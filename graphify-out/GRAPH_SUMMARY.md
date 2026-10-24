# Graph Summary — Tax-Planner
_Auto-generated from GRAPH_REPORT.md · do not edit manually_
_Regen: `graphify update .`_

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


_Full map → GRAPH_REPORT.md · query: `graphify query "..."`_
