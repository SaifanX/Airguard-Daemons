## 2024-04-15 - Secret Leakage via Vite config 'define'
**Vulnerability:** The application was exposing the GEMINI_API_KEY directly to the client-side bundle via the `define` configuration in `vite.config.ts`. This allows any user to extract the API key and abuse the service.
**Learning:** Injecting secrets via Vite's `define` directly replaces occurrences in the frontend code with the raw secret string, making it publicly accessible.
**Prevention:** Avoid defining secrets in `vite.config.ts` for client consumption. Instead, route sensitive operations (like AI generation) through a secure backend (e.g., Convex actions) where the secret remains hidden in the server environment.
