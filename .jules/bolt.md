## 2024-05-20 - Memoization of Geographic Computations inside requestAnimationFrame

**Learning:** Computations from libraries like `@turf/turf` (such as `lineString` and `length`) are expensive to run repeatedly inside a 60fps `requestAnimationFrame` loop. In `SimulationEngine.tsx`, these computations were causing unnecessary CPU overhead and garbage collection pressure because the static properties of the flight path do not change while animating.

**Action:** Extract static geographic calculations out of high-frequency animation loops and memoize them (e.g., using `useMemo`) based on the data that actually changes (like `flightPath`). This provides a massive performance boost for map-based simulations.