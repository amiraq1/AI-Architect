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

        let attachmentData: Attachment | null = null;
        let displayContent = text;

        if (file) {
            try {
                const base64Content = await convertFileToBase64(file);
                attachmentData = {
                    name: file.name,
                    type: file.type,
                    content: base64Content
                };
                if (!displayContent) displayContent = `[مرفق: ${file.name}]`;
            } catch (error) {
                console.error("File conversion error:", error);
                // We could handle this error state better in a real app
                return;
            }
        }

        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: 'user',
            content: displayContent,
            attachment: attachmentData ? { name: attachmentData.name, type: attachmentData.type } : undefined
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/nabd', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: text,
                    agentMode,
                    modelName,
                    attachment: attachmentData
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 402) {
                    throw new Error('PLAN_LIMIT_REACHED');
                }
                throw new Error(data.error || 'Failed to get response');
            }

            const assistantMessage: Message = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: data.result || data.response || JSON.stringify(data),
                plan: data.plan,
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error: any) {
            const isLimit = error.message === 'PLAN_LIMIT_REACHED';
            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: 'error',
                    content: isLimit
                        ? '🛑 عذراً، نفد رصيدك المجاني!\n\nيرجى الانتقال لصفحة الأسعار للاشتراك والحصول على المزيد من الرسائل.'
                        : `❌ ${error.message || 'حدث خطأ غير متوقع'}`,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearMessages = () => setMessages([]);

    return {
        messages,
        isLoading,
        sendMessage,
        clearMessages
    };
}
