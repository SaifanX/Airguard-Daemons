## 2024-05-16 - Client-Side AI Integration API Key Exposure
**Vulnerability:** Gemini API keys were injected into the client bundle via Vite's `define` configuration and used directly in the browser to communicate with the Google GenAI service.
**Learning:** Any direct client-side AI services pose a severe security risk and expose sensitive environment variables to the browser.
**Prevention:** Sensitive API keys must never be injected into the client bundle. All AI interactions must be proxied through secure backend actions (e.g., Convex) utilizing environment variables configured server-side.
