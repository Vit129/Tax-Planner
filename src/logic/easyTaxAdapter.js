import {
  expandMonths,
  getEmploymentRange,
  getRaises,
  setMonthSalary,
  setMonthOther,
  evalNumber,
} from '@vit129/thai-tax-core';
import {
  isCompanyActiveMonth,
  getCompanyBaseSalaryAtMonth,
  getCompanyMonthlySalaries,
  getCompanyLastSalary,
  getCompanyTotalIncome,
} from './companyLogic.js';
import { calculateTaxPlan, generateAiRmfPrompt } from './taxLogic.js';
import { buildRetirementPoolView, buildTaxWaterfall } from '@vit129/tax-ui';

// The shared package owns the monthly-income helpers; re-exported so the app and its tests import one place.
export {
  getStartSalary,
  getFirstRaise,
  setStartSalary,
  setFirstRaise,
  setYearlyOtherIncome,
} from '@vit129/tax-ui';

const AI_CHAT_URL_PREFIX = Object.freeze({
  gpt: 'https://chatgpt.com/?q=',
  claude: 'https://claude.ai/new?q=',
});

/**
 * Converts a Tax-Planner company object into the shared CoreCompany shape
 * expected by @vit129/tax-ui and @vit129/thai-tax-core (with sparse months{}).
 */
export function toCoreCompany(tpCompany) {
  const c = tpCompany || {};
  const startMonth = Math.max(1, Math.min(12, Math.round(evalNumber(c.startMonth)) || 1));
  const endMonth = Math.max(1, Math.min(12, Math.round(evalNumber(c.endMonth)) || 12));
  const salaries = getCompanyMonthlySalaries(c);

  const dense = salaries.map((sal, idx) => {
    const m = idx + 1;
    const ot = isCompanyActiveMonth(c, m)
      ? evalNumber(c.otMonthly?.[m] ?? c.otMonthly?.[String(m)])
      : 0;
    return {
      salary: sal,
      totalIncome: sal + ot,
    };
  });

  const months = {};
  dense.forEach((d, idx) => {
    const prev = idx > 0 ? dense[idx - 1] : null;
    if (!prev || prev.salary !== d.salary || prev.totalIncome !== d.totalIncome) {
      months[String(idx + 1)] = { salary: d.salary, totalIncome: d.totalIncome };
    }
  });

  const last = dense[11] || { salary: 0, totalIncome: 0 };
  const whRaw = String(c.withholdingTax ?? '').trim();
  const withholdingTax = whRaw === '' ? null : evalNumber(whRaw);

  const bonusFixMonths = evalNumber(c.bonusFixedMonths ?? c.bonusFixMonths);
  const bonusPerformance = evalNumber(c.bonusVariable) + evalNumber(c.bonusPerformance);
  const pvdEmpRate = evalNumber(c.pvdRateEmp ?? c.pvdEmpRate);
  const pvdCoRate = evalNumber(c.pvdRateCo ?? c.pvdCoRate);
  const compIncome = getCompanyTotalIncome(c);

  return {
    ...(c.id != null ? { id: c.id } : {}),
    name: c.name ?? '',
    months,
    monthlySalary: last.salary,
    totalMonthlyIncome: last.totalIncome,
    startMonth,
    endMonth,
    bonusFixMonths,
    bonusPerformance,
    bonusVariable: 0,
    pvdEmpRate,
    pvdCoRate,
    withholdingTax,
    compIncome,
  };
}

/**
 * Converts an edited shared CoreCompany back into Tax-Planner's saved company format.
 * Preserves unknown fields from previousTpCompany so saved localStorage data stays compatible.
 */
export function fromCoreCompany(core, previousTpCompany = {}) {
  const c = core || {};
  const prev = previousTpCompany || {};
  const dense = expandMonths(c);
  const range = getEmploymentRange(c);

  let startMonth;
  let endMonth;
  let baseSalary;
  let salaryAdjustments = [];
  const monthlyOverrides = {};
  const otMonthly = {};

  const prevWasEmpty =
    (prev.baseSalary === '' || prev.baseSalary === 0) &&
    (!prev.monthlyOverrides || Object.keys(prev.monthlyOverrides).length === 0);

  if (!range) {
    startMonth = Math.max(1, Math.min(12, Math.round(evalNumber(c.startMonth ?? prev.startMonth)) || 1));
    endMonth = Math.max(1, Math.min(12, Math.round(evalNumber(c.endMonth ?? prev.endMonth)) || 12));
    baseSalary = prev.baseSalary === 0 ? 0 : '';
  } else {
    startMonth = prevWasEmpty
      ? Math.max(range.start, Math.min(12, Math.round(evalNumber(c.startMonth)) || range.start))
      : range.start;
    endMonth = prevWasEmpty
      ? Math.max(startMonth, Math.min(range.end, Math.round(evalNumber(c.endMonth)) || range.end))
      : range.end;
    baseSalary = dense[startMonth - 1].salary;

    const raises = getRaises(c);
    salaryAdjustments = raises.map((r) => ({ month: r.month, salary: r.to }));

    for (let m = range.start; m <= range.end; m++) {
      const expectedBase = getCompanyBaseSalaryAtMonth({ baseSalary, salaryAdjustments }, m);
      const actualSalary = dense[m - 1].salary;
      if (actualSalary !== expectedBase) {
        monthlyOverrides[m] = actualSalary;
      }

      const extra = Math.max(0, Math.round(dense[m - 1].totalIncome - actualSalary));
      if (extra > 0) {
        otMonthly[m] = extra;
      }
    }
  }

  const bonusFixedMonths = evalNumber(c.bonusFixMonths ?? c.bonusFixedMonths);
  const bonusVariable = Math.round(evalNumber(c.bonusPerformance) + evalNumber(c.bonusVariable));
  const pvdRateEmp = evalNumber(c.pvdEmpRate ?? c.pvdRateEmp);
  const pvdRateCo = evalNumber(c.pvdCoRate ?? c.pvdRateCo);

  const whRaw = c.withholdingTax;
  const withholdingTax =
    whRaw === null || whRaw === undefined || String(whRaw).trim() === ''
      ? ''
      : evalNumber(whRaw);

  const rest = { ...prev };
  delete rest.months;
  delete rest.monthlySalary;
  delete rest.totalMonthlyIncome;
  delete rest.bonusFixMonths;
  delete rest.bonusPerformance;
  delete rest.pvdEmpRate;
  delete rest.pvdCoRate;
  delete rest.compIncome;

  return {
    ...rest,
    ...(c.id != null ? { id: c.id } : {}),
    name: c.name ?? prev.name ?? '',
    baseSalary,
    startMonth,
    endMonth,
    bonusFixedMonths,
    bonusVariable,
    pvdRateEmp,
    pvdRateCo,
    withholdingTax,
    salaryAdjustments,
    monthlyOverrides,
    otMonthly,
  };
}

/**
 * Creates a new Tax-Planner company entry when the user clicks "+ Add Company".
 * Uses a non-zero starting salary so @vit129/thai-tax-core range/month helpers operate on active months.
 */
export function createNextTpCompany(companies = [], defaultPrefix = '') {
  const list = Array.isArray(companies) ? companies : [];
  const last = list[list.length - 1] || {};
  const lastEnd = Math.max(1, Math.min(12, Math.round(evalNumber(last.endMonth)) || 12));
  const startMonth = lastEnd < 12 ? lastEnd + 1 : 1;
  const fallbackSalary = getCompanyLastSalary(last) || 45000;
  const idx = list.length + 1;

  return {
    name: defaultPrefix ? `${defaultPrefix} ${idx}` : '',
    baseSalary: String(fallbackSalary),
    startMonth,
    endMonth: 12,
    bonusFixedMonths: '0',
    bonusVariable: '0',
    pvdRateEmp: String(evalNumber(last.pvdRateEmp) || 0),
    pvdRateCo: String(evalNumber(last.pvdRateCo) || 0),
    withholdingTax: '',
    salaryAdjustments: [],
    monthlyOverrides: {},
    otMonthly: {},
  };
}

/**
 * Maps Tax-Planner deductions object to the shared @vit129/tax-ui deductions shape.
 */
export function toEasyDeductions(tpDeductions = {}) {
  const d = tpDeductions || {};
  return {
    spouse: Boolean(d.hasSpouse ?? d.spouse),
    parentsCount: evalNumber(d.parentsCount ?? d.parents),
    childrenCount: evalNumber(d.childrenCount ?? d.children),
    lifeInsurance: evalNumber(d.lifeInsurance),
    healthInsurance: evalNumber(d.healthInsurance),
    mortgageInterest: evalNumber(d.mortgageInterest),
    solarRooftop: evalNumber(d.solarRooftop),
    artSoftPower: evalNumber(d.artSoftPower),
    socialEnterprise: evalNumber(d.socialEnterprise),
    parentsHealthInsurance: evalNumber(d.parentsHealthInsurance),
    easyEReceipt: evalNumber(d.easyEReceipt),
    donation: evalNumber(d.donationGeneral ?? d.donation),
    rmf: evalNumber(d.rmf),
    thaiEsg: evalNumber(d.thaiEsg),
    pensionInsurance: evalNumber(d.pensionInsurance),
    // Tax-Planner calls the National Savings Fund (กอช.) `gpf`; the shared model and tax-core call it `nsf`.
    nsf: evalNumber(d.gpf ?? d.nsf),
  };
}

/**
 * Maps shared @vit129/tax-ui deductions back into Tax-Planner's deductions shape,
 * preserving any extra fields (e.g. pensionInsurance, gpf).
 */
export function fromEasyDeductions(easyDed = {}, prevTpDeductions = {}) {
  const e = easyDed || {};
  const prev = prevTpDeductions || {};
  return {
    ...prev,
    hasSpouse: Boolean(e.spouse ?? e.hasSpouse ?? prev.hasSpouse),
    parentsCount: Math.max(0, Math.min(4, Math.round(evalNumber(e.parentsCount ?? e.parents ?? prev.parentsCount)))),
    childrenCount: Math.max(0, Math.round(evalNumber(e.childrenCount ?? e.children ?? prev.childrenCount))),
    lifeInsurance: evalNumber(e.lifeInsurance ?? prev.lifeInsurance),
    healthInsurance: evalNumber(e.healthInsurance ?? prev.healthInsurance),
    mortgageInterest: evalNumber(e.mortgageInterest ?? prev.mortgageInterest),
    solarRooftop: evalNumber(e.solarRooftop ?? prev.solarRooftop),
    artSoftPower: evalNumber(e.artSoftPower ?? prev.artSoftPower),
    socialEnterprise: evalNumber(e.socialEnterprise ?? prev.socialEnterprise),
    parentsHealthInsurance: evalNumber(e.parentsHealthInsurance ?? prev.parentsHealthInsurance),
    easyEReceipt: evalNumber(e.easyEReceipt ?? prev.easyEReceipt),
    donationGeneral: evalNumber(e.donation ?? e.donationGeneral ?? prev.donationGeneral),
    rmf: evalNumber(e.rmf ?? prev.rmf),
    thaiEsg: evalNumber(e.thaiEsg ?? prev.thaiEsg),
    pensionInsurance: evalNumber(e.pensionInsurance ?? prev.pensionInsurance),
    gpf: evalNumber(e.nsf ?? e.gpf ?? prev.gpf),
  };
}

/**
 * Applies a single field edit from TaxDeductionGrid / TaxFundsStep onto Tax-Planner's deductions object.
 */
export function applyEasyDeductionUpdate(prevTpDeductions = {}, field, value) {
  const prev = prevTpDeductions || {};
  switch (field) {
    case 'spouse':
    case 'hasSpouse':
      return { ...prev, hasSpouse: Boolean(value) };
    case 'parents':
    case 'parentsCount':
      return { ...prev, parentsCount: Math.max(0, Math.min(4, Math.round(evalNumber(value)))) };
    case 'children':
    case 'childrenCount':
      return { ...prev, childrenCount: Math.max(0, Math.round(evalNumber(value))) };
    case 'donation':
    case 'donationGeneral':
      return { ...prev, donationGeneral: evalNumber(value) };
    case 'nsf':
    case 'gpf':
      return { ...prev, gpf: evalNumber(value) };
    default:
      return { ...prev, [field]: evalNumber(value) };
  }
}

/**
 * Builds the `inputs` prop expected by <TaxEasyApp /> from Tax-Planner state.
 */
export function toEasyInputs(tpCompanies = [], tpDeductions = {}) {
  const companies = (tpCompanies || []).map((c) => toCoreCompany(c));
  const deductions = toEasyDeductions(tpDeductions);

  return {
    companies,
    deductions,
    spouse: deductions.spouse,
    parents: deductions.parentsCount,
    children: deductions.childrenCount,
    lifeInsurance: deductions.lifeInsurance,
    healthInsurance: deductions.healthInsurance,
    mortgageInterest: deductions.mortgageInterest,
    solarRooftop: deductions.solarRooftop,
    artSoftPower: deductions.artSoftPower,
    socialEnterprise: deductions.socialEnterprise,
    parentsHealthInsurance: deductions.parentsHealthInsurance,
    easyEReceipt: deductions.easyEReceipt,
    donationNormal: deductions.donation,
    rmf: deductions.rmf,
    thaiEsg: deductions.thaiEsg,
  };
}

/**
 * Maps Tax-Planner's calculateTaxPlan output into the `plan` shape expected by <TaxEasyApp />.
 */
export function toEasyPlan(
  tpCompanies = [],
  tpDeductions = {},
  { extraRmf = 0, extraEsg = 0, foreignIncome = 0, otherIncome = [], basePlan = null, includeFull = true } = {}
) {
  const tpPlan =
    basePlan || calculateTaxPlan(tpCompanies, tpDeductions, foreignIncome, extraRmf, extraEsg, otherIncome);

  let fullRmfSaved = 0;
  let fullEsgSaved = 0;

  if (includeFull) {
    if (tpPlan.rmfRoom > 0) {
      const fullRmfPlan = calculateTaxPlan(
        tpCompanies,
        tpDeductions,
        foreignIncome,
        tpPlan.rmfRoom,
        0,
        otherIncome
      );
      fullRmfSaved = Math.max(0, tpPlan.taxPayable - fullRmfPlan.taxPayable);
    }
    if (tpPlan.esgRoom > 0) {
      const fullEsgPlan = calculateTaxPlan(
        tpCompanies,
        tpDeductions,
        foreignIncome,
        0,
        tpPlan.esgRoom,
        otherIncome
      );
      fullEsgSaved = Math.max(0, tpPlan.taxPayable - fullEsgPlan.taxPayable);
    }
  }

  const rmfBought = evalNumber(tpDeductions?.rmf);
  const esgBought = evalNumber(tpDeductions?.thaiEsg);

  const companyBreakdowns = (tpPlan.companyBreakdowns || []).map((bd) => ({
    ...bd,
    compIncome: bd.income,
    gross: bd.income,
    estimatedWithholding: bd.whEst,
  }));

  const settlementObj = {
    estimatedWithholding: tpPlan.totalWithholding,
    isRealWithholding: tpPlan.whRealAll,
    taxPayable: tpPlan.taxPayable,
    taxDiff: tpPlan.settlementDiff,
    taxStatus: tpPlan.isRefund ? 'refund' : 'pay_more',
    isRefund: tpPlan.isRefund,
    settlement: tpPlan.settlementDiff,
  };

  return {
    ...tpPlan,
    companyBreakdowns,
    bought: {
      rmf: rmfBought,
      esg: esgBought,
    },
    rmfBought,
    esgBought,
    limits: {
      rmf: { cap: tpPlan.rmfCap, used: tpPlan.rmfUsed, remain: tpPlan.rmfRoom },
      pvd: { cap: tpPlan.pvdCap, used: tpPlan.pvdUsed, remain: tpPlan.pvdRoom },
      thaiEsg: { cap: tpPlan.esgCap, used: tpPlan.esgUsed, remain: tpPlan.esgRoom },
      totalRetire: {
        cap: 500000,
        used: tpPlan.retirementPoolUsed,
        remain: tpPlan.retirementPoolRemain,
      },
    },
    current: {
      income: tpPlan.totalIncome,
      expenses: tpPlan.expenses,
      allowances: tpPlan.deductions,
      totalDeductions: tpPlan.deductions,
      net: tpPlan.netIncome,
      tax: tpPlan.taxPayable,
      items: tpPlan.deductionItems,
      effectiveRate: tpPlan.totalIncome > 0 ? (tpPlan.taxPayable / tpPlan.totalIncome) * 100 : 0,
    },
    settlement: settlementObj,
    trial: {
      net: tpPlan.netIncome,
      tax: tpPlan.taxPayable,
      marginalRate: tpPlan.marginalRate,
      settlement: settlementObj,
    },
    full: {
      rmfBuy: tpPlan.rmfRoom,
      rmfSaved: fullRmfSaved,
      esgBuy: tpPlan.esgRoom,
      esgSaved: fullEsgSaved,
    },
    advice: {
      rmfBuy: tpPlan.recommendedRmf,
      neededToDropBracket: tpPlan.neededToDropBracket,
    },
    autoSS: tpPlan.ssDeduction,
    pvdEmp: tpPlan.pvdUsed,
    pvdCoYear: tpPlan.pvdCompany,
    pool: buildRetirementPoolView({
      cap: 500000,
      parts: { rmf: tpPlan.rmfUsed, pvd: tpPlan.pvdUsed, pension: tpPlan.pensionUsed, nsf: tpPlan.gpfUsed },
      rmfCap: tpPlan.rmfCap,
      pvdCap: tpPlan.pvdCap,
      pvdCompany: tpPlan.pvdCompany,
    }),
    waterfall: buildTaxWaterfall({
      totalIncome: tpPlan.totalIncome,
      expenses: tpPlan.expenses,
      items: tpPlan.deductionItems,
      net: tpPlan.netIncome,
      tax: tpPlan.taxPayable,
    }),
  };
}

/**
 * Pure recalculate callback for @vit129/tax-ui's buildSimulatorModel.
 * Never mutates the base plan or headline refund.
 */
export function createEasySimulatorRecalculate(tpCompanies = [], tpDeductions = {}, foreignIncome = 0, otherIncome = []) {
  return ({ extraRmf = 0, extraEsg = 0 } = {}) =>
    toEasyPlan(tpCompanies, tpDeductions, {
      extraRmf,
      extraEsg,
      foreignIncome,
      otherIncome,
      includeFull: false,
    });
}

/**
 * Pure adapter for TaxFaqSection's buildAiPrompt callback, delegating to Tax-Planner's generateAiRmfPrompt.
 */
export function buildEasyAiPrompt(
  { bank = '', focus = '', hold = '', budget = 0, marginalRate = 0, monthsLeft = 0 } = {},
  { basePlan, taxYear } = {}
) {
  const effectiveBudget =
    budget > 0
      ? Math.round(budget)
      : Math.round(basePlan?.recommendedRmf || basePlan?.rmfRoom || 0);
  const rateVal = marginalRate || basePlan?.marginalRate || 0;
  const marginalRatePct = rateVal <= 1 ? Math.round(rateVal * 100) : Math.round(rateVal);

  return generateAiRmfPrompt({
    house: bank,
    focus,
    held: hold,
    budget: effectiveBudget,
    monthsLeft: taxYear?.monthsLeft ?? monthsLeft,
    ceYear: taxYear?.ce ?? 2026,
    beYear: taxYear?.be ?? 2569,
    marginalRatePct,
  });
}

/**
 * Builds the external AI provider URL for the Ask-AI buttons.
 */
export function buildAiChatUrl(provider, prompt) {
  const prefix = AI_CHAT_URL_PREFIX[provider];
  if (!prefix) {
    throw new Error(`Unknown AI chat provider: ${provider}`);
  }
  return prefix + encodeURIComponent(prompt || '');
}
