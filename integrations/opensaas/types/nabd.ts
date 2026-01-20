/**
 * Nabd AI Type Definitions
 * Copy this file to: src/shared/types/nabd.ts
 */

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT MODES
// ═══════════════════════════════════════════════════════════════════════════════

export type AgentMode = 'general' | 'coder' | 'writer' | 'researcher';

export interface AgentModeConfig {
    id: AgentMode;
    name: string;
    nameAr: string;
    icon: string;
    description: string;
    systemPrompt?: string;
}

export const AGENT_MODES: Record<AgentMode, AgentModeConfig> = {
    general: {
        id: 'general',
        name: 'General Assistant',
        nameAr: 'مساعد عام',
        icon: '🤖',
        description: 'For general tasks and questions',
    },
    coder: {
        id: 'coder',
        name: 'Programmer',
        nameAr: 'مبرمج',
        icon: '👨‍💻',
        description: 'Code writing and analysis',
    },
    writer: {
        id: 'writer',
        name: 'Content Writer',
        nameAr: 'كاتب محتوى',
        icon: '📝',
        description: 'Creative and professional writing',
    },
    researcher: {
        id: 'researcher',
        name: 'Researcher',
        nameAr: 'باحث',
        icon: '🔍',
        description: 'Deep research with reliable sources',
    },
};

// ═══════════════════════════════════════════════════════════════════════════════
// MODEL OPTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export type ModelName = 'llama-3.1-8b-instant' | 'llama-3.3-70b-versatile';

export interface ModelConfig {
    id: ModelName;
    name: string;
    icon: string;
    speed: 'fast' | 'medium' | 'slow';
    intelligence: 'basic' | 'advanced' | 'expert';
    tokensPerMinute: number;
}

export const MODEL_OPTIONS: Record<ModelName, ModelConfig> = {
    'llama-3.1-8b-instant': {
        id: 'llama-3.1-8b-instant',
        name: 'Fast',
        icon: '🚀',
        speed: 'fast',
        intelligence: 'advanced',
        tokensPerMinute: 6000,
    },
    'llama-3.3-70b-versatile': {
        id: 'llama-3.3-70b-versatile',
        name: 'Smart',
        icon: '🧠',
        speed: 'medium',
        intelligence: 'expert',
        tokensPerMinute: 3000,
    },
};

// ═══════════════════════════════════════════════════════════════════════════════
// API TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface NabdRunRequest {
    prompt: string;
    thread_id?: string;
    agent_mode?: AgentMode;
    model_name?: ModelName;
    image_path?: string;
}

export interface NabdRunResponse {
    success: boolean;
    result: string;
    plan: string[];
    steps_executed: number;
}

export interface NabdSpeakRequest {
    text: string;
    voice?: string;
}

export interface NabdSpeakResponse {
    audio_url: string;
}

export interface NabdUploadResponse {
    success: boolean;
    image_path: string;
    filename: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MESSAGE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type MessageRole = 'user' | 'assistant' | 'error' | 'system';

export interface ChatMessage {
    id: string;
    role: MessageRole;
    content: string;
    plan?: string[];
    stepsExecuted?: number;
    agentMode?: AgentMode;
    modelName?: ModelName;
    timestamp: Date;
    attachments?: MessageAttachment[];
}

export interface MessageAttachment {
    type: 'image' | 'file' | 'audio';
    url: string;
    name: string;
    size?: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ERROR TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface NabdError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}

export const ERROR_CODES = {
    UNAUTHORIZED: 'UNAUTHORIZED',
    SUBSCRIPTION_REQUIRED: 'SUBSCRIPTION_REQUIRED',
    RATE_LIMITED: 'RATE_LIMITED',
    INVALID_REQUEST: 'INVALID_REQUEST',
    SERVER_ERROR: 'SERVER_ERROR',
    NETWORK_ERROR: 'NETWORK_ERROR',
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;
