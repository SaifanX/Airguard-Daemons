## 2024-05-20 - Enforced Server-Side Business Logic

**Vulnerability:** Client-side validation could be bypassed, allowing high-risk flights (riskScore > 50) to be submitted and saved with an "APPROVED" status.
**Learning:** Never trust the client for critical security or business logic validation. Always re-verify rules on the backend. When writing Convex mutations, use an immutable pattern (e.g. `const data = { ...args, field: override }`) rather than mutating the `args` object directly before database insertion to ensure data integrity and avoid side-effects.
**Prevention:** In backend mutations, enforce mandatory conditions (like score thresholds) directly before `db.insert`, irrespective of what status the client requested.
