import { describe, it, expect } from 'vitest';
import {
  calculateProgressiveTax,
  getMarginalTaxRate,
  getBracketFloor,
  calculateTaxPlan,
  generateAiRmfPrompt,
} from '../src/logic/taxLogic.js';

describe('taxLogic', () => {
  it('calculates tax brackets according to Thai Revenue rules', () => {
    expect(calculateProgressiveTax(150000)).toBe(0);
    expect(calculateProgressiveTax(300000)).toBe(7500);
    expect(calculateProgressiveTax(500000)).toBe(27500);
    expect(calculateProgressiveTax(750000)).toBe(65000);
    expect(calculateProgressiveTax(1000000)).toBe(115000);
  });

  it('determines marginal tax rate and bracket floor correctly', () => {
    expect(getMarginalTaxRate(120000)).toBe(0);
    expect(getMarginalTaxRate(200000)).toBe(0.05);
    expect(getMarginalTaxRate(400000)).toBe(0.10);
    expect(getMarginalTaxRate(600000)).toBe(0.15);
    expect(getMarginalTaxRate(900000)).toBe(0.20);

    expect(getBracketFloor(525000)).toBe(500000);
    expect(getBracketFloor(300000)).toBe(150000);
  });

  it('calculates full tax plan, sub-caps, and refund/payable accurately', () => {
    const companies = [
      {
        name: 'Alpha Tech',
        startMonth: 1,
        endMonth: 12,
        baseSalary: 60000,
        bonusFixedMonths: 1,
        pvdRateEmp: 5,
        pvdRateCo: 5,
        withholdingTax: 35000,
      },
    ];
    const deductions = {
      lifeInsurance: 30000,
      rmf: 20000,
    };

    const plan = calculateTaxPlan(companies, deductions);

    expect(plan.totalIncome).toBe(780000);
    expect(plan.expenses).toBe(100000);
    expect(plan.deductions).toBe(156500); // Personal 60k + SS 10.5k (2569 ceiling) + PVD 36k + Life 30k + RMF 20k
    expect(plan.netIncome).toBe(523500);
    expect(plan.taxPayable).toBe(31025);
    expect(plan.isRefund).toBe(true);
    expect(plan.settlement).toBe(3975);

    // Retirement pool and sub-caps
    expect(plan.rmfCap).toBe(234000); // 30% of 780,000
    expect(plan.pvdCap).toBe(117000); // 15% of 780,000
    expect(plan.pvdUsed).toBe(36000);
    expect(plan.retirementPoolUsed).toBe(56000);
    expect(plan.retirementPoolRemain).toBe(444000);
    expect(plan.recommendedRmf).toBe(23501); // 523,500 - 500,000 + 1
  });

  it('generates Thai AI RMF prompt with portfolio holdings and budget', () => {
    const prompt = generateAiRmfPrompt({
      house: 'SCB',
      focus: 'หุ้นโลก',
      held: '',
      budget: 25000,
      monthsLeft: 3,
      ceYear: 2026,
      beYear: 2569,
      marginalRatePct: 15,
    });
    expect(prompt).toContain('ของ บลจ. SCB');
    expect(prompt).toContain('฿25,000');
    expect(prompt).toContain('15%');
    expect(prompt).toContain('SCBRMS&P500');
    expect(prompt).toContain('อยากเน้น: หุ้นโลก');
  });
});
