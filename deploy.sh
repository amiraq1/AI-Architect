#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# Nabd AI Agent - Deployment Script
# ═══════════════════════════════════════════════════════════════════════════════
# Usage: ./deploy.sh
# ═══════════════════════════════════════════════════════════════════════════════

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}   نبض AI Agent - سكربت النشر v2.0${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"

# Configuration
APP_NAME="nabdh-v2"
APP_DIR="/home/user/nabdh-app"
IMAGE_NAME="nabdh-v2-image"
CONTAINER_NAME="nabdh-v2-container"

# Step 1: Create app directory
echo -e "\n${YELLOW}[1/6] إنشاء مجلد التطبيق...${NC}"
mkdir -p $APP_DIR
cd $APP_DIR

# Step 2: Extract archive (if exists)
if [ -f "nabdh-v2.tar.gz" ]; then
    echo -e "\n${YELLOW}[2/6] فك ضغط الملفات...${NC}"
    tar -xzf nabdh-v2.tar.gz
    echo -e "${GREEN}✓ تم فك الضغط بنجاح${NC}"
else
    echo -e "${RED}✗ ملف nabdh-v2.tar.gz غير موجود!${NC}"
    echo -e "الرجاء رفع الملف أولاً باستخدام:"
    echo -e "  scp nabdh-v2.tar.gz user@amiraq.online:$APP_DIR/"
    exit 1
fi

# Step 3: Check for .env file
echo -e "\n${YELLOW}[3/6] التحقق من ملف البيئة...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠ ملف .env غير موجود. إنشاء ملف نموذجي...${NC}"
    cat > .env << 'EOF'
# Database
DATABASE_URL=postgresql://nabd:nabd_secret_2026@db:5432/nabdh_db

# JWT Secret (قم بتغييره!)
JWT_SECRET=change_this_to_a_very_long_random_string

# AI Keys
OPENAI_API_KEY=sk-proj-your-key-here
GROQ_API_KEY=gsk_your-key-here

# URLs
WASP_WEB_CLIENT_URL=https://amiraq.online
WASP_SERVER_URL=https://amiraq.online/api
EOF
    echo -e "${YELLOW}⚠ الرجاء تعديل ملف .env قبل التشغيل!${NC}"
fi

# Step 4: Stop existing container
echo -e "\n${YELLOW}[4/6] إيقاف الحاوية القديمة (إن وجدت)...${NC}"
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true
echo -e "${GREEN}✓ تم${NC}"

# Step 5: Build Docker image
echo -e "\n${YELLOW}[5/6] بناء صورة Docker (قد يستغرق عدة دقائق)...${NC}"
docker build -t $IMAGE_NAME .
echo -e "${GREEN}✓ تم بناء الصورة بنجاح${NC}"

# Step 6: Run container
echo -e "\n${YELLOW}[6/6] تشغيل الحاوية...${NC}"
docker run -d \
    --name $CONTAINER_NAME \
    --restart unless-stopped \
    -p 3000:3000 \
    --env-file .env \
    $IMAGE_NAME

echo -e "\n${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ تم النشر بنجاح!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "\nالتطبيق يعمل على: http://localhost:3000"
echo -e "للتحقق من السجلات: docker logs -f $CONTAINER_NAME"
echo -e "لإيقاف التطبيق: docker stop $CONTAINER_NAME"
