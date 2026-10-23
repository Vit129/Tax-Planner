import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import CompanyList from './components/CompanyList';
import DeductionsCard from './components/DeductionsCard';
import TaxSummaryCard from './components/TaxSummaryCard';
import WhatIfSimulator from './components/WhatIfSimulator';
import { calculateTaxPlan } from '../logic/taxLogic';

const STORAGE_KEY = 'TAX_PLANNER_DATA_V1';

const DEFAULT_SAMPLE_COMPANIES = [
  {
    name: 'บริษัทเก่า (ตัวอย่างย้ายงาน)',
    startMonth: 1,
    endMonth: 3,
    baseSalary: 55000,
    salaryAdjustments: [],
    bonusFixedMonths: 0,
    bonusVariable: 0,
    extraIncome: 12000,
    pvdRateEmp: 3,
    pvdRateCo: 3,
    withholdingTax: '',
  },
  {
    name: 'บริษัทใหม่ (เริ่มงาน เม.ย. และปรับเงินเดือน)',
    startMonth: 4,
    endMonth: 12,
    baseSalary: 75000,
    salaryAdjustments: [
      { month: 9, salary: 82000 } // ผ่านโปร ปรับเงินเดือนในเดือน ก.ย.
    ],
    bonusFixedMonths: 1.5,
    bonusVariable: 30000,
    extraIncome: 25000,
    pvdRateEmp: 5,
    pvdRateCo: 5,
    withholdingTax: '',
  },
];

const DEFAULT_SAMPLE_DEDUCTIONS = {
  hasSpouse: false,
  childrenCount: 1,
  children2018PlusCount: 0,
  parentsCount: 1,
  parentsHealthInsurance: 0,
  disabledCareCount: 0,
  antenatalCare: 0,
  lifeInsurance: 30000,
  healthInsurance: 15000,
  pensionInsurance: 0,
  spouseLifeInsurance: 0,
  rmf: 20000,
  thaiEsg: 0,
  easyEReceipt: 25000,
  mortgageInterest: 0,
  donationGeneral: 0,
  donationEducation: 0,
  donationParty: 0,
};

const EMPTY_COMPANIES = [
  {
    name: 'บริษัทหลัก',
    startMonth: 1,
    endMonth: 12,
    baseSalary: 60000,
    salaryAdjustments: [],
    bonusFixedMonths: 1,
    bonusVariable: 0,
    extraIncome: 0,
    pvdRateEmp: 5,
    pvdRateCo: 5,
    withholdingTax: '',
  },
];

export default function App() {
  const [companies, setCompanies] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.companies) && parsed.companies.length > 0) return parsed.companies;
      }
    } catch {
      // ignore
    }
    return DEFAULT_SAMPLE_COMPANIES;
  });

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

  const [foreignIncome, setForeignIncome] = useState(0);
  const [extraRmf, setExtraRmf] = useState(0);
  const [extraEsg, setExtraEsg] = useState(0);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ companies, deductions, foreignIncome }));
    } catch {
      // ignore
    }
  }, [companies, deductions, foreignIncome]);

  const handleReset = () => {
    if (window.confirm('คุณต้องการล้างข้อมูลทั้งหมดเพื่อเริ่มกรอกใหม่หรือไม่?')) {
      setCompanies(EMPTY_COMPANIES);
      setDeductions({});
      setForeignIncome(0);
      setExtraRmf(0);
      setExtraEsg(0);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleLoadSample = () => {
    setCompanies(DEFAULT_SAMPLE_COMPANIES);
    setDeductions(DEFAULT_SAMPLE_DEDUCTIONS);
    setExtraRmf(0);
    setExtraEsg(0);
  };

  const handleUpdateExtra = (type, val) => {
    if (type === 'rmf') setExtraRmf(val);
    if (type === 'esg') setExtraEsg(val);
  };

  // Base plan calculation
  const basePlan = useMemo(
    () => calculateTaxPlan(companies, deductions, foreignIncome, 0, 0),
    [companies, deductions, foreignIncome]
  );

  // Simulation plan calculation with extra RMF/ESG
  const simPlan = useMemo(
    () => calculateTaxPlan(companies, deductions, foreignIncome, extraRmf, extraEsg),
    [companies, deductions, foreignIncome, extraRmf, extraEsg]
  );

  const taxSavings = Math.max(0, basePlan.taxPayable - simPlan.taxPayable);

  return (
    <div className="app-container">
      <Header onReset={handleReset} onLoadSample={handleLoadSample} />

      <main className="main-layout">
        {/* Left Column: Inputs */}
        <section className="col-inputs">
          <CompanyList companies={companies} onUpdateCompanies={setCompanies} />
          <DeductionsCard deductions={deductions} onUpdateDeductions={setDeductions} />
        </section>

        {/* Right Column: Live Summary & Simulator */}
        <aside className="col-summary">
          <TaxSummaryCard
            basePlan={basePlan}
            simPlan={simPlan}
            extraRmf={extraRmf}
            extraEsg={extraEsg}
          />

          <WhatIfSimulator
            extraRmf={extraRmf}
            extraEsg={extraEsg}
            rmfRoom={basePlan.rmfRoom}
            esgRoom={basePlan.esgRoom}
            taxSavings={taxSavings}
            onUpdateExtra={handleUpdateExtra}
          />
        </aside>
      </main>
    </div>
  );
}
