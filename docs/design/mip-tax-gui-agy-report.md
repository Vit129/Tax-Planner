### Redesign Complete: Tax Page Rebuilt to Approved Mockup

The Tax Planner page in `~/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core` on branch `feat/tax-core` has been rebuilt to match the structure, order, wording, controls, and behavior of the approved design mockup ([`tax-planner-mockup.html`](file:///Users/supavit.cho/Git/Personal/Tax-Planner/docs/design/tax-planner-mockup.html)).

---

### 1. Commits

All changes were structured into small commits following conventional messages with the required co-author line:

- [`8c09b8ae`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core) — `feat(tax): add translations and UI components for tax planner redesign`
- [`4b860e98`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core) — `feat(tax): implement step cards for salary, family, insurance, and extras`
- [`da61f594`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core) — `feat(tax): rebuild right column cards and restyle Ask-AI fund section`
- [`419324f3`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core) — `feat(tax): rebuild Tax page layout matching approved mockup`

---

### 2. Files Added, Changed, and Removed

#### Added
- [`src/features/tax/TaxHeroSummaryCard.jsx`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/src/features/tax/TaxHeroSummaryCard.jsx) — Hero card with refund/extra-tax status, 4 summary tiles (income, total deductions, net income, tax), and 0–35% bracket ladder.
- [`src/features/tax/TaxRmfAdviceCard.jsx`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/src/features/tax/TaxRmfAdviceCard.jsx) — "ควรซื้อ RMF เท่าไร" card using `calculateRmfDropAdvice` with `enrichInputs`, full allowance box, and monthly chip plan.
- [`src/features/tax/TaxPoolBar.jsx`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/src/features/tax/TaxPoolBar.jsx) — 500,000 cap retirement pool progress bar with RMF, PVD, pension, and NSF breakdown.
- [`src/features/tax/TaxCompanyTable.jsx`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/src/features/tax/TaxCompanyTable.jsx) — Income by company breakdown table with employment range badges.
- [`src/features/tax/TaxGuide.jsx`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/src/features/tax/TaxGuide.jsx) — Three fold-outs: line-by-line waterfall, RMF vs PVD, and year-end checklist.
- [`src/features/tax/TaxStep1SalaryBonus.jsx`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/src/features/tax/TaxStep1SalaryBonus.jsx) — Step 1: Company tabs, start/end month selects, month grid with raise chips, bonus formula, PVD rates, and withholding.
- [`src/features/tax/TaxStep2Family.jsx`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/src/features/tax/TaxStep2Family.jsx) — Step 2: Yourself, spouse toggle, children, 2nd child born 2018+ (`children2`), and parents using enlarged steppers.
- [`src/features/tax/TaxStep3Insurance.jsx`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/src/features/tax/TaxStep3Insurance.jsx) — Step 3: Social Security (auto), PVD (auto), life, health (≤25k), pension, RMF bought (read-only link to `/rmf`), Thai ESG.
- [`src/features/tax/TaxStep4Extras.jsx`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/src/features/tax/TaxStep4Extras.jsx) — Step 4: 10 tap-to-add chips revealing input fields when toggled on, clearing to 0 when toggled off.

#### Changed
- [`src/pages/TaxPage.jsx`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/src/pages/TaxPage.jsx) — Restructured into desktop two-column / phone single-column layout with mobile sticky bar and derived tax year.
- [`src/features/tax/TaxInputPanel.jsx`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/src/features/tax/TaxInputPanel.jsx) — Decomposed into the 4 modular step cards while keeping `data-testid="tax-input-panel"`.
- [`src/features/tax/TaxSimulator.jsx`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/src/features/tax/TaxSimulator.jsx) — Rewritten simulator with two sliders (RMF & Thai ESG), 3 comparison tiles, lines, and full-cap ROI calculations.
- [`src/features/tax/AskAiFundSection.jsx`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/src/features/tax/AskAiFundSection.jsx) — Restyled to match mockup card (house, focus, held funds, budget, prompt foldout, and direct AI provider buttons).
- [`src/features/tax/TaxMonthGrid.jsx`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/src/features/tax/TaxMonthGrid.jsx) — Cleaned close button accessible name to exactly `"✕"`.
- [`src/features/tax/taxCalculations.ts`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/src/features/tax/taxCalculations.ts) — Wrapped `calculateRmfDropAdvice` with `enrichInputs`.
- [`src/components/ui/Stepper.jsx`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/src/components/ui/Stepper.jsx) — Enlarged touch targets to ≥ 40px with `aria-label="ลด"` and `aria-label="เพิ่ม"`.
- [`src/config/translations/07-tax.js`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/src/config/translations/07-tax.js) — Added Thai (`TH_STRINGS`) and English (`EN_STRINGS`) translations for all new controls and labels.
- [`src/features/tax/index.js`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/.kouen-worktrees/tax-core/src/features/tax/index.js) — Exported new components while preserving all existing exports.

#### Removed
- None. (Zero deleted files or removed exports).

---

### 3. Verification & Test Counts

1. **Vitest Unit Tests**: **283 passed** (51 test files).
2. **TypeScript Checker**: `npx tsc --noEmit -p .` completed **clean (0 errors)**.
3. **ESLint**: `npx eslint` on all touched files passed with **0 errors, 0 warnings**.
4. **Playwright E2E**: `LANG=th BASE_URL=http://127.0.0.1:5175 npx playwright test tests-web/port/tax --project=macbook-pro-14 --reporter=line` -> **12 passed (17.3s)**.

---

### 4. Browser Interaction Check Results

Executed automated browser interaction sequence (`.tmp/interaction-check.mjs`):
1. **Add second company**: Clicked `+ เพิ่มบริษัท`. A second tab `บริษัท 2 · ธ.ค.–ธ.ค.` appeared and was immediately focused.
2. **Raise + One-off bonus**: Opened September (month 9) popup editor. Filled salary `55,000` with scope "เดือนนี้และเดือนต่อไป" and one-off other income `15,000`. Saved. Month 9 cell updated to display `55,000 | 70,000 | -4,163` with the raise indicator `▲`.
3. **Optional deductions**: Tapped `Easy E-Receipt` chip -> field appeared -> entered `30,000`. Tapped `ดอกเบี้ยบ้าน` chip -> field appeared -> entered `50,000`. Both chips displayed active pressed styling.
4. **Simulator sliders**: Moved RMF slider to `30,000` and Thai ESG slider to `20,000`. Simulator comparison tiles reacted dynamically, showing `฿50,000` paid, updated tax savings, and bracket transition.
5. **Reset button**: Clicked `กลับไปค่าจริง`. Sliders reset to `0`, comparison tiles reset to `฿0`, and base user data remained untouched.
6. **Console errors**: `0` errors logged.

---

### 5. Screenshots & Card-by-Card Comparison

Full screenshots and card crops captured to `.tmp/`:
- **Desktop (1280px)**:
  - App full page: `.tmp/app-full-1280.png`
  - Mockup full page: `.tmp/mockup-1280.png`
- **Mobile (400px)**:
  - App full page: `.tmp/app-full-400.png`
  - Mockup full page: `.tmp/mockup-400.png`
- **Card Crops (App vs Mockup)**:
  - Hero Card: `.tmp/crop-app-hero.png` vs `.tmp/crop-mockup-hero.png`
  - Step 1 (Salary & Bonus): `.tmp/crop-app-step1.png` vs `.tmp/crop-mockup-step1.png`
  - Step 2 (Family): `.tmp/crop-app-step2.png` vs `.tmp/crop-mockup-step2.png`
  - Step 3 (Insurance & Funds): `.tmp/crop-app-step3.png` vs `.tmp/crop-mockup-step3.png`
  - Step 4 (Extras): `.tmp/crop-app-step4.png` vs `.tmp/crop-mockup-step4.png`
  - RMF Advice: `.tmp/crop-app-rmf-advice.png` vs `.tmp/crop-mockup-rmf-advice.png`
  - Pool Bar: `.tmp/crop-app-pool-bar.png` vs `.tmp/crop-mockup-pool-bar.png`
  - Simulator: `.tmp/crop-app-simulator.png` vs `.tmp/crop-mockup-simulator.png`
  - Ask-AI: `.tmp/crop-app-ask-ai.png` vs `.tmp/crop-mockup-ask-ai.png`
  - Company Table: `.tmp/crop-app-company-table.png` vs `.tmp/crop-mockup-company-table.png`
  - Guide (Fold-outs): `.tmp/crop-app-guide.png` vs `.tmp/crop-mockup-guide.png`
  - Visualizer: `.tmp/crop-app-visualizer.png`

#### Differences Left from Mockup & Rationale
1. **Sample Data Banner**: Mockup contained an orange banner `นี่คือตัวอย่าง · ...`. This was omitted as instructed by the brief because the app already has demo mode via `usePrivacy`.
2. **RMF Bought Field**: In the mockup, RMF bought was an editable input box. In the app, it is a read-only field displaying actual RMF bought with a link to `/rmf`, as explicitly mandated by the brief ("RMF actually bought (read-only, with the link to the RMF page)").
3. **Color Tokens**: The application uses the app's established dark theme tokens (`src/config/colors.js` and `typography.js`) rather than light-mode CSS variables from the mockup.
4. **TaxVisualizer Section**: The mockup did not include the SVG bracket chart, strategy tips, brackets reference, and dividend tax credit calculator. These were kept at the bottom of the right column per brief requirements.
5. **AI Prompt Generator**: Maintained the existing `generateAiRmfPrompt` implementation and exports so that unit tests in `AskAiFundSection.test.js` pass unchanged.

---

### 6. Git & Branch Status
- No push, no merge, no PR was executed.
- Untracked files under `graphify-out/`, `.tmp/`, and `tests/web-testing/test-results/` were left unstaged.
