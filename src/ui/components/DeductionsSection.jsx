import React, { useState } from 'react';
import Card from '../shared/Card';
import MoneyInput from '../shared/MoneyInput';
import ChipButton from '../shared/ChipButton';
import Stepper from '../shared/Stepper';
import STRINGS from '../../config/strings';
import { DEDUCTION_RULES, EXTRA_DEDUCTION_OPTIONS } from '../../config/taxRules';
import { evalNumber, formatBaht, formatCurrency } from '../../logic/evalExpression';

export default function DeductionsSection({
  deductions,
  ssDeduction,
  pvdUsed,
  onUpdateDeductions,
}) {
  const d = deductions || {};
  const [activeExtras, setActiveExtras] = useState(() => {
    const initial = {};
    EXTRA_DEDUCTION_OPTIONS.forEach((opt) => {
      if (evalNumber(d[opt.key]) > 0) initial[opt.key] = true;
    });
    return initial;
  });

  const up = (key, val) => {
    onUpdateDeductions({ ...d, [key]: val });
  };

  const toggleExtra = (key) => {
    const nextActive = { ...activeExtras };
    if (nextActive[key]) {
      delete nextActive[key];
      up(key, '');
    } else {
      nextActive[key] = true;
    }
    setActiveExtras(nextActive);
  };

  return (
    <Card stepNumber={3} title={STRINGS.STEP_3_TITLE} dataTestId="deductions-section">
      {/* Personal Deduction */}
      <div className="line">
        <div>
          <b>{STRINGS.DED_PERSONAL_LABEL}</b>
          <div className="auto">{STRINGS.DED_AUTO_TAG}</div>
        </div>
        <b className="num">{formatBaht(DEDUCTION_RULES.PERSONAL)}</b>
      </div>

      {/* Social Security */}
      <div className="line">
        <div>
          <b>{STRINGS.DED_SS_LABEL}</b>
          <div className="mut">{STRINGS.DED_SS_SUB}</div>
        </div>
        <b className="num" id="ssVal">
          {formatBaht(ssDeduction)}
        </b>
      </div>

      {/* PVD Employee */}
      <div className="line">
        <div>
          <b>{STRINGS.DED_PVD_LABEL}</b>
          <div className="mut">{STRINGS.DED_PVD_SUB}</div>
        </div>
        <b className="num" id="pvdVal">
          {formatBaht(pvdUsed)}
        </b>
      </div>

      {/* Spouse */}
      <div className="line">
        <div>
          <b>{STRINGS.DED_SPOUSE_LABEL}</b>
          <div className="mut">{STRINGS.DED_SPOUSE_SUB}</div>
        </div>
        <ChipButton
          id="spouse"
          active={!!d.hasSpouse}
          onClick={() => up('hasSpouse', !d.hasSpouse)}
          dataTestId="btn-spouse-toggle"
        >
          {d.hasSpouse ? STRINGS.BTN_HAS : STRINGS.BTN_NONE}
        </ChipButton>
      </div>

      {/* Kids */}
      <div className="line">
        <div>
          <b>{STRINGS.DED_KIDS_LABEL}</b>
          <div className="mut">{STRINGS.DED_KIDS_SUB}</div>
        </div>
        <Stepper
          value={evalNumber(d.childrenCount)}
          min={0}
          max={10}
          onChange={(v) => up('childrenCount', v)}
          dataTestId="stepper-kids"
        />
      </div>

      {/* Parents */}
      <div className="line">
        <div>
          <b>{STRINGS.DED_PARENTS_LABEL}</b>
          <div className="mut">{STRINGS.DED_PARENTS_SUB}</div>
        </div>
        <Stepper
          value={evalNumber(d.parentsCount)}
          min={0}
          max={4}
          onChange={(v) => up('parentsCount', v)}
          dataTestId="stepper-parents"
        />
      </div>

      {/* Life & Health Insurance */}
      <div className="row2">
        <MoneyInput
          id="life"
          label={STRINGS.LBL_LIFE_INS}
          prefix="฿"
          value={d.lifeInsurance}
          placeholder="0"
          onChange={(v) => up('lifeInsurance', v)}
          dataTestId="input-life-ins"
        />
        <MoneyInput
          id="health"
          label={STRINGS.LBL_HEALTH_INS}
          prefix="฿"
          value={d.healthInsurance}
          placeholder="0"
          onChange={(v) => up('healthInsurance', v)}
          dataTestId="input-health-ins"
        />
      </div>

      {/* Extra Deductions Chips */}
      <div>
        <div className="mut" style={{ marginBottom: 6 }}>
          {STRINGS.LBL_EXTRA_DEDUCTIONS}
        </div>
        <div className="toggle" id="extras">
          {EXTRA_DEDUCTION_OPTIONS.map((opt) => (
            <ChipButton
              key={opt.key}
              active={!!activeExtras[opt.key]}
              onClick={() => toggleExtra(opt.key)}
              dataTestId={`extra-chip-${opt.key}`}
            >
              {opt.label}
            </ChipButton>
          ))}
        </div>
      </div>

      {/* Dynamic Extra Input Fields */}
      <div className="row2" id="extraFields">
        {EXTRA_DEDUCTION_OPTIONS.filter((opt) => activeExtras[opt.key]).map((opt) => (
          <MoneyInput
            key={opt.key}
            id={`extra-${opt.key}`}
            label={`${opt.label}${
              opt.cap ? ` (≤${formatCurrency(opt.cap)})` : STRINGS.CAP_PCT_10
            }`}
            prefix="฿"
            value={d[opt.key]}
            placeholder="0"
            onChange={(v) => up(opt.key, v)}
            dataTestId={`input-extra-${opt.key}`}
          />
        ))}
      </div>
    </Card>
  );
}
