## 2026-05-13 - [Fix API Key Exposure]
**Vulnerability:** The Gemini API key was injected into the Vite frontend build via the `define` property in `vite.config.ts`, exposing the secret key to anyone inspecting the client code.
**Learning:** Hardcoded or bundled API keys in frontend configurations are a critical security risk. When using AI APIs, backend integration is required to prevent key leakage.
**Prevention:** Never inject secrets using Vite's `define` or `import.meta.env` unless they are explicitly meant for public consumption. Always proxy sensitive third-party API calls through a secure backend action (like Convex `action`) to protect the keys.
