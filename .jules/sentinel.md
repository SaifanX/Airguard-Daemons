## 2024-05-18 - API Key Exposure Vulnerability
**Vulnerability:** The Gemini API key is being injected into the client bundle via Vite`s `define` configuration and accessed on the client-side in `services/geminiService.ts`.
**Learning:** `process.env.API_KEY` was mapped via `define` in `vite.config.ts`, exposing it directly in the client bundle and enabling Open Proxy / AI prompt injection on the client side. Any API calls with API keys must happen on the backend.
**Prevention:** Remove API key injection from `vite.config.ts`. Move the AI generation logic to the `askCaptain` Convex action on the backend. Provide a frontend wrapper that calls the Convex action via the `useAction` hook.
