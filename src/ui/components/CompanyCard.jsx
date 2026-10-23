import React, { useState } from 'react';
import { MONTH_NAMES_TH } from '../../config/taxRules';
import {
  getCompanyMonthlySalaries,
  getCompanyAnnualSalary,
  getCompanyLastSalary,
  getCompanyFixedBonus,
  getCompanyPvdEmployee,
  estimateCompanyWithholding,
} from '../../logic/companyLogic';
import { calculateProgressiveTax } from '../../logic/taxLogic';
import { formatCurrency, evalNumber } from '../../logic/evalExpression';
import IncomeCalendar from './IncomeCalendar';

export default function CompanyCard({
  company,
  index,
  canRemove,
  onUpdate,
  onRemove,
}) {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const up = (key, val) => onUpdate({ ...company, [key]: val });

  const startMonth = Math.max(1, Math.min(12, Math.round(evalNumber(company.startMonth)) || 1));
  const endMonth = Math.max(1, Math.min(12, Math.round(evalNumber(company.endMonth)) || 12));
  const monthsWorked = Math.max(0, endMonth - startMonth + 1);

  const adjustments = Array.isArray(company.salaryAdjustments) ? company.salaryAdjustments : [];
  const hasAdjustments = adjustments.length > 0;

  const annualSalary = getCompanyAnnualSalary(company);
  const lastSalary = getCompanyLastSalary(company);
  const fixedBonusAmt = getCompanyFixedBonus(company);
  const pvdEmpAmt = getCompanyPvdEmployee(company);
  const estimatedWh = estimateCompanyWithholding(company, calculateProgressiveTax);

  const monthlySalaries = getCompanyMonthlySalaries(company);

  const handleAddAdjustment = () => {
    const nextMonth = Math.min(12, startMonth + 1);
    const newAdj = [...adjustments, { month: nextMonth, salary: evalNumber(company.baseSalary) + 5000 }];
    up('salaryAdjustments', newAdj);
  };

  const handleUpdateAdjustment = (idx, field, val) => {
    const next = [...adjustments];
    next[idx] = { ...next[idx], [field]: val };
    up('salaryAdjustments', next);
  };

  const handleRemoveAdjustment = (idx) => {
    const next = adjustments.filter((_, i) => i !== idx);
    up('salaryAdjustments', next);
  };

  // Selected month calculations for breakdown
  const selSalary = selectedMonth ? monthlySalaries[selectedMonth - 1] : 0;
  const selPvd = selectedMonth ? Math.round(selSalary * (evalNumber(company.pvdRateEmp) / 100)) : 0;
  const selSs = selectedMonth ? Math.min(selSalary * 0.05, 750) : 0;
  const annualized = selSalary * 12;
  const exp = Math.min(annualized * 0.5, 100000);
  const net = Math.max(0, annualized - exp - 60000 - selSs * 12 - selPvd * 12);
  const selWh = selSalary > 0 ? Math.ceil(calculateProgressiveTax(net) / 12) : 0;
  const selTakeHome = selSalary - selPvd - selSs - selWh;

  return (
    <div className="card company-card">
      <div className="card-header">
        <div className="company-title-row">
          <span className="co-icon">🏢</span>
          <input
            type="text"
            className="input-co-name"
            value={company.name || ''}
            onChange={(e) => up('name', e.target.value)}
            placeholder={`บริษัทที่ ${index + 1}`}
          />
        </div>
        {canRemove && (
          <button type="button" className="btn-remove-co" onClick={onRemove} title="ลบบริษัทนี้">
            ลบบริษัท
          </button>
        )}
      </div>

      {/* 1. Employment Period */}
      <div className="subbox">
        <label className="field-label">📅 ช่วงเวลาทำงานในปีนี้ (เลือกเดือนเริ่ม - สิ้นสุด)</label>
        <div className="row-pair">
          <div>
            <span className="field-sub">เริ่มทำงาน:</span>
            <select
              value={startMonth}
              onChange={(e) => up('startMonth', Number(e.target.value))}
              className="select-month"
            >
              {MONTH_NAMES_TH.map((name, i) => (
                <option key={i + 1} value={i + 1}>
                  {name} (เดือน {i + 1})
                </option>
              ))}
            </select>
          </div>
          <div>
            <span className="field-sub">ถึงเดือน:</span>
            <select
              value={endMonth}
              onChange={(e) => up('endMonth', Number(e.target.value))}
              className="select-month"
            >
              {MONTH_NAMES_TH.map((name, i) => (
                <option key={i + 1} value={i + 1} disabled={i + 1 < startMonth}>
                  {name} (เดือน {i + 1})
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="field-hint text-success">
          {monthsWorked === 12
            ? '✓ ทำงานเต็มปี 12 เดือน'
            : `✓ ทำงาน ${monthsWorked} เดือนในปีนี้ (ระบบคำนวณฐานภาษีและประกันสังคมตามช่วงจริง)`}
        </div>
      </div>

      {/* 2. Base Salary */}
      <div className="form-group">
        <label className="field-label">💵 ฐานเงินเดือนเริ่มต้น (บาท/เดือน)</label>
        <div className="input-currency-wrapper">
          <input
            type="text"
            className="input-currency"
            value={company.baseSalary ?? ''}
            onChange={(e) => up('baseSalary', e.target.value)}
            placeholder="0"
          />
          <span className="currency-suffix">บาท/เดือน</span>
        </div>
      </div>

      {/* 3. Salary Adjustments */}
      <div className="subbox">
        <div className="adj-header">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={hasAdjustments}
              onChange={(e) => {
                if (e.target.checked) {
                  handleAddAdjustment();
                } else {
                  up('salaryAdjustments', []);
                }
              }}
            />
            <span className="font-semibold">📈 มีการปรับเงินเดือนขึ้นในปีนี้</span>
          </label>
          {hasAdjustments && (
            <button type="button" className="btn-add-step" onClick={handleAddAdjustment}>
              + เพิ่มการปรับเงินเดือน
            </button>
          )}
        </div>

        {hasAdjustments && (
          <div className="adj-list">
            {adjustments.map((adj, i) => (
              <div key={i} className="adj-row">
                <span className="adj-tag">สเต็ป {i + 1}:</span>
                <span className="text-muted">ปรับตั้งแต่เดือน</span>
                <select
                  value={adj.month || startMonth + 1}
                  onChange={(e) => handleUpdateAdjustment(i, 'month', Number(e.target.value))}
                  className="select-adj-month"
                >
                  {MONTH_NAMES_TH.map((name, mIdx) => (
                    <option key={mIdx + 1} value={mIdx + 1}>
                      {name}
                    </option>
                  ))}
                </select>
                <span className="text-muted">เป็นเงินเดือน</span>
                <input
                  type="text"
                  value={adj.salary ?? ''}
                  onChange={(e) => handleUpdateAdjustment(i, 'salary', e.target.value)}
                  className="input-adj-salary"
                  placeholder="0"
                />
                <button
                  type="button"
                  className="btn-del-adj"
                  onClick={() => handleRemoveAdjustment(i)}
                  title="ลบสเต็ปนี้"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 🗓️ 12-Month Calendar Grid View */}
        <IncomeCalendar
          company={company}
          onSelectMonth={setSelectedMonth}
          selectedMonth={selectedMonth}
        />

        {/* Month Detail Popup/Box */}
        {selectedMonth && (
          <div className="month-detail-card">
            <div className="month-detail-header">
              <span>📌 รายละเอียดรายเดือน: <b>{MONTH_NAMES_TH[selectedMonth - 1]}</b></span>
              <button type="button" className="btn-close-detail" onClick={() => setSelectedMonth(null)}>✕</button>
            </div>
            <div className="month-detail-grid">
              <div className="detail-item">
                <span className="text-muted">เงินเดือน:</span>
                <b className="text-accent">฿{formatCurrency(selSalary)}</b>
              </div>
              <div className="detail-item">
                <span className="text-muted">หัก PVD ({company.pvdRateEmp || 0}%):</span>
                <b className="text-danger">-฿{formatCurrency(selPvd)}</b>
              </div>
              <div className="detail-item">
                <span className="text-muted">หัก ประกันสังคม:</span>
                <b className="text-danger">-฿{formatCurrency(selSs)}</b>
              </div>
              <div className="detail-item">
                <span className="text-muted">หัก ภาษี ณ ที่จ่าย (ประมาณการ):</span>
                <b className="text-danger">-฿{formatCurrency(selWh)}</b>
              </div>
              <div className="detail-item total-item">
                <span>รับสุทธิเข้าบัญชี (Take-home):</span>
                <b className="text-success">฿{formatCurrency(selTakeHome)}</b>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Bonus & OT */}
      <div className="row-pair form-group">
        <div>
          <label className="field-label">🎁 โบนัสคงที่ (Fixed Bonus)</label>
          <div className="input-group-addon">
            <input
              type="number"
              step="0.5"
              min="0"
              value={company.bonusFixedMonths ?? ''}
              onChange={(e) => up('bonusFixedMonths', e.target.value)}
              placeholder="0"
              className="input-small-num"
            />
            <span className="addon-text">เดือน (= ฿{formatCurrency(fixedBonusAmt)})</span>
          </div>
        </div>
        <div>
          <label className="field-label">🏆 โบนัสพิเศษ / Variable</label>
          <input
            type="text"
            value={company.bonusVariable ?? ''}
            onChange={(e) => up('bonusVariable', e.target.value)}
            placeholder="0"
            className="input-text"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="field-label">⚡ OT / ค่าคอมมิชชั่น / รายได้พิเศษรวมทั้งปี</label>
        <input
          type="text"
          value={company.extraIncome ?? ''}
          onChange={(e) => up('extraIncome', e.target.value)}
          placeholder="0"
          className="input-text"
        />
      </div>

      {/* 5. PVD & Withholding Tax */}
      <div className="row-pair form-group">
        <div>
          <label className="field-label">🛡️ กองทุนสำรองเลี้ยงชีพ (PVD พนักงาน %)</label>
          <div className="input-group-addon">
            <input
              type="number"
              min="0"
              max="15"
              step="1"
              value={company.pvdRateEmp ?? ''}
              onChange={(e) => up('pvdRateEmp', e.target.value)}
              placeholder="0"
              className="input-small-num"
            />
            <span className="addon-text">% (= ฿{formatCurrency(pvdEmpAmt)}/ปี)</span>
          </div>
        </div>
        <div>
          <label className="field-label">📑 ภาษีหัก ณ ที่จ่ายรวม (ตามใบ 50 ทวิ)</label>
          <input
            type="text"
            value={company.withholdingTax ?? ''}
            onChange={(e) => up('withholdingTax', e.target.value)}
            placeholder={`~฿${formatCurrency(estimatedWh)} (ประมาณการ)`}
            className="input-text text-danger"
          />
        </div>
      </div>
    </div>
  );
}
