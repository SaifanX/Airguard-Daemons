## 2025-05-19 - Removed API Key from Frontend Bundle
**Vulnerability:** The Gemini AI API key (`process.env.API_KEY` and `process.env.GEMINI_API_KEY`) was being directly injected into the Vite frontend build via the `define` config (`vite.config.ts`), and the frontend service (`geminiService.ts`) was using `@google/genai` to initialize the API directly. This exposes the secret API key in the client bundle, allowing malicious actors to steal and abuse it.
**Learning:** System API keys for GenAI should never be exposed or sent directly from the client.
**Prevention:** Always proxy AI interactions through a secure backend (e.g., Convex Actions). Define secrets safely on the backend via environment variables and dispatch contextual data rather than handling GenAI operations purely frontend side.
**2025-05-19 - Removed unused loadEnv causing Netlify CI failures**
**Learning:** Netlify's strict CI environments treat unused variables (such as unused `loadEnv` resulting from removing the previous vulnerability) as errors that will cause deployment pipelines to fail.
**Action:** When removing secrets or cleaning up config files, ensure that all corresponding imported helper functions (`loadEnv`) and localized variables are fully removed.
