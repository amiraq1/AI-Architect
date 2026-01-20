// ═══════════════════════════════════════════════════════════════════════════════
// WASP CONFIGURATION SNIPPET
// ═══════════════════════════════════════════════════════════════════════════════
// Add these declarations to your main.wasp file

/*
// ─────────────────────────────────────────────────────────────────────────────
// DATABASE ENTITIES
// ─────────────────────────────────────────────────────────────────────────────

entity Message {=psl
  id          Int      @id @default(autoincrement())
  content     String
  role        String   // "user" أو "assistant"
  createdAt   DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id])
  userId      Int
psl=}

// Update your existing User entity to include messages relation:
entity User {=psl
  // ... existing fields ...
  messages    Message[]
psl=}

// ─────────────────────────────────────────────────────────────────────────────
// NABD AI ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

action askNabd {
  fn: import { askNabd } from "@src/server/actions",
  entities: [User]
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
    "form-data": "^4.0.0"
  }
}
*/

export { };
