'use client';

import { useState } from 'react';
// import { notifyZapier } from '@/lib/zapier'; // We can't call server functions directly from client in Next.js usually without server actions or API.
// For now, I will create a simple API route wrapper or assume we can call an API.
// But as per the user request, I will put the component logic here.

// Since notifyZapier is a server-side lib function typically in Wasp/Next.js (unless using server actions),
// we need to call it via an API endpoint.
// For this specific component to work "as is" with client-side click, I'll simulate the API call.

export default function TestZapierButton() {
    const [status, setStatus] = useState('جاهز للتجربة');

    const handleTestClick = async () => {
        setStatus('جارٍ الإرسال... ⏳');
        try {
            // In a real Next.js app, this would be fetch('/api/zapier-test', ...)
            // For this step I'll assume we have an endpoint or I will create one.
            const res = await fetch('/api/test-zapier', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: "تجربة حية من نبض",
                    message: "هذه رسالة تجريبية للتأكد من أن الويب هوك يعمل بنجاح!",
                    email: "test@nabd.com"
                })
            });

            if (!res.ok) throw new Error('Failed');

            setStatus('✅ تم الإرسال بنجاح!');
            alert("مبروك! تحقق من Zapier الآن.");
        } catch (err) {
            console.error(err);
            setStatus('❌ فشل الإرسال');
            alert("حدث خطأ، تأكد من التيرمينال.");
        }
    };

    return (
        <div className="p-4 border rounded shadow-md bg-gray-800 text-white mt-4">
            <h3 className="font-bold mb-2">⚡ اختبار ربط Zapier</h3>
            <button
                onClick={handleTestClick}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
            >
                أرسل تنبيه تجريبي
            </button>
            <p className="mt-2 text-sm text-gray-300">{status}</p>
        </div>
    );
}
