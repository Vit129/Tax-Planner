import { migrateOtherIncome } from '../logic/migrateOtherIncome';
import React, { useState, useEffect, useMemo } from 'react';
import { INITIAL_FLOW_STATE } from '@vit129/tax-ui';
import EasyTaxApp from './EasyTaxApp';
import STRINGS from '../config/strings';
import { getTaxYearMetadata } from '../logic/taxLogic';
import { evalNumber } from '../logic/evalExpression';
import {
  fromCoreCompany,
  createNextTpCompany,
  applyEasyDeductionUpdate,
  hasTaxSummaryData,
} from '../logic/easyTaxAdapter';

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

function cloneCompanies(list) {
  return (list || []).map((c) =>
    createEmptyCompany({
      ...c,
      salaryAdjustments: Array.isArray(c.salaryAdjustments)
        ? c.salaryAdjustments.map((adj) => ({ ...adj }))
        : [],
      monthlyOverrides: { ...(c.monthlyOverrides || {}) },
      otMonthly: { ...(c.otMonthly || {}) },
    })
  );
}

export default function App() {
  const taxYear = useMemo(() => getTaxYearMetadata(), []);

  const [isSampleMode, setIsSampleMode] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Boolean(parsed.isSampleMode);
      }
    } catch {
      // ignore
    }
    return true;
  });

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) || 'light';
    } catch {
      return 'light';
    }
  });

  const [companies, setCompanies] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.companies) && parsed.companies.length > 0) {
          return cloneCompanies(parsed.companies);
        }
      }
    } catch {
      // ignore
    }
    return cloneCompanies(DEFAULT_SAMPLE_COMPANIES);
  });

  const [deductions, setDeductions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.deductions) {
          return { ...EMPTY_DEDUCTIONS, ...parsed.deductions };
        }
      }
    } catch {
      // ignore
    }
    return { ...DEFAULT_SAMPLE_DEDUCTIONS };
  });

  const [foreignIncome, setForeignIncome] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return evalNumber(parsed.foreignIncome);
      }
    } catch {
      // ignore
    }
    return 0;
  });

  const [otherIncome, setOtherIncome] = useState(() => {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return migrateOtherIncome(data.otherIncome);
    } catch { return []; }
  });

  const [flowState, setFlowState] = useState(() => ({
    ...INITIAL_FLOW_STATE,
    isSummaryMode: hasTaxSummaryData(companies, deductions, foreignIncome, otherIncome),
  }));

  const [simExtra, setSimExtra] = useState({
    extraRmf: 0,
    extraEsg: 0,
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          companies,
          deductions,
          foreignIncome,
          otherIncome,
          isSampleMode,
        })
      );
    } catch {
      // ignore
    }
  }, [companies, deductions, foreignIncome, otherIncome, isSampleMode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleStartOwn = () => {
    setCompanies([createEmptyCompany()]);
    setDeductions({ ...EMPTY_DEDUCTIONS });
    setForeignIncome(0);
    setOtherIncome([]);
    setSimExtra({ extraRmf: 0, extraEsg: 0 });
    setIsSampleMode(false);
    setFlowState({
      ...INITIAL_FLOW_STATE,
      hasSavedOwnData: true,
      isSummaryMode: false,
    });
  };

  const handleLoadSample = () => {
    setCompanies(cloneCompanies(DEFAULT_SAMPLE_COMPANIES));
    setDeductions({ ...DEFAULT_SAMPLE_DEDUCTIONS });
    setForeignIncome(0);
    setOtherIncome([]);
    setSimExtra({ extraRmf: 0, extraEsg: 0 });
    setIsSampleMode(true);
    setFlowState({
      ...INITIAL_FLOW_STATE,
      hasSavedOwnData: false,
      isSummaryMode: true,
    });
  };

  const handleUpdateCompany = (idx, nextCore) => {
    setCompanies((prev) =>
      prev.map((c, i) => (i === idx ? fromCoreCompany(nextCore, c) : c))
    );
  };

  const handleAddCompany = () => {
    setCompanies((prev) => [
      ...prev,
      createNextTpCompany(prev, STRINGS.COMPANY_DEFAULT_PREFIX),
    ]);
  };

  const handleRemoveCompany = (idx) => {
    setCompanies((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev));
  };

  const handleUpdateWithholding = (idx, val) => {
    setCompanies((prev) =>
      prev.map((c, i) =>
        i === idx
          ? {
              ...c,
              withholdingTax:
                val === null || val === undefined || String(val).trim() === ''
                  ? ''
                  : evalNumber(val),
            }
          : c
      )
    );
  };

  const handleResetToAutoWithholding = () => {
    setCompanies((prev) => prev.map((c) => ({ ...c, withholdingTax: '' })));
  };

  const handleUpdateDeduction = (field, val) => {
    setDeductions((prev) => applyEasyDeductionUpdate(prev, field, val));
  };

  const handleUpdateRmf = (val) => {
    setDeductions((prev) => applyEasyDeductionUpdate(prev, 'rmf', val));
  };

  const handleUpdateEsg = (val) => {
    setDeductions((prev) => applyEasyDeductionUpdate(prev, 'thaiEsg', val));
  };

  return (
    <EasyTaxApp
      companies={companies}
      deductions={deductions}
      foreignIncome={foreignIncome}
      otherIncome={otherIncome}
      onChangeOtherIncome={setOtherIncome}
      flowState={flowState}
      onUpdateFlow={setFlowState}
      simExtra={simExtra}
      onChangeSimExtra={setSimExtra}
      onUpdateCompany={handleUpdateCompany}
      onAddCompany={handleAddCompany}
      onRemoveCompany={handleRemoveCompany}
      onUpdateWithholding={handleUpdateWithholding}
      onResetToAutoWithholding={handleResetToAutoWithholding}
      onUpdateDeduction={handleUpdateDeduction}
      onUpdateRmf={handleUpdateRmf}
      onUpdateEsg={handleUpdateEsg}
      onResetSample={handleLoadSample}
      onClearData={handleStartOwn}
      isSampleData={isSampleMode}
      theme={theme}
      onToggleTheme={handleToggleTheme}
      taxYear={taxYear}
    />
  );
}
