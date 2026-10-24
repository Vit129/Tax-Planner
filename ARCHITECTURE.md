# 🏛️ Architecture: Tax-Planner (v1.1.0)

## 1. Architectural Principles

Tax-Planner adheres to strict decoupled layering according to **AODD & Clean Architecture Patterns**:

1. **Pure Domain Logic Isolation (`packages/tax-core` / `@vit129/thai-tax-core`)**:
   - Zero React, DOM, Browser, or network dependencies.
   - Computes progressive personal income tax (ภ.ง.ด. 90/91), itemized allowances, ฿500k retirement pool caps, and safe arithmetic parsing.
   - Tested in pure Node via Vitest without virtual DOM mocks.

2. **Presentation Layer Separation (`src/ui/`)**:
   - UI components receive state via props or React Context, invoke handlers, and render markup.
   - Never embed tax calculation algorithms, tax rate thresholds, or deduction caps directly inside render functions or hooks.

3. **Externalized Localization / String Dictionary (`src/config/strings.js`)**:
   - 100% of human-readable text, input labels, error messages, month names, and prompt templates live in `strings.js`.
   - UI components and domain logic contain **zero hardcoded Thai string literals**.

4. **Design Token Centralization (`@vit129/tax-ui` & `src/config/`)**:
   - No hardcoded `#hex` color literals in components.
   - No numeric `fontSize` or inline `fontFamily` overrides.
   - All styles reference `COLORS.*` and `TYPOGRAPHY.*`.

5. **Automated Architecture Guard Enforcement (`tests/architectureGuard.test.js`)**:
   - Architectural rules are not passive documentation; they are verified by automated tests running on every test run.
   - Enforces 0 missing `STRINGS` keys, 0 hardcoded Thai characters outside `strings.js`, 0 hardcoded `#hex` colors, and 0 raw typography values.

---

## 2. Shared Packages Architecture (`@vit129`)

Tax-Planner leverages shared monorepo packages located in `../My-Investment-Port/packages/`:

```
My-Investment-Port/packages/
├── tax-core/                  # @vit129/thai-tax-core
│   ├── src/
│   │   ├── index.ts           # Public API barrel
│   │   ├── types.ts           # Tax & company TypeScript interfaces
│   │   ├── taxMath.ts         # Progressive tax ladder & marginal rate
│   │   ├── deductions.ts      # 2569 itemized allowances & sub-caps
│   │   ├── evalExpression.ts  # Math formula evaluator & Baht formatters
│   │   ├── employment.ts      # Multi-company income & PVD
│   │   ├── socialSecurity.ts  # Social security month-by-month calculator
│   │   ├── strings.ts         # Base deduction labels & prompt templates
│   │   └── aiPrompt.ts        # AI RMF recommendation prompt generator
│   └── tests/                 # Unit test suite for core math & prompts
│
└── tax-ui/                    # @vit129/tax-ui
    ├── src/
    │   ├── index.js           # Public API barrel
    │   ├── tokens.js          # Shared Warm Cream & Dark color/typography tokens
    │   ├── BreakdownTile.jsx  # Reusable metric & sub-cap tile
    │   ├── Card.jsx           # Reusable container with step badge & actions
    │   ├── ChipButton.jsx     # Reusable pill toggle & preset button
    │   ├── MoneyInput.jsx     # Reusable currency/unit input with monospace font
    │   ├── ProgressBar.jsx    # Reusable multi-segment progress bar
    │   └── Stepper.jsx        # Reusable count decrement/increment control
    └── tests/                 # Unit tests for UI primitives and tokens
```

In `Tax-Planner/vite.config.js`, `@vit129/thai-tax-core` and `@vit129/tax-ui` are mapped via Vite path aliases:
```javascript
resolve: {
  alias: {
    '@vit129/thai-tax-core': path.resolve(sharedPackagesRoot, 'tax-core/src/index.ts'),
    '@vit129/tax-ui': path.resolve(sharedPackagesRoot, 'tax-ui/src/index.js'),
  },
  dedupe: ['react', 'react-dom'],
}
```

---

## 3. Directory Layout

```
Tax-Planner/
├── README.md                  # Developer & user guide
├── PRODUCT.md                 # Product requirements & persona specifications
├── ARCHITECTURE.md            # System architecture & layer boundaries
├── DESIGN.md                  # Design system, tokens & layout grid
├── CONTEXT.md                 # Domain vocabulary & tax glossary
├── AGENTS.md                  # AI agent pairing rules
├── package.json               # Package config & npm scripts
├── vite.config.js             # Vite bundler configuration & aliases
├── index.html                 # Single page application entry point
│
├── src/
│   ├── config/
│   │   ├── colors.js          # Color tokens re-exported from @vit129/tax-ui
│   │   ├── typography.js      # Typography scale re-exported from @vit129/tax-ui
│   │   ├── strings.js         # Centralized Thai string dictionary
│   │   └── taxRules.js        # Numeric constants & rules (derived from strings.js)
│   ├── logic/
│   │   ├── evalExpression.js  # Re-exported from @vit129/thai-tax-core
│   │   ├── companyLogic.js    # Multi-employer salary, bonuses & withholding
│   │   └── taxLogic.js        # Master calculation engine & AI prompt wrapper
│   └── ui/
│       ├── App.jsx            # Top-level state orchestration & localStorage
│       ├── shared/            # Re-exported UI primitives from @vit129/tax-ui
│       └── components/        # Feature UI sections (Salary, Deductions, What-If, etc.)
│
└── tests/
    ├── companyLogic.test.js   # Unit tests for company & raise timeline logic
    ├── taxLogic.test.js       # Unit tests for progressive tax & sub-caps
    └── architectureGuard.test.js # Automated architecture invariant guard
```

---

## 4. Dependency Direction

```
ui/components  ──▶  ui/shared (@vit129/tax-ui)  ──▶  logic (@vit129/thai-tax-core)  ──▶  config/strings
```
- **Invariants:**
  - `logic` MUST NEVER import from `ui`.
  - `config` MUST NEVER import from `logic` or `ui`.
  - No file outside `config/strings.js` may declare hardcoded Thai strings.
  - No file outside `config/colors.js` may declare hardcoded `#hex` values.

---

## 5. Automated Architecture Guard Specifications

`tests/architectureGuard.test.js` runs in Vitest and validates 4 core assertions:
1. `has zero missing STRINGS keys across all source files`: Verifies that every `STRINGS.<KEY>` referenced in JSX exists in `src/config/strings.js`.
2. `has zero hardcoded Thai words/characters outside src/config/strings.js`: Scans all source files with regex `[\u0E01-\u0E3A\u0E40-\u0E7F]`.
3. `has zero hardcoded #hex colors outside src/config/colors.js`: Scans all source files with regex `#[0-9a-fA-F]{3,8}\b`.
4. `has zero hardcoded fontSize or fontFamily outside src/config/typography.js`: Scans all UI files for non-token font styles.
