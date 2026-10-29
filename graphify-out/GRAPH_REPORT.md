# Graph Report - adopt-easy-ui  (2026-10-29)

## Corpus Check
- 43 files · ~25,197 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 461 nodes · 656 edges · 30 communities (19 shown, 11 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.72)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d770b231`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## God Nodes (most connected - your core abstractions)
1. `TaxPlannerPage` - 22 edges
2. `SCENARIOS` - 18 edges
3. `render()` - 12 edges
4. `getCompanyBreakdown()` - 11 edges
5. `calculateTaxPlan()` - 11 edges
6. `getCompanyMonthlySalaries()` - 10 edges
7. `renderMonths()` - 8 edges
8. `SAMPLE_RMF_FUNDS` - 8 edges
9. `getCompanyTotalIncome()` - 8 edges
10. `App()` - 8 edges

## Cross-Cutting Nodes (span the most distinct areas of the codebase)
A high-degree node isn't always architecturally central - a widely-used
utility/config file can rack up more edges than a real coupler while only
ever touching one area. This ranks by how many DIFFERENT communities a
node's neighbors span, not by raw edge count.
1. `STRINGS` - bridges 3 areas (7 edges)
2. `render()` - bridges 2 areas (12 edges)
3. `calculateTaxPlan()` - bridges 2 areas (11 edges)
4. `renderMonths()` - bridges 2 areas (8 edges)
5. `toEasyPlan()` - bridges 2 areas (7 edges)
6. `on()` - bridges 2 areas (6 edges)
7. `fromCoreCompany()` - bridges 2 areas (6 edges)
8. `CO()` - bridges 2 areas (5 edges)
9. `createNextTpCompany()` - bridges 2 areas (5 edges)
10. `applyEasyDeductionUpdate()` - bridges 2 areas (5 edges)

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

## Communities (30 total, 11 thin omitted)

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
Cohesion: 0.08
Nodes (30): STRINGS, BRACKET_RATES_PCT, DEDUCTION_RULES, EXTRA_DEDUCTION_OPTIONS, SAMPLE_PVD_FUNDS, SAMPLE_RMF_FUNDS, SCBRMS&P500, BGOLDRMF (+22 more)

### Community 3 - "Plan: Extract tax-core & Redesign TaxPage"
Cohesion: 0.11
Nodes (24): Tax-Planner Agent Instructions, Automated Architecture Guard (tests/architectureGuard.test.js), Dependency Direction ui -> logic -> config, Centralized Strings Dictionary (src/config/strings.js), Tax-Planner Architecture, @vit129/tax-ui package, @vit129/thai-tax-core package, Tax-Planner Guidelines (CLAUDE.md) (+16 more)

### Community 4 - "taxLogic.js"
Cohesion: 0.11
Nodes (36): COLORS, TYPOGRAPHY, estimateCompanyWithholding(), getCompanyAnnualSalary(), getCompanyBaseSalaryAtMonth(), getCompanyBreakdown(), getCompanyExtraIncome(), getCompanyFixedBonus() (+28 more)

### Community 5 - "scripts"
Cohesion: 0.07
Nodes (26): contributors, dependencies, react, react-dom, @vit129/tax-ui, @vit129/thai-tax-core, devDependencies, @playwright/test (+18 more)

### Community 6 - "render"
Cohesion: 0.22
Nodes (18): all(), baseAt(), coCalc(), compute(), f(), floorOf(), generateAiPrompt(), k() (+10 more)

### Community 8 - "start.js"
Cohesion: 0.33
Nodes (8): __dirname, __filename, main(), promptMessage(), REPO_ROOT, runCommand(), selectWithArrows(), selectWithReadline()

### Community 10 - "CO"
Cohesion: 1.00
Nodes (3): CO(), loadForm(), switchCo()

### Community 12 - "@media (min-width: 900px)"
Cohesion: 0.67
Nodes (3): @media (min-width: 900px), .grid, .results

### Community 17 - "@media (min-width: 900px)"
Cohesion: 0.26
Nodes (10): applyEasyDeductionUpdate(), createNextTpCompany(), fromCoreCompany(), getTaxYearMetadata(), App(), cloneCompanies(), createEmptyCompany(), DEFAULT_SAMPLE_COMPANIES (+2 more)

### Community 22 - "SCENARIOS"
Cohesion: 0.06
Nodes (39): fromEasyDeductions(), creates next company and builds AI prompt and URLs accurately, each field changes the tax and reverting restores it exactly, easyTaxAdapter — Display, Round-Trip, Edit, and Legacy V2 Compatibility, easyTaxAdapter — pension insurance, NSF (gpf), retirement pool and tax waterfall, keeps the What-If simulator isolated from basePlan taxPayable and settlement, loads legacy V2 localStorage data blobs without error, maps Tax-Planner gpf to the shared nsf field and back (+31 more)

### Community 23 - "🧪 TaxLogicScenario — Comprehensive Tax & RMF Verification Matrix"
Cohesion: 0.29
Nodes (6): 🧪 TaxLogicScenario — Comprehensive Tax & RMF Verification Matrix, 📋 ขอบเขตการทดสอบ (Scope), 🎯 วัตถุประสงค์หลัก 2 ข้อในการทดสอบ, 🚀 วิธีการรันชุดทดสอบ (Execution), ✅ สิ่งที่รวมในการทดสอบ (In-Scope / Included), ❌ สิ่งที่ไม่รวมในการทดสอบ และเหตุผล (Out-of-Scope / Excluded & Rationale)

### Community 24 - "compilerOptions"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, paths, @vit129/tax-ui, @vit129/thai-tax-core

## Knowledge Gaps
- **303 isolated node(s):** `#sampleBar`, `#startOwn`, `#stickyBar`, `#stickyVal`, `#coTabs` (+298 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.
- **4 possibly unreachable function(s):** `__dirname`, `__dirname`, `__dirname`, `__filename`
  Not reached from any recognized entry point - could be dead code, or dynamically dispatched/decorator-registered.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `TaxPlannerPage` connect `TaxPlannerPage` to `SCENARIOS`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **What connects `#sampleBar`, `#startOwn`, `#stickyBar` to the rest of the system?**
  _304 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `tax-planner-mockup.html` be split into smaller, more focused modules?**
  _Cohesion score 0.02127659574468085 - nodes in this community are weakly interconnected._
- **Should `index.css` be split into smaller, more focused modules?**
  _Cohesion score 0.02247191011235955 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07657657657657657 - nodes in this community are weakly interconnected._
- **Should `Plan: Extract tax-core & Redesign TaxPage` be split into smaller, more focused modules?**
  _Cohesion score 0.10507246376811594 - nodes in this community are weakly interconnected._
- **Should `taxLogic.js` be split into smaller, more focused modules?**
  _Cohesion score 0.11382113821138211 - nodes in this community are weakly interconnected._