## 2025-05-08 - Fixed Critical API Key Leak in Client Bundle
**Vulnerability:** The Gemini API key was being hardcoded into the Vite client bundle via the `define` property in `vite.config.ts`, making it accessible to any user who inspects the frontend code. Additionally, a direct client-side service (`services/geminiService.ts`) was making calls to the AI SDK.
**Learning:** In Vite, injecting environment variables via `define` statically replaces them in the compiled JS bundle. Any API keys placed here are exposed.
**Prevention:** Always proxy calls to external AI APIs through a secure backend (in this app, via Convex Actions). The frontend should only send formatted context to the backend, and the backend should securely read the environment variable using `process.env`.
