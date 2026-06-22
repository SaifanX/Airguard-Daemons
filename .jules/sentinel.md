## 2024-06-22 - Vite Config Define Secret Leakage
**Vulnerability:** The `vite.config.ts` file used the `define` block to expose `process.env.API_KEY` to the client payload, leaking the secret.
**Learning:** In Vite, any value explicitly passed to the `define` property is bundled and exposed in plain text in the client-side build. This bypasses prefix rules and exposes backend secrets to the frontend.
**Prevention:** Never use Vite's `define` property to inject sensitive API keys or secrets. Move all related sensitive API interactions (e.g. Gemini calls) securely to the backend (such as a Convex action).
