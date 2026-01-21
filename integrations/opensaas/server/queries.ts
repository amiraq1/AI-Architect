import { HttpError } from 'wasp/server';
import type { GetChatHistory } from 'wasp/server/operations';
import type { Message } from 'wasp/entities';

export const getChatHistory: GetChatHistory<void, Message[]> = async (args, context) => {
    if (!context.user) { throw new HttpError(401); }

    // 1. البحث عن آخر محادثة للمستخدم (أو إنشاء منطق لفتح محادثة محددة)
    const chat = await context.entities.Chat.findFirst({
        where: { userId: context.user.id },
        include: {
            messages: {
                orderBy: { createdAt: 'asc' } // ترتيب زمني
            }
        },
        orderBy: { updatedAt: 'desc' }
    });

    if (!chat) return [];

    return chat.messages;
};
