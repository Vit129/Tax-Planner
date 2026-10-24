import React from 'react';
import Card from '../shared/Card';
import MoneyInput from '../shared/MoneyInput';
import STRINGS from '../../config/strings';
import { formatBaht, formatCurrency } from '../../logic/evalExpression';

export default function WithholdingSection({
  company,
  companyBreakdown,
  onUpdateWithholding,
}) {
  const whReal = companyBreakdown?.whReal;
  const whEst = companyBreakdown?.whEst || 0;

  const badge = (
    <span className={`badge${whReal ? ' real' : ''}`} id="whBadge">
      {whReal ? STRINGS.BADGE_WH_REAL : `${STRINGS.BADGE_WH_EST_PREFIX} ${formatBaht(whEst)}`}
    </span>
  );

  return (
    <Card
      stepNumber={2}
      title={STRINGS.STEP_2_TITLE}
      rightElement={badge}
      dataTestId="withholding-section"
    >
      <MoneyInput
        id="wh"
        label={STRINGS.LBL_WH_INPUT}
        prefix="฿"
        value={company?.withholdingTax ?? ''}
        placeholder={formatCurrency(whEst)}
        onChange={onUpdateWithholding}
        dataTestId="input-withholding"
      />
    </Card>
  );
}
