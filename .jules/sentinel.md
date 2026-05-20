## 2025-05-15 - [API Key Exposure in Vite Config]
**Vulnerability:** The Gemini API key was injected directly into the client bundle via `define` in `vite.config.ts`, exposing the raw key and making the AI service susceptible to prompt injection and Open Proxy vulnerabilities.
**Learning:** Client-side AI services pose severe security risks by exposing environment variables.
**Prevention:** Always implement AI interactions via backend actions (e.g., Convex) and pass only the necessary context (e.g., `weatherContext`, `zoneContext`) instead of constructing the full system instruction on the frontend.
