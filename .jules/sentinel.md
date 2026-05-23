## 2026-05-22 - Prevent API Key Leakage
**Vulnerability:** The `GEMINI_API_KEY` was injected into the client bundle via `vite.config.ts` `define` property, allowing attackers to extract it and abuse the AI service.
**Learning:** In Vite, any environment variable explicitly defined via `define` will be exposed in plain text in the frontend build, regardless of its prefix.
**Prevention:** Never use Vite's `define` configuration for sensitive secrets. Always build backend actions (e.g., using Convex) to act as a secure proxy, executing authenticated third-party API calls entirely on the server.
