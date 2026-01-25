import axios from 'axios';
// Note: HttpError is Wasp-specific. For Next.js, we usually throw standard Errors or return responses.
// I will adapt HttpError to be a standard Error class helper if not available, or use a mock.

class HttpError extends Error {
    statusCode: number;
    constructor(statusCode: number, message?: string) {
        super(message);
        this.statusCode = statusCode;
    }
}

// رابط الويب هوك الخاص بك الذي أرسلته
const MY_ZAPIER_WEBHOOK = "https://hooks.zapier.com/hooks/catch/25105173/uqg4hpb/";

type ZapierPayload = {
    title: string;
    message: string;
    email?: string;
};

export const notifyZapier = async (args: ZapierPayload, context?: any) => {
    // التحقق البسيط (يمكنك إزالته للتجربة السريعة)
    // if (!context?.user) { throw new HttpError(401, "يجب تسجيل الدخول"); }

    try {
        console.log(`🚀 جارٍ إرسال البيانات إلى Zapier: ${args.title}`);

        // إرسال البيانات الفعلية
        const response = await axios.post(MY_ZAPIER_WEBHOOK, {
            event: "NABD_ALERT",
            ...args,
            timestamp: new Date().toISOString(),
            platform: "Nabd AI V2"
        });

        return { success: true, zapierId: response.data.request_id };

    } catch (error) {
        console.error("❌ خطأ في الاتصال بـ Zapier:", error);
        throw new HttpError(500, "فشل الاتصال بـ Zapier");
    }
}
