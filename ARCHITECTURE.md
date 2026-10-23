# Architecture: Tax-Planner

## 1. Principles

1. **Strict Logic vs UI Separation**:
   - `src/logic/`: Pure calculation functions (no DOM, no React, no I/O). Tested directly with Vitest.
   - `src/ui/`: Presentation and state orchestration.
   - `src/config/`: Tax brackets, limits, and constant rules for tax year 2569 (2026).
2. **Dependency Direction**:
   - `ui -> logic -> config`
   - `logic` NEVER imports from `ui`.
3. **Anti-Monolith & Modular Design**:
   - Each component remains under 300–400 lines.
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
│   │   └── taxRules.js           # Tax brackets & deduction caps (2569/2026)
│   ├── logic/
│   │   ├── evalExpression.js     # Safe formula/number parsing
│   │   ├── companyLogic.js       # Salary progression, PVD, SS, withholding
│   │   └── taxLogic.js           # Progressive tax calculation & settlements
│   └── ui/
│       ├── App.jsx               # Main state orchestration
│       └── components/
│           ├── Header.jsx        # App header & sample loader
│           ├── CompanyCard.jsx   # Company salary, timeline & adjustments
│           ├── CompanyList.jsx   # Multi-company manager
│           ├── DeductionsCard.jsx# Deductions checklist
│           ├── TaxSummaryCard.jsx# Waterfall breakdown & hero card
│           └── WhatIfSimulator.jsx# RMF / ThaiESG what-if sliders
└── tests/
    ├── companyLogic.test.js      # Unit tests for company salary logic
    └── taxLogic.test.js          # Unit tests for tax brackets & deductions
```

## 3. Structure Deviations

None. Fully compliant with project-blueprint standard.
