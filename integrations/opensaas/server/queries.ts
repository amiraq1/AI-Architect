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

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN STATS QUERY
// ═══════════════════════════════════════════════════════════════════════════════

export const getAdminStats = async (args: void, context: any) => {
    if (!context.user) { throw new HttpError(401); }

    // التحقق من صلاحية الأدمن
    if (!context.user.isAdmin) {
        throw new HttpError(403, 'غير مصرح لك بالوصول');
    }

    // جلب الإحصائيات
    const totalUsers = await context.entities.User.count();
    const totalChats = await context.entities.Chat.count();
    const totalMessages = await context.entities.Message.count();
    const premiumUsers = await context.entities.User.count({
        where: { subscriptionStatus: 'active' }
    });

    // جلب آخر 10 رسائل كنشاط حديث
    const recentMessages = await context.entities.Message.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
            chat: {
                include: { user: true }
            }
        }
    });

    const recentActivity = recentMessages.map((msg: any) => ({
        type: 'message',
        description: msg.content.substring(0, 50) + (msg.content.length > 50 ? '...' : ''),
        user: msg.chat?.user?.username || 'مجهول',
        time: new Date(msg.createdAt).toLocaleString('ar-IQ')
    }));

    return {
        totalUsers,
        totalChats,
        totalMessages,
        premiumUsers,
        recentActivity
    };
};
