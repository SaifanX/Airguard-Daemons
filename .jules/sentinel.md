## 2026-05-26 - Prevent Open Proxy / Secret Exposure via Convex

**Vulnerability:** The application was exposing the `GEMINI_API_KEY` to the client-side bundle via Vite's `define` configuration (`process.env.API_KEY`). The `geminiService.ts` running on the client directly authenticated with Google's API using this exposed key.

**Learning:** Any values passed to `define` in `vite.config.ts` are injected into the frontend bundle in plain text, bypassing Vite's strict `VITE_` prefix protections. Direct client-side calls to LLMs inherently leak API keys and open the system to abuse (Open Proxy vulnerability) and prompt injection.

**Prevention:** Never inject secrets using `define`. Always proxy sensitive operations (like AI generation) through a secure backend (Convex). Initialize the action with `useAction` on the frontend and ensure Node.js modules are handled properly on the backend by using the `"use node";` directive.
