// ═══════════════════════════════════════════════════════════════════════════════
// WASP CONFIGURATION SNIPPET
// ═══════════════════════════════════════════════════════════════════════════════
// Add these declarations to your main.wasp file

/*
// ─────────────────────────────────────────────────────────────────────────────
// DATABASE ENTITIES
// ─────────────────────────────────────────────────────────────────────────────

entity Message {=psl
  id          Int       @id @default(autoincrement())
  chat        Chat      @relation(fields: [chatId], references: [id])
  chatId      Int
  role        String    // "user" أو "assistant"
  content     String    // نص الرسالة
  hasImage    Boolean   @default(false) // هل تحتوي على صورة؟
  createdAt   DateTime  @default(now())
psl=}

entity Chat {=psl
  id          Int       @id @default(autoincrement())
  user        User      @relation(fields: [userId], references: [id])
  userId      Int
  messages    Message[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
psl=}

// Update your existing User entity to include chats relation:
entity User {=psl
  // ... existing fields ...
  chats       Chat[]
psl=}

// ─────────────────────────────────────────────────────────────────────────────
// NABD AI OPERATIONS (Queries & Actions)
// ─────────────────────────────────────────────────────────────────────────────

action askNabd {
  fn: import { askNabd } from "@src/server/actions.js",
  entities: [User, Message]
}

action sendChatMessage {
  fn: import { sendChatMessage } from "@src/server/actions.js",
  entities: [Chat, Message]
}

query getChatHistory {
  fn: import { getChatHistory } from "@src/server/queries.js",
  entities: [Chat, Message]
}

// ─────────────────────────────────────────────────────────────────────────────
// NABD CHAT PAGE (Optional - if you want a dedicated page)
// ─────────────────────────────────────────────────────────────────────────────

route NabdChatRoute { path: "/ai-chat", to: NabdChatPage }
page NabdChatPage {
  component: import { NabdChat } from "@src/client/app/NabdChat", 
  authRequired: true
}
*/

// ═══════════════════════════════════════════════════════════════════════════════
// PACKAGE.JSON DEPENDENCIES
// ═══════════════════════════════════════════════════════════════════════════════
// Add to your package.json:

/*
{
  "dependencies": {
    "axios": "^1.6.0",
    "form-data": "^4.0.0",
    "react-markdown": "^9.0.0",
    "remark-gfm": "^4.0.0",
    "react-syntax-highlighter": "^15.5.0"
  }
}
*/

export { };
