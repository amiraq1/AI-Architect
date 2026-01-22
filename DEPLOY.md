# دليل نشر تطبيق نبض AI (Nabd AI)

## المتطلبات المسبقة
- سيرفر Ubuntu/Debian
- Docker و Docker Compose
- اسم نطاق (Domain) موجه إلى السيرفر (amiraq.online)

## 1. إعداد السيرفر (مرة واحدة)

قم بتحديث النظام وتثبيت Docker:

```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# تثبيت Docker Compose
sudo apt install -y docker-compose-plugin

# تثبيت Nginx و Certbot (للشهادة الأمنية)
sudo apt install -y nginx certbot python3-certbot-nginx
```

## 2. نشر التطبيق

### الخيار أ: السحب من Git (الأسهل)

```bash
# استنساخ المستودع
git clone https://github.com/amiraq1/AI-Architect.git nabdh-app
cd nabdh-app

# إعداد ملف البيئة
cp .env.example .env
nano .env  # قم بتعديل المتغيرات داخل الملف

# تشغيل التطبيق
docker compose up -d --build
```

### الخيار ب: استخدام ملف مضغوط (إذا كان لديك الكود محلياً)

```bash
# (على جهازك المحلي) رفع الملف
scp nabdh-v2.tar.gz user@amiraq.online:/home/user/

# (على السيرفر) فك الضغط وتشغيل
mkdir -p nabdh-app && cd nabdh-app
tar -xzf ../nabdh-v2.tar.gz
docker compose up -d --build
```

## 3. إعداد قاعدة البيانات

بعد تشغيل الحاويات، يجب إعداد قاعدة البيانات:

```bash
# تشغيل الترحيل (Migrations)
docker compose exec nabdh-app npx prisma migrate deploy
```

## 4. إعداد Nginx و HTTPS

```bash
# نسخ ملف الإعدادات
sudo cp nginx.conf /etc/nginx/sites-available/amiraq.online

# تفعيل الموقع
sudo ln -s /etc/nginx/sites-available/amiraq.online /etc/nginx/sites-enabled/

# التحقق من الإعدادات
sudo nginx -t

# إعادة تشغيل Nginx
sudo systemctl restart nginx

# استخراج شهادة SSL
sudo certbot --nginx -d amiraq.online
```

## 5. إدارة التطبيق

- **عرض السجلات:** `docker compose logs -f`
- **إيقاف التطبيق:** `docker compose down`
- **تحديث التطبيق:** `git pull && docker compose up -d --build`
