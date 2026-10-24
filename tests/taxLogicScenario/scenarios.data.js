/**
 * TaxLogicScenario Test Data Matrix (14 Golden Scenarios)
 *
 * Scope:
 * - Single vs Multi-Employer (Job Switchers with 1 vs 2 bonuses)
 * - Brackets: 10%, 15%, 20%, 25%, 30%, 35%
 * - Mid-Year Raises (0, 1, 2 raises)
 * - Bonus (Fixed, Variable, Performance, Hybrid)
 * - PVD (0%, 2%, 3%, 5%, 10%, 15%)
 * - Social Security (ม.33 2569 ceiling: 875/mo, 10,500/yr)
 * - Insurance (Zero, Partial, Full 100k/200k, and Pension Overflow)
 * - RMF Advice (Down 1 bracket, capped at 30% and 500k group limit)
 *
 * Excluded: Mortgage interest, donations, child/parent counts, temporary stimulus (Easy E-Receipt)
 */

export const SCENARIOS = [
  {
    id: 'case-01',
    title: 'บริษัทเดียว · ฐาน 10% · ไม่ปรับเงินเดือน · Fixed โบนัส 1 ด. · PVD 3% · ไม่มีประกัน',
    companies: [
      {
        name: 'Alpha Tech',
        startMonth: 1,
        endMonth: 12,
        baseSalary: 38000,
        bonusFixedMonths: 1,
        pvdRateEmp: 3,
        pvdRateCo: 3,
        withholdingTax: 8500,
      },
    ],
    deductions: {},
    expected: {
      marginalRate: 0.10,
      targetDropBracket: 0.05,
      hasOverflow: false,
    },
  },
  {
    id: 'case-02',
    title: 'บริษัทเดียว · ฐาน 15% · ปรับเงินเดือน 1 ครั้ง (ผ่านโปร ด.4) · Var โบนัส 1.5 ด. · PVD 5% · ประกันไม่เต็ม',
    companies: [
      {
        name: 'Beta Corp',
        startMonth: 1,
        endMonth: 12,
        baseSalary: 60000,
        salaryAdjustments: [{ month: 4, salary: 68000 }],
        bonusFixedMonths: 1.5,
        pvdRateEmp: 5,
        pvdRateCo: 5,
        withholdingTax: 32000,
      },
    ],
    deductions: {
      lifeInsurance: 30000,
      healthInsurance: 15000,
    },
    expected: {
      marginalRate: 0.15,
      targetDropBracket: 0.10,
      hasOverflow: false,
    },
  },
  {
    id: 'case-03',
    title: 'บริษัทเดียว · ฐาน 20% · ปรับเงินเดือน 2 ครั้ง (ด.4 + ด.10) · Fixed + Var 2 ด. · PVD 2% · ประกันไม่เต็ม',
    companies: [
      {
        name: 'Gamma Innovations',
        startMonth: 1,
        endMonth: 12,
        baseSalary: 80000,
        salaryAdjustments: [
          { month: 4, salary: 85000 },
          { month: 10, salary: 92000 },
        ],
        bonusFixedMonths: 2,
        pvdRateEmp: 2,
        pvdRateCo: 2,
        withholdingTax: 75000,
      },
    ],
    deductions: {
      lifeInsurance: 50000,
    },
    expected: {
      marginalRate: 0.20,
      targetDropBracket: 0.15,
      hasOverflow: false,
    },
  },
  {
    id: 'case-04',
    title: 'บริษัทเดียว · ฐาน 20% · ปรับ 1 ครั้ง · Fixed 2 ด. · PVD 10% · ประกันเต็ม Max (100k)',
    companies: [
      {
        name: 'Delta Systems',
        startMonth: 1,
        endMonth: 12,
        baseSalary: 78000,
        salaryAdjustments: [{ month: 6, salary: 85000 }],
        bonusFixedMonths: 2,
        pvdRateEmp: 10,
        pvdRateCo: 10,
        withholdingTax: 70000,
      },
    ],
    deductions: {
      lifeInsurance: 80000,
      healthInsurance: 25000, // Clamped to 25k, total general life = 100k max
    },
    expected: {
      marginalRate: 0.20,
      targetDropBracket: 0.15,
      hasOverflow: false,
    },
  },
  {
    id: 'case-05',
    title: 'บริษัทเดียว · ฐาน 25% · ไม่ปรับเงินเดือน · Perf โบนัสปลายปี 2.5 ด. · PVD 5% · ประกันไม่เต็ม',
    companies: [
      {
        name: 'Epsilon Ltd',
        startMonth: 1,
        endMonth: 12,
        baseSalary: 125000,
        bonusFixedMonths: 2.5,
        pvdRateEmp: 5,
        pvdRateCo: 5,
        withholdingTax: 180000,
      },
    ],
    deductions: {
      lifeInsurance: 60000,
      healthInsurance: 20000,
    },
    expected: {
      marginalRate: 0.25,
      targetDropBracket: 0.20,
      hasOverflow: false,
    },
  },
  {
    id: 'case-06',
    title: 'บริษัทเดียว · ฐาน 25% · ปรับ 1 ครั้ง · Fixed 1 ด. + Perf 2 ด. · PVD 10% · ประกันเต็ม Max + บำนาญ',
    companies: [
      {
        name: 'Zeta Global',
        startMonth: 1,
        endMonth: 12,
        baseSalary: 135000,
        salaryAdjustments: [{ month: 5, salary: 145000 }],
        bonusFixedMonths: 3,
        pvdRateEmp: 10,
        pvdRateCo: 10,
        withholdingTax: 210000,
      },
    ],
    deductions: {
      lifeInsurance: 100000,
      pensionInsurance: 100000,
    },
    expected: {
      marginalRate: 0.25,
      targetDropBracket: 0.20,
      hasOverflow: false,
    },
  },
  {
    id: 'case-07',
    title: 'บริษัทเดียว · ฐาน 30% · ปรับ 2 ครั้ง · Hybrid โบนัส 3 ด. · PVD 15% · ประกันเต็ม Max ทุกตัว',
    companies: [
      {
        name: 'Eta Enterprise',
        startMonth: 1,
        endMonth: 12,
        baseSalary: 230000,
        salaryAdjustments: [
          { month: 4, salary: 250000 },
          { month: 10, salary: 270000 },
        ],
        bonusFixedMonths: 3,
        pvdRateEmp: 15,
        pvdRateCo: 15,
        withholdingTax: 580000,
      },
    ],
    deductions: {
      lifeInsurance: 100000,
      pensionInsurance: 200000,
    },
    expected: {
      marginalRate: 0.30,
      targetDropBracket: 0.25,
      hasOverflow: false,
    },
  },
  {
    id: 'case-08',
    title: 'บริษัทเดียว · ฐาน 35% · ปรับ 1 ครั้ง (รายได้สูง 500k+) · Var โบนัส 3 ด. · PVD 15% · ประกันเต็ม Max ทุกตัว',
    companies: [
      {
        name: 'Theta Holdings',
        startMonth: 1,
        endMonth: 12,
        baseSalary: 480000,
        salaryAdjustments: [{ month: 6, salary: 520000 }],
        bonusFixedMonths: 3,
        pvdRateEmp: 15,
        pvdRateCo: 15,
        withholdingTax: 1600000,
      },
    ],
    deductions: {
      lifeInsurance: 100000,
      pensionInsurance: 200000,
    },
    expected: {
      marginalRate: 0.35,
      targetDropBracket: 0.30,
      hasOverflow: false,
    },
  },
  {
    id: 'case-09',
    title: 'ย้ายงานระหว่างปี (2 ที่) · ฐาน 15% · โบนัส 1 ที่ (บ.B) · PVD 5% · ประกันไม่เต็ม',
    companies: [
      {
        name: 'Company A (ม.ค. - มิ.ย.)',
        startMonth: 1,
        endMonth: 6,
        baseSalary: 52000,
        bonusFixedMonths: 0,
        pvdRateEmp: 5,
        pvdRateCo: 5,
        withholdingTax: 10000,
      },
      {
        name: 'Company B (ก.ค. - ธ.ค.)',
        startMonth: 7,
        endMonth: 12,
        baseSalary: 62000,
        bonusFixedMonths: 1.5,
        pvdRateEmp: 5,
        pvdRateCo: 5,
        withholdingTax: 18000,
      },
    ],
    deductions: {
      lifeInsurance: 30000,
    },
    expected: {
      marginalRate: 0.15,
      targetDropBracket: 0.10,
      hasOverflow: false,
    },
  },
  {
    id: 'case-10',
    title: 'ย้ายงานระหว่างปี (2 ที่) · ฐาน 20% · ปรับหลังโปรที่ บ.B · โบนัส 2 ที่ (A + B) · PVD A 3% -> B 5% · ประกันไม่เต็ม',
    companies: [
      {
        name: 'First Co (ม.ค. - พ.ค.)',
        startMonth: 1,
        endMonth: 5,
        baseSalary: 60000,
        bonusFixedMonths: 1,
        pvdRateEmp: 3,
        pvdRateCo: 3,
        withholdingTax: 25000,
      },
      {
        name: 'Second Co (มิ.ย. - ธ.ค.)',
        startMonth: 6,
        endMonth: 12,
        baseSalary: 76000,
        salaryAdjustments: [{ month: 9, salary: 85000 }],
        bonusFixedMonths: 2,
        pvdRateEmp: 5,
        pvdRateCo: 5,
        withholdingTax: 55000,
      },
    ],
    deductions: {
      lifeInsurance: 50000,
      healthInsurance: 10000,
    },
    expected: {
      marginalRate: 0.20,
      targetDropBracket: 0.15,
      hasOverflow: false,
    },
  },
  {
    id: 'case-11',
    title: 'ย้ายงานระหว่างปี (2 ที่) · ฐาน 25% · ก้าวกระโดด · โบนัส 1 ที่ (บ.B) · PVD 10% · ประกันเต็ม Max (100k)',
    companies: [
      {
        name: 'Startup A (ม.ค. - เม.ย.)',
        startMonth: 1,
        endMonth: 4,
        baseSalary: 95000,
        bonusFixedMonths: 0,
        pvdRateEmp: 5,
        pvdRateCo: 5,
        withholdingTax: 22000,
      },
      {
        name: 'Unicorn B (พ.ค. - ธ.ค.)',
        startMonth: 5,
        endMonth: 12,
        baseSalary: 140000,
        bonusFixedMonths: 2.5,
        pvdRateEmp: 10,
        pvdRateCo: 10,
        withholdingTax: 160000,
      },
    ],
    deductions: {
      lifeInsurance: 80000,
      healthInsurance: 25000,
    },
    expected: {
      marginalRate: 0.25,
      targetDropBracket: 0.20,
      hasOverflow: false,
    },
  },
  {
    id: 'case-12',
    title: 'ย้ายงานระหว่างปี (2 ที่) · ฐาน 30% · ปรับ 1 ครั้งที่ บ.B · โบนัส 2 ที่ · PVD 10% ทั้ง 2 ที่ · ประกันเต็ม Max + บำนาญ',
    companies: [
      {
        name: 'Prime Corp A (ม.ค. - มิ.ย.)',
        startMonth: 1,
        endMonth: 6,
        baseSalary: 190000,
        bonusFixedMonths: 1.5,
        pvdRateEmp: 10,
        pvdRateCo: 10,
        withholdingTax: 160000,
      },
      {
        name: 'Prime Corp B (ก.ค. - ธ.ค.)',
        startMonth: 7,
        endMonth: 12,
        baseSalary: 230000,
        salaryAdjustments: [{ month: 10, salary: 250000 }],
        bonusFixedMonths: 2,
        pvdRateEmp: 10,
        pvdRateCo: 10,
        withholdingTax: 250000,
      },
    ],
    deductions: {
      lifeInsurance: 100000,
      pensionInsurance: 150000,
    },
    expected: {
      marginalRate: 0.30,
      targetDropBracket: 0.25,
      hasOverflow: false,
    },
  },
  {
    id: 'case-13',
    title: 'Edge Case ปริ่มขอบ · ฐาน 20% -> 15% · สุทธิเกินขั้น 15% มานิดเดียว · ซื้อ RMF ขั้นต่ำเพื่อพลิกลงฐาน 15%',
    companies: [
      {
        name: 'Precision Co',
        startMonth: 1,
        endMonth: 12,
        baseSalary: 79200,
        bonusFixedMonths: 1,
        pvdRateEmp: 5,
        pvdRateCo: 5,
        withholdingTax: 60000,
      },
    ],
    deductions: {
      lifeInsurance: 40000,
    },
    expected: {
      marginalRate: 0.20,
      targetDropBracket: 0.15,
      hasOverflow: false,
    },
  },
  {
    id: 'case-14',
    title: 'ท่าพิเศษ Pension Overflow · ฐาน 20% · ไม่มีประกันทั่วไป แต่มีบำนาญ 150k ไหลไปเติมทั่วไป 100k + เกษียณ 50k',
    companies: [
      {
        name: 'Overflow Corp',
        startMonth: 1,
        endMonth: 12,
        baseSalary: 85000,
        bonusFixedMonths: 1.5,
        pvdRateEmp: 5,
        pvdRateCo: 5,
        withholdingTax: 70000,
      },
    ],
    deductions: {
      lifeInsurance: 0,
      pensionInsurance: 150000,
    },
    expected: {
      marginalRate: 0.20,
      targetDropBracket: 0.15,
      hasOverflow: true,
    },
  },
];
