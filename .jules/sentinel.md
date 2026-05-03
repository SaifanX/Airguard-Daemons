## 2024-05-03 - Prevent API Key Leakage in Client Bundle
**Vulnerability:** The Gemini API key was injected into the Vite client bundle via the `define` configuration and accessed directly in client-side code (`services/geminiService.ts`), exposing it to the browser.
**Learning:** Never use `define` or `VITE_` prefixes for secrets. Client-side code cannot securely hold API keys.
**Prevention:** Proxy all AI interactions through secure backend actions (like Convex `action`) and only send pre-computed context from the frontend.
