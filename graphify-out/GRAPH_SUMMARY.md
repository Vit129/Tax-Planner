# Graph Summary — delivery-workflow-completion
_Auto-generated from GRAPH_REPORT.md · do not edit manually_
_Regen: `graphify update .`_

## Summary
- 2704 nodes · 3084 edges · 220 communities (187 shown, 33 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.67)
- Token cost: 0 input · 0 output


## Graph Freshness
- Built from commit: `e6af78d4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).


## God Nodes (most connected - your core abstractions)
1. `Fix Generated Playwright Files (Postman Migration)` - 33 edges
2. `TaxPlannerPage` - 23 edges
3. `UX/UI Designer` - 21 edges
4. `SCENARIOS` - 18 edges
5. `Browser Automation with playwright-cli` - 17 edges
6. `Frontend Development` - 16 edges
7. `AI-SDLC Progress Spec — Task Breakdown & Progress Tracking` - 15 edges
8. `calculateTaxPlan()` - 14 edges
9. `Coding Principles` - 13 edges
10. `Running Custom Playwright Code` - 13 edges


## Cross-Cutting Nodes (span the most distinct areas of the codebase)
A high-degree node isn't always architecturally central - a widely-used
utility/config file can rack up more edges than a real coupler while only
ever touching one area. This ranks by how many DIFFERENT communities a
node's neighbors span, not by raw edge count.
1. `calculateTaxPlan()` - bridges 4 areas (14 edges)
2. `STRINGS` - bridges 4 areas (11 edges)
3. `f()` - bridges 4 areas (8 edges)
4. `toEasyPlan()` - bridges 3 areas (8 edges)
5. `fromCoreCompany()` - bridges 3 areas (6 edges)
6. `toEasyInputs()` - bridges 3 areas (6 edges)
7. `createNextTpCompany()` - bridges 3 areas (5 edges)
8. `Browser Automation with playwright-cli` - bridges 2 areas (17 edges)
9. `render()` - bridges 2 areas (12 edges)

## Surprising Connections (you probably didn't know these)
- `Tax-Planner Guidelines (CLAUDE.md)` --semantically_similar_to--> `Tax-Planner Agent Instructions`  [INFERRED] [semantically similar]
  CLAUDE.md → AGENTS.md
- `_load_csv()` --indirect_call--> `f()`  [INFERRED]
  .claude/skills/uxui-designer/scripts/core.py → docs/design/tax-planner-mockup.html
- `_read_rows()` --indirect_call--> `f()`  [INFERRED]
  .claude/skills/uxui-designer/scripts/validate_data.py → docs/design/tax-planner-mockup.html
- `Automated Architecture Guard (tests/architectureGuard.test.js)` --references--> `Color Tokens (light/dark)`  [INFERRED]
  ARCHITECTURE.md → DESIGN.md
- `Tax-Planner Agent Instructions` --references--> `Automated Architecture Guard (tests/architectureGuard.test.js)`  [EXTRACTED]
  AGENTS.md → ARCHITECTURE.md


_Full map → GRAPH_REPORT.md · query: `graphify query "..."`_
