# Graph Report - adopt-easy-ui  (2026-10-29)

## Corpus Check
- 45 files · ~25,357 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 464 nodes · 688 edges · 28 communities (18 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.72)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `11f1eb3a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## God Nodes (most connected - your core abstractions)
1. `TaxPlannerPage` - 22 edges
2. `SCENARIOS` - 18 edges
3. `render()` - 12 edges
4. `getCompanyBreakdown()` - 11 edges
5. `calculateTaxPlan()` - 11 edges
6. `getCompanyMonthlySalaries()` - 10 edges
7. `STRINGS` - 9 edges
8. `renderMonths()` - 8 edges
9. `SAMPLE_RMF_FUNDS` - 8 edges
10. `getCompanyTotalIncome()` - 8 edges

## Cross-Cutting Nodes (span the most distinct areas of the codebase)
A high-degree node isn't always architecturally central - a widely-used
utility/config file can rack up more edges than a real coupler while only
ever touching one area. This ranks by how many DIFFERENT communities a
node's neighbors span, not by raw edge count.
1. `SCENARIOS` - bridges 2 areas (18 edges)
2. `render()` - bridges 2 areas (12 edges)
3. `STRINGS` - bridges 2 areas (9 edges)
4. `renderMonths()` - bridges 2 areas (8 edges)
5. `SAMPLE_RMF_FUNDS` - bridges 2 areas (8 edges)
6. `toEasyPlan()` - bridges 2 areas (7 edges)
7. `on()` - bridges 2 areas (6 edges)
8. `CO()` - bridges 2 areas (5 edges)
9. `buildEasyAiPrompt()` - bridges 2 areas (5 edges)
10. `switchCo()` - bridges 2 areas (4 edges)

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
Nodes (88): :root,
:root[data-theme="light"], .num, .banner, .btn, .btn.pri, .btn:focus-visible,
input:focus-visible,
select:focus-visible, .grid, .card (+80 more)

### Community 2 - "App.jsx"
Cohesion: 0.10
Nodes (18): COLORS, STRINGS, BRACKET_RATES_PCT, DEDUCTION_RULES, EXTRA_DEDUCTION_OPTIONS, SAMPLE_PVD_FUNDS, TAX_BRACKETS, TYPOGRAPHY (+10 more)

### Community 3 - "Plan: Extract tax-core & Redesign TaxPage"
Cohesion: 0.11
Nodes (24): Tax-Planner Agent Instructions, Automated Architecture Guard (tests/architectureGuard.test.js), Dependency Direction ui -> logic -> config, Centralized Strings Dictionary (src/config/strings.js), Tax-Planner Architecture, @vit129/tax-ui package, @vit129/thai-tax-core package, Tax-Planner Guidelines (CLAUDE.md) (+16 more)

### Community 4 - "taxLogic.js"
Cohesion: 0.13
Nodes (34): estimateCompanyWithholding(), getCompanyAnnualSalary(), getCompanyBaseSalaryAtMonth(), getCompanyBreakdown(), getCompanyExtraIncome(), getCompanyFixedBonus(), getCompanyLastSalary(), getCompanyMonthlySalaries() (+26 more)

### Community 5 - "scripts"
Cohesion: 0.07
Nodes (26): contributors, dependencies, react, react-dom, @vit129/tax-ui, @vit129/thai-tax-core, devDependencies, @playwright/test (+18 more)

### Community 6 - "render"
Cohesion: 0.22
Nodes (18): all(), baseAt(), coCalc(), compute(), f(), floorOf(), generateAiPrompt(), k() (+10 more)

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

### Community 17 - "@media (min-width: 900px)"
Cohesion: 0.11
Nodes (35): AI_CHAT_URL_PREFIX, applyEasyDeductionUpdate(), buildAiChatUrl(), buildEasyAiPrompt(), createEasySimulatorRecalculate(), createNextTpCompany(), fromCoreCompany(), fromEasyDeductions() (+27 more)

### Community 21 - "TaxPlannerPage"
Cohesion: 0.11
Nodes (8): TaxPlannerPage, [TC-TAX-WEB-001] Single Employer, Bracket 10%, Zero Insurance, RMF Drop to 5% @Feature @High @Scenario, [TC-TAX-WEB-002] Single Employer, Bracket 15%, Partial Insurance (Life 30k + Health 15k) @Feature @High @Scenario, [TC-TAX-WEB-003] Job Switcher (2 Employers), Combined Income & 2569 Social Security Cap @Feature @High @Scenario, [TC-TAX-WEB-004] Legacy V2 Saved Data & Pension Overflow into Retirement Pool Card @Feature @Medium @Scenario, [TC-TAX-WEB-005] Real-shaped Fixture Display, Round-Trip, and Every-Field Edit & Revert @Critical @Scenario, [TC-TAX-WEB-006] Sticky Bottom Bar, Responsive Viewports (360/390/768/1024), and Light/Dark Readability @Critical @Scenario, [TC-TAX-WEB-007] Guided Tour Spotlights Inside Screen at 390x844 and 1024x800 @Critical @Scenario

### Community 22 - "SCENARIOS"
Cohesion: 0.13
Nodes (15): SCENARIOS, บริษัทเดียว · ฐาน 10% · ไม่ปรับเงินเดือน · Fixed โบนัส 1 ด. · PVD 3% · ไม่มีประกัน, บริษัทเดียว · ฐาน 15% · ปรับเงินเดือน 1 ครั้ง (ผ่านโปร ด.4) · Var โบนัส 1.5 ด. · PVD 5% · ประกันไม่เต็ม, บริษัทเดียว · ฐาน 20% · ปรับเงินเดือน 2 ครั้ง (ด.4 + ด.10) · Fixed + Var 2 ด. · PVD 2% · ประกันไม่เต็ม, บริษัทเดียว · ฐาน 20% · ปรับ 1 ครั้ง · Fixed 2 ด. · PVD 10% · ประกันเต็ม Max (100k), บริษัทเดียว · ฐาน 25% · ไม่ปรับเงินเดือน · Perf โบนัสปลายปี 2.5 ด. · PVD 5% · ประกันไม่เต็ม, บริษัทเดียว · ฐาน 25% · ปรับ 1 ครั้ง · Fixed 1 ด. + Perf 2 ด. · PVD 10% · ประกันเต็ม Max + บำนาญ, บริษัทเดียว · ฐาน 30% · ปรับ 2 ครั้ง · Hybrid โบนัส 3 ด. · PVD 15% · ประกันเต็ม Max ทุกตัว (+7 more)

### Community 23 - "🧪 TaxLogicScenario — Comprehensive Tax & RMF Verification Matrix"
Cohesion: 0.29
Nodes (6): 🧪 TaxLogicScenario — Comprehensive Tax & RMF Verification Matrix, 📋 ขอบเขตการทดสอบ (Scope), 🎯 วัตถุประสงค์หลัก 2 ข้อในการทดสอบ, 🚀 วิธีการรันชุดทดสอบ (Execution), ✅ สิ่งที่รวมในการทดสอบ (In-Scope / Included), ❌ สิ่งที่ไม่รวมในการทดสอบ และเหตุผล (Out-of-Scope / Excluded & Rationale)

### Community 24 - "compilerOptions"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, paths, @vit129/tax-ui, @vit129/thai-tax-core

## Knowledge Gaps
- **295 isolated node(s):** `#sampleBar`, `#startOwn`, `#stickyBar`, `#stickyVal`, `#coTabs` (+290 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.
- **4 possibly unreachable function(s):** `__dirname`, `__dirname`, `__dirname`, `__filename`
  Not reached from any recognized entry point - could be dead code, or dynamically dispatched/decorator-registered.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `SCENARIOS` connect `SCENARIOS` to `@media (min-width: 900px)`, `TaxPlannerPage`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `STRINGS` connect `App.jsx` to `@media (min-width: 900px)`, `taxLogic.js`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `#sampleBar`, `#startOwn`, `#stickyBar` to the rest of the system?**
  _296 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `tax-planner-mockup.html` be split into smaller, more focused modules?**
  _Cohesion score 0.02127659574468085 - nodes in this community are weakly interconnected._
- **Should `index.css` be split into smaller, more focused modules?**
  _Cohesion score 0.02247191011235955 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0967741935483871 - nodes in this community are weakly interconnected._
- **Should `Plan: Extract tax-core & Redesign TaxPage` be split into smaller, more focused modules?**
  _Cohesion score 0.10507246376811594 - nodes in this community are weakly interconnected._