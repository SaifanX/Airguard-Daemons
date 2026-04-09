## 2025-04-09 - Remove Hardcoded API Key from Vite Config
**Vulnerability:** The Gemini API key was injected directly into the client bundle via Vite's `define` configuration in `vite.config.ts`, exposing it to the browser.
**Learning:** This repo previously utilized a direct client-side AI integration (`services/geminiService.ts`) which required the API key to be available on the client.
**Prevention:** Always proxy sensitive AI interactions through secure backend actions (like the Convex action `askCaptain` in `convex/ai.ts`) and ensure environment variables are only accessible in server-side environments. Avoid using Vite's `define` for sensitive secrets.
