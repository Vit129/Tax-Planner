export const TAX_YEAR = 2569;

export const TAX_BRACKETS = [
  { min: 0,       max: 150000,  rate: 0,    cumulative: 0 },
  { min: 150001,  max: 300000,  rate: 0.05, cumulative: 7500 },
  { min: 300001,  max: 500000,  rate: 0.10, cumulative: 27500 },
  { min: 500001,  max: 750000,  rate: 0.15, cumulative: 65000 },
  { min: 750001,  max: 1000000, rate: 0.20, cumulative: 115000 },
  { min: 1000001, max: 2000000, rate: 0.25, cumulative: 365000 },
  { min: 2000001, max: 5000000, rate: 0.30, cumulative: 1265000 },
  { min: 5000001, max: Infinity, rate: 0.35, cumulative: Infinity },
];

export const DEDUCTION_RULES = {
  // Expenses (ค่าใช้จ่ายเงินได้ 40(1))
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

  // Social Security (ประกันสังคม)
  SS_MONTHLY_MAX: 750, // 5% of 15,000 cap = 750/mo (9,000/yr)
  SS_ANNUAL_CAP: 9000,

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
  DONATION_MAX_RATE: 0.10, // Max 10% of net income before donation
  POLITICAL_PARTY_CAP: 10000,
};

export const MONTH_NAMES_TH = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
  'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
  'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

export const MONTH_SHORT_TH = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.',
  'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.',
  'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];
