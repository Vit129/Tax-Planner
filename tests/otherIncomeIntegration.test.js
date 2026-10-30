import { describe, it, expect } from 'vitest';
import { calculateTaxPlan } from '../src/logic/taxLogic.js';
import { toEasyPlan, createEasySimulatorRecalculate } from '../src/logic/easyTaxAdapter.js';

const income = (type, gross, details = {}) => ({ type, gross, withholding: 0, expenses: 0, treatment: 'included', ...details });

describe('[BE-IT] other income in tax plan and simulator', () => {
  it('[Success] applies actual expenses before donation and sums withholding', () => {
    const result = calculateTaxPlan([], {}, 0, 0, 0, [income('5', 1000000, { expenses: 300000, withholding: 50000 })]);
    expect(result).toMatchObject({ totalIncome: 1000000, expenses: 300000, netIncome: 640000, taxPayable: 48500, totalWithholding: 50000, settlementDiff: 1500 });
    expect(result.otherIncomeSummary.form).toBe('90');
  });
  it('[Success] credits eligible dividends after computing tax', () => {
    const result = calculateTaxPlan([], {}, 0, 0, 0, [income('4', 80000, { dividendCorpTaxRate: 0.2, withholding: 8000 })]);
    expect(result.totalIncome).toBe(100000);
    expect(result.otherIncomeSummary.dividendTaxCredit).toBe(20000);
    expect(result.settlementDiff).toBe(28000);
  });
  it('[Edge] applies higher method 2 at the threshold after exemption', () => {
    const result = calculateTaxPlan([], {}, 0, 0, 0, [income('8', 1200000, { expenses: 1100000 })]);
    expect(result.taxMethods.selectedMethod).toBe(2);
    expect(result.taxPayable).toBe(6000);
  });
  it('[Success] keeps income and method 2 in the simulator', () => {
    const rows = [income('8', 1200000, { expenses: 1100000 })];
    const base = toEasyPlan([], {}, { otherIncome: rows });
    const simulated = createEasySimulatorRecalculate([], {}, 0, rows)({ extraRmf: 10000 });
    expect(simulated.totalIncome).toBe(base.totalIncome);
    expect(simulated.taxPayable).toBe(6000);
  });
});

describe('[BE-IT] separate retirement income bases', () => {
  it('[Alternative] counts final-tax income for RMF but not annual taxable income', () => {
    const final = income('4', 100000, { treatment: 'excluded', exclusionKind: 'final', withholding: 10000 });
    const plan = calculateTaxPlan([], {}, 0, 0, 0, [final]);
    expect(plan.totalIncome).toBe(0);
    expect(plan.rmfCap).toBe(30000);
    expect(plan.otherIncomeSummary.withholding).toBe(0);
  });
  it('[Edge] does not use non-employment income to increase PVD cap', () => {
    const plan = calculateTaxPlan([], { pvdManual: 50000 }, 0, 0, 0, [income('8', 500000)]);
    expect(plan.pvdCap).toBe(0);
    expect(plan.pvdUsed).toBe(0);
  });
});
