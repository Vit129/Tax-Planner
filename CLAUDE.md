# Tax-Planner Guidelines

## Build & Test Commands
- Run dev server: `npm run dev`
- Run unit tests: `npm test`
- Build production: `npm run build`

## Code Structure
- `src/config/`: Tax brackets & deduction rules.
- `src/logic/`: Pure calculation functions (no UI, no DOM).
- `src/ui/`: React presentation components.
- `tests/`: Vitest test suites.
