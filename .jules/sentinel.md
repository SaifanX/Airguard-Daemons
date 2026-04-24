## 2025-05-24 - API Key Exposure in Vite Config
**Vulnerability:** A critical security vulnerability was discovered where the Gemini API key was being injected directly into the client bundle via the `define` block in `vite.config.ts`.
**Learning:** Hardcoding or injecting backend API keys into frontend build configurations (like `vite.config.ts`) exposes them to the public, leading to potential abuse and quota limits.
**Prevention:** Always proxy AI interactions through a secure backend (like Convex or a dedicated server). Ensure API keys are only accessed via secure server environments using environment variables (e.g., `process.env`), and never exposed to the frontend bundle.
## 2025-05-24 - CI Build Failure due to NPM command
**Vulnerability:** CI deployments on Netlify were failing because the `netlify.toml` file explicitly configured a build step using `npm run build`. This violated the repository requirement to exclusively use `pnpm`, leading to package manager lockfile conflicts and failed deployments.
**Learning:** Build command configurations in automated CI/CD pipelines (e.g., `netlify.toml`, GitHub Actions) must match the strict package manager constraints defined in the project (e.g., `pnpm`).
**Prevention:** Always verify build scripts and CI pipeline configuration files for package manager consistency (replacing `npm` or `yarn` with `pnpm`) to prevent build environments from breaking.

## 2025-05-24 - CI Build Failure due to NPM lockfile
**Vulnerability:** CI deployments on Netlify were failing because the `package-lock.json` file was present alongside `pnpm-lock.yaml`.
**Learning:** Having `package-lock.json` present causes Netlify CI to incorrectly infer `npm` instead of the mandated `pnpm`, leading to package manager conflicts and build failures.
**Prevention:** Ensure `package-lock.json` is not committed or present in the repository.
