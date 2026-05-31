## 2024-05-31 - Initial Setup
**Learning:** Required Sentinel tracking file.
**Action:** Created file.

## 2024-05-31 - Client-Side API Key Leak via Vite Config Define
**Vulnerability:** The Gemini API key was exposed directly to the frontend JS bundle through Vite's `define` configuration, and the AI agent logic was incorrectly executing client-side.
**Learning:** Vite bundles `define` variables directly into the compiled output in plain text. AI operations should never happen client-side due to key leakage and Open Proxy vulnerability risks.
**Prevention:** Always ensure AI integrations run purely on the backend (e.g., using Convex actions like `askCaptain`). Never use `define` in `vite.config.ts` for sensitive environment variables.
