## 2026-06-13 - API Key Client-Side Exposure
**Vulnerability:** The Gemini API key was injected into the client-side code via Vite's `define` property (`'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY)`), allowing any user to extract it.
**Learning:** Using `define` in Vite or similar bundlers for secrets blindly exposes them to the frontend bundle. API calls requiring secrets must be proxied through a secure backend action.
**Prevention:** Always verify `vite.config.ts` for secret definitions. Implement API calls involving secrets on the backend (e.g., using Convex actions) and pass only sanitized data from the frontend.
