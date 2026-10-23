import { describe, it, expect } from 'vitest';
import {
  calculateProgressiveTax,
  getMarginalTaxRate,
  calculateTaxPlan,
} from '../src/logic/taxLogic.js';

describe('taxLogic', () => {
  it('calculates tax brackets according to Thai Revenue rules', () => {
    // 0 - 150,000 exempt
    expect(calculateProgressiveTax(150000)).toBe(0);

    // 300,000 -> 150,000 * 5% = 7,500
    expect(calculateProgressiveTax(300000)).toBe(7500);

    // 500,000 -> 7,500 + 200,000 * 10% = 27,500
    expect(calculateProgressiveTax(500000)).toBe(27500);

    // 750,000 -> 27,500 + 250,000 * 15% = 65,000
    expect(calculateProgressiveTax(750000)).toBe(65000);

    // 1,000,000 -> 65,000 + 250,000 * 20% = 115,000
    expect(calculateProgressiveTax(1000000)).toBe(115000);
  });

  it('determines marginal tax rate correctly', () => {
    expect(getMarginalTaxRate(120000)).toBe(0);
    expect(getMarginalTaxRate(200000)).toBe(0.05);
    expect(getMarginalTaxRate(400000)).toBe(0.10);
    expect(getMarginalTaxRate(600000)).toBe(0.15);
    expect(getMarginalTaxRate(900000)).toBe(0.20);
  });

  it('calculates full tax plan and correctly handles refund/payable', () => {
    const companies = [
      {
        name: 'Alpha Tech',
        startMonth: 1,
        endMonth: 12,
        baseSalary: 60000,
        bonusFixedMonths: 1,
        pvdRateEmp: 5,
        withholdingTax: 35000, // Real 50 Tawi
      },
    ];
    const deductions = {
      lifeInsurance: 30000,
      rmf: 20000,
    };

    const plan = calculateTaxPlan(companies, deductions);

    // Total income: 60,000 * 12 + 60,000 (bonus) = 780,000
    expect(plan.totalIncome).toBe(780000);

    // Expenses: 50% max 100,000
    expect(plan.expenses).toBe(100000);

    // Deductions: Personal (60k) + SS (9k) + PVD (36k) + Life (30k) + RMF (20k) = 155,000
    expect(plan.deductions).toBe(155000);

    // Net income: 780,000 - 100,000 - 155,000 = 525,000
    expect(plan.netIncome).toBe(525000);

    // Tax on 525k: 27,500 + (25,000 * 15%) = 27,500 + 3,750 = 31,250
    expect(plan.taxPayable).toBe(31250);

    // Withheld = 35,000, Tax = 31,250 -> Refund = 3,750
    expect(plan.isRefund).toBe(true);
    expect(plan.settlement).toBe(3750);
  });
});
