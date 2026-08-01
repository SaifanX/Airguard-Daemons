## 2024-06-23 - Client-side API Key Leak via Vite define

**Vulnerability:** The Gemini API key was being leaked to the client bundle via Vite's `define` configuration (`process.env.API_KEY`), and AI generation was being performed directly on the client side in `services/geminiService.ts`.
**Learning:** In Vite, any value explicitly passed to the `define` configuration property is bundled and exposed in plain text in the client-side build, bypassing the `VITE_` prefix rule. Direct client-side calls to external AI services using sensitive keys are highly insecure.
**Prevention:** Never use Vite's `define` for sensitive secrets. Always route sensitive operations, like AI generation, through secure backend actions (e.g., Convex actions) where the API key can be kept safely in the server environment. Initialize the action on the client (e.g., via `useAction`) and pass it down to utility services if needed, but ensure the actual execution happens on the backend.
