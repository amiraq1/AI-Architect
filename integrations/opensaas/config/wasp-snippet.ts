// ═══════════════════════════════════════════════════════════════════════════════
// WASP CONFIGURATION SNIPPET
// ═══════════════════════════════════════════════════════════════════════════════
// Add these declarations to your main.wasp file

/*
// ─────────────────────────────────────────────────────────────────────────────
// NABD AI ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

action generateNabdResponse {
  fn: import { generateNabdResponse } from "@src/server/actions",
  entities: [User]
}

action generateNabdSpeech {
  fn: import { generateNabdSpeech } from "@src/server/actions",
  entities: [User]
}

action uploadNabdImage {
  fn: import { uploadNabdImage } from "@src/server/actions",
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
