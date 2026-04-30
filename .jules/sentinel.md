## 2024-05-18 - Prevent Frontend API Key Injection in Vite

**Vulnerability:** The Google Gemini `API_KEY` was being hardcoded into the frontend client bundle using Vite's `define` configuration within `vite.config.ts`. Additionally, the frontend directly initiated calls to the AI API, exposing the API keys to any user who inspects the client bundle or network traffic.

**Learning:** Injecting secrets via Vite's `define` or making API calls to an external service directly from the frontend exposes the API key. Since Vite `define` does string replacement during compilation, this leads to the secret being burned into the public static output (the `.js` files in `dist/`). This allows malicious users to extract the key and exploit it, leading to financial or security risks.

**Prevention:** To avoid this in the future:
1. Never inject sensitive environment variables (e.g., API keys, database credentials) into the frontend using Vite's `define` or `import.meta.env` unless the variable is explicitly intended to be public (e.g., `VITE_PUBLIC_API_URL`).
2. Move all interactions with sensitive external APIs (like Google GenAI) to a secure backend environment (like a Convex action or a Node.js server).
3. Ensure the frontend only passes contextual data required for the operation (like `weatherContext` or `zoneContext`), and the backend handles constructing the payload, attaching the secret API key, and forwarding the request.
4. When executing node-specific libraries on the backend (like Convex), ensure the `"use node";` directive is added to the top of the file if needed to support specific modules.