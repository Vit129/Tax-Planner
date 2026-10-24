# 🇹🇭 Tax-Planner (v1.1.0)

> **Live Web Application:** [https://vit129.github.io/Tax-Planner/](https://vit129.github.io/Tax-Planner/)  
> **Thai Personal Income Tax (ภ.ง.ด. 90/91) & Investment Deduction Planner for 2569 (2026)**  
> Fast, responsive, privacy-first, and powered by shared `@vit129` micro-packages.

---

## 📖 Table of Contents
- [✨ Key Features](#-key-features)
- [🏗️ Decoupled Architecture & Shared Packages](#️-decoupled-architecture--shared-packages)
- [🎨 Design System (Warm Cream Default)](#-design-system-warm-cream-default)
- [🚀 Quick Start & NPM Scripts](#-quick-start--npm-scripts)
- [🛡️ Automated Architecture Guard](#️-automated-architecture-guard)
- [📚 Documentation Links](#-documentation-links)

---

## ✨ Key Features

1. **Multi-Employer Timeline & Mid-Year Raises:**
   - Manage up to 5 employment periods with custom start/end months (Jan–Dec).
   - Add salary adjustment events (e.g. raise from May onward) with automated PVD and Social Security calculation.
   - Click any month on the 12-month calendar grid to customize bonuses, overtime, or variable income.
2. **2569 Thai Tax Math & Deductions Matrix:**
   - 100% compliant with Thai Revenue Department progressive brackets (0% to 35%).
   - Combined **฿500,000 Retirement Pool** (RMF + PVD + Pension Life + GPF/NSF) with real-time sub-cap meters.
   - Separate **฿300,000 Thai ESG** allowance.
   - Automatic pension insurance overflow into unused general life insurance room (up to ฿100,000).
3. **Smart RMF Advice & DCA Target Scheduler:**
   - Recommends the exact RMF purchase amount needed to drop to a lower marginal tax bracket.
   - Generates month-by-month dollar-cost averaging (DCA) purchase targets for the months remaining before December 31.
4. **What-If Simulator with Instant ROI:**
   - Dual control via direct currency input or range slider.
   - One-click strategy presets: `Drop 1 Bracket`, `Full RMF`, and `Full Thai ESG`.
5. **AI RMF Recommendation Prompt Generator:**
   - Generates contextualized Thai AI prompts incorporating tax bracket, remaining budget, AMC preference, and themes.
   - 1-click deep links for ChatGPT, Claude, and Gemini with automated clipboard copy.
6. **100% Client-Side Privacy:**
   - Zero telemetry, zero server-side storage. All calculations execute locally in the browser; state is saved solely in `localStorage`.

---

## 🏗️ Decoupled Architecture & Shared Packages

Tax-Planner is built on clean decoupled layers and utilizes `@vit129` shared packages:
- **`@vit129/thai-tax-core`**: Headless domain logic, progressive tax formulas, deduction caps, and AI prompt builder.
- **`@vit129/tax-ui`**: Atomic UI primitives (`BreakdownTile`, `Card`, `ChipButton`, `MoneyInput`, `ProgressBar`, `Stepper`) and Warm Cream design tokens.
- **`src/config/strings.js`**: 100% of human-readable Thai strings externalized; components contain **zero hardcoded text**.
- **`src/config/colors.js` & `src/config/typography.js`**: Semantic tokens; components contain **zero hardcoded hex colors or raw font sizes**.

---

## 🎨 Design System (Warm Cream Default)

- **Default Theme:** Bright Warm Cream (`--bg: #FBF8F1`, `--surface: #FFFFFF`, `--accent: #146C36`, `--gold: #8C5300`).
- **Dark Mode:** Easily toggled via the header switch, respecting high-contrast accessible tokens (`[data-theme="dark"]`).
- **Responsive Layout:** 2-column desktop grid collapsing into an adaptive single column with a sticky summary bar on mobile devices.

---

## 🚀 Quick Start & NPM Scripts

### Prerequisites
- Node.js `>= 18.0.0`
- npm `>= 9.0.0`

### Installation
```bash
# Install dependencies
npm install

# Start local development server (port 5180)
npm run dev

# Run Vitest test suite & architecture guard
npm test

# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🛡️ Automated Architecture Guard

Every test run executes [`tests/architectureGuard.test.js`](file:///Users/supavit.cho/Git/Personal/Tax-Planner/tests/architectureGuard.test.js), automatically verifying four strict structural invariants:
- `✓` **Zero missing `STRINGS` keys** across all source files.
- `✓` **Zero hardcoded Thai characters** outside `src/config/strings.js`.
- `✓` **Zero hardcoded `#hex` colors** outside `src/config/colors.js`.
- `✓` **Zero hardcoded `fontSize` / `fontFamily`** outside `src/config/typography.js`.

---

## 📚 Documentation Links

- [PRODUCTS.md](file:///Users/supavit.cho/Git/Personal/Tax-Planner/PRODUCTS.md) — Product vision, personas, and feature specifications.
- [ARCHITECTURE.md](file:///Users/supavit.cho/Git/Personal/Tax-Planner/ARCHITECTURE.md) — Layered architectural design and dependency rules.
- [DESIGN.md](file:///Users/supavit.cho/Git/Personal/Tax-Planner/DESIGN.md) — Warm Cream design system, color tokens, and typography scale.
- [CONTEXT.md](file:///Users/supavit.cho/Git/Personal/Tax-Planner/CONTEXT.md) — Domain vocabulary and Thai tax rules reference.
