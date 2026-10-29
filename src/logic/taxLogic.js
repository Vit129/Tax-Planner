import {
  TAX_BRACKETS,
  DEDUCTION_RULES,
  SAMPLE_RMF_FUNDS,
  SAMPLE_PVD_FUNDS,
} from '../config/taxRules.js';
import STRINGS from '../config/strings.js';
import {
  evalNumber,
  generateAiRmfPrompt as generateCoreAiRmfPrompt,
} from '@vit129/thai-tax-core';
import {
  getCompanySocialSecurity,
  getCompanyPvdEmployee,
  getCompanyBreakdown,
} from './companyLogic.js';

/**
 * Calculates progressive personal income tax (90/91).
 */
export function calculateProgressiveTax(netIncome) {
  if (netIncome <= 150000) return 0;

  let totalTax = 0;
  let prevMax = 0;

  for (let i = 0; i < TAX_BRACKETS.length; i++) {
    const bracket = TAX_BRACKETS[i];
    if (netIncome > prevMax) {
      const taxableInRange = Math.min(netIncome, bracket.max) - prevMax;
      totalTax += taxableInRange * bracket.rate;
    }
    prevMax = bracket.max;
  }

  return Math.round(totalTax);
}

/**
 * Returns marginal tax rate for given net income (e.g., 0.15 for 15%).
 */
export function getMarginalTaxRate(netIncome) {
  for (let i = 0; i < TAX_BRACKETS.length; i++) {
    if (netIncome <= TAX_BRACKETS[i].max) {
      return TAX_BRACKETS[i].rate;
    }
  }
  return 0.35;
}

/**
 * Returns the floor (upper bound of previous bracket) for given net income.
 */
export function getBracketFloor(netIncome) {
  let prevMax = 0;
  for (let i = 0; i < TAX_BRACKETS.length; i++) {
    if (netIncome <= TAX_BRACKETS[i].max) {
      return prevMax;
    }
    prevMax = TAX_BRACKETS[i].max;
  }
  return prevMax;
}

/**
 * Calculates itemized deductions and retirement pool limits according to Thai Revenue Dept rules.
 */
export function calculateAllDeductions(
  companies,
  deductionsInput,
  totalIncome,
  extraRmf = 0,
  extraEsg = 0,
  labels = STRINGS.DEDUCTION_ITEM_LABELS
) {
  const d = deductionsInput || {};
  const items = [];
  const add = (label, amount) => {
    if (amount > 0) items.push({ label, amount: Math.round(amount) });
  };

  // 1. Personal & Family
  add(labels.personal, DEDUCTION_RULES.PERSONAL);
  if (d.hasSpouse) add(labels.spouse, DEDUCTION_RULES.SPOUSE);

  const child1Count = evalNumber(d.childrenCount);
  const child2Count = evalNumber(d.children2018PlusCount);
  const childTotal = child1Count * DEDUCTION_RULES.CHILD_1 + child2Count * DEDUCTION_RULES.CHILD_2_PLUS;
  add(labels.children, childTotal);

  const parentsCount = evalNumber(d.parentsCount);
  add(labels.parents, parentsCount * DEDUCTION_RULES.PARENT);

  const disabledCareCount = evalNumber(d.disabledCareCount);
  add(labels.disabledCare, disabledCareCount * DEDUCTION_RULES.DISABLED_CARE);

  const antenatal = Math.min(evalNumber(d.antenatalCare), DEDUCTION_RULES.ANTENATAL_CAP);
  add(labels.antenatalCare, antenatal);

  // 2. Social Security
  const totalSsRaw = (companies || []).reduce((acc, c) => acc + getCompanySocialSecurity(c), 0);
  const ssDeduction = Math.min(totalSsRaw, DEDUCTION_RULES.SS_ANNUAL_CAP);
  add(labels.socialSecurity, ssDeduction);

  // 3. Life & Health Insurance
  const generalLife = evalNumber(d.lifeInsurance);
  const healthIns = Math.min(evalNumber(d.healthInsurance), DEDUCTION_RULES.HEALTH_SUB_CAP);
  const lifeAndHealthBase = Math.min(generalLife + healthIns, DEDUCTION_RULES.LIFE_HEALTH_CAP);
  const unusedGeneralLife = Math.max(0, DEDUCTION_RULES.LIFE_HEALTH_CAP - lifeAndHealthBase);

  // Pension life insurance can overflow into unused general life insurance room (up to 100k)
  const pensionLife = evalNumber(d.pensionInsurance);
  const pensionOverflowToLife = Math.min(pensionLife, unusedGeneralLife);
  const lifeAndHealthTotal = lifeAndHealthBase + pensionOverflowToLife;
  add(labels.lifeHealthInsurance, lifeAndHealthTotal);

  const spouseLife = Math.min(evalNumber(d.spouseLifeInsurance), DEDUCTION_RULES.SPOUSE_LIFE_CAP);
  add(labels.spouseLifeInsurance, spouseLife);

  const parentsHealth = Math.min(evalNumber(d.parentsHealthInsurance), DEDUCTION_RULES.PARENT_HEALTH_CAP);
  add(labels.parentHealthInsurance, parentsHealth);

  // 4. Retirement Pool (RMF + PVD + Pension Life Remainder + GPF/NSF)
  const autoPvd = (companies || []).reduce((acc, c) => acc + getCompanyPvdEmployee(c), 0);
  const pvdAmount = d.pvdManual != null && d.pvdManual !== '' ? evalNumber(d.pvdManual) : autoPvd;
  const pvdCap = Math.min(totalIncome * DEDUCTION_RULES.PVD_RATE, DEDUCTION_RULES.RETIREMENT_POOL_CAP);
  const pvdAllowed = Math.min(pvdAmount, pvdCap);
  const pvdRoom = Math.max(0, pvdCap - pvdAllowed);

  const rmfCap = Math.min(totalIncome * DEDUCTION_RULES.RMF_RATE, DEDUCTION_RULES.RETIREMENT_POOL_CAP);
  const rmfInput = evalNumber(d.rmf) + extraRmf;
  const rmfAllowed = Math.min(rmfInput, rmfCap);

  const pensionRemainder = Math.max(0, pensionLife - pensionOverflowToLife);
  const pensionAllowed = Math.min(
    pensionRemainder,
    totalIncome * DEDUCTION_RULES.PENSION_INSURANCE_RATE,
    DEDUCTION_RULES.PENSION_INSURANCE_CAP
  );

  const gpf = Math.min(evalNumber(d.gpf), DEDUCTION_RULES.GPF_CAP);

  const rawRetirement = pvdAllowed + rmfAllowed + pensionAllowed + gpf;
  const retirementUsed = Math.min(rawRetirement, DEDUCTION_RULES.RETIREMENT_POOL_CAP);
  const poolRemain = Math.max(0, DEDUCTION_RULES.RETIREMENT_POOL_CAP - retirementUsed);
  add(labels.retirementGroup, retirementUsed);

  // 5. Thai ESG (Separate 300,000 cap)
  const esgCap = Math.min(totalIncome * DEDUCTION_RULES.THAI_ESG_RATE, DEDUCTION_RULES.THAI_ESG_CAP);
  const esgInput = evalNumber(d.thaiEsg) + extraEsg;
  const esgAllowed = Math.min(esgInput, esgCap);
  add(labels.thaiEsg, esgAllowed);

  // 6. Stimulus & Mortgage Interest
  const mortgage = Math.min(evalNumber(d.mortgageInterest), DEDUCTION_RULES.MORTGAGE_INTEREST_CAP);
  add(labels.mortgageInterest, mortgage);

  const solar = Math.min(evalNumber(d.solarRooftop), DEDUCTION_RULES.SOLAR_ROOFTOP_CAP);
  add(labels.solarRooftop, solar);

  const easyReceipt = Math.min(evalNumber(d.easyEReceipt), DEDUCTION_RULES.EASY_E_RECEIPT_CAP);
  add(labels.easyEReceipt, easyReceipt);

  // Subtotal before donations
  const baseDeductions = items.reduce((acc, item) => acc + item.amount, 0);
  const standardExpenses = Math.min(totalIncome * DEDUCTION_RULES.EXPENSE_RATE, DEDUCTION_RULES.EXPENSE_CAP);
  const netBeforeDonations = Math.max(0, totalIncome - standardExpenses - baseDeductions);

  // 7. Donations (Capped at 10% of net income before donations)
  const donationGeneral = evalNumber(d.donationGeneral);
  const donationEdu = evalNumber(d.donationEducation) * 2;
  const maxDonationAllowed = netBeforeDonations * DEDUCTION_RULES.DONATION_MAX_RATE;
  const actualDonations = Math.min(donationGeneral + donationEdu, maxDonationAllowed);
  add(labels.donation, actualDonations);

  const politicalParty = Math.min(evalNumber(d.donationParty), DEDUCTION_RULES.POLITICAL_PARTY_CAP);
  add(labels.donationParty, politicalParty);

  const totalDeductions = items.reduce((acc, item) => acc + item.amount, 0);

  // Remaining rooms for RMF and ThaiESG
  const rmfRoom = Math.max(
    0,
    Math.min(
      rmfCap - rmfAllowed,
      DEDUCTION_RULES.RETIREMENT_POOL_CAP - (pvdAllowed + pensionAllowed + gpf + rmfAllowed)
    )
  );

  const esgRoom = Math.max(0, esgCap - esgAllowed);

  return {
    items,
    totalDeductions,
    standardExpenses,
    ssDeduction,
    pvdAmount,
    pvdCap,
    pvdAllowed,
    pvdRoom,
    rmfCap,
    rmfAllowed,
    rmfRoom,
    pensionAllowed,
    gpfAllowed: gpf,
    retirementUsed,
    poolRemain,
    esgCap,
    esgAllowed,
    esgRoom,
  };
}

/**
 * Master tax calculation function.
 */
export function calculateTaxPlan(companies, deductionsInput, foreignIncome = 0, extraRmf = 0, extraEsg = 0) {
  const cos = companies || [];
  const companyBreakdowns = cos.map((c) => getCompanyBreakdown(c, calculateProgressiveTax));
  const domesticIncome = companyBreakdowns.reduce((acc, c) => acc + c.income, 0);
  const totalIncome = domesticIncome + evalNumber(foreignIncome);

  const deductions = calculateAllDeductions(cos, deductionsInput, totalIncome, extraRmf, extraEsg);
  const netIncome = Math.max(0, totalIncome - deductions.standardExpenses - deductions.totalDeductions);

  const taxPayable = calculateProgressiveTax(netIncome);
  const marginalRate = getMarginalTaxRate(netIncome);
  const bracketFloor = getBracketFloor(netIncome);
  const neededToDropBracket = marginalRate > 0 ? Math.max(0, netIncome - bracketFloor) + 1 : 0;
  const recommendedRmf =
    marginalRate > 0 && neededToDropBracket > 0 && neededToDropBracket <= deductions.rmfRoom
      ? neededToDropBracket
      : 0;

  const totalWithholding = companyBreakdowns.reduce((acc, c) => acc + c.wh, 0);
  const whRealAll = companyBreakdowns.length > 0 && companyBreakdowns.every((c) => c.whReal);

  const settlementDiff = totalWithholding - taxPayable;
  const isRefund = settlementDiff >= 0;

  return {
    companyBreakdowns,
    domesticIncome,
    foreignIncome: evalNumber(foreignIncome),
    totalIncome,
    expenses: deductions.standardExpenses,
    deductions: deductions.totalDeductions,
    deductionItems: deductions.items,
    ssDeduction: deductions.ssDeduction,
    netIncome,
    taxPayable,
    marginalRate,
    bracketFloor,
    neededToDropBracket,
    recommendedRmf,
    totalWithholding,
    whRealAll,
    settlementDiff,
    settlement: Math.abs(settlementDiff),
    isRefund,
    rmfCap: deductions.rmfCap,
    rmfUsed: deductions.rmfAllowed,
    rmfRoom: deductions.rmfRoom,
    pvdCap: deductions.pvdCap,
    pvdUsed: deductions.pvdAllowed,
    pvdRoom: deductions.pvdRoom,
    pensionUsed: deductions.pensionAllowed,
    gpfUsed: deductions.gpfAllowed,
    retirementPoolUsed: deductions.retirementUsed,
    retirementPoolRemain: deductions.poolRemain,
    esgCap: deductions.esgCap,
    esgUsed: deductions.esgAllowed,
    esgRoom: deductions.esgRoom,
    pvdEmployee: companyBreakdowns.reduce((acc, c) => acc + c.pvd, 0),
    pvdCompany: companyBreakdowns.reduce((acc, c) => acc + c.pvdCo, 0),
  };
}

/**
 * Pure function to compute tax year metadata and remaining months for DCA.
 */
export function getTaxYearMetadata(now = new Date()) {
  const ce = now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1;
  const be = ce + 543;
  const fileBe = be + 1;
  const monthsLeft =
    now.getFullYear() === ce ? 12 - now.getMonth() : now.getFullYear() < ce ? 12 : 0;
  return { ce, be, fileBe, monthsLeft };
}

/**
 * Pure function to generate the AI prompt for RMF recommendations via @vit129/thai-tax-core.
 */
export function generateAiRmfPrompt({
  house = '',
  focus = '',
  held = '',
  budget = 0,
  monthsLeft = 0,
  ceYear = 2026,
  beYear = 2569,
  marginalRatePct = 0,
  rmfFunds = SAMPLE_RMF_FUNDS,
  pvdFunds = SAMPLE_PVD_FUNDS,
}) {
  return generateCoreAiRmfPrompt({
    house,
    focus,
    held,
    budget,
    monthsLeft,
    ceYear,
    beYear,
    marginalRatePct,
    rmfFunds,
    pvdFunds,
  });
}
