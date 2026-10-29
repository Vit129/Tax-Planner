import { describe, it, expect } from 'vitest';
import {
  getAnnualExtraIncome,
  getEmploymentRange,
  setEmploymentRange,
} from '@vit129/thai-tax-core';
import {
  getBonusTotal,
  applyBonus,
  buildSimulatorModel,
} from '@vit129/tax-ui';
import {
  toCoreCompany,
  fromCoreCompany,
  createNextTpCompany,
  toEasyDeductions,
  fromEasyDeductions,
  applyEasyDeductionUpdate,
  fromEasyDeductions,
  toEasyInputs,
  toEasyPlan,
  createEasySimulatorRecalculate,
  buildEasyAiPrompt,
  buildAiChatUrl,
  getStartSalary,
  getFirstRaise,
  setStartSalary,
  setFirstRaise,
  setYearlyOtherIncome,
} from '../src/logic/easyTaxAdapter.js';
import { calculateTaxPlan } from '../src/logic/taxLogic.js';
import { STRINGS } from '../src/config/strings.js';
import {
  SCENARIOS,
  SHAPE_FIXTURE,
  LEGACY_V2_SAMPLE_FIXTURE,
} from './fixtures/taxLogic/scenarios.data.js';

describe('easyTaxAdapter — Display, Round-Trip, Edit, and Legacy V2 Compatibility', () => {
  it('maps the SAMPLE CO fixture to exact @vit129/tax-ui display fields and Tax-Planner plan math', () => {
    const [tpComp] = SHAPE_FIXTURE.companies;
    const core = toCoreCompany(tpComp);
    const exp = SHAPE_FIXTURE.expectedDisplay;

    expect(core.name).toBe('SAMPLE CO');
    expect(getEmploymentRange(core)).toEqual({ start: 1, end: 12 });
    expect(getStartSalary(core)).toBe(exp.startSalary);
    expect(getFirstRaise(core)).toEqual({
      month: exp.raiseMonth,
      from: exp.startSalary,
      to: exp.raiseSalary,
    });
    expect(getAnnualExtraIncome(core)).toBe(exp.yearlyOtherIncome);
    expect(getBonusTotal(core, exp.raiseSalary)).toBe(exp.bonusTotal);
    expect(core.pvdEmpRate).toBe(exp.pvdEmpRate);
    expect(core.pvdCoRate).toBe(exp.pvdCoRate);
    expect(core.withholdingTax).toBe(exp.withholdingTax);

    const plan = toEasyPlan(SHAPE_FIXTURE.companies, SHAPE_FIXTURE.deductions);
    expect(plan.totalIncome).toBe(exp.totalIncome);
    expect(plan.expenses).toBe(exp.expenses);
    expect(plan.deductions).toBe(exp.deductions);
    expect(plan.netIncome).toBe(exp.netIncome);
    expect(plan.taxPayable).toBe(exp.taxPayable);
    expect(plan.totalWithholding).toBe(exp.withholdingTax);
    expect(plan.settlement.taxDiff).toBe(exp.settlementDiff);
    expect(plan.settlement.taxStatus).toBe('refund');
    expect(plan.settlement.isRefund).toBe(true);
  });

  it('round-trips SHAPE_FIXTURE, LEGACY_V2_SAMPLE_FIXTURE, and all 14 golden SCENARIOS with zero tax drift', () => {
    const allCases = [
      SHAPE_FIXTURE,
      LEGACY_V2_SAMPLE_FIXTURE,
      ...SCENARIOS,
    ];

    for (const sc of allCases) {
      const before = calculateTaxPlan(sc.companies, sc.deductions);
      const roundTrippedCompanies = sc.companies.map((c) => fromCoreCompany(toCoreCompany(c), c));
      const roundTrippedDeductions = fromEasyDeductions(
        toEasyDeductions(sc.deductions),
        sc.deductions
      );
      const after = calculateTaxPlan(roundTrippedCompanies, roundTrippedDeductions);

      expect(after.totalIncome, `${sc.id} totalIncome`).toBe(before.totalIncome);
      expect(after.deductions, `${sc.id} deductions`).toBe(before.deductions);
      expect(after.netIncome, `${sc.id} netIncome`).toBe(before.netIncome);
      expect(after.taxPayable, `${sc.id} taxPayable`).toBe(before.taxPayable);
      expect(after.totalWithholding, `${sc.id} totalWithholding`).toBe(before.totalWithholding);
      expect(after.settlementDiff, `${sc.id} settlementDiff`).toBe(before.settlementDiff);
      expect(after.rmfCap, `${sc.id} rmfCap`).toBe(before.rmfCap);
      expect(after.pvdUsed, `${sc.id} pvdUsed`).toBe(before.pvdUsed);
    }
  });

  it('updates tax on every field edit and restores exact ฿35,410 when reverted', () => {
    const baseCompanies = SHAPE_FIXTURE.companies;
    const baseDeductions = SHAPE_FIXTURE.deductions;
    const baselineTax = SHAPE_FIXTURE.expectedDisplay.taxPayable;
    const baselineRefund = SHAPE_FIXTURE.expectedDisplay.settlementDiff;

    const calc = (comp, ded = baseDeductions) => toEasyPlan([comp], ded);
    const core0 = toCoreCompany(baseCompanies[0]);

    // 1. Edit start salary (52,000 -> 52,500 -> 52,000)
    const coreSalEdited = setStartSalary(core0, 52500);
    const tpSalEdited = fromCoreCompany(coreSalEdited, baseCompanies[0]);
    expect(calc(tpSalEdited).taxPayable).toBeGreaterThan(baselineTax);

    const coreSalReverted = setStartSalary(toCoreCompany(tpSalEdited), 52000);
    const tpSalReverted = fromCoreCompany(coreSalReverted, tpSalEdited);
    expect(calc(tpSalReverted).taxPayable).toBe(baselineTax);

    // 2. Edit raise month (month 3 -> month 6 -> month 3)
    const coreRaiseMonthEdited = setFirstRaise(core0, 6, 54500);
    const tpRaiseMonthEdited = fromCoreCompany(coreRaiseMonthEdited, baseCompanies[0]);
    expect(calc(tpRaiseMonthEdited).taxPayable).toBeLessThan(baselineTax);

    const coreRaiseMonthReverted = setFirstRaise(toCoreCompany(tpRaiseMonthEdited), 3, 54500);
    const tpRaiseMonthReverted = fromCoreCompany(coreRaiseMonthReverted, tpRaiseMonthEdited);
    expect(calc(tpRaiseMonthReverted).taxPayable).toBe(baselineTax);

    // 3. Edit raise salary (54,500 -> 70,000 -> 54,500)
    const coreRaiseSalEdited = setFirstRaise(core0, 3, 70000);
    const tpRaiseSalEdited = fromCoreCompany(coreRaiseSalEdited, baseCompanies[0]);
    expect(calc(tpRaiseSalEdited).taxPayable).toBeGreaterThan(baselineTax);

    const coreRaiseSalReverted = setFirstRaise(toCoreCompany(tpRaiseSalEdited), 3, 54500);
    const tpRaiseSalReverted = fromCoreCompany(coreRaiseSalReverted, tpRaiseSalEdited);
    expect(calc(tpRaiseSalReverted).taxPayable).toBe(baselineTax);

    // 4. Edit bonus (109,000 -> 200,000 -> 109,000)
    const coreBonusEdited = applyBonus(core0, 200000);
    const tpBonusEdited = fromCoreCompany(coreBonusEdited, baseCompanies[0]);
    expect(calc(tpBonusEdited).taxPayable).toBeGreaterThan(baselineTax);

    const coreBonusReverted = applyBonus(toCoreCompany(tpBonusEdited), 109000);
    const tpBonusReverted = fromCoreCompany(coreBonusReverted, tpBonusEdited);
    expect(calc(tpBonusReverted).taxPayable).toBe(baselineTax);

    // 5. Edit yearly other income (19,700 -> 60,000 -> 19,700)
    const coreOtherEdited = setYearlyOtherIncome(core0, 60000);
    const tpOtherEdited = fromCoreCompany(coreOtherEdited, baseCompanies[0]);
    expect(calc(tpOtherEdited).taxPayable).toBeGreaterThan(baselineTax);

    const coreOtherReverted = setYearlyOtherIncome(toCoreCompany(tpOtherEdited), 19700);
    const tpOtherReverted = fromCoreCompany(coreOtherReverted, tpOtherEdited);
    expect(calc(tpOtherReverted).taxPayable).toBe(baselineTax);

    // 6. Edit PVD rate (3% -> 5% -> 3%)
    const tpPvdEdited = fromCoreCompany({ ...core0, pvdEmpRate: 5 }, baseCompanies[0]);
    expect(calc(tpPvdEdited).taxPayable).toBeLessThan(baselineTax);

    const tpPvdReverted = fromCoreCompany(
      { ...toCoreCompany(tpPvdEdited), pvdEmpRate: 3 },
      tpPvdEdited
    );
    expect(calc(tpPvdReverted).taxPayable).toBe(baselineTax);

    // 7. Edit employment range (1..12 -> 3..12 -> 1..12)
    const coreRangeEdited = setEmploymentRange(core0, 3, 12);
    const tpRangeEdited = fromCoreCompany(
      { ...coreRangeEdited, startMonth: 3, endMonth: 12 },
      baseCompanies[0]
    );
    expect(calc(tpRangeEdited).taxPayable).toBeLessThan(baselineTax);

    // 8. Edit deductions (lifeInsurance, rmf, spouse, parents, children, donation) and revert
    const dedEdited = applyEasyDeductionUpdate(baseDeductions, 'lifeInsurance', 50000);
    expect(calc(baseCompanies[0], dedEdited).taxPayable).toBeLessThan(baselineTax);

    const dedReverted = applyEasyDeductionUpdate(dedEdited, 'lifeInsurance', 12000);
    const revertedPlan = calc(baseCompanies[0], dedReverted);
    expect(revertedPlan.taxPayable).toBe(baselineTax);
    expect(revertedPlan.settlement.taxDiff).toBe(baselineRefund);
  });

  it('keeps the What-If simulator isolated from basePlan taxPayable and settlement', () => {
    const basePlan = toEasyPlan(SHAPE_FIXTURE.companies, SHAPE_FIXTURE.deductions);
    const recalculate = createEasySimulatorRecalculate(
      SHAPE_FIXTURE.companies,
      SHAPE_FIXTURE.deductions
    );

    const simModel = buildSimulatorModel({
      base: basePlan,
      simExtra: { extraRmf: 50000, extraEsg: 20000 },
      recalculate,
    });

    expect(simModel.simulated.taxPayable).toBeLessThan(basePlan.taxPayable);
    expect(simModel.metrics.saved).toBe(basePlan.taxPayable - simModel.simulated.taxPayable);
    // Base plan headline numbers must remain untouched
    expect(basePlan.taxPayable).toBe(35410);
    expect(basePlan.settlement.taxDiff).toBe(5590);
  });

  it('loads legacy V2 localStorage data blobs without error', () => {
    const v2SavedBlob = JSON.parse(
      JSON.stringify({
        companies: LEGACY_V2_SAMPLE_FIXTURE.companies,
        deductions: LEGACY_V2_SAMPLE_FIXTURE.deductions,
        foreignIncome: 0,
      })
    );

    const easyInputs = toEasyInputs(v2SavedBlob.companies, v2SavedBlob.deductions);
    const easyPlan = toEasyPlan(v2SavedBlob.companies, v2SavedBlob.deductions, {
      foreignIncome: v2SavedBlob.foreignIncome,
    });
    const directPlan = calculateTaxPlan(
      v2SavedBlob.companies,
      v2SavedBlob.deductions,
      v2SavedBlob.foreignIncome
    );

    expect(easyInputs.companies).toHaveLength(2);
    expect(easyInputs.companies[0].name).toBe(LEGACY_V2_SAMPLE_FIXTURE.companies[0].name);
    expect(easyPlan.taxPayable).toBe(directPlan.taxPayable);
    expect(easyPlan.settlement.taxDiff).toBe(directPlan.settlementDiff);
  });

  it('creates next company and builds AI prompt and URLs accurately', () => {
    const nextComp = createNextTpCompany(
      [{ name: 'First Co', baseSalary: '55000', startMonth: 1, endMonth: 6, pvdRateEmp: '5', pvdRateCo: '5' }],
      STRINGS.LBL_COMPANY_NAME
    );
    expect(nextComp.name).toBe(`${STRINGS.LBL_COMPANY_NAME} 2`);
    expect(nextComp.startMonth).toBe(7);
    expect(nextComp.endMonth).toBe(12);
    expect(nextComp.baseSalary).toBe('55000');

    const basePlan = toEasyPlan(SHAPE_FIXTURE.companies, SHAPE_FIXTURE.deductions);
    const prompt = buildEasyAiPrompt(
      {
        bank: STRINGS.DEFAULT_AI_HOUSES[0],
        focus: STRINGS.DEFAULT_AI_FOCUSES[0],
        hold: '',
        budget: 50000,
        marginalRate: 0.2,
      },
      { basePlan, taxYear: { ce: 2026, be: 2569, monthsLeft: 3 } }
    );
    expect(prompt).toContain(STRINGS.DEFAULT_AI_HOUSES[0]);
    expect(prompt).toContain('50,000');

    expect(buildAiChatUrl('gpt', 'hello')).toBe('https://chatgpt.com/?q=hello');
    expect(buildAiChatUrl('claude', 'hello')).toBe('https://claude.ai/new?q=hello');
  });
});

describe('easyTaxAdapter — pension insurance, NSF (gpf), retirement pool and tax waterfall', () => {
  const tax = (ded) => calculateTaxPlan(SHAPE_FIXTURE.companies, ded, 0, 0, 0).taxPayable;

  it('maps Tax-Planner gpf to the shared nsf field and back', () => {
    const ded = { ...SHAPE_FIXTURE.deductions, pensionInsurance: 50000, gpf: 20000 };
    expect(toEasyDeductions(ded)).toMatchObject({ pensionInsurance: 50000, nsf: 20000 });
    const back = fromEasyDeductions({ ...toEasyDeductions(ded), nsf: 25000 }, ded);
    expect(back).toMatchObject({ pensionInsurance: 50000, gpf: 25000 });
    expect(applyEasyDeductionUpdate(ded, 'nsf', 10000).gpf).toBe(10000);
  });

  it('each field changes the tax and reverting restores it exactly', () => {
    const base = SHAPE_FIXTURE.deductions;
    const t0 = tax(base);
    const pen = applyEasyDeductionUpdate(base, 'pensionInsurance', 100000);
    expect(tax(pen)).toBeLessThan(t0);
    expect(tax(applyEasyDeductionUpdate(pen, 'pensionInsurance', base.pensionInsurance))).toBe(t0);
    const nsf = applyEasyDeductionUpdate(base, 'nsf', 30000);
    expect(tax(nsf)).toBeLessThan(t0);
    expect(tax(applyEasyDeductionUpdate(nsf, 'nsf', base.gpf))).toBe(t0);
  });

  it('the pool card model matches the engine and counts pension and NSF', () => {
    // Pension insurance first fills the unused life-insurance room (100,000 - 12,000 - 18,000 = 70,000);
    // only the 30,000 above that counts in the retirement pool, plus 20,000 of NSF.
    const ded = { ...SHAPE_FIXTURE.deductions, pensionInsurance: 100000, gpf: 20000 };
    const plan = toEasyPlan(SHAPE_FIXTURE.companies, ded);
    const none = toEasyPlan(SHAPE_FIXTURE.companies, SHAPE_FIXTURE.deductions);
    expect(plan.pool.cap).toBe(500000);
    expect(plan.pool.used).toBe(plan.retirementPoolUsed);
    expect(plan.pool.used - none.pool.used).toBe(50000);
    expect(plan.pool.remain).toBe(plan.retirementPoolRemain);
  });

  it('the waterfall lines add up to the net income and end at the plan tax', () => {
    const plan = toEasyPlan(SHAPE_FIXTURE.companies, { ...SHAPE_FIXTURE.deductions, pensionInsurance: 60000 });
    const w = plan.waterfall;
    const allowances = w.items.reduce((sum, i) => sum + i.amount, 0);
    expect(Math.round(w.totalIncome - w.expenses - allowances)).toBe(Math.round(w.net));
    expect(w.tax).toBe(plan.taxPayable);
  });
});
