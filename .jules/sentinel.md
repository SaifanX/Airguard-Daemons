## 2024-04-03 - [CRITICAL] API Key Exposure via Vite Config

**Vulnerability:** A critical security vulnerability was discovered in the Vite configuration (`vite.config.ts`), where the `GEMINI_API_KEY` environment variable was exposed to the frontend client bundle via the `define` configuration. Additionally, the key was being used in a frontend service (`services/geminiService.ts`) to make direct calls to the Gemini API. This allows anyone inspecting the client source code to extract the secret API key.

**Learning:** When using build tools like Vite, it is easy to accidentally leak secrets by exposing them in `define` blocks or prefixing them with `VITE_`. Any secret required for third-party integrations must remain on the server, and frontend code should call a backend proxy function instead.

**Prevention:**
- Never define server-side secrets in Vite's `define` or use the `VITE_` prefix for secrets.
- Always proxy sensitive operations (like AI API calls) through backend actions (e.g., Convex actions).
- When using Convex actions that require Node.js specific modules, ensure the action file starts with `"use node";` to avoid edge runtime limitations.
