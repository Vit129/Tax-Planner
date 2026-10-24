# Plan: Extract `packages/tax-core` and Redesign TaxPage UI

> **READ-ONLY Task Notice:** No files, branches, or worktrees have been created, modified, or deleted. This document is an architectural and implementation plan presented for review and approval.

---

## A. `tax-core` Public API Design

`packages/tax-core` (to be published as `@vit129/thai-tax-core`) will be a zero-dependency, pure-TypeScript library containing pure mathematical, tax-rule, and string formatting functions. It contains **no React hooks, no DOM manipulation, no Zustand store, and no portfolio fund holdings**.

### 1. Types & Interfaces

| Type / Interface | Definition & Fields | Source / Origin |
|---|---|---|
| `TaxBracket` | `{ min: number; max: number; rate: number; cumulative: number }` | [`src/features/tax/taxCalculations.ts:4-9`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/src/features/tax/taxCalculations.ts#L4-L9) |
| `TaxYearRules` | Annual tax configuration (`PERSONAL_DEDUCTION`, `SS_MONTHLY_CAP`, `EXPENSE_CAP`, `RETIREMENT_GROUP_CAP`, `THAI_ESG_CAP`, `TAX_BRACKETS`, etc.) | Derived from [`src/data/raw/thaiFunds.js:39-56`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/src/data/raw/thaiFunds.js#L39-L56) + year-specific configs (e.g., `rules/2569.ts`) |
| `CompanyMonthEntry` | `{ salary?: number; totalIncome?: number; other?: number }` | [`src/types/portfolio.ts:25`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/src/types/portfolio.ts#L25) & mockup [`tax-planner-mockup.html:248`](file:///Users/supavit.cho/Git/Personal/Tax-Planner/docs/design/tax-planner-mockup.html#L248) |
| `CoreCompany` | `{ id?: string; name: string; monthlySalary: number; totalMonthlyIncome?: number; startMonth?: number; endMonth?: number; months?: Record<string, CompanyMonthEntry>; bonusFixMonths?: number; bonusVariable?: number; bonusPerformance?: number; pvdEmpRate?: number; pvdCoRate?: number; withholdingTax?: number \| null }` | Pure subset of [`src/types/portfolio.ts:22-34`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/src/types/portfolio.ts#L22-L34) |
| `CompanyAnnuals` | `{ salary: number; bonusFix: number; bonusVariable: number; bonusPerformance: number; pvdEmp: number; pvdCo: number; pvd: number }` | [`src/features/tax/taxCalculations.ts:67-75`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/src/features/tax/taxCalculations.ts#L67-L75) |
| `TaxCoreInputs` | `{ companies: CoreCompany[]; foreignIncome?: number; spouse?: boolean; children?: number; children2?: number; parents?: number; lifeInsurance?: number; healthInsurance?: number; pensionInsurance?: number; rmf?: number; ssf?: number; thaiEsg?: number; easyEReceipt?: number; mortgageInterest?: number; donationNormal?: number; donationEdu?: number; disabledCare?: number; antenatalCare?: number; pvdManual?: number; parentHealthInsurance?: number; gpf?: number }` | Pure subset of [`src/types/portfolio.ts:36-60`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/src/types/portfolio.ts#L36-L60) |
| `ScenarioOverrides` | `{ rmfOverride?: number; pvdOverride?: number; thaiEsgOverride?: number }` | [`src/features/tax/taxCalculations.ts:262-264`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/src/features/tax/taxCalculations.ts#L262-L264) |
| `DeductionItem` | `[label: string, amount: number]` | From HTML planner [`docs/share/tax-rmf-pvd-planner.html:380`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/docs/share/tax-rmf-pvd-planner.html#L380) & mockup |
| `DeductionResult` | `{ totalAssessableIncome: number; expenses: number; allowances: number; netIncome: number; total: number; items: DeductionItem[] }` | Expanded from [`src/features/tax/taxCalculations.ts:268-336`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/src/features/tax/taxCalculations.ts#L268-L336) |
| `DeductionLimits` | Limits breakdown for SSF, RMF, PVD, Thai ESG, and total retirement pool | [`src/features/tax/taxCalculations.ts:346-373`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/src/features/tax/taxCalculations.ts#L346-L373) |
| `TaxSettlementResult` | `{ current: SettlementDetail; scenario: SettlementDetail }` where `taxStatus: 'refund' \| 'pay_more'` | [`src/features/tax/taxCalculations.ts:182-207`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/src/features/tax/taxCalculations.ts#L182-L207) |
| `RmfAdvicePlan` | `{ targetNet: number; targetBracketRate: number; needAmount: number; rmfBuy: number; esgBuy: number; taxSaved: number; monthlyPlan: { month: number; amount: number }[] }` | **NEW** (inspired by [`tax-planner-mockup.html:343-352`](file:///Users/supavit.cho/Git/Personal/Tax-Planner/docs/design/tax-planner-mockup.html#L343-L352) and [`tax-rmf-pvd-planner.html:501-510`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/docs/share/tax-rmf-pvd-planner.html#L501-L510)) |
| `TaxYearInfo` | `{ yearCE: number; yearBE: number; filingYearBE: number; monthsLeft: number }` | **NEW** (helper for dynamic year logic) |

---

### 2. Pure Functions in `tax-core`

#### Core Tax Math & Rules
- **`calculateTax(netIncome: number, rules?: TaxYearRules): number`**
  - *Origin:* [`src/features/tax/taxCalculations.ts:22-39`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/src/features/tax/taxCalculations.ts#L22-L39)
  - *Inputs:* `netIncome`, optional `rules` (defaults to active tax year).
  - *Outputs:* Total annual tax liability (THB).
- **`getMarginalTaxRate(netIncome: number, rules?: TaxYearRules): number`**
  - *Origin:* **NEW** pure function (from [`docs/share/tax-rmf-pvd-planner.html:295`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/docs/share/tax-rmf-pvd-planner.html#L295) & [`tax-planner-mockup.html:262`](file:///Users/supavit.cho/Git/Personal/Tax-Planner/docs/design/tax-planner-mockup.html#L262)).
  - *Outputs:* Decimal marginal rate (e.g., `0.20`).
- **`getEffectiveTaxRate(tax: number, income: number): number`**
  - *Origin:* Extracted from [`src/features/tax/taxCalculations.ts:423`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/src/features/tax/taxCalculations.ts#L423).
  - *Outputs:* Percentage (e.g., `12.5`).

#### Social Security & Employment Calculations
- **`calculateSocialSecurity(companies: CoreCompany[], rules?: TaxYearRules): { total: number; monthly: number[] }`**
  - *Origin:* Refactored from [`src/features/tax/taxCalculations.ts:119-123`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/src/features/tax/taxCalculations.ts#L119-L123) and [`tax-planner-mockup.html:281`](file:///Users/supavit.cho/Git/Personal/Tax-Planner/docs/design/tax-planner-mockup.html#L281).
  - *Rule enforced:* Monthly cap of 875 THB applied across all employers combined for each month (1..12), with annual cap of 10,500 THB.
- **`getAnnualSalary(c: CoreCompany): number`**
  - *Origin:* [`src/features/tax/taxCalculations.ts:57-59`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/src/features/tax/taxCalculations.ts#L57-L59).
- **`getCompanyAnnuals(c: CoreCompany): CompanyAnnuals`**
  - *Origin:* [`src/features/tax/taxCalculations.ts:77-92`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/src/features/tax/taxCalculations.ts#L77-L92).
- **`getAnnualExtraIncome(c: CoreCompany): number`**
  - *Origin:* [`src/features/tax/taxCalculations.ts:94-106`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/src/features/tax/taxCalculations.ts#L94-L106).
- **`getCompanyIncome(c: CoreCompany): number`**
  - *Origin:* [`src/features/tax/taxCalculations.ts:108-111`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/src/features/tax/taxCalculations.ts#L108-L111).
- **`estimateCompanyWithholding(c: CoreCompany, rules?: TaxYearRules): number`**
  - *Origin:* [`src/features/tax/taxCalculations.ts:167-177`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/src/features/tax/taxCalculations.ts#L167-L177).
- **`estimateEmploymentWithholding(companies: CoreCompany[], rules?: TaxYearRules): number`**
  - *Origin:* [`src/features/tax/taxCalculations.ts:179-180`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/src/features/tax/taxCalculations.ts#L179-L180).

#### Deductions, Limits & Settlements
- **`calculateDeductions(inputs: TaxCoreInputs, scenario?: ScenarioOverrides, rules?: TaxYearRules): DeductionResult`**
  - *Origin:* [`src/features/tax/taxCalculations.ts:268-336`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/src/features/tax/taxCalculations.ts#L268-L336).
- **`calculateLimits(inputs: TaxCoreInputs, scenario?: ScenarioOverrides, rules?: TaxYearRules): DeductionLimits`**
  - *Origin:* [`src/features/tax/taxCalculations.ts:346-373`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/src/features/tax/taxCalculations.ts#L346-L373).
- **`calculateTaxSettlement(inputs: TaxCoreInputs, scenario?: ScenarioOverrides, rules?: TaxYearRules): TaxSettlementResult`**
  - *Origin:* [`src/features/tax/taxCalculations.ts:182-207`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/src/features/tax/taxCalculations.ts#L182-L207).
- **`calculateTaxShieldScenario(inputs: TaxCoreInputs, scenario?: ScenarioOverrides, rules?: TaxYearRules): TaxShieldScenarioResult`**
  - *Origin:* [`src/features/tax/taxCalculations.ts:401-444`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/src/features/tax/taxCalculations.ts#L401-L444).
- **`calculateDividendCredit(amount: number, corporateTaxRate?: number): { credit: number; grossedUpIncome: number }`**
  - *Origin:* [`src/features/tax/taxCalculations.ts:338-342`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/src/features/tax/taxCalculations.ts#L338-L342).

#### Planning, Optimization & Advice
- **`calculateRmfDropAdvice(inputs: TaxCoreInputs, rules?: TaxYearRules, asOfDate?: Date): RmfAdvicePlan`**
  - *Origin:* **NEW** pure function. Analyzes the distance between `netIncome` and the next lower tax bracket boundary (`targetNet`), evaluates room in RMF and Thai ESG, and calculates monthly pace needed for remaining months.
- **`getDerivedTaxYear(asOfDate?: Date): TaxYearInfo`**
  - *Origin:* **NEW** pure helper. Derived rule: Jan–Jun = previous year, Jul–Dec = current year. Generates B.E., C.E., filing deadline year, and `monthsLeft`.
- **`buildAskAiRmfPrompt(options: AiRmfPromptOptions): string`**
  - *Origin:* Extracted from [`src/features/tax/AskAiFundSection.jsx:19-58`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/src/features/tax/AskAiFundSection.jsx#L19-L58) and [`tax-planner-mockup.html:358-363`](file:///Users/supavit.cho/Git/Personal/Tax-Planner/docs/design/tax-planner-mockup.html#L358-L363). Pure string builder accepting budget, marginal rate, tax year B.E./C.E., fund house, investment theme, and held funds.

---

## B. What Stays in the App & How It Feeds `tax-core`

```
  ┌─────────────────────────────────────────────────────────────┐
  │                 Host App State & Stores                     │
  │                                                             │
  │  1. Portfolio Store (RMF / PVD holdings & monthly history)  │
  │  2. PrivacyContext (Demo Mode toggle & mock tax data)       │
  │  3. UI_STRINGS (i18n Thai/English translation dictionary)   │
  │  4. LocalStorage persistence (portfolio-tax-storage)        │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
             Adapter / Normalizer Reads in Host App
                                 │
       ┌─────────────────────────┴────────────────────────┐
       ▼                                                  ▼
┌──────────────────────────────┐              ┌──────────────────────────────┐
│       getSmartRmf(inputs)    │              │       getSmartPvd(inputs)    │
│  Reads: rmfFunds, monthly    │              │  Reads: pvdPortfolioAmounts, │
│  history from portfolio.     │              │  pvdFunds, company ratios.   │
│  Outputs: { paid, projected }│              │  Outputs: { paidEmp, emp, co}│
└──────────────┬───────────────┘              └──────────────┬───────────────┘
               │                                             │
               └──────────────────────┬──────────────────────┘
                                      │
                                      ▼
                        Adapter: toTaxCoreInputs()
         Translates app state -> Pure TaxCoreInputs POJO
                                      │
                                      ▼
     ┌─────────────────────────────────────────────────────────────────┐
     │              Shared Package: @vit129/thai-tax-core              │
     │                                                                 │
     │  - calculateTax()                                               │
     │  - calculateDeductions()                                        │
     │  - calculateSocialSecurity() (875/mo combined cap)              │
     │  - calculateLimits()                                            │
     │  - calculateRmfDropAdvice()                                     │
     │  - calculateTaxShieldScenario()                                 │
     │  - calculateDividendCredit() (called by Dividend Credit Card)   │
     │  - buildAskAiRmfPrompt()                                        │
     └─────────────────────────────────────────────────────────────────┘
```

1. **Portfolio Reads (`getSmartRmf` & `getSmartPvd`)**:
   - [`src/features/tax/taxCalculations.ts:210-260`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/src/features/tax/taxCalculations.ts#L210-L260): These functions inspect `inputs.rmfFunds`, `inputs.pvdFunds`, and `inputs.pvdPortfolioAmounts`. They remain in the host app (`src/features/tax/portfolioTaxBridge.ts` or kept in `taxCalculations.ts`).
   - *How it feeds `tax-core`:* The host app executes `getSmartRmf` and `getSmartPvd` to extract actual contributions paid, projects future months, and maps them directly to `rmf` and `pvdManual` in `TaxCoreInputs`.
2. **Demo Mode (`usePrivacy`)**:
   - [`src/pages/TaxPage.jsx:25-26`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/src/pages/TaxPage.jsx#L25-L26): The app selects between `demoState.taxInputs` and `realInputs`.
   - *How it feeds `tax-core`:* Pure `tax-core` does not know whether data is demo or real; it simply receives whichever `TaxCoreInputs` object the page provides.
3. **`UI_STRINGS` & i18n**:
   - [`src/config/translations/07-tax.js`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/src/config/translations/07-tax.js): Stays in the app. `tax-core` returns language-neutral numeric values, rate ratios, and enum keys (`refund` / `pay_more`). The UI formats currency (`฿10,000`), percentages (`20%`), and translates labels.
4. **Dividend Tax Credit Card**:
   - [`src/features/tax/TaxVisualizer.jsx:78-116`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/src/features/tax/TaxVisualizer.jsx#L78-L116): Interactive input controls for dividend amount and corporate tax rate stay as React UI state in the card component. When changed, it invokes `calculateDividendCredit(amount, rate)` from `tax-core`.
5. **Persistence & Cloud Sync**:
   - [`src/hooks/useTaxStore.js`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/src/hooks/useTaxStore.js) and [`src/hooks/portfolioSyncPayloads.js`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/src/hooks/portfolioSyncPayloads.js): Zustand persistence, `localStorage`, and event dispatch remain entirely inside the app.

---

## C. Behaviour Differences Found & Clarification Questions

During inspection of `taxCalculations.ts`, `tax-rmf-pvd-planner.html`, and `tax-planner-mockup.html`, the following differences were identified. **These are questions for user decision — no assumptions have been made:**

### Difference 1: Social Security Monthly Calculation
- **Evidence:**
  - `taxCalculations.ts:120-123`: `calculateSocialSecurity` caps each company independently at `Math.min(sal * 0.05, 875)` and sums them, only capping at 10,500 annually at the deductions stage ([`L311`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/src/features/tax/taxCalculations.ts#L311)).
  - `tax-rmf-pvd-planner.html:366,389`: Also caps each company at 875/mo independently.
  - `tax-planner-mockup.html:281`: Sums all employers' contributions month-by-month first: `for (i = 0..11) { m = sum(cs[x].ssM[i]); ss += Math.min(875, m); }`.
- **Status:** **Resolved by your prompt requirement:** *"social security 875 THB/month cap (10,500/yr) across all employers combined."* `tax-core` will implement the mockup's combined monthly cap.

### Difference 2: Withholding Tax Estimation (`whEst`)
- **Evidence:**
  - `taxCalculations.ts:167-177`: Annualizes partial-year employment using `k = 12 / monthsWorked`, calculates full-year tax, and divides back by `k`: `Math.ceil(calculateTax(net) / k)`.
  - `tax-rmf-pvd-planner.html:370-371`: Uses the same annualized method: `k = 12 / mo; annW = inc * k; whEst = Math.ceil(tax(...) / k)`.
  - `tax-planner-mockup.html:274`: Does **not** annualize. Calculates tax directly on total income earned so far: `taxOf(income - expenses - 60000 - ss - pvd)`.
- **Question for user:**
  > Should `whEst` use the standard payroll annualization method (`12 / monthsWorked`), or the simplified non-annualized direct tax formula from the mockup?

### Difference 3: Bonus Base Salary for Mid-Year Departures
- **Evidence:**
  - `taxCalculations.ts:79-80`: `const lastSalary = salaryArr[11] || c.monthlySalary || 0;` (uses December / month 12 salary).
  - `tax-rmf-pvd-planner.html:364`: `bfmAmt = sal * num(c.bfm)` (uses static base salary).
  - `tax-planner-mockup.html:267`: `function lastSal(c)` scans backward from month 12 to 1 and selects the salary of the *last month the employee was actually active* in that company (`on(c, i)`).
- **Question for user:**
  > When an employee leaves a company mid-year (e.g., worked Jan–Jun), should the fixed bonus be calculated using the salary of their last active month in that company (mockup behavior) or December's carry-forward salary (current `taxCalculations.ts`)?

### Difference 4: Target Net Income for "Drop One Bracket" (`+1` vs exact boundary)
- **Evidence:**
  - `taxCalculations.ts:385`: `neededOverall = netIncome - targetNet` (drops net income exactly to the bracket max boundary, e.g., 500,000 for 10%).
  - `tax-rmf-pvd-planner.html:502`: `need = a.net - pb` (exact boundary).
  - `tax-planner-mockup.html:348`: `var need = Math.max(0, a.net - floorOf(a.net)) + 1;` (adds 1 THB to ensure the net income drops strictly below the bracket threshold into the lower tier).
- **Question for user:**
  > In the RMF bracket drop recommendation, should the needed purchase amount target the exact threshold (`netIncome - bracketMax`), or include `+1 THB` to guarantee landing strictly in the lower rate tier?

### Difference 5: Pension Insurance Overflow to Life Insurance (`penToLife`)
- **Evidence:**
  - `taxCalculations.ts:312,321`: Pension insurance is evaluated solely inside the retirement group cap (≤15% income, ≤200,000 THB, combined ≤500,000 THB).
  - `tax-rmf-pvd-planner.html:390-392`: Unused life insurance room (up to 100,000 THB) can be filled by pension insurance first, with only the remainder counting towards the 200,000 / 500,000 retirement cap (per Revenue Department rules).
  - `tax-planner-mockup.html:284`: Pension goes directly to the retirement group cap without life insurance overflow.
- **Question for user:**
  > Should `tax-core` support the Revenue Department rule allowing pension insurance to fill unused general life insurance deduction (up to 100,000 THB) before counting against the 200,000 THB retirement limit?

### Difference 6: Additional Deduction Categories (GPF, Parent Health, 2nd Child)
- **Evidence:**
  - `taxCalculations.ts`: Supports child (flat 30k), parents (30k), disabled care (60k), antenatal care (60k), SSF, RMF, PVD, Thai ESG, easy E-Receipt, mortgage interest, donations.
  - `tax-rmf-pvd-planner.html`: Also supports 2nd child born ≥2561 (60k), parent health insurance (15k), spouse life insurance (10k), GPF/กอช. (30k), political party donations (10k).
  - `tax-planner-mockup.html`: Supports GPF/กอช. (`nsf` 30k) and parent health insurance (`parentHealth` 15k).
- **Question for user:**
  > Should `tax-core` include these additional deduction items (`gpf`/กอช., `parentHealth`, 2nd child) in its schema, or keep only the fields currently tracked in `My-Investment-Port`?

---

## D. UI Plan for TaxPage Matching Mockup

### 1. Structure Comparison & Transformation

```
  Mockup Structure                                   App Implementation (TaxPage)
  ─────────────────────────────────────────────      ──────────────────────────────────────────────
  Header: วางแผนภาษีปี 2569 (2026)                -> PageHeader with dynamic BE/CE derived year
  Disclaimer Banner                               -> Callout card using COLORS.BORDER_SUBTLE / TEXT_MUTED
  Banner: นี่คือตัวอย่าง / เริ่มกรอกของฉัน         -> Integrated with App Demo Mode banner
  Sticky summary bar (mobile)                     -> Mobile bottom/top sticky bar
  2-Column Layout (Form / Results):               -> CSS Grid: Left = Form, Right = Sticky Results

  [LEFT COLUMN: FORM]
  Step 1: Money & Bonus                           -> TaxCompanyIncomeCard.jsx
    - Company tabs (Company 1, 2)                    - Company pill tabs
    - Start / End month selects                      - Start & end month dropdowns
    - 12-Month grid (with raise/edit chips)          - TaxMonthGrid.jsx
    - Month detail panel + raise scope radios        - TaxMonthDetailDrawer.jsx (forward vs 1 month)
    - Bonus formula & PVD %                          - Formula visualizer
    - Withholding input with auto estimate badge     - Real vs auto badge
  Step 2: Family Deductions                       -> TaxFamilyCard.jsx (Self, Spouse, Kids, Parents)
  Step 3: Insurance & Funds                       -> TaxInsuranceCard.jsx (SS auto, PVD auto, Life, Health)
  Step 4: Extra Deductions                        -> TaxExtrasCard.jsx (toggle chips + dynamic inputs)

  [RIGHT COLUMN: STICKY RESULTS]
  Hero Card (Refund / Pay more)                   -> TaxHeroSummaryCard.jsx (COLORS.MINT / COLORS.DANGER)
  4-Metric Tiles (Income, Ded, Net, Tax)          -> 4-grid tile cards using COLORS.SURFACE
  Tax Ladder (0% - 35%)                           -> TaxLadderBar.jsx (current bracket highlighted)
  "ควรซื้อ RMF เท่าไร" Advice Card                 -> TaxRmfAdviceCard.jsx (drop bracket & full room)
  Ask-AI Card                                     -> AskAiFundSection.jsx (updated to pure helper)
  Retirement Pool Bar (500k)                      -> TaxPoolBar.jsx (RMF, PVD, Pension, NSF segments)
  Simulator (Dual Range Sliders RMF & Thai ESG)   -> TaxSimulator.jsx (refactored for dual sliders)
  Per-Company Breakdown Table                     -> TaxCompanyTable.jsx
  Waterfall & Checklist Collapsibles              -> Details / Accordion components
  Dividend Credit Card                            -> Preserved from existing TaxVisualizer.jsx
```

### 2. Styling & Theme Tokens
- Retain the app's dark theme palette:
  - Surface: `COLORS.BACKGROUND`, `COLORS.SURFACE`, `COLORS.CARD_BG`, `COLORS.BORDER_SUBTLE`.
  - Accents: `COLORS.MINT` (Refund / savings), `COLORS.DANGER` (Pay more), `COLORS.BLUE` (Tax strategy / PVD), `COLORS.GOLD` (Retirement pool).
  - Typography: `TYPOGRAPHY.TEXT_*` constants, with `font-mono` (`tabular-nums`) for currency values.

### 3. Files Touched & Created

| Action | File Path | Responsibility |
|---|---|---|
| **Add** | `packages/tax-core/` | Shared pure-TypeScript package. |
| **Modify** | `src/features/tax/taxCalculations.ts` | Re-export functions from `packages/tax-core` while retaining app-specific bridges (`getSmartRmf`, `getSmartPvd`). |
| **Modify** | `src/pages/TaxPage.jsx` | Full page overhaul to match the mockup 2-column layout and dynamic B.E./C.E. year. |
| **Add** | `src/features/tax/TaxMonthGrid.jsx` | 12-month calendar buttons with carry-forward value display and raise markers. |
| **Add** | `src/features/tax/TaxMonthDetailDrawer.jsx` | Drawer/panel for month edit with radio buttons: *"This and future months"* (`fwd`) vs *"This month only"* (`one`). |
| **Add** | `src/features/tax/TaxHeroSummaryCard.jsx` | Sticky / hero refund or pay more result card. |
| **Add** | `src/features/tax/TaxRmfAdviceCard.jsx` | "ควรซื้อ RMF เท่าไร" advice component. |
| **Add** | `src/features/tax/TaxLadderBar.jsx` | Visual tax bracket step indicator (0% → 35%). |
| **Modify** | `src/features/tax/TaxSimulator.jsx` | Upgrade to dual sliders (RMF + Thai ESG) and comparison metrics. |
| **Modify** | `src/features/tax/AskAiFundSection.jsx` | Use pure prompt builder with dynamic B.E./C.E. year. |
| **Modify** | `src/features/tax/CompanyIncomeSection.jsx` | Align with company tabs and month grid. |
| **Preserve**| `src/features/tax/TaxVisualizer.jsx` | Extract/retain Dividend Tax Credit calculator and reference table. |

---

## E. Test Plan

### 1. Existing Tests to Keep 100% Green
- [`tests/vitest/tax-v3-normalization.test.js`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/tests/vitest/tax-v3-normalization.test.js): Verifies normalization of V1/V2 to V3 sparse months map and carry-forward calculation.
- [`tests/vitest/features/tax/taxCalculations.test.js`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/tests/vitest/features/tax/taxCalculations.test.js): Property-based fast-check tests (P1–P4), `getAnnualExtraIncome`, withholding estimates, tax shield scenario.
- [`tests/vitest/features/tax/AskAiFundSection.test.js`](file:///Users/supavit.cho/Git/Personal/My-Investment-Port/tests/vitest/features/tax/AskAiFundSection.test.js): Default fund houses, prompt generation strings.
- All 41 existing test suites across the repository (`npm test`).

### 2. New Test Suite in `packages/tax-core/tests/`
1. **Bracket & Tax Computation Tests**:
   - Boundary tests for all 8 tax brackets (0, 150k, 300k, 500k, 750k, 1M, 2M, 5M).
   - Invariant: `calculateTax(net)` strictly monotonically increases with `net`.
2. **Social Security Combined Multi-Employer Tests**:
   - Single company with salary > 17,500 THB → caps at 875/mo, 10,500/yr.
   - Two concurrent companies in month `m` (e.g., Company A = 10,000 THB, Company B = 10,000 THB) → combined 5% is 1,000 THB, capped strictly at 875 THB for that month.
   - Job change mid-year (Months 1–3 at Company A, Months 4–12 at Company B) → total annual SS capped at 10,500 THB.
3. **Deductions & 500k Retirement Cap Tests**:
   - RMF (≤30% income, ≤500k) + PVD (≤15% income, ≤500k) + Pension (≤15% income, ≤200k) combined ≤ 500,000 THB.
   - Thai ESG evaluated separately (≤30% income, ≤300,000 THB).
   - Donation cap: evaluated strictly after expenses and allowances (≤10% of net before donations).
4. **Settlement & Withholding Tests**:
   - `isRealWithholding = true` when all companies specify 50 Tawi withholding.
   - `taxStatus = 'refund'` when withholding > tax; `'pay_more'` when withholding < tax.
5. **RMF Drop Bracket Advice Tests**:
   - Evaluates correct amount to reach lower bracket boundary.
   - Correctly splits between RMF and Thai ESG if RMF room alone is insufficient.
6. **Date Derivation & Dynamic Tax Year Tests**:
   - Mock date in March 2026 → Tax year B.E. 2568 (2025).
   - Mock date in August 2026 → Tax year B.E. 2569 (2026).
   - Boundary test at June 30 vs July 1.

---

## F. Step-by-Step Implementation Plan (Small PR-Sized Steps)

```
PR 1: packages/tax-core Scaffolding & Core Port
  │
  ├─ Create packages/tax-core/ with TypeScript build configuration & package.json
  ├─ Implement pure rules/2569.ts, types, calculateTax, calculateSocialSecurity (combined 875 cap)
  ├─ Add unit & fast-check tests in packages/tax-core/tests/
  └─ Verify `npm test` remains green
  │
PR 2: taxCalculations Bridge & Full Library Parity
  │
  ├─ Port calculateDeductions, calculateLimits, calculateSettlement, calculateRmfDropAdvice
  ├─ Add dynamic tax year helper (Jan-Jun previous, Jul-Dec current)
  ├─ Update src/features/tax/taxCalculations.ts to re-export from @vit129/thai-tax-core
  ├─ Keep getSmartRmf and getSmartPvd in host app bridge
  └─ Verify existing 41 test suites pass with zero regressions
  │
PR 3: UI Atoms & Month Grid Components
  │
  ├─ Create TaxMonthGrid.jsx (12-month calendar with carry-forward & raise badges)
  ├─ Create TaxMonthDetailDrawer.jsx (forward vs single-month salary raise radios)
  ├─ Create TaxLadderBar.jsx and TaxHeroSummaryCard.jsx
  └─ Unit test new components in isolation
  │
PR 4: Redesign TaxPage & Results Column
  │
  ├─ Assemble Left Form (Company tabs, Month grid, Family, Insurance, Extras)
  ├─ Assemble Right Column (Hero, Tiles, Ladder, Advice, Dual Simulator, Ask-AI)
  ├─ Implement dynamic B.E. (C.E.) year header
  ├─ Preserve Dividend Tax Credit Card and Demo Mode integration
  └─ Verify responsive layout (desktop 2-column, mobile stacked + sticky bar)
  │
PR 5: Integration, End-to-End Verification & Documentation
  │
  ├─ Run full Vitest suite (`npm test`) & linter (`npm run lint`)
  ├─ Verify against approved mockup in both light/dark modes
  └─ Update documentation and graphify index
```

---

*This report is complete and strictly read-only. Awaiting your feedback and decisions on the questions in Section C before proceeding to any implementation.*
