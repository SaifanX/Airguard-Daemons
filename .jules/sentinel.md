## YYYY-MM-DD - Exposed API Key
**Vulnerability:** API Keys exposed in client-side bundle via `define` in `vite.config.ts`
**Learning:** Vite bundles the `define` properties as strings that get evaluated. This is especially risky for API keys, as they are completely exposed.
**Prevention:** Never use Vite `define` to expose secrets to the client. API calls to external services with sensitive keys should occur on a backend server, not directly from the client.
