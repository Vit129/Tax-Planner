---
type: "mcp_result"
date: "2026-10-30T14:22:37.190948+00:00"
question: "Tax planner initial flow state default summary versus wizard and condition when no data"
contributor: "graphify"
outcome: "useful"
source_nodes: ["EasyTaxApp()", "toEasyInputs()"]
---

# Q: Tax planner initial flow state default summary versus wizard and condition when no data

## Answer

Tax-Planner initializes flowState in src/ui/App.jsx from locally persisted/default sample state. It now opens summary when salary, deductions, foreign income, or other income data exists, and keeps wizard mode for empty own-data setup.

## Outcome

- Signal: useful

## Source Nodes

- EasyTaxApp()
- toEasyInputs()