# Graph Report - Tax-Planner  (2026-10-24)

## Corpus Check
- 49 files · ~22,249 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 394 nodes · 629 edges · 21 communities (13 shown, 8 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.76)
- Token cost: 93,390 input · 7,626 output

## Graph Freshness
- Built from commit: `99e1c0a3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## God Nodes (most connected - your core abstractions)
1. `STRINGS` - 17 edges
2. `render()` - 12 edges
3. `getCompanyBreakdown()` - 11 edges
4. `getCompanyMonthlySalaries()` - 10 edges
5. `SAMPLE_RMF_FUNDS` - 9 edges
6. `calculateTaxPlan()` - 9 edges
7. `renderMonths()` - 8 edges
8. `Plan: Extract tax-core & Redesign TaxPage` - 8 edges
9. `num()` - 7 edges
10. `coCalc()` - 7 edges

## Cross-Cutting Nodes (span the most distinct areas of the codebase)
A high-degree node isn't always architecturally central - a widely-used
utility/config file can rack up more edges than a real coupler while only
ever touching one area. This ranks by how many DIFFERENT communities a
node's neighbors span, not by raw edge count.
1. `STRINGS` - bridges 2 areas (17 edges)
2. `render()` - bridges 2 areas (12 edges)
3. `renderMonths()` - bridges 2 areas (8 edges)
4. `on()` - bridges 2 areas (6 edges)
5. `CO()` - bridges 2 areas (5 edges)
6. `switchCo()` - bridges 2 areas (4 edges)
7. `getCompanyBreakdown()` - bridges 1 areas (11 edges)
8. `SAMPLE_RMF_FUNDS` - bridges 1 areas (9 edges)
9. `calculateTaxPlan()` - bridges 1 areas (9 edges)
10. `num()` - bridges 1 areas (7 edges)

## Surprising Connections (you probably didn't know these)
- `Tax-Planner Guidelines (CLAUDE.md)` --semantically_similar_to--> `Tax-Planner Agent Instructions`  [INFERRED] [semantically similar]
  CLAUDE.md → AGENTS.md
- `Automated Architecture Guard (tests/architectureGuard.test.js)` --references--> `Color Tokens (light/dark)`  [INFERRED]
  ARCHITECTURE.md → DESIGN.md
- `Social Security cap (750/mo, 9,000/yr per PRODUCTS.md)` --conceptually_related_to--> `calculateSocialSecurity (combined 875/mo cap)`  [AMBIGUOUS]
  PRODUCTS.md → docs/design/mip-tax-core-plan.md
- `Tax-Planner Agent Instructions` --references--> `Automated Architecture Guard (tests/architectureGuard.test.js)`  [EXTRACTED]
  AGENTS.md → ARCHITECTURE.md
- `Automated Architecture Guard (tests/architectureGuard.test.js)` --references--> `Typography Tokens`  [INFERRED]
  ARCHITECTURE.md → DESIGN.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Zero hardcoded literals contract (strings, colors, typography) enforced by guard** — architecture_architecture_guard, architecture_strings_dictionary, design_color_tokens, design_typography_tokens [EXTRACTED 0.90]
- **@vit129/thai-tax-core public calculation API** — docs_design_mip_tax_core_plan_calculate_tax, docs_design_mip_tax_core_plan_calculate_social_security, docs_design_mip_tax_core_plan_calculate_deductions, docs_design_mip_tax_core_plan_calculate_rmf_drop_advice, docs_design_mip_tax_core_plan_build_ask_ai_rmf_prompt [EXTRACTED 0.90]

## Communities (21 total, 8 thin omitted)

### Community 0 - "tax-planner-mockup.html"
Cohesion: 0.02
Nodes (91): #addCo, #advice, #ai, #aiBudget, #aiClaude, #aiCopy, #aiFeedback, #aiFocus (+83 more)

### Community 1 - "index.css"
Cohesion: 0.02
Nodes (87): :root,
:root[data-theme="light"], .num, .banner, .btn, .btn.pri, .btn:focus-visible,
input:focus-visible,
select:focus-visible, .grid, .card (+79 more)

### Community 2 - "App.jsx"
Cohesion: 0.09
Nodes (36): COLORS, STRINGS, BRACKET_RATES_PCT, DEDUCTION_RULES, EXTRA_DEDUCTION_OPTIONS, SAMPLE_PVD_FUNDS, TAX_BRACKETS, TYPOGRAPHY (+28 more)

### Community 3 - "Plan: Extract tax-core & Redesign TaxPage"
Cohesion: 0.08
Nodes (32): Tax-Planner Agent Instructions, Automated Architecture Guard (tests/architectureGuard.test.js), Dependency Direction ui -> logic -> config, Centralized Strings Dictionary (src/config/strings.js), Tax-Planner Architecture, @vit129/tax-ui package, @vit129/thai-tax-core package, Tax-Planner Guidelines (CLAUDE.md) (+24 more)

### Community 4 - "companyLogic.test.js"
Cohesion: 0.20
Nodes (24): estimateCompanyWithholding(), getCompanyAnnualSalary(), getCompanyBaseSalaryAtMonth(), getCompanyBreakdown(), getCompanyExtraIncome(), getCompanyFixedBonus(), getCompanyLastSalary(), getCompanyMonthlySalaries() (+16 more)

### Community 5 - "scripts"
Cohesion: 0.09
Nodes (21): dependencies, react, react-dom, @vit129/tax-ui, @vit129/thai-tax-core, devDependencies, vite, @vitejs/plugin-react (+13 more)

### Community 6 - "render"
Cohesion: 0.22
Nodes (18): all(), baseAt(), coCalc(), compute(), f(), floorOf(), generateAiPrompt(), k() (+10 more)

### Community 7 - "architectureGuard.test.js"
Cohesion: 0.18
Nodes (8): __dirname, has zero hardcoded fontSize or fontFamily outside src/config/typography.js, has zero hardcoded #hex colors outside src/config/colors.js, has zero hardcoded Thai words/characters outside src/config/strings.js, has zero missing imports for TYPOGRAPHY, COLORS, and STRINGS when referenced, has zero missing STRINGS keys across all source files, SRC_DIR, Tax-Planner Architecture Guard (Logic / UI / Translator / Color / Typography / Shared UI)

### Community 8 - "start.js"
Cohesion: 0.33
Nodes (8): __dirname, __filename, main(), promptMessage(), REPO_ROOT, runCommand(), selectWithArrows(), selectWithReadline()

### Community 9 - "SAMPLE_RMF_FUNDS"
Cohesion: 0.29
Nodes (7): SAMPLE_RMF_FUNDS, SCBRMS&P500, BGOLDRMF, KKP PGE RMF-H, MEGAWORLD30RMF, B-INNOTECHRMF, UGISRMF

### Community 10 - "CO"
Cohesion: 1.00
Nodes (3): CO(), loadForm(), switchCo()

### Community 12 - "@media (min-width: 900px)"
Cohesion: 0.67
Nodes (3): @media (min-width: 900px), .grid, .results

## Ambiguous Edges - Review These
- `Social Security cap (750/mo, 9,000/yr per PRODUCTS.md)` → `calculateSocialSecurity (combined 875/mo cap)`  [AMBIGUOUS]
  PRODUCTS.md · relation: conceptually_related_to

## Knowledge Gaps
- **248 isolated node(s):** `#sampleBar`, `#startOwn`, `#stickyBar`, `#stickyVal`, `#coTabs` (+243 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.
- **4 possibly unreachable function(s):** `__dirname`, `__dirname`, `__dirname`, `__filename`
  Not reached from any recognized entry point - could be dead code, or dynamically dispatched/decorator-registered.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Social Security cap (750/mo, 9,000/yr per PRODUCTS.md)` and `calculateSocialSecurity (combined 875/mo cap)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `SAMPLE_RMF_FUNDS` connect `SAMPLE_RMF_FUNDS` to `App.jsx`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `STRINGS` connect `App.jsx` to `companyLogic.test.js`, `architectureGuard.test.js`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `calculateTaxPlan()` connect `App.jsx` to `companyLogic.test.js`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `#sampleBar`, `#startOwn`, `#stickyBar` to the rest of the system?**
  _249 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `tax-planner-mockup.html` be split into smaller, more focused modules?**
  _Cohesion score 0.02127659574468085 - nodes in this community are weakly interconnected._
- **Should `index.css` be split into smaller, more focused modules?**
  _Cohesion score 0.022727272727272728 - nodes in this community are weakly interconnected._