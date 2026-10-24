import { DEDUCTION_RULES } from '../config/taxRules.js';
import { evalNumber } from './evalExpression.js';

/**
 * Returns whether month `m` (1..12) is within the company's active period.
 */
export function isCompanyActiveMonth(company, m) {
  const start = Math.max(1, Math.min(12, Math.round(evalNumber(company?.startMonth)) || 1));
  const end = Math.max(1, Math.min(12, Math.round(evalNumber(company?.endMonth)) || 12));
  return m >= start && m <= end;
}

/**
 * Returns base salary at month `m` (1..12) accounting for carry-forward salaryAdjustments,
 * before any single-month override.
 */
export function getCompanyBaseSalaryAtMonth(company, m) {
  let currentSalary = evalNumber(company?.baseSalary);
  const adjustments = Array.isArray(company?.salaryAdjustments)
    ? [...company.salaryAdjustments].sort((a, b) => a.month - b.month)
    : [];
  for (const adj of adjustments) {
    if (adj.month <= m && adj.salary != null) {
      currentSalary = evalNumber(adj.salary);
    }
  }
  return currentSalary;
}

/**
 * Returns an array of 12 numbers representing salary for each month (index 0 = Jan, 11 = Dec).
 * Respects startMonth, endMonth, carry-forward salaryAdjustments, and single-month overrides (monthlyOverrides).
 */
export function getCompanyMonthlySalaries(company) {
  const start = Math.max(1, Math.min(12, Math.round(evalNumber(company?.startMonth)) || 1));
  const end = Math.max(1, Math.min(12, Math.round(evalNumber(company?.endMonth)) || 12));
  const overrides = company?.monthlyOverrides || {};

  const salaries = new Array(12).fill(0);

  for (let m = 1; m <= 12; m++) {
    if (m >= start && m <= end) {
      const ov = overrides[m] ?? overrides[String(m)];
      if (ov != null && ov !== '') {
        salaries[m - 1] = evalNumber(ov);
      } else {
        salaries[m - 1] = getCompanyBaseSalaryAtMonth(company, m);
      }
    } else {
      salaries[m - 1] = 0;
    }
  }

  return salaries;
}

/**
 * Total salary earned at this company throughout the active months.
 */
export function getCompanyAnnualSalary(company) {
  const salaries = getCompanyMonthlySalaries(company);
  return salaries.reduce((acc, s) => acc + s, 0);
}

/**
 * Last active salary earned (used as the base for fixed bonus calculation).
 */
export function getCompanyLastSalary(company) {
  const salaries = getCompanyMonthlySalaries(company);
  for (let m = 12; m >= 1; m--) {
    if (isCompanyActiveMonth(company, m)) {
      return salaries[m - 1];
    }
  }
  return evalNumber(company?.baseSalary);
}

/**
 * Fixed bonus amount = (last active salary) * (bonus fixed months).
 */
export function getCompanyFixedBonus(company) {
  const lastSalary = getCompanyLastSalary(company);
  const months = evalNumber(company?.bonusFixedMonths);
  return Math.round(lastSalary * months);
}

/**
 * Total bonus = fixed bonus + variable/performance bonus.
 */
export function getCompanyTotalBonus(company) {
  const fixed = getCompanyFixedBonus(company);
  const variable = evalNumber(company?.bonusVariable);
  return fixed + variable;
}

/**
 * Extra income (OT, commission, shift allowance) across active months + annual extraIncome.
 */
export function getCompanyExtraIncome(company) {
  let total = evalNumber(company?.extraIncome);
  if (company?.otMonthly && typeof company.otMonthly === 'object') {
    for (let m = 1; m <= 12; m++) {
      if (isCompanyActiveMonth(company, m)) {
        total += evalNumber(company.otMonthly[m] || company.otMonthly[String(m)]);
      }
    }
  }
  return total;
}

/**
 * Total assessable income from this company = Annual Salary + Total Bonus + Extra Income.
 */
export function getCompanyTotalIncome(company) {
  return (
    getCompanyAnnualSalary(company) +
    getCompanyTotalBonus(company) +
    getCompanyExtraIncome(company)
  );
}

/**
 * PVD employee contribution from this company.
 */
export function getCompanyPvdEmployee(company) {
  const rate = evalNumber(company?.pvdRateEmp) / 100;
  if (rate <= 0) return 0;
  const salaries = getCompanyMonthlySalaries(company);
  return Math.round(salaries.reduce((acc, s) => acc + s * rate, 0));
}

/**
 * PVD company contribution from this company.
 */
export function getCompanyPvdCompany(company) {
  const rate = evalNumber(company?.pvdRateCo) / 100;
  if (rate <= 0) return 0;
  const salaries = getCompanyMonthlySalaries(company);
  return Math.round(salaries.reduce((acc, s) => acc + s * rate, 0));
}

/**
 * Social security contribution for active months.
 */
export function getCompanySocialSecurity(company) {
  const salaries = getCompanyMonthlySalaries(company);
  return salaries.reduce((acc, s) => {
    if (s <= 0) return acc;
    return acc + Math.min(s * 0.05, DEDUCTION_RULES.SS_MONTHLY_MAX);
  }, 0);
}

/**
 * Estimates employer withholding tax (ภ.ง.ด. 1) for the period worked at this company.
 */
export function estimateCompanyWithholding(company, calculateTaxFn) {
  const start = Math.max(1, Math.min(12, Math.round(evalNumber(company?.startMonth)) || 1));
  const end = Math.max(1, Math.min(12, Math.round(evalNumber(company?.endMonth)) || 12));
  const monthsWorked = Math.max(1, end - start + 1);

  const totalIncome = getCompanyTotalIncome(company);
  if (totalIncome <= 0) return 0;

  const ss = getCompanySocialSecurity(company);
  const pvd = getCompanyPvdEmployee(company);

  const annualFactor = 12 / monthsWorked;
  const annualizedIncome = totalIncome * annualFactor;
  const annualizedExpenses = Math.min(annualizedIncome * DEDUCTION_RULES.EXPENSE_RATE, DEDUCTION_RULES.EXPENSE_CAP);
  const annualizedSs = ss * annualFactor;
  const annualizedPvd = pvd * annualFactor;
  const personalDeduction = DEDUCTION_RULES.PERSONAL;

  const annualizedNet = Math.max(
    0,
    annualizedIncome - annualizedExpenses - personalDeduction - annualizedSs - annualizedPvd
  );

  const annualizedTax = calculateTaxFn(annualizedNet);
  return Math.ceil(annualizedTax * (monthsWorked / 12));
}

/**
 * Computes complete per-company summary object.
 */
export function getCompanyBreakdown(company, calculateTaxFn) {
  const salary = getCompanyAnnualSalary(company);
  const extra = getCompanyExtraIncome(company);
  const bonus = getCompanyTotalBonus(company);
  const income = salary + extra + bonus;
  const pvd = getCompanyPvdEmployee(company);
  const pvdCo = getCompanyPvdCompany(company);
  const ss = getCompanySocialSecurity(company);
  const whEst = estimateCompanyWithholding(company, calculateTaxFn);
  const whRaw = String(company?.withholdingTax ?? '').trim();
  const whReal = whRaw !== '';
  const wh = whReal ? evalNumber(whRaw) : whEst;

  return {
    salary,
    extra,
    bonus,
    income,
    pvd,
    pvdCo,
    ss,
    whEst,
    whReal,
    wh,
  };
}
