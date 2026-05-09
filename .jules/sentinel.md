## 2025-05-09 - [CRITICAL] API Key Injection in Vite Build

**Vulnerability:** The Gemini API key (`GEMINI_API_KEY`) was being insecurely injected into the client bundle via Vite's `define` configuration in `vite.config.ts`, and utilized securely client-side in `services/geminiService.ts`. This exposed the sensitive secret to anyone inspecting the frontend code.
**Learning:** Never inject secret API keys into client-side code, even via seemingly "safe" build tool replacements. Client-side logic that requires sensitive keys must be proxied through a secure backend environment.
**Prevention:** Remove `process.env.API_KEY` injections from frontend build configurations. Move the API client initialization (e.g., `@google/genai`) and request logic into backend functions (e.g., Convex Actions) with `"use node";`, where environment variables are kept secret. Process and format contextual inputs on the frontend before securely passing them to the backend action.
