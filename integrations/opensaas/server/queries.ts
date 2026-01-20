import { HttpError } from 'wasp/server';
import type { GetChatHistory } from 'wasp/server/operations';
import type { Message } from 'wasp/entities';

export const getChatHistory: GetChatHistory<void, Message[]> = async (args, context) => {
    if (!context.user) {
        throw new HttpError(401);
    }

    // جلب الرسائل الخاصة بالمستخدم الحالي فقط
    return context.entities.Message.findMany({
        where: {
            userId: context.user.id
        },
        orderBy: {
            createdAt: 'asc' // الأقدم أولاً (لأننا في شات)
        }
    });
};
