import os
import shutil
import subprocess
import tempfile
from typing import Optional


def run_python_sandboxed(code: str) -> str:
    """
    Execute Python code inside a locked-down Docker container.
    The tool is disabled by default; enable via PYTHON_TOOL_MODE=docker.
    """
    mode = (os.getenv("PYTHON_TOOL_MODE") or "disabled").strip().lower()
    if mode in {"", "0", "false", "off", "disabled"}:
        return (
            "Python tool is disabled for safety. "
            "Set PYTHON_TOOL_MODE=docker to enable sandboxed execution."
        )

    if mode != "docker":
        return f"Unsupported PYTHON_TOOL_MODE '{mode}'. Use 'docker'."

    return _run_in_docker(code)


def _run_in_docker(code: str) -> str:
    if not isinstance(code, str) or not code.strip():
        return "No code provided."

    max_code_chars = _get_env_int("PYTHON_SANDBOX_MAX_CODE_CHARS", 4000, 100, 20000)
    if len(code) > max_code_chars:
        return f"Code too long. Max {max_code_chars} characters."

    if shutil.which("docker") is None:
        return "Docker is not available on this host."

    image = os.getenv("PYTHON_SANDBOX_IMAGE", "python:3.12-alpine").strip()
    timeout_sec = _get_env_int("PYTHON_SANDBOX_TIMEOUT_SEC", 10, 1, 120)
    memory_mb = _get_env_int("PYTHON_SANDBOX_MEMORY_MB", 256, 64, 2048)
    pids_limit = _get_env_int("PYTHON_SANDBOX_PIDS", 64, 16, 1024)
    cpu_limit = _get_env_float("PYTHON_SANDBOX_CPU", 0.5, 0.1, 4.0)
    max_output_chars = _get_env_int("PYTHON_SANDBOX_MAX_OUTPUT_CHARS", 4000, 200, 20000)

    data_dir = os.path.abspath(os.getenv("PYTHON_SANDBOX_DATA_DIR", "data"))
    os.makedirs(data_dir, exist_ok=True)

    with tempfile.TemporaryDirectory() as temp_dir:
        script_path = os.path.join(temp_dir, "main.py")
        with open(script_path, "w", encoding="utf-8") as handle:
            handle.write(code)

        sandbox_mount = _format_mount_path(temp_dir)
        data_mount = _format_mount_path(data_dir)

        cmd = [
            "docker",
            "run",
            "--rm",
            "--network",
            "none",
            "--cpus",
            str(cpu_limit),
            "--memory",
            f"{memory_mb}m",
            "--pids-limit",
            str(pids_limit),
            "--security-opt",
            "no-new-privileges",
            "--cap-drop",
            "ALL",
            "--tmpfs",
            "/tmp:rw,noexec,nosuid,nodev,size=64m",
            "--read-only",
            "-e",
            "PYTHONDONTWRITEBYTECODE=1",
            "-e",
            "PYTHONUNBUFFERED=1",
            "-v",
            f"{sandbox_mount}:/sandbox:ro",
            "-v",
            f"{data_mount}:/sandbox/data:rw",
            "-w",
            "/sandbox",
            image,
            "python",
            "-u",
            "main.py",
        ]

        try:
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=timeout_sec,
            )
        except subprocess.TimeoutExpired:
            return f"Execution timed out after {timeout_sec}s."
        except Exception as exc:
            return f"Sandbox execution failed: {exc}"

    stdout = (result.stdout or "").strip()
    stderr = (result.stderr or "").strip()
    if stdout and stderr:
        output = f"{stdout}\n{stderr}"
    else:
        output = stdout or stderr

    if not output:
        output = "Execution completed with no output."

    return _truncate(output, max_output_chars)


def _format_mount_path(path: str) -> str:
    path = os.path.abspath(path)
    if os.name == "nt":
        return path.replace("\\", "/")
    return path


def _get_env_int(name: str, default: int, min_value: Optional[int], max_value: Optional[int]) -> int:
    raw = os.getenv(name)
    if raw is None or raw.strip() == "":
        return default
    try:
        value = int(raw)
    except ValueError:
        return default
    if min_value is not None:
        value = max(value, min_value)
    if max_value is not None:
        value = min(value, max_value)
    return value


def _get_env_float(name: str, default: float, min_value: Optional[float], max_value: Optional[float]) -> float:
    raw = os.getenv(name)
    if raw is None or raw.strip() == "":
        return default
    try:
        value = float(raw)
    except ValueError:
        return default
    if min_value is not None:
        value = max(value, min_value)
    if max_value is not None:
        value = min(value, max_value)
    return value


def _truncate(text: str, max_chars: int) -> str:
    if len(text) <= max_chars:
        return text
    return f"{text[:max_chars]}... [output truncated]"
