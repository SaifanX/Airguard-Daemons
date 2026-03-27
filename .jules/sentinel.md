## 2024-05-23 - API Key Exposure via Vite Config

**Vulnerability:** A critical vulnerability was found where the `GEMINI_API_KEY` environment variable was directly injected into the client bundle via Vite's `define` configuration. This allowed any user viewing the application's source code to extract the API key and potentially misuse the Gemini API quota.

**Learning:** When using full-stack frameworks or build tools (like Vite), environment variables injected using `define` or prefixed with `VITE_` are exposed in the client-side JavaScript. Sensitive credentials like backend API keys should never be passed this way.

**Prevention:** Move any operations requiring sensitive API keys to the backend. In this case, we migrated the Gemini AI inference from the client `services/geminiService.ts` to a secure backend action `askCaptain` in `convex/ai.ts`.
