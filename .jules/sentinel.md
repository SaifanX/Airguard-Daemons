## 2025-05-24 - API Key Exposure in Vite Config
**Vulnerability:** A critical security vulnerability was discovered where the Gemini API key was being injected directly into the client bundle via the `define` block in `vite.config.ts`.
**Learning:** Hardcoding or injecting backend API keys into frontend build configurations (like `vite.config.ts`) exposes them to the public, leading to potential abuse and quota limits.
**Prevention:** Always proxy AI interactions through a secure backend (like Convex or a dedicated server). Ensure API keys are only accessed via secure server environments using environment variables (e.g., `process.env`), and never exposed to the frontend bundle.
