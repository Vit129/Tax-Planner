import { test, expect } from '@playwright/test';
import { calculateTaxPlan, calculateProgressiveTax, getMarginalTaxRate } from '../../src/logic/taxLogic.js';
import { SCENARIOS } from './scenarios.data.js';

test.describe('TaxLogicScenario — API & Pure Mathematical Engine Tests', () => {
  for (const sc of SCENARIOS) {
    test(`${sc.id}: ${sc.title}`, async () => {
      const plan = calculateTaxPlan(sc.companies, sc.deductions);

      // 1. Verify Income & Expense Capping
      expect(plan.totalIncome).toBeGreaterThan(0);
      expect(plan.expenses).toBe(Math.min(plan.totalIncome * 0.5, 100000));

      // 2. Verify Deductions & New 2569 Social Security Ceiling (max 10,500)
      expect(plan.deductions).toBeGreaterThanOrEqual(70500); // At least Personal 60k + SS (up to 10.5k)

      // 3. Verify Net Income
      expect(plan.netIncome).toBe(Math.max(0, plan.totalIncome - plan.expenses - plan.deductions));

      // 4. Verify Marginal Tax Bracket Matches Target
      expect(plan.marginalRate).toBe(sc.expected.marginalRate);

      // 5. Verify Progressive Tax Calculation Matches Formula
      const manualTax = calculateProgressiveTax(plan.netIncome);
      expect(plan.taxPayable).toBe(manualTax);

      // 6. Verify Settlement (Refund or Payable)
      const totalWh = sc.companies.reduce((s, c) => s + (c.withholdingTax || 0), 0);
      if (totalWh >= plan.taxPayable) {
        expect(plan.isRefund).toBe(true);
        expect(plan.settlement).toBe(totalWh - plan.taxPayable);
      } else {
        expect(plan.isRefund).toBe(false);
        expect(plan.settlement).toBe(plan.taxPayable - totalWh);
      }

      // 7. Verify RMF Advice (Optimal reduction to drop 1 bracket)
      if (plan.recommendedRmf > 0) {
        // Must not exceed 30% of total assessable income
        expect(plan.recommendedRmf).toBeLessThanOrEqual(plan.totalIncome * 0.30);

        // Must not exceed remaining room in 500k retirement pool
        expect(plan.recommendedRmf).toBeLessThanOrEqual(plan.retirementPoolRemain);

        // Re-evaluating net income after purchasing recommended RMF
        const simNetIncome = plan.netIncome - plan.recommendedRmf;
        const newRate = getMarginalTaxRate(simNetIncome);

        // The marginal rate must drop down to the target bracket
        expect(newRate).toBeLessThan(plan.marginalRate);
        expect(newRate).toBe(sc.expected.targetDropBracket);
      }

      // 8. Verify Pension Overflow rule when applicable
      if (sc.expected.hasOverflow) {
        // Pension life (150,000) with 0 general life overflows 100,000 into general life
        // and remaining 50,000 stays in retirement group
        expect(plan.retirementPoolUsed).toBeGreaterThan(0);
        expect(plan.deductions).toBeGreaterThanOrEqual(60000 + 10500 + 150000);
      }
    });
  }
});
