## 2025-04-13 - API Key Leak via Vite Config
**Vulnerability:** The `GEMINI_API_KEY` was exposed in the client bundle because it was injected using Vite's `define` configuration. This allowed any user to inspect the frontend code and steal the API key.
**Learning:** Never use Vite's `define` or `import.meta.env` to pass sensitive backend secrets to the frontend.
**Prevention:** All API calls requiring secrets must be proxied through secure backend actions (like Convex server actions). The frontend should only compute necessary context and send it to the backend, which holds the actual API key.
