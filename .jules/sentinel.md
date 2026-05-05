## 2024-05-05 - [API Key Exposure in Vite Config]
**Vulnerability:** The Gemini API key was injected into the client bundle via Vite`s define configuration, exposing it to end users.
**Learning:** Sensitive API keys must not be exposed to the client. AI interactions should be proxied through secure backend actions.
**Prevention:** Remove API key from Vite bundle and implement backend actions (e.g., Convex) for AI generation.
