# Graph Report - Tax-Planner  (2026-10-28)

## Corpus Check
- 55 files · ~25,487 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 445 nodes · 676 edges · 28 communities (18 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.72)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a6bf34cc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## God Nodes (most connected - your core abstractions)
1. `STRINGS` - 17 edges
2. `SCENARIOS` - 16 edges
3. `TaxPlannerPage` - 16 edges
4. `render()` - 12 edges
5. `getCompanyBreakdown()` - 11 edges
6. `getCompanyMonthlySalaries()` - 10 edges
7. `calculateTaxPlan()` - 10 edges
8. `SAMPLE_RMF_FUNDS` - 9 edges
9. `renderMonths()` - 8 edges
10. `getMarginalTaxRate()` - 8 edges

## Cross-Cutting Nodes (span the most distinct areas of the codebase)
A high-degree node isn't always architecturally central - a widely-used
utility/config file can rack up more edges than a real coupler while only
ever touching one area. This ranks by how many DIFFERENT communities a
node's neighbors span, not by raw edge count.
1. `STRINGS` - bridges 2 areas (17 edges)
2. `render()` - bridges 2 areas (12 edges)
3. `calculateTaxPlan()` - bridges 2 areas (10 edges)
4. `renderMonths()` - bridges 2 areas (8 edges)
5. `calculateProgressiveTax()` - bridges 2 areas (7 edges)
6. `on()` - bridges 2 areas (6 edges)
7. `DEDUCTION_RULES` - bridges 2 areas (6 edges)
8. `CO()` - bridges 2 areas (5 edges)
9. `switchCo()` - bridges 2 areas (4 edges)
10. `SCENARIOS` - bridges 1 areas (16 edges)

## Surprising Connections (you probably didn't know these)
- `Tax-Planner Guidelines (CLAUDE.md)` --semantically_similar_to--> `Tax-Planner Agent Instructions`  [INFERRED] [semantically similar]
  CLAUDE.md → AGENTS.md
- `Automated Architecture Guard (tests/architectureGuard.test.js)` --references--> `Color Tokens (light/dark)`  [INFERRED]
  ARCHITECTURE.md → DESIGN.md
- `Tax-Planner Agent Instructions` --references--> `Automated Architecture Guard (tests/architectureGuard.test.js)`  [EXTRACTED]
  AGENTS.md → ARCHITECTURE.md
- `Automated Architecture Guard (tests/architectureGuard.test.js)` --references--> `Typography Tokens`  [INFERRED]
  ARCHITECTURE.md → DESIGN.md
- `Tax-Planner README` --references--> `Tax-Planner Architecture`  [EXTRACTED]
  README.md → ARCHITECTURE.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Zero hardcoded literals contract (strings, colors, typography) enforced by guard** — architecture_architecture_guard, architecture_strings_dictionary, design_color_tokens, design_typography_tokens [EXTRACTED 0.90]
- **@vit129/thai-tax-core public calculation API** — docs_design_mip_tax_core_plan_calculate_tax, docs_design_mip_tax_core_plan_calculate_social_security, docs_design_mip_tax_core_plan_calculate_deductions, docs_design_mip_tax_core_plan_calculate_rmf_drop_advice, docs_design_mip_tax_core_plan_build_ask_ai_rmf_prompt [EXTRACTED 0.90]

## Communities (28 total, 10 thin omitted)

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
Cohesion: 0.14
Nodes (21): COLORS, STRINGS, BRACKET_RATES_PCT, DEDUCTION_RULES, EXTRA_DEDUCTION_OPTIONS, SAMPLE_PVD_FUNDS, TYPOGRAPHY, generateAiRmfPrompt() (+13 more)

### Community 3 - "Plan: Extract tax-core & Redesign TaxPage"
Cohesion: 0.11
Nodes (24): Tax-Planner Agent Instructions, Automated Architecture Guard (tests/architectureGuard.test.js), Dependency Direction ui -> logic -> config, Centralized Strings Dictionary (src/config/strings.js), Tax-Planner Architecture, @vit129/tax-ui package, @vit129/thai-tax-core package, Tax-Planner Guidelines (CLAUDE.md) (+16 more)

### Community 4 - "companyLogic.test.js"
Cohesion: 0.19
Nodes (24): estimateCompanyWithholding(), getCompanyAnnualSalary(), getCompanyBaseSalaryAtMonth(), getCompanyBreakdown(), getCompanyExtraIncome(), getCompanyFixedBonus(), getCompanyLastSalary(), getCompanyMonthlySalaries() (+16 more)

### Community 5 - "scripts"
Cohesion: 0.07
Nodes (26): contributors, dependencies, react, react-dom, @vit129/tax-ui, @vit129/thai-tax-core, devDependencies, @playwright/test (+18 more)

### Community 6 - "render"
Cohesion: 0.22
Nodes (18): all(), baseAt(), coCalc(), compute(), f(), floorOf(), generateAiPrompt(), k() (+10 more)

### Community 7 - "architectureGuard.test.js"
Cohesion: 0.18
Nodes (8): __dirname, has zero hardcoded fontSize or fontFamily outside src/config/typography.js, has zero hardcoded #hex colors outside src/config/colors.js, has zero hardcoded Thai words/characters outside src/config/strings.js, has zero missing imports for TYPOGRAPHY, COLORS, and STRINGS when referenced, has zero missing STRINGS keys across all source files, SRC_DIR, Tax-Planner Architecture Guard (Logic / UI / Translator / Color / Typography / Shared UI)

### Community 8 - "start.js"
Cohesion: 0.33
Nodes (8): __dirname, __filename, main(), promptMessage(), REPO_ROOT, runCommand(), selectWithArrows(), selectWithReadline()

### Community 9 - "taxLogic.js"
Cohesion: 0.12
Nodes (22): SAMPLE_RMF_FUNDS, SCBRMS&P500, BGOLDRMF, KKP PGE RMF-H, MEGAWORLD30RMF, B-INNOTECHRMF, UGISRMF, TAX_BRACKETS (+14 more)

### Community 10 - "CO"
Cohesion: 1.00
Nodes (3): CO(), loadForm(), switchCo()

### Community 12 - "@media (min-width: 900px)"
Cohesion: 0.67
Nodes (3): @media (min-width: 900px), .grid, .results

### Community 21 - "TaxPlannerPage"
Cohesion: 0.10
Nodes (5): TaxPlannerPage, [TC-TAX-WEB-001] Single Employer, Bracket 10%, Zero Insurance, RMF Drop to 5% @Feature @High @Scenario, [TC-TAX-WEB-002] Single Employer, Bracket 15%, Partial Insurance (Life 30k + Health 15k) @Feature @High @Scenario, [TC-TAX-WEB-003] Job Switcher (2 Employers), Combined Income & 2569 Social Security Cap @Feature @High @Scenario, [TC-TAX-WEB-004] Pension Insurance Overflow into Unused General Life Insurance @Feature @Medium @Scenario

### Community 22 - "SCENARIOS"
Cohesion: 0.12
Nodes (15): SCENARIOS, บริษัทเดียว · ฐาน 10% · ไม่ปรับเงินเดือน · Fixed โบนัส 1 ด. · PVD 3% · ไม่มีประกัน, บริษัทเดียว · ฐาน 15% · ปรับเงินเดือน 1 ครั้ง (ผ่านโปร ด.4) · Var โบนัส 1.5 ด. · PVD 5% · ประกันไม่เต็ม, บริษัทเดียว · ฐาน 20% · ปรับเงินเดือน 2 ครั้ง (ด.4 + ด.10) · Fixed + Var 2 ด. · PVD 2% · ประกันไม่เต็ม, บริษัทเดียว · ฐาน 20% · ปรับ 1 ครั้ง · Fixed 2 ด. · PVD 10% · ประกันเต็ม Max (100k), บริษัทเดียว · ฐาน 25% · ไม่ปรับเงินเดือน · Perf โบนัสปลายปี 2.5 ด. · PVD 5% · ประกันไม่เต็ม, บริษัทเดียว · ฐาน 25% · ปรับ 1 ครั้ง · Fixed 1 ด. + Perf 2 ด. · PVD 10% · ประกันเต็ม Max + บำนาญ, บริษัทเดียว · ฐาน 30% · ปรับ 2 ครั้ง · Hybrid โบนัส 3 ด. · PVD 15% · ประกันเต็ม Max ทุกตัว (+7 more)

### Community 23 - "🧪 TaxLogicScenario — Comprehensive Tax & RMF Verification Matrix"
Cohesion: 0.29
Nodes (6): 🧪 TaxLogicScenario — Comprehensive Tax & RMF Verification Matrix, 📋 ขอบเขตการทดสอบ (Scope), 🎯 วัตถุประสงค์หลัก 2 ข้อในการทดสอบ, 🚀 วิธีการรันชุดทดสอบ (Execution), ✅ สิ่งที่รวมในการทดสอบ (In-Scope / Included), ❌ สิ่งที่ไม่รวมในการทดสอบ และเหตุผล (Out-of-Scope / Excluded & Rationale)

### Community 24 - "compilerOptions"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, paths, @vit129/tax-ui, @vit129/thai-tax-core

## Knowledge Gaps
- **280 isolated node(s):** `#sampleBar`, `#startOwn`, `#stickyBar`, `#stickyVal`, `#coTabs` (+275 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.
- **4 possibly unreachable function(s):** `__dirname`, `__dirname`, `__dirname`, `__filename`
  Not reached from any recognized entry point - could be dead code, or dynamically dispatched/decorator-registered.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `SCENARIOS` connect `SCENARIOS` to `taxLogic.js`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `calculateTaxPlan()` connect `taxLogic.js` to `App.jsx`, `companyLogic.test.js`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `STRINGS` connect `App.jsx` to `taxLogic.js`, `architectureGuard.test.js`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `#sampleBar`, `#startOwn`, `#stickyBar` to the rest of the system?**
  _281 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `tax-planner-mockup.html` be split into smaller, more focused modules?**
  _Cohesion score 0.02127659574468085 - nodes in this community are weakly interconnected._
- **Should `index.css` be split into smaller, more focused modules?**
  _Cohesion score 0.022727272727272728 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14009661835748793 - nodes in this community are weakly interconnected._