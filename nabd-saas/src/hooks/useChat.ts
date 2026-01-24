import { useState, useCallback } from 'react';
import { Message, Attachment } from '@/types/chat';

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

    const sendMessage = useCallback(async (
        text: string,
        file: File | null,
        agentMode: string,
        modelName: string
    ) => {
        if (!text.trim() && !file) return;

        // 1. Prepare User Message (Optimistic UI)
        let attachmentData: Attachment | null = null;
        let displayContent = text;

        if (file) {
            try {
                const base64Content = await convertFileToBase64(file);
                attachmentData = { name: file.name, type: file.type, content: base64Content };
                if (!displayContent) displayContent = `[مرفق: ${file.name}]`;
            } catch (error) { console.error("File error", error); return; }
        }

        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: 'user',
            content: displayContent,
            attachment: attachmentData ? { name: attachmentData.name, type: attachmentData.type } : undefined
        };

        // Update UI immediately with user message
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // 2. Prepare Payload (History + New Message)
            const historyPayload = messages.map(m => ({ role: m.role, content: m.content })).filter(m => m.role !== 'error');
            const newMessagePayload = { role: 'user', content: text }; // Files are just client-side for now in this v1

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

        } catch (error: any) {
            setMessages((prev) => [
                ...prev,
                { id: crypto.randomUUID(), role: 'error', content: `❌ ${error.message || 'فشل الاتصال'}` },
            ]);
        } finally {
            setIsLoading(false);
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
