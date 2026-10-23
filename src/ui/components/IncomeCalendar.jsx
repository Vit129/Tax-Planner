import React from 'react';
import { MONTH_SHORT_TH } from '../../config/taxRules';
import { getCompanyMonthlySalaries } from '../../logic/companyLogic';
import { formatCurrency, evalNumber } from '../../logic/evalExpression';
import { calculateProgressiveTax } from '../../logic/taxLogic';
import { estimateCompanyWithholding } from '../../logic/companyLogic';

export default function IncomeCalendar({ company, onSelectMonth, selectedMonth }) {
  const start = Math.max(1, Math.min(12, Math.round(evalNumber(company.startMonth)) || 1));
  const end = Math.max(1, Math.min(12, Math.round(evalNumber(company.endMonth)) || 12));
  const salaries = getCompanyMonthlySalaries(company);
  const adjustments = Array.isArray(company.salaryAdjustments) ? company.salaryAdjustments : [];

  const currentCalMonth = new Date().getMonth() + 1;

  return (
    <div className="income-calendar-wrapper">
      <div className="calendar-header">
        <span className="calendar-title">🗓️ ปฏิทินรายได้ 12 เดือน (Calendar View)</span>
        <span className="calendar-sub">คลิกที่เดือนเพื่อดูรายละเอียดเงินเดือน & ภาษีหักรายเดือน</span>
      </div>

      <div className="calendar-grid">
        {MONTH_SHORT_TH.map((monthName, idx) => {
          const m = idx + 1;
          const isActive = m >= start && m <= end;
          const salary = salaries[m - 1];
          const isSelected = selectedMonth === m;
          const isCurrent = m === currentCalMonth;
          const adj = adjustments.find((a) => a.month === m);

          // Monthly PVD
          const pvdRate = evalNumber(company.pvdRateEmp) / 100;
          const pvdMonthly = isActive ? Math.round(salary * pvdRate) : 0;

          // Estimate monthly withholding (annualize this month)
          const ssMonthly = isActive ? Math.min(salary * 0.05, 750) : 0;
          const annualized = salary * 12;
          const exp = Math.min(annualized * 0.5, 100000);
          const net = Math.max(0, annualized - exp - 60000 - ssMonthly * 12 - pvdMonthly * 12);
          const monthlyWh = isActive && salary > 0 ? Math.ceil(calculateProgressiveTax(net) / 12) : 0;

          return (
            <div
              key={m}
              onClick={() => isActive && onSelectMonth?.(selectedMonth === m ? null : m)}
              className={`cal-cell ${isActive ? 'cal-active' : 'cal-inactive'} ${isSelected ? 'cal-selected' : ''} ${isCurrent ? 'cal-current' : ''}`}
              title={isActive ? `เดือน ${monthName}: เงินเดือน ฿${formatCurrency(salary)}` : 'ไม่ได้ทำงานที่นี่ในเดือนนี้'}
            >
              <div className="cal-cell-header">
                <span className="cal-month-name">
                  {monthName} {isCurrent ? '◀' : ''}
                </span>
                {adj && <span className="cal-adj-badge">★ ปรับ</span>}
              </div>

              <div className="cal-salary">
                {isActive && salary > 0 ? `฿${formatCurrency(salary)}` : '—'}
              </div>

              {isActive && monthlyWh > 0 && (
                <div className="cal-wh text-danger">
                  -฿{formatCurrency(monthlyWh)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
