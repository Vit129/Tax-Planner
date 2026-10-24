import { describe, it, expect } from 'vitest';
import {
  getCompanyMonthlySalaries,
  getCompanyAnnualSalary,
  getCompanyLastSalary,
  getCompanyFixedBonus,
  getCompanyTotalBonus,
  getCompanyExtraIncome,
  getCompanyTotalIncome,
  getCompanyPvdEmployee,
  getCompanySocialSecurity,
  estimateCompanyWithholding,
  getCompanyBreakdown,
} from '../src/logic/companyLogic.js';
import { calculateProgressiveTax } from '../src/logic/taxLogic.js';

describe('companyLogic', () => {
  it('calculates 12 months with fixed base salary correctly', () => {
    const co = {
      startMonth: 1,
      endMonth: 12,
      baseSalary: 65000,
    };
    const salaries = getCompanyMonthlySalaries(co);
    expect(salaries).toHaveLength(12);
    expect(salaries.every(s => s === 65000)).toBe(true);
    expect(getCompanyAnnualSalary(co)).toBe(65000 * 12);
  });

  it('handles mid-year start (e.g. April to Dec = 9 months)', () => {
    const co = {
      startMonth: 4,
      endMonth: 12,
      baseSalary: 75000,
    };
    const salaries = getCompanyMonthlySalaries(co);
    expect(salaries[0]).toBe(0);
    expect(salaries[1]).toBe(0);
    expect(salaries[2]).toBe(0);
    expect(salaries[3]).toBe(75000);
    expect(salaries[11]).toBe(75000);
    expect(getCompanyAnnualSalary(co)).toBe(75000 * 9);
  });

  it('handles mid-year salary adjustment with carry-forward', () => {
    const co = {
      startMonth: 1,
      endMonth: 12,
      baseSalary: 65000,
      salaryAdjustments: [
        { month: 4, salary: 70000 },
        { month: 10, salary: 75000 },
      ],
    };
    const salaries = getCompanyMonthlySalaries(co);
    expect(salaries[0]).toBe(65000);
    expect(salaries[2]).toBe(65000);
    expect(salaries[3]).toBe(70000);
    expect(salaries[8]).toBe(70000);
    expect(salaries[9]).toBe(75000);
    expect(salaries[11]).toBe(75000);

    const expectedTotal = 65000 * 3 + 70000 * 6 + 75000 * 3;
    expect(getCompanyAnnualSalary(co)).toBe(expectedTotal);
    expect(getCompanyLastSalary(co)).toBe(75000);
  });

  it('supports single-month salary overrides without affecting subsequent months', () => {
    const co = {
      startMonth: 1,
      endMonth: 12,
      baseSalary: 50000,
      monthlyOverrides: { 5: 25000 },
      otMonthly: { 5: 4000 },
    };
    const salaries = getCompanyMonthlySalaries(co);
    expect(salaries[4]).toBe(25000); // May overridden
    expect(salaries[5]).toBe(50000); // June back to base
    expect(getCompanyExtraIncome(co)).toBe(4000);
  });

  it('calculates fixed bonus using the last active salary', () => {
    const co = {
      startMonth: 1,
      endMonth: 12,
      baseSalary: 60000,
      salaryAdjustments: [{ month: 6, salary: 80000 }],
      bonusFixedMonths: 2,
    };
    expect(getCompanyFixedBonus(co)).toBe(160000);
    expect(getCompanyTotalBonus(co)).toBe(160000);
  });

  it('calculates PVD contribution based on adjusted monthly salaries', () => {
    const co = {
      startMonth: 1,
      endMonth: 12,
      baseSalary: 100000,
      salaryAdjustments: [{ month: 7, salary: 120000 }],
      pvdRateEmp: 5,
    };
    expect(getCompanyPvdEmployee(co)).toBe(66000);
  });

  it('calculates social security properly capped per month', () => {
    const co = {
      startMonth: 1,
      endMonth: 12,
      baseSalary: 50000,
    };
    expect(getCompanySocialSecurity(co)).toBe(9000);
  });

  it('estimates employer withholding tax and breakdown accurately', () => {
    const co = {
      startMonth: 1,
      endMonth: 12,
      baseSalary: 80000,
      bonusFixedMonths: 1,
      pvdRateEmp: 5,
    };
    const wh = estimateCompanyWithholding(co, calculateProgressiveTax);
    expect(wh).toBeGreaterThan(0);
    expect(wh).toBeLessThan(getCompanyTotalIncome(co));

    const bd = getCompanyBreakdown(co, calculateProgressiveTax);
    expect(bd.whReal).toBe(false);
    expect(bd.wh).toBe(wh);
  });
});
