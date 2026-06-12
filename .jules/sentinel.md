## 2025-06-12 - Prevent Confused Deputy / Open Proxy Vulnerability

**Vulnerability:** The AI system instruction (system prompt) was configured on the frontend alongside the API key exposed via `vite.config.ts`. Even if moved to the backend, if a backend action simply takes an arbitrary instruction and data from the frontend and acts as an open proxy to the LLM API, it introduces a "Confused Deputy" vulnerability where malicious users can spoof prompts or extract keys.

**Learning:** When standardizing on backend architecture for AI API calls in Convex apps to protect the API key, it is critical not just to hide the key, but to enforce the strict construction of the prompt itself on the server. The frontend must only provide minimal necessary variables (like pre-formatted context strings), leaving the core logic and constraints hardcoded in the server action.

**Prevention:** To prevent this, always build the AI system prompt securely on the backend. Only pass necessary context variables to the server, and avoid taking arbitrary full instructions. Remove any insecure key exposures from client bundles (e.g., Vite `define` properties).
