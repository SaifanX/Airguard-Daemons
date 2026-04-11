## 2024-04-11 - Fixed API Key Leakage via Vite config
**Vulnerability:** The Gemini API key was being hardcoded into the client bundle via the `define` section in `vite.config.ts`.
**Learning:** Using `define` in `vite.config.ts` to inject environment variables that are actually secrets exposes them directly in the browser's JavaScript bundle. This is a common and critical misconfiguration.
**Prevention:** Always verify if an environment variable injected via Vite contains sensitive data. If it does, the logic requiring it must be moved to a backend service (e.g., Convex) and proxy the request instead of doing it from the client.
