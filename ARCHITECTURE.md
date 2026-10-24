# Architecture: Tax-Planner

## 1. Principles

1. **Strict Logic vs UI vs Config Separation**:
   - `src/config/`: Centralized tokens (`colors.js`, `typography.js`), Thai-only strings (`strings.js`), and tax rules (`taxRules.js`). Zero hardcoded colors, fonts, or strings in UI.
   - `src/logic/`: Pure calculation functions (no DOM, no React, no I/O). Tested directly with Vitest.
   - `src/ui/shared/`: Reusable atomic UI components (`Card`, `MoneyInput`, `ChipButton`, `Stepper`, `ProgressBar`, `BreakdownTile`).
   - `src/ui/components/`: Feature-level UI sections and cards.
2. **Dependency Direction**:
   - `ui/components -> ui/shared -> logic -> config`
   - `logic` NEVER imports from `ui`.
3. **Anti-Monolith & Modular Design**:
   - Each component remains well under 300–400 lines.
   - High cohesion and single responsibility.

## 2. Directory Structure

```
Tax-Planner/
├── README.md
├── ARCHITECTURE.md
├── CONTEXT.md
├── CLAUDE.md
├── AGENTS.md
├── .gitignore
├── package.json
├── vite.config.js
├── index.html
├── src/
│   ├── config/
│   │   ├── colors.js              # Warm Cream Theme & Dark mode color tokens
│   │   ├── typography.js          # Font families, sizes, and weights
│   │   ├── strings.js             # Centralized Thai UI strings (single-language)
│   │   └── taxRules.js            # Tax brackets, deduction caps, AI defaults & sample funds
│   ├── logic/
│   │   ├── evalExpression.js      # Safe formula/number parsing & Baht formatters
│   │   ├── companyLogic.js        # Monthly salaries, overrides, OT, PVD, SS & withholding
│   │   └── taxLogic.js            # Progressive tax, sub-caps, RMF advice & AI prompt generator
│   └── ui/
│       ├── App.jsx                # Main state orchestration & 2-column layout
│       ├── shared/
│       │   ├── Card.jsx           # Shared Card wrapper with step number & header actions
│       │   ├── MoneyInput.jsx     # Shared currency/unit/text input
│       │   ├── ChipButton.jsx     # Shared pill/chip & preset toggle button
│       │   ├── Stepper.jsx        # Shared - / + numeric stepper
│       │   ├── ProgressBar.jsx    # Shared multi-segment horizontal bar
│       │   └── BreakdownTile.jsx  # Shared metric & sub-cap tile
│       └── components/
│           ├── Header.jsx             # App header, disclaimer, sample bar & sticky mobile bar
│           ├── SalarySection.jsx      # Step 1: Company tabs, 12-month grid, raises & bonus
│           ├── WithholdingSection.jsx # Step 2: 50 Tawi withholding input & badge
│           ├── DeductionsSection.jsx  # Step 3: Family, insurance & extra deduction chips
│           ├── FundsSection.jsx       # Step 4: RMF & Thai ESG already bought
│           ├── HeroSummaryCard.jsx    # Right 1: Refund/Payable hero, 4 tiles & bracket ladder
│           ├── RmfAdviceCard.jsx      # Right 2: Smart RMF advice & monthly DCA chips
│           ├── RetirementPoolCard.jsx # Right 3: 500k pool bar + RMF & PVD breakdown tiles
│           ├── CompanyBreakdownCard.jsx # Right 4: Per-company income & withholding table
│           ├── WhatIfSimulator.jsx    # Right 5: Presets, unified amount box, slider & ROI
│           ├── AskAiCard.jsx          # Right 6: Ask AI RMF prompt & 4 platform buttons
│           └── TaxDetailsCard.jsx     # Right 7: Waterfall calculation & year-end checklist
└── tests/
    ├── companyLogic.test.js       # Unit tests for company salary & override logic
    └── taxLogic.test.js           # Unit tests for tax brackets, sub-caps & AI prompt
```

## 3. Structure Deviations

None. Fully compliant with project-blueprint standard.
