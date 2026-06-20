## 2026-06-20 - Prevent API Key Leakage
**Vulnerability:** Client-Side API Key Exposure in vite.config.ts
**Learning:** The frontend build tool (Vite) was injecting the `GEMINI_API_KEY` into the client bundle via the `define` property in `vite.config.ts`, bypassing the standard `VITE_` prefix protection. This exposed the raw secret to anyone accessing the site.
**Prevention:** API keys must never be explicitly assigned to `process.env` variables using Vite's `define` object. The backend should exclusively retrieve API keys from its own secure environment variables.
