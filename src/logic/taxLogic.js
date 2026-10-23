import { TAX_BRACKETS, DEDUCTION_RULES } from '../config/taxRules.js';
import { evalNumber } from './evalExpression.js';
import {
  getCompanyTotalIncome,
  getCompanySocialSecurity,
  getCompanyPvdEmployee,
  getCompanyPvdCompany,
  estimateCompanyWithholding,
} from './companyLogic.js';

/**
 * Calculates progressive personal income tax (ภ.ง.ด. 90/91).
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
 * Calculates itemized deductions and retirement pool limits according to 2026 Thai Revenue Dept rules.
 */
export function calculateAllDeductions(companies, deductionsInput, totalIncome, extraRmf = 0, extraEsg = 0) {
  const d = deductionsInput || {};
  const items = [];
  const add = (label, amount) => {
    if (amount > 0) items.push({ label, amount: Math.round(amount) });
  };

  // 1. Personal & Family
  add('ผู้มีเงินได้ (ตนเอง)', DEDUCTION_RULES.PERSONAL);
  if (d.hasSpouse) add('คู่สมรส (ไม่มีเงินได้)', DEDUCTION_RULES.SPOUSE);

  const child1Count = evalNumber(d.childrenCount);
  const child2Count = evalNumber(d.children2018PlusCount);
  const childTotal = child1Count * DEDUCTION_RULES.CHILD_1 + child2Count * DEDUCTION_RULES.CHILD_2_PLUS;
  add('บุตร', childTotal);

  const parentsCount = evalNumber(d.parentsCount);
  add('บิดามารดา', parentsCount * DEDUCTION_RULES.PARENT);

  const disabledCareCount = evalNumber(d.disabledCareCount);
  add('ดูแลผู้พิการ / ทุพพลภาพ', disabledCareCount * DEDUCTION_RULES.DISABLED_CARE);

  const antenatal = Math.min(evalNumber(d.antenatalCare), DEDUCTION_RULES.ANTENATAL_CAP);
  add('ฝากครรภ์และคลอดบุตร', antenatal);

  // 2. Social Security
  const totalSsRaw = (companies || []).reduce((acc, c) => acc + getCompanySocialSecurity(c), 0);
  const ssDeduction = Math.min(totalSsRaw, DEDUCTION_RULES.SS_ANNUAL_CAP);
  add('ประกันสังคม', ssDeduction);

  // 3. Life & Health Insurance
  const generalLife = evalNumber(d.lifeInsurance);
  const healthIns = Math.min(evalNumber(d.healthInsurance), DEDUCTION_RULES.HEALTH_SUB_CAP);
  const lifeAndHealth = Math.min(generalLife + healthIns, DEDUCTION_RULES.LIFE_HEALTH_CAP);
  add('เบี้ยประกันชีวิตและสุขภาพ', lifeAndHealth);

  const spouseLife = Math.min(evalNumber(d.spouseLifeInsurance), DEDUCTION_RULES.SPOUSE_LIFE_CAP);
  add('เบี้ยประกันชีวิตคู่สมรส', spouseLife);

  const parentsHealth = Math.min(evalNumber(d.parentsHealthInsurance), DEDUCTION_RULES.PARENT_HEALTH_CAP);
  add('เบี้ยประกันสุขภาพบิดามารดา', parentsHealth);

  // 4. Retirement Pool (RMF + PVD + Pension Life + GPF + NSF)
  const autoPvd = (companies || []).reduce((acc, c) => acc + getCompanyPvdEmployee(c), 0);
  const pvdAmount = d.pvdManual != null && d.pvdManual !== '' ? evalNumber(d.pvdManual) : autoPvd;
  const pvdAllowed = Math.min(pvdAmount, totalIncome * DEDUCTION_RULES.PVD_RATE, DEDUCTION_RULES.RETIREMENT_POOL_CAP);

  const rmfInput = evalNumber(d.rmf) + extraRmf;
  const rmfAllowed = Math.min(rmfInput, totalIncome * DEDUCTION_RULES.RMF_RATE, DEDUCTION_RULES.RETIREMENT_POOL_CAP);

  const pensionLife = evalNumber(d.pensionInsurance);
  const pensionAllowed = Math.min(pensionLife, totalIncome * DEDUCTION_RULES.PENSION_INSURANCE_RATE, DEDUCTION_RULES.PENSION_INSURANCE_CAP);

  const gpf = Math.min(evalNumber(d.gpf), DEDUCTION_RULES.GPF_CAP);

  const rawRetirement = pvdAllowed + rmfAllowed + pensionAllowed + gpf;
  const retirementUsed = Math.min(rawRetirement, DEDUCTION_RULES.RETIREMENT_POOL_CAP);
  add('กองทุนรวมเพื่อการเกษียณ (RMF / PVD / กบข. / บำนาญ)', retirementUsed);

  // 5. Thai ESG (Separate 300,000 cap)
  const esgInput = evalNumber(d.thaiEsg) + extraEsg;
  const esgAllowed = Math.min(esgInput, totalIncome * DEDUCTION_RULES.THAI_ESG_RATE, DEDUCTION_RULES.THAI_ESG_CAP);
  add('กองทุนรวม Thai ESG', esgAllowed);

  // 6. Stimulus & Mortgage Interest
  const easyReceipt = Math.min(evalNumber(d.easyEReceipt), DEDUCTION_RULES.EASY_E_RECEIPT_CAP);
  add('Easy E-Receipt', easyReceipt);

  const mortgage = Math.min(evalNumber(d.mortgageInterest), DEDUCTION_RULES.MORTGAGE_INTEREST_CAP);
  add('ดอกเบี้ยเงินกู้ยืมเพื่อที่อยู่อาศัย', mortgage);

  // Subtotal before donations
  const baseDeductions = items.reduce((acc, item) => acc + item.amount, 0);
  const standardExpenses = Math.min(totalIncome * DEDUCTION_RULES.EXPENSE_RATE, DEDUCTION_RULES.EXPENSE_CAP);
  const netBeforeDonations = Math.max(0, totalIncome - standardExpenses - baseDeductions);

  // 7. Donations (Capped at 10% of net income before donations)
  const donationGeneral = evalNumber(d.donationGeneral);
  const donationEdu = evalNumber(d.donationEducation) * 2; // Education & Sports get 2x
  const maxDonationAllowed = netBeforeDonations * DEDUCTION_RULES.DONATION_MAX_RATE;
  const actualDonations = Math.min(donationGeneral + donationEdu, maxDonationAllowed);
  add('เงินบริจาค', actualDonations);

  const politicalParty = Math.min(evalNumber(d.donationParty), DEDUCTION_RULES.POLITICAL_PARTY_CAP);
  add('เงินบริจาคพรรคการเมือง', politicalParty);

  const totalDeductions = items.reduce((acc, item) => acc + item.amount, 0);

  // Calculate remaining rooms for RMF and ThaiESG
  const rmfRoom = Math.max(
    0,
    Math.min(
      totalIncome * DEDUCTION_RULES.RMF_RATE - rmfInput,
      DEDUCTION_RULES.RETIREMENT_POOL_CAP - (pvdAllowed + pensionAllowed + gpf + rmfInput)
    )
  );

  const esgRoom = Math.max(
    0,
    Math.min(totalIncome * DEDUCTION_RULES.THAI_ESG_RATE, DEDUCTION_RULES.THAI_ESG_CAP) - esgInput
  );

  return {
    items,
    totalDeductions,
    standardExpenses,
    pvdAmount,
    pvdAllowed,
    rmfAllowed,
    retirementUsed,
    rmfRoom,
    esgRoom,
  };
}

/**
 * Master tax calculation function.
 */
export function calculateTaxPlan(companies, deductionsInput, foreignIncome = 0, extraRmf = 0, extraEsg = 0) {
  const cos = companies || [];
  const domesticIncome = cos.reduce((acc, c) => acc + getCompanyTotalIncome(c), 0);
  const totalIncome = domesticIncome + evalNumber(foreignIncome);

  const deductions = calculateAllDeductions(cos, deductionsInput, totalIncome, extraRmf, extraEsg);
  const netIncome = Math.max(0, totalIncome - deductions.standardExpenses - deductions.totalDeductions);

  const taxPayable = calculateProgressiveTax(netIncome);
  const marginalRate = getMarginalTaxRate(netIncome);

  // Total withholding tax calculation (supports real 50 Tawi override or auto estimation)
  let totalWithholding = 0;
  cos.forEach((c) => {
    if (c.withholdingTax !== '' && c.withholdingTax != null) {
      totalWithholding += evalNumber(c.withholdingTax);
    } else {
      totalWithholding += estimateCompanyWithholding(c, calculateProgressiveTax);
    }
  });

  const settlement = totalWithholding - taxPayable;
  const isRefund = settlement >= 0;

  return {
    domesticIncome,
    foreignIncome: evalNumber(foreignIncome),
    totalIncome,
    expenses: deductions.standardExpenses,
    deductions: deductions.totalDeductions,
    deductionItems: deductions.items,
    netIncome,
    taxPayable,
    marginalRate,
    totalWithholding,
    settlement: Math.abs(settlement),
    isRefund,
    rmfRoom: deductions.rmfRoom,
    esgRoom: deductions.esgRoom,
    pvdEmployee: (cos).reduce((acc, c) => acc + getCompanyPvdEmployee(c), 0),
    pvdCompany: (cos).reduce((acc, c) => acc + getCompanyPvdCompany(c), 0),
  };
}
