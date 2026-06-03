## 2024-11-20 - Initialization\n**Learning:** Sentinel initialized.\n**Action:** No action yet.

## 2026-06-03 - Prevent Sensitive Environment Variable Exposure in Vite Configuration
**Vulnerability:** The `vite.config.ts` used the `define` configuration to explicitly inject `process.env.API_KEY` and `process.env.GEMINI_API_KEY` into the global scope. This completely bypasses Vite's standard `VITE_` prefix protection, exposing sensitive API credentials in plain text in the generated client-side Javascript bundle, making them susceptible to theft.
**Learning:** Explicitly overriding properties using the `define` object in a frontend bundler forces string replacement across the entire codebase during compilation. When mapping environment variables, this permanently hardcodes backend secrets into the publicly delivered assets.
**Prevention:** Never use the `define` directive in bundler configs (like Vite or Webpack) to map sensitive keys. Always isolate API credentials within a secure backend environment (like Convex actions or Edge functions) and route AI requests from the frontend client to the backend proxy service for secure processing.
