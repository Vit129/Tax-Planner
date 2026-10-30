# Graph Summary — Tax-Planner
_Auto-generated from GRAPH_REPORT.md · do not edit manually_
_Regen: `graphify update .`_

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


_Full map → GRAPH_REPORT.md · query: `graphify query "..."`_
