# Tax-Planner

Browser-based Thai personal income tax planner for ภ.ง.ด. 90/91. Calculations and saved app data run in the browser.

## Run

```bash
npm install
npm run dev
```

## Check

```bash
npm test
npm run build
```

## Folders

- `src/logic/` — tax calculations and data transformations.
- `src/config/` — tax rules, user-facing strings, colors, and typography.
- `src/io/` — browser storage access.
- `src/ui/` — React interface components.
- `src/App.jsx` — application composition and state wiring.
- `tests/` — unit tests and browser scenario tests.

See [ARCHITECTURE.md](ARCHITECTURE.md) for layer boundaries and dependency rules.
