## 2024-05-20 - Enforced Server-Side Business Logic

**Vulnerability:** Client-side validation could be bypassed, allowing high-risk flights (riskScore > 50) to be submitted and saved with an "APPROVED" status.
**Learning:** Never trust the client for critical security or business logic validation. Always re-verify rules on the backend. When writing Convex mutations, use an immutable pattern (e.g. `const data = { ...args, field: override }`) rather than mutating the `args` object directly before database insertion to ensure data integrity and avoid side-effects.
**Prevention:** In backend mutations, enforce mandatory conditions (like score thresholds) directly before `db.insert`, irrespective of what status the client requested.

## 2024-05-20 - Netlify Deployment and Runtime Errors

**Vulnerability:** Convex deployment fails when backend Node.js built-ins are imported into actions that are run on the default V8 isolate edge runtime.
**Learning:** Convex server functions using Node-specific modules (such as '@google/genai') must include the '"use node";' directive at the top of the file to execute properly.
**Prevention:** Always verify if an imported module relies on node-specific APIs. If so, add '"use node";' to the top of the action file.
