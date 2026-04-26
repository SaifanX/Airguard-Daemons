## 2025-05-01 - Missing Backend Validation for Flight Status
**Vulnerability:** The client could bypass safety checks by submitting flights with `riskScore > 50` and `status: "APPROVED"`. The backend mutation `logFlight` had the validation logic commented out.
**Learning:** Never trust client-side validation for critical safety or status fields. Attackers can modify API requests to bypass frontend controls.
**Prevention:** Always enforce critical business logic and security rules on the backend, creating new objects (immutability) instead of mutating the `args` directly.
