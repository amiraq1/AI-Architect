# OpenSaaS Integration Guide

This folder contains ready-to-use code for integrating Nabd AI Agent with OpenSaaS projects.

## 📁 Files Structure

```
integrations/opensaas/
├── README.md              # This file
├── server/
│   └── actions.ts         # Wasp server action (copy to src/server/)
├── client/
│   └── NabdChat.tsx       # React component (copy to src/client/)
├── config/
│   └── env.example        # Environment variables template
└── types/
    └── nabd.ts            # TypeScript types
```

## 🚀 Quick Setup

### 1. Add Environment Variables

Add to your `.env.server` file:
```env
NABD_API_URL=https://your-nabd-deployment.com
NABD_SECRET_KEY=nabd-secret-2026-v1
```

### 2. Update `main.wasp`

Add the action declaration:
```wasp
action generateNabdResponse {
  fn: import { generateNabdResponse } from "@src/server/actions",
  entities: [User]
}
```

### 3. Copy Files

- Copy `server/actions.ts` → `src/server/actions.ts`
- Copy `client/NabdChat.tsx` → `src/client/app/NabdChat.tsx`
- Copy `types/nabd.ts` → `src/shared/types/nabd.ts`

### 4. Install Dependencies

```bash
npm install axios
```

## 🔒 Security

- All requests require valid `X-NABD-SECRET` header
- User must be authenticated (`context.user`)
- User must have active subscription (`subscriptionStatus === 'active'`)

## 📡 API Endpoints Used

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/run` | POST | Execute AI agent |
| `/speak` | POST | Text-to-speech |
| `/upload` | POST | Upload images |

