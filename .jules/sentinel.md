## 2025-03-01 - Exposing API Keys in Vite config

**Vulnerability:** The Gemini API key was exposed directly to the client bundle via Vite's `define` property (`'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY)`), allowing unauthorized usage of the API key by any user who inspects the frontend code.

**Learning:** Any value explicitly defined in Vite's `define` configuration bypasses the `VITE_` prefix safeguards and gets hardcoded directly into the public frontend bundle. Security-critical values, such as LLM API keys, should never be passed this way or used in client-side code directly.

**Prevention:** Always remove sensitive API keys from the frontend configuration and source code. Instead, utilize a backend environment variable and handle all sensitive API requests through proxy actions (like Convex actions) where the token is kept secure and inaccessible to the client.
