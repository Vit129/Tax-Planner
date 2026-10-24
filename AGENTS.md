# Tax-Planner — Agent Instructions

## Session Start
- Pure logic lives in `src/logic/` with Vitest in `tests/`.
- UI lives in `src/ui/`.
- Config / constants in `src/config/`.
- NEVER put DOM or UI dependencies inside `src/logic/`.
- When adding or modifying calculation logic, ALWAYS run `npm test` to verify.

## Domain Rules (2569 / 2026)
- Social Security (ม.33) ceiling is ฿17,500/mo (5% = ฿875/mo, ฿10,500/yr cap under Phase 1 law); never revert to legacy ฿750/฿9,000.

## Verification
- Run `npm test` before committing (`tests/architectureGuard.test.js` guards STRINGS/COLORS/TYPOGRAPHY imports and zero hardcoded tokens).
- Run `npm run build` to verify production bundle.
