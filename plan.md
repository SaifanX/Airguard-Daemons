1. **Fix Critical Vulnerability: Remove API Key from Client Bundle**
   - In `vite.config.ts`, remove the `define` block that injects `process.env.API_KEY` and `process.env.GEMINI_API_KEY` into the frontend build.

2. **Migrate AI Logic to Backend**
   - Update `convex/ai.ts` to use `"use node";` to enable Node.js runtime.
   - Refactor the `askCaptain` Convex action to construct the AI system prompt dynamically based on passed parameters. It should read `process.env.API_KEY || process.env.GEMINI_API_KEY` to be secure and compatible with environments.

3. **Refactor Frontend AI Integration**
   - Update `components/AiAssistant.tsx` to stop calling the frontend `getCaptainCritique` function and instead use the Convex action `askCaptain`.
   - Calculate contextual data (like `weatherContext` and `zoneContext`) securely on the frontend and pass these sanitized strings as arguments to `askCaptain`.

4. **Cleanup Unused Service**
   - Delete `services/geminiService.ts` since it's no longer used and poses a risk of encouraging frontend AI processing.

5. **Complete pre commit steps**
   - Ensure proper testing, verification, review, and reflection are done by running `pnpm build`, checking TypeScript and linting (if available), and generating a journal entry.

6. **Submit the change**
   - Commit the change with an appropriate description for the security patch.
