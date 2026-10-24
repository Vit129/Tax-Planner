# 🎨 Design System: Tax-Planner (Warm Cream & Dark)

## 1. Design Philosophy

Tax-Planner's design system is built upon **clarity, warmth, and cognitive calm**:
- **Warm Cream default palette:** Avoids the clinical harshness of pure `#FFFFFF` white screens by using warm ivory (`#FBF8F1`) and soft stone backgrounds, reducing eye fatigue during intensive financial calculations.
- **Scannable Information Hierarchy:** Large numerical values in monospace fonts, paired with clear status badges and color-coded progress bars.
- **Zero Raw Literals Contract:** All visual tokens must resolve through semantic CSS variables and `@vit129/tax-ui` design tokens. No hardcoded `#hex` values or arbitrary font sizes exist in UI components.

---

## 2. Color Tokens

### Theme Light (Bright Cream — Default)
```css
:root {
  --bg: #FBF8F1;          /* Canvas background */
  --surface: #FFFFFF;     /* Elevated cards and containers */
  --sunk: #F6F1E8;        /* Recessed wells, inputs, code blocks */
  --fg: #2B2520;          /* High contrast primary text */
  --mut: #635B52;         /* Secondary muted text */
  --line: #E5DDD0;        /* Subtle divider borders */
  --accent: #146C36;      /* Emerald primary actions & tax refunds */
  --accent-soft: #E6F3EB; /* Soft green badge & pill background */
  --gold: #8C5300;        /* Warm gold warnings & tax bracket highlights */
  --gold-soft: #FBF0DC;   /* Soft gold chip background */
  --bad: #A8221B;         /* Danger / Tax payable / Deficit indicators */
  --bad-soft: #FCEBE9;    /* Danger badge background */
  --blue: #1A568C;        /* Information links, presets, and AI buttons */
  --blue-soft: #E9F1F7;   /* Blue chip background */
}
```

### Theme Dark (Accessible Dark Mode)
```css
[data-theme="dark"] {
  --bg: #1A1714;
  --surface: #24201C;
  --sunk: #2D2823;
  --fg: #EFE8DE;
  --mut: #AFA597;
  --line: #3D3630;
  --accent: #6CC58E;
  --accent-soft: #1F3A29;
  --gold: #E3B260;
  --gold-soft: #3A2F1C;
  --bad: #F08A80;
  --bad-soft: #3F2320;
  --blue: #86B6E6;
  --blue-soft: #1E2E40;
}
```

### Brand Accents (External AI Providers)
- **ChatGPT:** `#10A37F`
- **Claude:** `#D97757`
- **Gemini:** `#3186FF`
- **AI Copy Success:** `#00BC7D` (with high-contrast `#000000` text)

---

## 3. Typography Hierarchy

Defined in `@vit129/tax-ui/tokens.js` and imported via `src/config/typography.js`:

| Token | Size | Weight | Primary Purpose |
|---|---|---|---|
| `TYPOGRAPHY.SIZE_HERO` | `2.1rem` | 800 | Hero summary refund/payable values |
| `TYPOGRAPHY.SIZE_SIM_MONEY` | `1.6rem` | 800 | What-if simulation interactive amount display |
| `TYPOGRAPHY.SIZE_H1` | `1.5rem` | 700 | Main application page titles |
| `TYPOGRAPHY.SIZE_POOL_MAIN` | `1.35rem` | 700 | Retirement pool remaining allowance header |
| `TYPOGRAPHY.SIZE_H2` | `1.1rem` | 700 | Step card headers (Step 1..4) |
| `TYPOGRAPHY.SIZE_TILE_NUM` | `1.05rem` | 700 | Metric tile numbers (Deductions, Net income) |
| `TYPOGRAPHY.SIZE_BASE` | `1.00rem` | 400 / 600 | Standard body text, descriptions, buttons |
| `TYPOGRAPHY.SIZE_LABEL` | `0.90rem` | 500 / 600 | Form input labels, table column headers |
| `TYPOGRAPHY.SIZE_SMALL` | `0.85rem` | 400 | Sub-details, helper hints, footnotes |
| `TYPOGRAPHY.SIZE_MICRO` | `0.80rem` | 500 / 700 | Small badge labels, sub-cap markers, status pills |
| `TYPOGRAPHY.SIZE_BADGE` | `0.75rem` | 700 | Counter badges, notification counts |

### Font Families
- **Body & Display:** `var(--body)` (`system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`)
- **Numerical & Code:** `var(--mono)` (`ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace`)

---

## 4. UI Primitives & Layout Grid

### Responsive 2-Column Desktop Grid
- **Left Column (Inputs & Steps):**
  - Header & Global Controls
  - Step 1: Salary, Employer Tabs, 12-Month Grid, Raises & Bonus
  - Step 2: 50 Tawi Withholding Tax
  - Step 3: Deductions (Family, Health, Social, Extras)
  - Step 4: Funds Already Purchased (RMF & Thai ESG)
- **Right Column (Live Analytics & Planning):**
  - Card 1: Hero Summary & Tax Bracket Ladder
  - Card 2: Smart RMF Advice & Monthly DCA Scheduler
  - Card 3: Retirement Pool (฿500k) Sub-Cap Meter
  - Card 4: Per-Company Income & Withholding Table
  - Card 5: What-If Simulator & Instant Savings ROI
  - Card 6: Ask AI RMF Prompt Generator
  - Card 7: Step-by-Step Waterfall Calculation & Checklist

### Mobile Adaptive Layout
- Stacks into a single fluid column on viewports `< 980px`.
- Renders a **sticky summary bar** at the top or bottom of the mobile viewport with current refund/payable status and quick jump navigation.

---

## 5. Micro-Interactions & Accessibility
- **Target Sizes:** Touch targets are at least `44px` high for primary buttons, tabs, and monetary input containers.
- **Focus Indicators:** High-contrast `2px` focus rings with keyboard accessibility (`Tab`, `Space`, `Enter`).
- **Interactive Feedback:** Ripple and state transitions restricted to `0.15s ease` to maintain immediate tactile responsiveness.
- **Contrast Ratios:** All text elements meet WCAG 2.1 AA standards (minimum 4.5:1 for normal text, 3:1 for large text).
