### Implementation Summary (PR 1 + PR 2)

All steps from the approved plan ([`mip-tax-core-plan.md`](file:///Users/supavit.cho/Git/Personal/Tax-Planner/docs/design/mip-tax-core-plan.md)) were implemented strictly within the git worktree [`/Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core) on branch `feat/tax-core`. No UI/JSX files were edited, and no pushes or PRs were performed.

---

### Commits

1. [`756b4aeb`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core) — `chore: move tax-rmf-pvd planner to repo root`
2. [`7db3e5c0`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core) — `feat(tax-core): scaffold package with per-year rules and vitest configuration`
3. [`0c41705b`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core) — `feat(tax-core): port taxCalculations logic into tax-core and re-export from app`

---

### Files Changed

- **Moved / Renamed:**
  - `docs/share/tax-rmf-pvd-planner.html` → [`tax-rmf-pvd.html`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/tax-rmf-pvd.html)
  - Updated path in [`.claude/skills/tax-management/references/tax-details.md`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/.claude/skills/tax-management/references/tax-details.md#L57)
- **New Package [`packages/tax-core`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core):**
  - [`packages/tax-core/package.json`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/package.json) (`@vit129/thai-tax-core`, `0.1.0`)
  - [`packages/tax-core/tsconfig.json`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/tsconfig.json)
  - [`packages/tax-core/src/types.ts`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/src/types.ts)
  - [`packages/tax-core/src/rules/2569.ts`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/src/rules/2569.ts)
  - [`packages/tax-core/src/rules/index.ts`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/src/rules/index.ts) ([`getRules`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/src/rules/index.ts#L10-L28))
  - [`packages/tax-core/src/taxMath.ts`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/src/taxMath.ts) ([`calculateTax`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/src/taxMath.ts#L7-L28), [`getMarginalTaxRate`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/src/taxMath.ts#L30-L36), [`getEffectiveTaxRate`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/src/taxMath.ts#L38-L41))
  - [`packages/tax-core/src/socialSecurity.ts`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/src/socialSecurity.ts) ([`calculateSocialSecurity`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/src/socialSecurity.ts#L24-L29))
  - [`packages/tax-core/src/employment.ts`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/src/employment.ts) (salary, bonus by last-worked month, withholding annualization)
  - [`packages/tax-core/src/deductions.ts`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/src/deductions.ts) ([`calculateDeductions`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/src/deductions.ts#L15-L182), [`calculateLimits`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/src/deductions.ts#L184-L280), [`calculateDividendCredit`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/src/deductions.ts#L282-L288))
  - [`packages/tax-core/src/settlement.ts`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/src/settlement.ts) ([`calculateTaxSettlement`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/src/settlement.ts#L13-L45), [`calculateTaxShieldScenario`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/src/settlement.ts#L77-L135))
  - [`packages/tax-core/src/rmfAdvice.ts`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/src/rmfAdvice.ts) ([`calculateRmfDropAdvice`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/src/rmfAdvice.ts#L7-L113))
  - [`packages/tax-core/src/taxYear.ts`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/src/taxYear.ts) ([`getDerivedTaxYear`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/src/taxYear.ts#L13-L30), [`monthsLeftInTaxYear`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/src/taxYear.ts#L3-L11))
  - [`packages/tax-core/src/aiPrompt.ts`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/src/aiPrompt.ts) ([`buildAskAiRmfPrompt`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/src/aiPrompt.ts#L10-L46))
  - [`packages/tax-core/src/index.ts`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/src/index.ts)
- **Unit Tests Added:**
  - [`packages/tax-core/tests/rules.test.ts`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/tests/rules.test.ts)
  - [`packages/tax-core/tests/taxMath.test.ts`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/tests/taxMath.test.ts)
  - [`packages/tax-core/tests/socialSecurity.test.ts`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/tests/socialSecurity.test.ts)
  - [`packages/tax-core/tests/employment.test.ts`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/tests/employment.test.ts)
  - [`packages/tax-core/tests/deductions.test.ts`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/tests/deductions.test.ts)
  - [`packages/tax-core/tests/rmfAdvice.test.ts`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/tests/rmfAdvice.test.ts)
  - [`packages/tax-core/tests/taxYear.test.ts`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/tests/taxYear.test.ts)
  - [`packages/tax-core/tests/aiPrompt.test.ts`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/packages/tax-core/tests/aiPrompt.test.ts)
- **Host App Re-exports & Configuration:**
  - [`src/features/tax/taxCalculations.ts`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/src/features/tax/taxCalculations.ts) (re-exports all calculation functions and types from `@vit129/thai-tax-core`; preserves [`getSmartRmf`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/src/features/tax/taxCalculations.ts#L104-L117) and [`getSmartPvd`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/src/features/tax/taxCalculations.ts#L68-L102))
  - [`src/types/portfolio.ts`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/src/types/portfolio.ts#L36-L65) (added optional fields to [`TaxInputs`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/src/types/portfolio.ts#L36-L65): `children2`, `parentHealthInsurance`, `parentsHealth`, `spouseLifeInsurance`, `spouseLife`, `gpf`, `nsf`, `donationParty`, `politicalDonation`)
  - [`vite.config.js`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/vite.config.js#L26-L53) (aliased `@vit129/thai-tax-core` and added `'packages/*/tests/**/*.test.ts'` to `test.include`)
  - [`tsconfig.json`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/tsconfig.json#L13-L17) (added paths mapping and included `packages/**/*`)

---

### Test Counts & Verification

- **Vitest Test Suites / Counts:**
  - **Before:** 41 passed files (221 passed tests)
  - **After:** 49 passed files (252 passed tests) — **+8 test suites, +31 tests, 0 regressions**
- **TypeScript Typecheck (`npx tsc --noEmit -p .`):** Clean (0 errors).
- **Linter (`npm run lint`):** Clean (0 errors).

---

### Changed Expected Values & Reason

- **No existing tests required expected value changes.**
  All 41 existing test suites (including fast-check property tests in [`taxCalculations.test.js`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/tests/vitest/features/tax/taxCalculations.test.js) and normalizer tests in [`tax-v3-normalization.test.js`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/tests/vitest/tax-v3-normalization.test.js)) remain 100% green without modification.

---

### Blockers / Incomplete Items

- None. All requirements for PR 1 and PR 2 were completed and verified.
