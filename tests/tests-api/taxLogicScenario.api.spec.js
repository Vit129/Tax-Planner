import { test, expect } from '@playwright/test';
import { getAnnualExtraIncome } from '@vit129/thai-tax-core';
import { getBonusTotal, applyBonus } from '@vit129/tax-ui';
import { calculateTaxPlan, calculateProgressiveTax, getMarginalTaxRate } from '../../src/logic/taxLogic.js';
import {
  toCoreCompany,
  fromCoreCompany,
  toEasyDeductions,
  fromEasyDeductions,
  applyEasyDeductionUpdate,
  toEasyPlan,
  getStartSalary,
  getFirstRaise,
  setStartSalary,
  setFirstRaise,
  setYearlyOtherIncome,
} from '../../src/logic/easyTaxAdapter.js';
import { SCENARIOS, SHAPE_FIXTURE, LEGACY_V2_SAMPLE_FIXTURE } from '../fixtures/taxLogic/scenarios.data.js';

test.describe('@Critical [TS-TAX-API] Tax Mathematical Engine & RMF Logic Scenarios', () => {
  for (const sc of SCENARIOS) {
    test(`[TC-TAX-API-${String(sc.id).replace('case-', '')}] ${sc.title} @Feature @Critical @Scenario`, async () => {
      const plan = calculateTaxPlan(sc.companies, sc.deductions);

      // 1. Verify Income & Expense Capping (50% max 100k)
      expect(plan.totalIncome).toBeGreaterThan(0);
      expect(plan.expenses).toBe(Math.min(plan.totalIncome * 0.5, 100000));

      // 2. Verify Deductions & 2569 Social Security Ceiling (max 10,500)
      expect(plan.deductions).toBeGreaterThanOrEqual(70500); // Personal 60k + SS (up to 10.5k)

      // 3. Verify Net Income
      expect(plan.netIncome).toBe(Math.max(0, plan.totalIncome - plan.expenses - plan.deductions));

      // 4. Verify Marginal Tax Bracket Matches Scenario Target
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
        expect(plan.retirementPoolUsed).toBeGreaterThan(0);
        expect(plan.deductions).toBeGreaterThanOrEqual(60000 + 10500 + 150000);
      }

      // 9. Verify EasyTaxAdapter round-trip preserves exact calculation
      const roundComp = sc.companies.map((c) => fromCoreCompany(toCoreCompany(c), c));
      const roundDed = fromEasyDeductions(toEasyDeductions(sc.deductions), sc.deductions);
      const afterPlan = calculateTaxPlan(roundComp, roundDed);
      expect(afterPlan.taxPayable).toBe(plan.taxPayable);
      expect(afterPlan.settlementDiff).toBe(plan.settlementDiff);
    });
  }

  test('[TC-TAX-API-SHAPE] Real-shaped fixture display, round-trip, edit & revert, and legacy V2 compatibility @Critical @Scenario', async () => {
    const [tpComp] = SHAPE_FIXTURE.companies;
    const core = toCoreCompany(tpComp);
    const exp = SHAPE_FIXTURE.expectedDisplay;

    expect(getStartSalary(core)).toBe(exp.startSalary);
    expect(getFirstRaise(core)).toEqual({
      month: exp.raiseMonth,
      from: exp.startSalary,
      to: exp.raiseSalary,
    });
    expect(getAnnualExtraIncome(core)).toBe(exp.yearlyOtherIncome);
    expect(getBonusTotal(core, exp.raiseSalary)).toBe(exp.bonusTotal);

    const basePlan = toEasyPlan(SHAPE_FIXTURE.companies, SHAPE_FIXTURE.deductions);
    expect(basePlan.taxPayable).toBe(exp.taxPayable);
    expect(basePlan.settlement.taxDiff).toBe(exp.settlementDiff);

    // Edit & revert each field
    const calc = (comp, ded = SHAPE_FIXTURE.deductions) => toEasyPlan([comp], ded).taxPayable;
    expect(calc(fromCoreCompany(setStartSalary(core, 52500), tpComp))).not.toBe(exp.taxPayable);
    expect(calc(fromCoreCompany(setFirstRaise(core, 6, 54500), tpComp))).not.toBe(exp.taxPayable);
    expect(calc(fromCoreCompany(setFirstRaise(core, 3, 70000), tpComp))).not.toBe(exp.taxPayable);
    expect(calc(fromCoreCompany(applyBonus(core, 200000), tpComp))).not.toBe(exp.taxPayable);
    expect(calc(fromCoreCompany(setYearlyOtherIncome(core, 50000), tpComp))).not.toBe(exp.taxPayable);
    expect(calc(fromCoreCompany({ ...core, pvdEmpRate: 5 }, tpComp))).not.toBe(exp.taxPayable);
    expect(
      calc(tpComp, applyEasyDeductionUpdate(SHAPE_FIXTURE.deductions, 'lifeInsurance', 50000))
    ).not.toBe(exp.taxPayable);

    // Legacy V2 sample data
    const legacyPlan = toEasyPlan(
      LEGACY_V2_SAMPLE_FIXTURE.companies,
      LEGACY_V2_SAMPLE_FIXTURE.deductions
    );
    expect(legacyPlan.taxPayable).toBe(
      calculateTaxPlan(LEGACY_V2_SAMPLE_FIXTURE.companies, LEGACY_V2_SAMPLE_FIXTURE.deductions)
        .taxPayable
    );
  });
});

