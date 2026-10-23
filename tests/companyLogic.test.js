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
    // Jan-Mar should be 0
    expect(salaries[0]).toBe(0);
    expect(salaries[1]).toBe(0);
    expect(salaries[2]).toBe(0);
    // Apr-Dec should be 75000
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
        { month: 4, salary: 70000 }, // Raise in April
        { month: 10, salary: 75000 }, // Raise in October
      ],
    };
    const salaries = getCompanyMonthlySalaries(co);
    // Jan-Mar: 65,000 (3 months) = 195,000
    expect(salaries[0]).toBe(65000);
    expect(salaries[2]).toBe(65000);

    // Apr-Sep: 70,000 (6 months) = 420,000
    expect(salaries[3]).toBe(70000);
    expect(salaries[8]).toBe(70000);

    // Oct-Dec: 75,000 (3 months) = 225,000
    expect(salaries[9]).toBe(75000);
    expect(salaries[11]).toBe(75000);

    const expectedTotal = 65000 * 3 + 70000 * 6 + 75000 * 3;
    expect(getCompanyAnnualSalary(co)).toBe(expectedTotal);
    expect(getCompanyLastSalary(co)).toBe(75000);
  });

  it('calculates fixed bonus using the last active salary', () => {
    const co = {
      startMonth: 1,
      endMonth: 12,
      baseSalary: 60000,
      salaryAdjustments: [{ month: 6, salary: 80000 }],
      bonusFixedMonths: 2,
    };
    // Last salary is 80,000, so 2 months bonus = 160,000
    expect(getCompanyFixedBonus(co)).toBe(160000);
    expect(getCompanyTotalBonus(co)).toBe(160000);
  });

  it('calculates PVD contribution based on adjusted monthly salaries', () => {
    const co = {
      startMonth: 1,
      endMonth: 12,
      baseSalary: 100000,
      salaryAdjustments: [{ month: 7, salary: 120000 }], // 6 months @ 100k, 6 months @ 120k
      pvdRateEmp: 5,
    };
    // 5% of 100k = 5,000/mo * 6 = 30,000
    // 5% of 120k = 6,000/mo * 6 = 36,000
    // Total PVD = 66,000
    expect(getCompanyPvdEmployee(co)).toBe(66000);
  });

  it('calculates social security properly capped per month', () => {
    const co = {
      startMonth: 1,
      endMonth: 12,
      baseSalary: 50000, // Above 15,000 cap
    };
    // 750/mo * 12 = 9,000
    expect(getCompanySocialSecurity(co)).toBe(9000);
  });

  it('estimates employer withholding tax reasonably', () => {
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
  });
});
