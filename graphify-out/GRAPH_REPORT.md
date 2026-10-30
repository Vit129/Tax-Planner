# Graph Report - Tax-Planner  (2026-10-30)

## Corpus Check
- 61 files · ~31,111 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 579 nodes · 837 edges · 35 communities (23 shown, 12 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.72)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `14d76407`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## God Nodes (most connected - your core abstractions)
1. `TaxPlannerPage` - 23 edges
2. `SCENARIOS` - 18 edges
3. `calculateTaxPlan()` - 14 edges
4. `render()` - 12 edges
5. `STRINGS` - 11 edges
6. `getCompanyBreakdown()` - 11 edges
7. `getCompanyMonthlySalaries()` - 10 edges
8. `App()` - 10 edges
9. `runPatchRelease()` - 9 edges
10. `renderMonths()` - 8 edges

## Cross-Cutting Nodes (span the most distinct areas of the codebase)
A high-degree node isn't always architecturally central - a widely-used
utility/config file can rack up more edges than a real coupler while only
ever touching one area. This ranks by how many DIFFERENT communities a
node's neighbors span, not by raw edge count.
1. `calculateTaxPlan()` - bridges 3 areas (14 edges)
2. `TaxPlannerPage` - bridges 2 areas (23 edges)
3. `render()` - bridges 2 areas (12 edges)
4. `STRINGS` - bridges 2 areas (11 edges)
5. `renderMonths()` - bridges 2 areas (8 edges)
6. `toEasyPlan()` - bridges 2 areas (8 edges)
7. `on()` - bridges 2 areas (6 edges)
8. `toEasyInputs()` - bridges 2 areas (6 edges)
9. `createEasySimulatorRecalculate()` - bridges 2 areas (6 edges)
10. `CO()` - bridges 2 areas (5 edges)

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

## Communities (35 total, 12 thin omitted)

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
Cohesion: 0.11
Nodes (17): COLORS, STRINGS, TYPOGRAPHY, IncomeCategoryTabs(), OtherIncomeStep(), OtherIncomeSummary(), __dirname, has zero hardcoded fontSize or fontFamily outside src/config/typography.js (+9 more)

### Community 3 - "Plan: Extract tax-core & Redesign TaxPage"
Cohesion: 0.11
Nodes (24): Tax-Planner Agent Instructions, Automated Architecture Guard (tests/architectureGuard.test.js), Dependency Direction ui -> logic -> config, Centralized Strings Dictionary (src/config/strings.js), Tax-Planner Architecture, @vit129/tax-ui package, @vit129/thai-tax-core package, Tax-Planner Guidelines (CLAUDE.md) (+16 more)

### Community 4 - "companyLogic.test.js"
Cohesion: 0.06
Nodes (55): BRACKET_RATES_PCT, DEDUCTION_RULES, EXTRA_DEDUCTION_OPTIONS, SAMPLE_PVD_FUNDS, SAMPLE_RMF_FUNDS, SCBRMS&P500, BGOLDRMF, KKP PGE RMF-H (+47 more)

### Community 5 - "scripts"
Cohesion: 0.07
Nodes (29): contributors, dependencies, react, react-dom, @vit129/tax-ui, @vit129/thai-tax-core, devDependencies, @playwright/test (+21 more)

### Community 6 - "render"
Cohesion: 0.22
Nodes (18): all(), baseAt(), coCalc(), compute(), f(), floorOf(), generateAiPrompt(), k() (+10 more)

### Community 8 - "start.js"
Cohesion: 0.14
Nodes (24): compare(), needsReleaseCommit(), parts(), planPatchVersion(), __dirname, __filename, getPagesDeployInfo(), getSharedPackagesCommit() (+16 more)

### Community 10 - "CO"
Cohesion: 1.00
Nodes (3): CO(), loadForm(), switchCo()

### Community 12 - "@media (min-width: 900px)"
Cohesion: 0.67
Nodes (3): @media (min-width: 900px), .grid, .results

### Community 17 - "@media (min-width: 900px)"
Cohesion: 0.08
Nodes (24): amount(), summarizeOtherIncome(), VALID_TYPES, [BE-UT] legacy income election migration, normalizes legacy interest and flags conflicting elections in both rows, preserves an unsupported prior exclusion for review without crashing, validates inconsistent legacy interest even without migration, [Alternative] excludes final-tax withholding from the annual settlement (+16 more)

### Community 22 - "SCENARIOS"
Cohesion: 0.07
Nodes (45): AI_CHAT_URL_PREFIX, applyEasyDeductionUpdate(), buildAiChatUrl(), buildEasyAiPrompt(), createEasySimulatorRecalculate(), createNextTpCompany(), fromCoreCompany(), fromEasyDeductions() (+37 more)

### Community 23 - "🧪 TaxLogicScenario — Comprehensive Tax & RMF Verification Matrix"
Cohesion: 0.29
Nodes (6): 🧪 TaxLogicScenario — Comprehensive Tax & RMF Verification Matrix, 📋 ขอบเขตการทดสอบ (Scope), 🎯 วัตถุประสงค์หลัก 2 ข้อในการทดสอบ, 🚀 วิธีการรันชุดทดสอบ (Execution), ✅ สิ่งที่รวมในการทดสอบ (In-Scope / Included), ❌ สิ่งที่ไม่รวมในการทดสอบ และเหตุผล (Out-of-Scope / Excluded & Rationale)

### Community 24 - "compilerOptions"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, paths, @vit129/tax-ui, @vit129/thai-tax-core

### Community 30 - "EasyTaxApp.jsx"
Cohesion: 0.10
Nodes (19): [1.1.0] - 2026-10-24, [1.2.0] - 2026-10-29, [1.3.0] - 2026-10-29, [1.4.0] - 2026-10-29, [1.4.1] - 2026-10-30, [1.4.2] - 2026-10-30, [1.4.3] - 2026-10-30, Added (+11 more)

### Community 31 - "otherIncome.test.js"
Cohesion: 0.13
Nodes (15): SCENARIOS, บริษัทเดียว · ฐาน 10% · ไม่ปรับเงินเดือน · Fixed โบนัส 1 ด. · PVD 3% · ไม่มีประกัน, บริษัทเดียว · ฐาน 15% · ปรับเงินเดือน 1 ครั้ง (ผ่านโปร ด.4) · Var โบนัส 1.5 ด. · PVD 5% · ประกันไม่เต็ม, บริษัทเดียว · ฐาน 20% · ปรับเงินเดือน 2 ครั้ง (ด.4 + ด.10) · Fixed + Var 2 ด. · PVD 2% · ประกันไม่เต็ม, บริษัทเดียว · ฐาน 20% · ปรับ 1 ครั้ง · Fixed 2 ด. · PVD 10% · ประกันเต็ม Max (100k), บริษัทเดียว · ฐาน 25% · ไม่ปรับเงินเดือน · Perf โบนัสปลายปี 2.5 ด. · PVD 5% · ประกันไม่เต็ม, บริษัทเดียว · ฐาน 25% · ปรับ 1 ครั้ง · Fixed 1 ด. + Perf 2 ด. · PVD 10% · ประกันเต็ม Max + บำนาญ, บริษัทเดียว · ฐาน 30% · ปรับ 2 ครั้ง · Hybrid โบนัส 3 ด. · PVD 15% · ประกันเต็ม Max ทุกตัว (+7 more)

### Community 32 - "incomeTaxMethods.test.js"
Cohesion: 0.22
Nodes (8): compareIncomeTaxMethods(), [Alternative] selects progressive tax when it is higher, [BE-UT] annual tax method comparison, [Edge] excludes method 2 below the income threshold, [Edge] exempts method 2 up to and including 5000 baht, [Edge] includes method 2 exactly at the 120,000 threshold, [Edge] rejects invalid amounts, [Success] selects method 2 when it is higher and not exempt

### Community 33 - "SAMPLE_RMF_FUNDS"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Tax planner initial flow state default summary versus wizard and condition when no data, Source Nodes

## Knowledge Gaps
- **366 isolated node(s):** `changelog`, `git`, `#sampleBar`, `#startOwn`, `#stickyBar` (+361 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.
- **4 possibly unreachable function(s):** `__dirname`, `__dirname`, `__dirname`, `__filename`
  Not reached from any recognized entry point - could be dead code, or dynamically dispatched/decorator-registered.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `STRINGS` connect `App.jsx` to `companyLogic.test.js`, `SCENARIOS`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `TaxPlannerPage` connect `TaxPlannerPage` to `App.jsx`, `SCENARIOS`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `SCENARIOS` connect `otherIncome.test.js` to `SCENARIOS`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **What connects `changelog`, `git`, `#sampleBar` to the rest of the system?**
  _367 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `tax-planner-mockup.html` be split into smaller, more focused modules?**
  _Cohesion score 0.02127659574468085 - nodes in this community are weakly interconnected._
- **Should `index.css` be split into smaller, more focused modules?**
  _Cohesion score 0.02247191011235955 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10873440285204991 - nodes in this community are weakly interconnected._