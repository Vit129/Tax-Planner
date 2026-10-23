# Tax-Planner — Agent Instructions

## Session Start
- Pure logic lives in `src/logic/` with Vitest in `tests/`.
- UI lives in `src/ui/`.
- Config / constants in `src/config/`.
- NEVER put DOM or UI dependencies inside `src/logic/`.
- When adding or modifying calculation logic, ALWAYS run `npm test` to verify.

## Verification
- Run `npm test` before committing.
- Run `npm run build` to verify production bundle.
