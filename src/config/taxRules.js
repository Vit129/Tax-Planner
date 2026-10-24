import STRINGS from './strings.js';

export const TAX_YEAR = 2569;

export const TAX_BRACKETS = [
  { min: 0,       max: 150000,   rate: 0,    cumulative: 0 },
  { min: 150001,  max: 300000,   rate: 0.05, cumulative: 7500 },
  { min: 300001,  max: 500000,   rate: 0.10, cumulative: 27500 },
  { min: 500001,  max: 750000,   rate: 0.15, cumulative: 65000 },
  { min: 750001,  max: 1000000,  rate: 0.20, cumulative: 115000 },
  { min: 1000001, max: 2000000,  rate: 0.25, cumulative: 365000 },
  { min: 2000001, max: 5000000,  rate: 0.30, cumulative: 1265000 },
  { min: 5000001, max: Infinity, rate: 0.35, cumulative: Infinity },
];

export const BRACKET_RATES_PCT = [0, 5, 10, 15, 20, 25, 30, 35];

export const DEDUCTION_RULES = {
  // Expenses (40(1))
  EXPENSE_RATE: 0.50,
  EXPENSE_CAP: 100000,

  // Personal & Family
  PERSONAL: 60000,
  SPOUSE: 60000,
  CHILD_1: 30000,
  CHILD_2_PLUS: 60000,
  PARENT: 30000,
  PARENT_HEALTH_CAP: 15000,
  DISABLED_CARE: 60000,
  ANTENATAL_CAP: 60000,

  // Social Security (ม.33 ปรับเพดานใหม่ปี 2569: 17,500 บาท -> 875 บาท/เดือน = 10,500 บาท/ปี)
  SS_MONTHLY_MAX: 875,
  SS_ANNUAL_CAP: 10500,

  // Insurance
  LIFE_HEALTH_CAP: 100000,
  HEALTH_SUB_CAP: 25000,
  SPOUSE_LIFE_CAP: 10000,
  PENSION_INSURANCE_RATE: 0.15,
  PENSION_INSURANCE_CAP: 200000,

  // Retirement Pool (RMF + PVD + GPF + Pension Life + NSF)
  RETIREMENT_POOL_CAP: 500000,
  RMF_RATE: 0.30,
  PVD_RATE: 0.15,
  GPF_CAP: 30000,

  // Thai ESG (Separate from Retirement Pool)
  THAI_ESG_RATE: 0.30,
  THAI_ESG_CAP: 300000,

  // Stimulus & Living
  EASY_E_RECEIPT_CAP: 50000,
  MORTGAGE_INTEREST_CAP: 100000,

  // Donations
  DONATION_MAX_RATE: 0.10,
  POLITICAL_PARTY_CAP: 10000,
};

export const MONTH_NAMES_TH = STRINGS.MONTH_NAMES_TH;
export const MONTH_SHORT_TH = STRINGS.MONTH_SHORT_TH;

export const EXTRA_DEDUCTION_OPTIONS = [
  { key: 'mortgageInterest', label: STRINGS.EXTRA_DEDUCTION_LABELS.mortgageInterest, cap: 100000 },
  { key: 'easyEReceipt', label: STRINGS.EXTRA_DEDUCTION_LABELS.easyEReceipt, cap: 50000 },
  { key: 'pensionInsurance', label: STRINGS.EXTRA_DEDUCTION_LABELS.pensionInsurance, cap: 200000 },
  { key: 'parentsHealthInsurance', label: STRINGS.EXTRA_DEDUCTION_LABELS.parentsHealthInsurance, cap: 15000 },
  { key: 'donationGeneral', label: STRINGS.EXTRA_DEDUCTION_LABELS.donationGeneral, cap: null },
  { key: 'gpf', label: STRINGS.EXTRA_DEDUCTION_LABELS.gpf, cap: 30000 },
];

export const DEFAULT_AI_HOUSES = STRINGS.DEFAULT_AI_HOUSES;
export const DEFAULT_AI_FOCUSES = STRINGS.DEFAULT_AI_FOCUSES;

export const SAMPLE_RMF_FUNDS = [
  { name: 'SCBRMS&P500', type: 'Core', style: 'Passive' },
  { name: 'KKP PGE RMF-H', type: 'Core', style: 'Passive' },
  { name: 'MEGAWORLD30RMF', type: 'Core', style: 'Active' },
  { name: 'B-INNOTECHRMF', type: 'Theme', style: 'Active' },
  { name: 'UGISRMF', type: 'Theme', style: 'Active' },
  { name: 'BGOLDRMF', type: 'Theme', style: 'Passive' },
];

export const SAMPLE_PVD_FUNDS = [
  { name: 'B-GLOBAL', allocation: 30 },
  { name: 'B-USALPHA', allocation: 20 },
  { name: 'B-ASIA', allocation: 8 },
  { name: 'B-NIPPON', allocation: 7 },
  { name: 'B-INNOTECH', allocation: 25 },
  { name: 'BCARE', allocation: 5 },
  { name: 'BGOLD', allocation: 5 },
];
