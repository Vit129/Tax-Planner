import React from 'react';
import Card from '../shared/Card';
import MoneyInput from '../shared/MoneyInput';
import STRINGS from '../../config/strings';

export default function FundsSection({ deductions, onUpdateDeductions }) {
  const d = deductions || {};
  const up = (key, val) => onUpdateDeductions({ ...d, [key]: val });

  return (
    <Card stepNumber={4} title={STRINGS.STEP_4_TITLE} dataTestId="funds-section">
      <div className="row2">
        <MoneyInput
          id="rmf"
          label={STRINGS.LBL_RMF_BOUGHT}
          prefix="฿"
          value={d.rmf}
          placeholder="0"
          onChange={(v) => up('rmf', v)}
          dataTestId="input-rmf-bought"
        />
        <MoneyInput
          id="esg"
          label={STRINGS.LBL_ESG_BOUGHT}
          prefix="฿"
          value={d.thaiEsg}
          placeholder="0"
          onChange={(v) => up('thaiEsg', v)}
          dataTestId="input-esg-bought"
        />
      </div>
      <p className="note">{STRINGS.NOTE_FUNDS_CAP}</p>
    </Card>
  );
}
