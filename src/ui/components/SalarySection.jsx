import React, { useState } from 'react';
import Card from '../shared/Card';
import MoneyInput from '../shared/MoneyInput';
import ChipButton from '../shared/ChipButton';
import STRINGS from '../../config/strings';
import COLORS from '../../config/colors';
import { MONTH_SHORT_TH, DEDUCTION_RULES } from '../../config/taxRules';
import {
  isCompanyActiveMonth,
  getCompanyBaseSalaryAtMonth,
  getCompanyMonthlySalaries,
  getCompanyLastSalary,
  getCompanyTotalBonus,
} from '../../logic/companyLogic';
import { evalNumber, formatBaht, formatShortBaht } from '../../logic/evalExpression';

export default function SalarySection({
  companies,
  activeCoIdx,
  onSelectCompany,
  onAddCompany,
  onDeleteCompany,
  onUpdateCompany,
}) {
  const [selectedMonth, setSelectedMonth] = useState(9); // 1..12 (default Sep = 9)
  const [onlyThisMonth, setOnlyThisMonth] = useState(false);

  const company = companies[activeCoIdx] || companies[0];
  const startMonth = Math.max(1, Math.min(12, Math.round(evalNumber(company.startMonth)) || 1));
  const endMonth = Math.max(1, Math.min(12, Math.round(evalNumber(company.endMonth)) || 12));

  const salaries = getCompanyMonthlySalaries(company);
  const adjustments = Array.isArray(company.salaryAdjustments)
    ? [...company.salaryAdjustments].sort((a, b) => a.month - b.month)
    : [];
  const overrides = company.monthlyOverrides || {};
  const otMonthly = company.otMonthly || {};

  const up = (field, val) => {
    const next = { ...company, [field]: val };
    if (field === 'startMonth' && Number(val) > endMonth) {
      next.endMonth = Number(val);
    }
    if (field === 'endMonth' && Number(val) < startMonth) {
      next.startMonth = Number(val);
    }
    onUpdateCompany(activeCoIdx, next);
  };

  const handleSelectCo = (idx) => {
    onSelectCompany(idx);
    const targetCo = companies[idx];
    if (targetCo && !isCompanyActiveMonth(targetCo, selectedMonth)) {
      setSelectedMonth(Math.max(1, Math.round(evalNumber(targetCo.startMonth)) || 1));
    }
  };

  const handleMonthSalaryChange = (rawVal) => {
    const val = evalNumber(rawVal);
    if (onlyThisMonth) {
      const nextOverrides = { ...overrides, [selectedMonth]: rawVal === '' ? null : val };
      up('monthlyOverrides', nextOverrides);
    } else {
      const nextOverrides = { ...overrides };
      delete nextOverrides[selectedMonth];
      for (let m = selectedMonth + 1; m <= 12; m++) {
        delete nextOverrides[m];
      }
      const filteredAdj = adjustments.filter((r) => r.month !== selectedMonth);
      const baseBefore = getCompanyBaseSalaryAtMonth(
        { ...company, salaryAdjustments: filteredAdj },
        selectedMonth
      );
      if (val !== baseBefore) {
        filteredAdj.push({ month: selectedMonth, salary: val });
      }
      onUpdateCompany(activeCoIdx, {
        ...company,
        monthlyOverrides: nextOverrides,
        salaryAdjustments: filteredAdj,
      });
    }
  };

  const handleMonthOtherChange = (rawVal) => {
    const nextOt = { ...otMonthly, [selectedMonth]: rawVal === '' ? 0 : evalNumber(rawVal) };
    up('otMonthly', nextOt);
  };

  const handleRemoveRaise = (monthToRemove) => {
    const nextAdj = adjustments.filter((r) => r.month !== monthToRemove);
    up('salaryAdjustments', nextAdj);
  };

  const selActive = isCompanyActiveMonth(company, selectedMonth);
  const selSal = salaries[selectedMonth - 1] || 0;
  const selOther = evalNumber(otMonthly[selectedMonth]);
  const selPvd = selSal * (evalNumber(company.pvdRateEmp) / 100);
  const selSs = Math.min(DEDUCTION_RULES.SS_MONTHLY_MAX, selSal * 0.05);
  const prevSal =
    selectedMonth > 1 && isCompanyActiveMonth(company, selectedMonth - 1)
      ? salaries[selectedMonth - 2]
      : selSal;
  const diffPct = prevSal > 0 ? ((selSal - prevSal) / prevSal) * 100 : 0;

  const lastSal = getCompanyLastSalary(company);
  const totalBonus = getCompanyTotalBonus(company);

  return (
    <Card stepNumber={1} title={STRINGS.STEP_1_TITLE} dataTestId="salary-section">
      {/* Company Tabs */}
      <div className="toggle" id="coTabs" role="tablist">
        {companies.map((c, idx) => {
          const st = Math.max(1, Math.min(12, Math.round(evalNumber(c.startMonth)) || 1));
          const en = Math.max(1, Math.min(12, Math.round(evalNumber(c.endMonth)) || 12));
          const name = c.name || `${STRINGS.COMPANY_DEFAULT_PREFIX} ${idx + 1}`;
          return (
            <ChipButton
              key={idx}
              role="tab"
              active={idx === activeCoIdx}
              onClick={() => handleSelectCo(idx)}
              dataTestId={`co-tab-${idx}`}
            >
              {name} · {MONTH_SHORT_TH[st - 1]}–{MONTH_SHORT_TH[en - 1]}
            </ChipButton>
          );
        })}
      </div>

      {/* Company Name & Base Salary */}
      <div className="row2">
        <MoneyInput
          id="coName"
          label={STRINGS.LBL_COMPANY_NAME}
          value={company.name}
          onChange={(v) => up('name', v)}
          isText
          dataTestId="input-co-name"
        />
        <MoneyInput
          id="salary"
          label={STRINGS.LBL_BASE_SALARY}
          prefix="฿"
          value={company.baseSalary}
          onChange={(v) => up('baseSalary', v)}
          dataTestId="input-base-salary"
        />
      </div>

      {/* Period & PVD */}
      <div className="row2">
        <label className="f" htmlFor="start">
          {STRINGS.LBL_START_MONTH}
          <select
            id="start"
            className="money"
            style={{ padding: '0 10px' }}
            value={startMonth}
            onChange={(e) => up('startMonth', Number(e.target.value))}
            data-testid="select-start-month"
          >
            {MONTH_SHORT_TH.map((m, i) => (
              <option key={i + 1} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label className="f" htmlFor="end">
          {STRINGS.LBL_END_MONTH}
          <select
            id="end"
            className="money"
            style={{ padding: '0 10px' }}
            value={endMonth}
            onChange={(e) => up('endMonth', Number(e.target.value))}
            data-testid="select-end-month"
          >
            {MONTH_SHORT_TH.map((m, i) => (
              <option key={i + 1} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <MoneyInput
          id="pvdE"
          label={STRINGS.LBL_PVD_EMP}
          suffix="%"
          value={company.pvdRateEmp}
          onChange={(v) => up('pvdRateEmp', v)}
          dataTestId="input-pvd-emp"
        />
        <MoneyInput
          id="pvdC"
          label={STRINGS.LBL_PVD_CO}
          suffix="%"
          value={company.pvdRateCo}
          onChange={(v) => up('pvdRateCo', v)}
          dataTestId="input-pvd-co"
        />
      </div>

      {/* Add / Delete Company Buttons */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          className="btn"
          id="addCo"
          type="button"
          onClick={onAddCompany}
          dataTestId="btn-add-company"
        >
          {STRINGS.BTN_ADD_COMPANY}
        </button>
        {companies.length > 1 && (
          <button
            className="btn"
            id="delCo"
            type="button"
            style={{ color: COLORS.BAD }}
            onClick={() => onDeleteCompany(activeCoIdx)}
            dataTestId="btn-del-company"
          >
            {STRINGS.BTN_DEL_COMPANY}
          </button>
        )}
      </div>

      <p className="mut">{STRINGS.HINT_MONTH_GRID}</p>

      {/* 12-Month Grid */}
      <div className="months" id="months" data-testid="months-grid">
        {MONTH_SHORT_TH.map((mName, idx) => {
          const m = idx + 1;
          const here = isCompanyActiveMonth(company, m);
          const workedOther = companies.some(
            (otherCo, j) => j !== activeCoIdx && isCompanyActiveMonth(otherCo, m)
          );
          const s = salaries[idx];
          const o = evalNumber(otMonthly[m]);
          const hasRaise = adjustments.some((r) => r.month === m);
          const hasOverride = overrides[m] != null && overrides[m] !== '';

          return (
            <button
              key={m}
              type="button"
              className={`m${here ? '' : ' off'}${selectedMonth === m ? ' sel' : ''}`}
              onClick={() => setSelectedMonth(m)}
              data-testid={`month-btn-${m}`}
            >
              <span className="t">
                {mName}
                {hasRaise && <b style={{ color: COLORS.ACCENT }}> ▲</b>}
                {hasOverride && ' ✎'}
              </span>
              <span className="v">
                {here ? formatShortBaht(s) : workedOther ? STRINGS.MONTH_OTHER_COMPANY : '—'}
              </span>
              <span className="x">
                {o > 0 && here ? `+${formatShortBaht(o)}` : '\u00A0'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Raises list */}
      <div id="raises" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
        {adjustments.length > 0 ? (
          <>
            <span className="mut">{STRINGS.RAISE_LABEL}</span>
            {adjustments.map((r) => (
              <span
                key={r.month}
                className="chip"
                style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}
              >
                {MONTH_SHORT_TH[r.month - 1]} → {formatBaht(r.salary)}
                <button
                  type="button"
                  aria-label={STRINGS.ARIA_REMOVE_RAISE}
                  onClick={() => handleRemoveRaise(r.month)}
                  style={{
                    border: 0,
                    background: 'none',
                    color: COLORS.BAD,
                    fontSize: TYPOGRAPHY.SIZE_BASE,
                    cursor: 'pointer',
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </>
        ) : (
          <span className="mut">{STRINGS.RAISE_EMPTY_HINT}</span>
        )}
      </div>

      {/* Selected Month Detail */}
      <div className="detail" id="detail" data-testid="month-detail">
        <b>
          {STRINGS.MONTH_PREFIX} {MONTH_SHORT_TH[selectedMonth - 1]}
        </b>
        {selActive ? (
          <>
            <div className="row2">
              <MoneyInput
                id="mSal"
                label={STRINGS.LBL_MONTH_SALARY}
                prefix="฿"
                value={selSal}
                onChange={handleMonthSalaryChange}
                dataTestId="input-month-salary"
              />
              <MoneyInput
                id="mOther"
                label={STRINGS.LBL_MONTH_OTHER}
                prefix="฿"
                value={selOther || ''}
                placeholder="0"
                onChange={handleMonthOtherChange}
                dataTestId="input-month-other"
              />
            </div>

            <fieldset
              style={{
                border: 0,
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <legend className="mut" style={{ padding: 0, marginBottom: 4 }}>
                {STRINGS.LEGEND_SALARY_SCOPE}
              </legend>
              <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <input
                  type="radio"
                  name="scope"
                  value="fwd"
                  checked={!onlyThisMonth}
                  onChange={() => setOnlyThisMonth(false)}
                  style={{ marginTop: 6 }}
                />
                <span>
                  {STRINGS.SCOPE_FWD_TITLE}{' '}
                  <span className="mut">{STRINGS.SCOPE_FWD_SUB}</span>
                </span>
              </label>
              <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <input
                  type="radio"
                  name="scope"
                  value="one"
                  checked={onlyThisMonth}
                  onChange={() => setOnlyThisMonth(true)}
                  style={{ marginTop: 6 }}
                />
                <span>
                  {STRINGS.SCOPE_ONE_TITLE}{' '}
                  <span className="mut">{STRINGS.SCOPE_ONE_SUB}</span>
                </span>
              </label>
            </fieldset>

            <p className="note">{STRINGS.NOTE_MONTH_EDIT}</p>

            <div className="slip">
              <span>
                {STRINGS.SLIP_TOTAL} <b className="num">{formatBaht(selSal + selOther)}</b>
              </span>
              <span>
                {STRINGS.SLIP_PVD} <b className="num">−{formatBaht(selPvd)}</b>
              </span>
              <span>
                {STRINGS.SLIP_SS} <b className="num">−{formatBaht(selSs)}</b>
              </span>
              {diffPct !== 0 && (
                <span>
                  {STRINGS.SLIP_DIFF_PREV}{' '}
                  <b className="num">
                    {diffPct > 0 ? '+' : ''}
                    {diffPct.toFixed(1)}%
                  </b>
                </span>
              )}
            </div>
          </>
        ) : (
          <p className="mut">
            {STRINGS.MSG_INACTIVE_MONTH(
              company.name || `${STRINGS.COMPANY_DEFAULT_PREFIX} ${activeCoIdx + 1}`
            )}
          </p>
        )}
      </div>

      {/* Bonus */}
      <div className="row2">
        <MoneyInput
          id="bonusM"
          label={STRINGS.LBL_BONUS_MONTHS}
          suffix={STRINGS.UNIT_MONTHS}
          value={company.bonusFixedMonths}
          onChange={(v) => up('bonusFixedMonths', v)}
          dataTestId="input-bonus-months"
        />
        <MoneyInput
          id="bonusX"
          label={STRINGS.LBL_BONUS_EXTRA}
          prefix="฿"
          value={company.bonusVariable}
          onChange={(v) => up('bonusVariable', v)}
          dataTestId="input-bonus-extra"
        />
      </div>
      <div className="formula" id="bonusF">
        {STRINGS.FORMULA_BONUS(
          formatBaht(lastSal),
          evalNumber(company.bonusFixedMonths),
          formatBaht(evalNumber(company.bonusVariable)),
          formatBaht(totalBonus)
        )}
      </div>
    </Card>
  );
}
