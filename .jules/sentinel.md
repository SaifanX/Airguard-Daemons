## 2025-03-01 - API Key Exposure in Frontend
**Vulnerability:** The Google Gen AI API key (`GEMINI_API_KEY`) was being directly exposed to the client-side bundle in `vite.config.ts` using the Vite `define` config (`'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY)`). The key was subsequently being used on the client-side inside `services/geminiService.ts`.
**Learning:** In Vite, any explicit value passed to the `define` configuration property is bundled and exposed in plain text in the client-side build, completely bypassing normal secure server environments.
**Prevention:** Never use the `define` directive in Vite (or `VITE_` prefixes) for sensitive secrets. All AI calls using secure tokens should exclusively be made through secure backend services (like Convex actions).
