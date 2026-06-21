## 2024-06-21 - API Key Exposure via Vite Define
**Vulnerability:** The Gemini API key was exposed to the frontend via the `define` block in `vite.config.ts`, and direct AI calls were happening from the client.
**Learning:** `define` in Vite directly replaces strings in the bundle with the evaluated expressions, exposing sensitive secrets. Direct API calls from the frontend allow Open Proxy (Confused Deputy) vulnerabilities.
**Prevention:** Always ensure sensitive actions (like API calls using keys) are executed within backend functions (e.g., Convex actions). Never expose secrets via Vite's `define` or `VITE_` prefix unless intentionally public. Use secure action proxies.
