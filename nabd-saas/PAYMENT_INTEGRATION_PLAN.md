# 💳 خطة دمج المدفوعات (Payment Integration Plan)

**المشروع:** نبض (Nabd SaaS)
**الحالة:** التأسيس الأولي (Foundation)

---

## 1. نموذج قاعدة البيانات (Database Schema)

لتفعيل المدفوعات، يجب تحديث ملف `schema.prisma` لإضافة الحقول التالية لجدول `User`:

```prisma
model User {
  id               String    @id @default(cuid())
  email            String    @unique
  // ... existing fields ...
  
  // 💳 Payment Fields
  plan             String    @default("free") // free, pro, business
  stripeCustomerId String?   @unique
  subscriptionId   String?   @unique
  subscriptionStatus String? // active, past_due, canceled
  currentPeriodEnd DateTime? // When the cycle ends
  
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
}
```

## 2. متغيرات البيئة (Environment Variables)

أضف هذه المتغيرات إلى ملف `.env`:

```bash
# Stripe Keys (احصل عليها من dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# ZainCash Keys (إذا أردت تفعيله لاحقاً)
ZAINCASH_MERCHANT_ID=...
ZAINCASH_SECRET=...
```

## 3. سيناريوهات الاختبار (Test Scenarios)

قبل الذهاب للـ Production، تأكد من اختبار ما يلي يدوياً:

1.  **السيناريو الناجح:** اشترك بخطة Pro باستخدام بطاقة تجريبية (4242...). تأكد من تحديث حالة المستخدم في الـ DB.
2.  **الفشل:** استخدم بطاقة مرفوضة (Generic Decline). تأكد من ظهور رسالة خطأ في الواجهة.
3.  **الإلغاء:** قم بإلغاء الاشتراك من لوحة Stripe. هل تم تحديث حالة المستخدم إلى `free` أو وضع علامة `canceled`؟
4.  **التجديد التلقائي:** (محاكاة عبر Stripe CLI). هل تم تحديث تاريخ `currentPeriodEnd`؟

## 4. الخطوات التالية (Action Items)

1.  [ ] إعداد حساب Stripe وتفعيله.
2.  [ ] نسخ المفاتيح إلى `.env`.
3.  [ ] تحديث `prisma schema` وتنفيذ `npx prisma db push`.
4.  [ ] ربط زر "اشتراك" في صفحة الأسعار بـ API يقوم بإنشاء `Checkout Session`.

---
هذا الأساس يضمن لك نظام مدفوعات آمن وقابل للتوسع عالمياً.
