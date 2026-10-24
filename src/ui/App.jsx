import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import SalarySection from './components/SalarySection';
import WithholdingSection from './components/WithholdingSection';
import DeductionsSection from './components/DeductionsSection';
import FundsSection from './components/FundsSection';
import HeroSummaryCard from './components/HeroSummaryCard';
import RmfAdviceCard from './components/RmfAdviceCard';
import RetirementPoolCard from './components/RetirementPoolCard';
import CompanyBreakdownCard from './components/CompanyBreakdownCard';
import WhatIfSimulator from './components/WhatIfSimulator';
import AskAiCard from './components/AskAiCard';
import TaxDetailsCard from './components/TaxDetailsCard';
import STRINGS from '../config/strings';
import { calculateTaxPlan, getTaxYearMetadata } from '../logic/taxLogic';
import { evalNumber } from '../logic/evalExpression';

const STORAGE_KEY = 'TAX_PLANNER_DATA_V2';
const THEME_STORAGE_KEY = 'TAX_PLANNER_THEME';

function createEmptyCompany(overrides = {}) {
  return {
    name: '',
    baseSalary: '',
    startMonth: 1,
    endMonth: 12,
    bonusFixedMonths: '',
    bonusVariable: '',
    pvdRateEmp: '',
    pvdRateCo: '',
    withholdingTax: '',
    salaryAdjustments: [],
    monthlyOverrides: {},
    otMonthly: {},
    ...overrides,
  };
}

const DEFAULT_SAMPLE_COMPANIES = [
  createEmptyCompany({
    name: STRINGS.SAMPLE_COMPANY_A_NAME,
    baseSalary: '40000',
    startMonth: 1,
    endMonth: 3,
    bonusFixedMonths: '0',
    bonusVariable: '0',
    pvdRateEmp: '3',
    pvdRateCo: '3',
    otMonthly: { 2: 3000 },
  }),
  createEmptyCompany({
    name: STRINGS.SAMPLE_COMPANY_B_NAME,
    baseSalary: '48000',
    startMonth: 4,
    endMonth: 12,
    bonusFixedMonths: '1.5',
    bonusVariable: '0',
    pvdRateEmp: '5',
    pvdRateCo: '5',
    salaryAdjustments: [{ month: 9, salary: 52000 }],
    otMonthly: { 6: 2500, 9: 5000 },
  }),
];

const DEFAULT_SAMPLE_DEDUCTIONS = {
  hasSpouse: false,
  childrenCount: 0,
  parentsCount: 1,
  lifeInsurance: '20000',
  healthInsurance: '12000',
  rmf: '30000',
  thaiEsg: '10000',
};

const EMPTY_DEDUCTIONS = {
  hasSpouse: false,
  childrenCount: 0,
  parentsCount: 0,
  lifeInsurance: '',
  healthInsurance: '',
  rmf: '',
  thaiEsg: '',
};

export default function App() {
  const taxYear = useMemo(() => getTaxYearMetadata(), []);

  const [isSampleMode, setIsSampleMode] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return !!parsed.isSampleMode;
      }
    } catch {
      // ignore
    }
    return true;
  });

  const [companies, setCompanies] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.companies) && parsed.companies.length > 0) {
          return parsed.companies;
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_SAMPLE_COMPANIES;
  });

  const [activeCoIdx, setActiveCoIdx] = useState(() =>
    companies.length > 1 ? 1 : 0
  );

  const [deductions, setDeductions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.deductions) return parsed.deductions;
      }
    } catch {
      // ignore
    }
    return DEFAULT_SAMPLE_DEDUCTIONS;
  });

  const [extraRmf, setExtraRmf] = useState(0);
  const [extraEsg, setExtraEsg] = useState(0);

  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // ignore
    }
    return 'light'; // Default: warm bright cream
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    document.title = `${STRINGS.APP_TITLE_PREFIX} ${taxYear.be}`;
  }, [taxYear.be]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ companies, deductions, isSampleMode })
      );
    } catch {
      // ignore
    }
  }, [companies, deductions, isSampleMode]);

  const handleStartOwn = () => {
    setIsSampleMode(false);
    setCompanies([createEmptyCompany()]);
    setActiveCoIdx(0);
    setDeductions(EMPTY_DEDUCTIONS);
    setExtraRmf(0);
    setExtraEsg(0);
  };

  const handleLoadSample = () => {
    setIsSampleMode(true);
    setCompanies(DEFAULT_SAMPLE_COMPANIES);
    setActiveCoIdx(1);
    setDeductions(DEFAULT_SAMPLE_DEDUCTIONS);
    setExtraRmf(0);
    setExtraEsg(0);
  };

  const handleUpdateCompany = (idx, updatedCo) => {
    const next = [...companies];
    next[idx] = updatedCo;
    setCompanies(next);
  };

  const handleAddCompany = () => {
    const last = companies[companies.length - 1] || createEmptyCompany();
    const startMonth = Math.min(12, (Math.round(evalNumber(last.endMonth)) || 12) + 1);
    const newCo = createEmptyCompany({
      name: `${STRINGS.COMPANY_DEFAULT_PREFIX} ${companies.length + 1}`,
      startMonth,
      endMonth: 12,
      pvdRateEmp: last.pvdRateEmp,
      pvdRateCo: last.pvdRateCo,
    });
    const next = [...companies, newCo];
    setCompanies(next);
    setActiveCoIdx(next.length - 1);
  };

  const handleDeleteCompany = (idx) => {
    if (companies.length <= 1) return;
    const next = companies.filter((_, i) => i !== idx);
    setCompanies(next);
    setActiveCoIdx(Math.max(0, idx - 1));
  };

  const handleUpdateExtra = (type, val) => {
    if (type === 'rmf') setExtraRmf(val);
    if (type === 'esg') setExtraEsg(val);
  };

  const handleResetSim = () => {
    setExtraRmf(0);
    setExtraEsg(0);
  };

  // Base Tax Plan
  const basePlan = useMemo(
    () => calculateTaxPlan(companies, deductions, 0, 0, 0),
    [companies, deductions]
  );

  // Simulated Tax Plan
  const simPlan = useMemo(
    () => calculateTaxPlan(companies, deductions, 0, extraRmf, extraEsg),
    [companies, deductions, extraRmf, extraEsg]
  );

  // Full RMF & Full ESG & Drop-1-Bracket Plans for ROI & Advice
  const fullRmfPlan = useMemo(
    () => calculateTaxPlan(companies, deductions, 0, basePlan.rmfRoom, 0),
    [companies, deductions, basePlan.rmfRoom]
  );

  const fullEsgPlan = useMemo(
    () => calculateTaxPlan(companies, deductions, 0, 0, basePlan.esgRoom),
    [companies, deductions, basePlan.esgRoom]
  );

  const dropBracketPlan = useMemo(
    () =>
      basePlan.recommendedRmf > 0
        ? calculateTaxPlan(companies, deductions, 0, basePlan.recommendedRmf, 0)
        : null,
    [companies, deductions, basePlan.recommendedRmf]
  );

  const activeCompany = companies[activeCoIdx] || companies[0];
  const activeBreakdown = basePlan.companyBreakdowns[activeCoIdx] || basePlan.companyBreakdowns[0];

  return (
    <div className="wrap">
      <Header
        taxYear={taxYear}
        isSampleMode={isSampleMode}
        onStartOwn={handleStartOwn}
        onLoadSample={handleLoadSample}
        isRefund={basePlan.isRefund}
        settlement={basePlan.settlement}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      />

      <div className="grid">
        {/* LEFT COLUMN: FORM STEPS 1-4 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          <SalarySection
            companies={companies}
            activeCoIdx={activeCoIdx}
            onSelectCompany={setActiveCoIdx}
            onAddCompany={handleAddCompany}
            onDeleteCompany={handleDeleteCompany}
            onUpdateCompany={handleUpdateCompany}
          />

          <WithholdingSection
            company={activeCompany}
            companyBreakdown={activeBreakdown}
            onUpdateWithholding={(val) =>
              handleUpdateCompany(activeCoIdx, { ...activeCompany, withholdingTax: val })
            }
          />

          <DeductionsSection
            deductions={deductions}
            ssDeduction={basePlan.ssDeduction}
            pvdUsed={basePlan.pvdUsed}
            onUpdateDeductions={setDeductions}
          />

          <FundsSection
            deductions={deductions}
            onUpdateDeductions={setDeductions}
          />
        </div>

        {/* RIGHT COLUMN: STICKY RESULTS (7 CARDS IN ORDER) */}
        <aside
          className="results"
          style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}
        >
          {/* 1. Hero Summary */}
          <HeroSummaryCard basePlan={basePlan} />

          {/* 2. RMF Advice */}
          <RmfAdviceCard
            basePlan={basePlan}
            monthsLeft={taxYear.monthsLeft}
            fullRmfPlan={fullRmfPlan}
            dropBracketPlan={dropBracketPlan}
          />

          {/* 3. Retirement Pool (500,000 Cap + RMF/PVD Tiles) */}
          <RetirementPoolCard basePlan={basePlan} />

          {/* 4. Per-Company Breakdown */}
          <CompanyBreakdownCard companies={companies} basePlan={basePlan} />

          {/* 5. What-If Simulator */}
          <WhatIfSimulator
            basePlan={basePlan}
            simPlan={simPlan}
            fullRmfPlan={fullRmfPlan}
            fullEsgPlan={fullEsgPlan}
            dropBracketPlan={dropBracketPlan}
            deductions={deductions}
            extraRmf={extraRmf}
            extraEsg={extraEsg}
            taxYear={taxYear}
            onUpdateExtra={handleUpdateExtra}
            onResetSim={handleResetSim}
          />

          {/* 6. Ask AI */}
          <AskAiCard basePlan={basePlan} taxYear={taxYear} />

          {/* 7. Details & Waterfall */}
          <TaxDetailsCard basePlan={basePlan} taxYear={taxYear} />
        </aside>
      </div>
    </div>
  );
}
