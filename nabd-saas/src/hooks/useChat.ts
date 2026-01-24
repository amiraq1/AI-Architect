import { useState, useCallback } from 'react';
import { Message, Attachment } from '@/types/chat';
import { useToast } from '@/components/ui/ToastProvider';

// Helper to convert file to Base64
const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [isUploading, setIsUploading] = useState(false);

    const uploadFile = async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Upload failed');
            }
            const data = await res.json();
            return data.url;
        } catch (e: any) {
            console.error(e);
            alert(`فشل رفع الملف: ${e.message}`); // Simple user feedback
            return null;
        }
    };

    const { showToast } = useToast();

    // ⚡ Internal Command Handler
    const handleCommand = async (fullText: string): Promise<boolean> => {
        const [cmd, ...args] = fullText.trim().split(/\s+/);

        switch (cmd.toLowerCase()) {
            case '/clear':
            case '/clr':
                clearMessages();
                showToast('تم مسح المحادثة', 'success');
                return true;

            case '/reset':
                setMessages([]);
                showToast('تم إعادة تعيين الجلسة', 'info');
                return true;

            case '/browse':
            case '/scan':
                // Pass through but maybe show a toast? 
                // Actually, if we return false, it goes to AI. 
                // But we want to modify the prompt for /browse to be explicit.
                if (args.length === 0) {
                    showToast('خطأ: يرجى كتابة الرابط. مثال: /browse google.com', 'error');
                    return true;
                }
                return false; // Let it fall through to AI, but we handle it better below

            case '/help':
            case '/?':
                const helpMsg: Message = {
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    content: `
### 🛠️ أوامر التحكم (Command List)
* **/clear**: مسح المحادثة الحالية (Alias: /clr)
* **/reset**: إعادة تعيين الجلسة بالكامل
* **/browse [url]**: تصفح رابط معين مباشرة
* **/help**: عرض هذه القائمة
                    `
                };
                setMessages(prev => [...prev, helpMsg]);
                return true;

            default:
                showToast(`أمر غير معروف: ${cmd}`, 'error');
                return true;
        }
    };

    const sendMessage = useCallback(async (
        text: string,
        file: File | null,
        agentMode: string,
        modelName: string
    ) => {
        if (!text.trim() && !file) return;

        // 🛡️ COMMAND CHECK
        if (text.startsWith('/') && !file) {
            const isHandled = await handleCommand(text);
            if (isHandled) return;
        }

        // 1. Upload Handling (First Step)
        let attachmentUrl: string | null = null;
        let attachmentData: Attachment | null = null;
        let displayContent = text;

        // Special handling for explicit /browse command
        if (text.startsWith('/browse ') || text.startsWith('/scan ')) {
            const url = text.split(/\s+/)[1];
            displayContent = `[SYSTEM: User explicitly requested to browse: ${url}]\nPlease browse this URL and summarize it.`;
        }

        if (file) {
            setIsUploading(true);
            // Optimistic UI data
            attachmentData = { name: file.name, type: file.type, content: '' }; // No heavy base64 in state
            if (!displayContent) displayContent = `[جاري رفع الملف: ${file.name}...]`;

            // Perform Upload
            attachmentUrl = await uploadFile(file);
            setIsUploading(false);

            if (!attachmentUrl) return; // Stop if upload failed

            // Update display content
            if (text === '') displayContent = `[مرفق: ${file.name}]`;
        }

        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: 'user',
            content: displayContent,
            attachment: attachmentData ? { ...attachmentData } : undefined
        };

        // Update UI immediately with user message
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // 2. Prepare Payload (History + New Message)
            const historyPayload = messages.map(m => ({ role: m.role, content: m.content })).filter(m => m.role !== 'error');

            // Append File URL to user content for AI Context
            const finalUserContent = file && attachmentUrl
                ? `${text}\n\n[System: User uploaded a file. Access it here: ${attachmentUrl}]`
                : text;

            const newMessagePayload = { role: 'user', content: finalUserContent };

            const payload = {
                messages: [...historyPayload, newMessagePayload], // Sending Full History
                agentMode,
                modelName
            };

            // 3. Start Stream Request
            const response = await fetch('/api/nabd', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error(response.statusText);
            if (!response.body) throw new Error('No body');

            // 4. Create Placeholder for AI Response
            const aiMessageId = crypto.randomUUID();
            setMessages((prev) => [...prev, { id: aiMessageId, role: 'assistant', content: '' }]);

            // 5. Read Stream
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let aiContent = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const textChunk = decoder.decode(value, { stream: true });
                aiContent += textChunk;

                // Update the specific message in state
                setMessages((prev) =>
                    prev.map(msg => msg.id === aiMessageId ? { ...msg, content: aiContent } : msg)
                );
            }

            // 6. Tool Use Check (Browsing) 🌐
            const browseMatch = aiContent.match(/\[BROWSE:\s*(https?:\/\/[^\s\]]+)\]/);

            if (browseMatch) {
                const targetUrl = browseMatch[1];
                console.log(`[Tool] Detected Browse Request: ${targetUrl}`);

                // Show "Browsing..." indicator (Edit the AI message or add a new one)
                // Here we edit the AI message to show status
                setMessages((prev) =>
                    prev.map(msg => msg.id === aiMessageId ? { ...msg, content: `${aiContent}\n\n🔄 جاري تصفح الرابط: ${targetUrl}...` } : msg)
                );

                try {
                    // Fetch Content
                    const browseRes = await fetch('/api/browse', {
                        method: 'POST', body: JSON.stringify({ url: targetUrl })
                    });

                    if (!browseRes.ok) throw new Error('Browse failed');
                    const browseData = await browseRes.json();

                    const browsingContext = `
[SYSTEM: Browsing Result for ${targetUrl}]
Title: ${browseData.title}
Content: ${browseData.content}
[END BROWSING RESULT]

Based on this content, please summarize and answer the user's original request.
`;
                    // 7. Recursive Call (Re-prompt AI with new data)
                    // We append the browsing result as a "User" role (hidden context) so the AI sees it as part of conversation
                    // But to keep UI clean, we don't show this context in UI, we just send it in payload.

                    const followUpPayload = {
                        messages: [
                            ...historyPayload,
                            newMessagePayload,
                            { role: 'assistant', content: aiContent }, // The "I will browse..." message
                            { role: 'user', content: browsingContext } // The actual data
                        ],
                        agentMode,
                        modelName
                    };

                    const followUpRes = await fetch('/api/nabd', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(followUpPayload),
                    });

                    if (!followUpRes.ok) throw new Error('Follow-up failed');
                    if (!followUpRes.body) throw new Error('No body');

                    // Read Follow-up Stream (Append to the same AI message or replace)
                    const followReader = followUpRes.body.getReader();
                    let finalAnswer = ''; // Start fresh or append? Let's start fresh for the answer part

                    // Remove the [BROWSE] tag from the visible message for cleaner UI
                    const cleanAiContent = aiContent.replace(/\[BROWSE:.*?\]/, '✅ تم قراءة المحتوى.');

                    while (true) {
                        const { done, value } = await followReader.read();
                        if (done) break;
                        const chunk = decoder.decode(value, { stream: true });
                        finalAnswer += chunk;

                        setMessages((prev) =>
                            prev.map(msg => msg.id === aiMessageId ? {
                                ...msg,
                                content: cleanAiContent + '\n\n' + finalAnswer
                            } : msg)
                        );
                    }

                } catch (toolError: any) {
                    setMessages((prev) =>
                        prev.map(msg => msg.id === aiMessageId ? { ...msg, content: aiContent + `\n\n❌ فشل التصفح: ${toolError.message}` } : msg)
                    );
                }
            }

        } catch (error: any) {
            setMessages((prev) => [
                ...prev,
                { id: crypto.randomUUID(), role: 'error', content: `❌ ${error.message || 'فشل الاتصال'}` },
            ]);
        } finally {
            setIsLoading(false);
            setIsUploading(false);
        }
    }, [messages]); // Dependency on messages to build history

    const clearMessages = () => setMessages([]);

    return {
        messages,
        isLoading,
        sendMessage,
        clearMessages
    };
}
