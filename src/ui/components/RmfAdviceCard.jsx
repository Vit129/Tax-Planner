import React from 'react';
import Card from '../shared/Card';
import STRINGS from '../../config/strings';
import COLORS from '../../config/colors';
import { MONTH_SHORT_TH } from '../../config/taxRules';
import {
  calculateProgressiveTax,
  getMarginalTaxRate,
} from '../../logic/taxLogic';
import { formatBaht, formatShortBaht } from '../../logic/evalExpression';

export default function RmfAdviceCard({
  basePlan,
  monthsLeft,
  fullRmfPlan,
  dropBracketPlan,
}) {
  const { marginalRate, neededToDropBracket, rmfRoom, taxPayable, netIncome } = basePlan;
  const mePct = Math.round(marginalRate * 100);

  const renderMonthChips = (amount) => {
    if (monthsLeft <= 0) return null;
    const perMonth = Math.ceil(amount / monthsLeft);
    const chipCount = Math.min(monthsLeft, 4);
    const startIdx = 12 - monthsLeft;

    return (
      <div className="mchips">
        {Array.from({ length: chipCount }, (_, i) => (
          <span key={i}>
            {MONTH_SHORT_TH[startIdx + i]} {formatShortBaht(perMonth)}
          </span>
        ))}
        {monthsLeft > 4 && <span>+{monthsLeft - 4} {STRINGS.UNIT_MONTHS}</span>}
      </div>
    );
  };

  if (marginalRate === 0) {
    return (
      <Card title={STRINGS.CARD_RMF_ADVICE_TITLE} dataTestId="rmf-advice-card">
        <p className="mut">{STRINGS.MSG_NO_TAX_NEEDED}</p>
      </Card>
    );
  }

  const canDropBracket = neededToDropBracket > 0 && neededToDropBracket <= rmfRoom;
  const nextRatePct = canDropBracket
    ? Math.round(getMarginalTaxRate(netIncome - neededToDropBracket) * 100)
    : mePct;
  const dropTaxSaved = canDropBracket && dropBracketPlan
    ? taxPayable - dropBracketPlan.taxPayable
    : canDropBracket
    ? taxPayable - calculateProgressiveTax(netIncome - neededToDropBracket)
    : 0;

  const fullTaxSaved = fullRmfPlan ? taxPayable - fullRmfPlan.taxPayable : 0;

  return (
    <Card title={STRINGS.CARD_RMF_ADVICE_TITLE} dataTestId="rmf-advice-card">
      <div id="advice" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {canDropBracket && (
          <div className="advice">
            <b>{STRINGS.ADVICE_DROP_BRACKET(mePct, nextRatePct)}</b>
            <span>
              {STRINGS.ADVICE_BUY_MORE}{' '}
              <b className="num">{formatBaht(neededToDropBracket)}</b>
              {monthsLeft > 0 && (
                <>
                  {' '}
                  {STRINGS.ADVICE_PER_MONTH}{' '}
                  {formatBaht(Math.ceil(neededToDropBracket / monthsLeft))}
                </>
              )}
            </span>
            <span>
              {STRINGS.ADVICE_TAX_SAVED} {formatBaht(dropTaxSaved)}{' '}
              {STRINGS.ADVICE_NET_COST} {formatBaht(neededToDropBracket - dropTaxSaved)}
            </span>
            {renderMonthChips(neededToDropBracket)}
          </div>
        )}

        {rmfRoom > 0 && (
          <div className="advice" style={{ background: COLORS.SUNK }}>
            <b style={{ color: COLORS.FG }}>{STRINGS.ADVICE_FULL_RIGHT_TITLE}</b>
            <span>
              {STRINGS.ADVICE_BUY_EXTRA} <b className="num">{formatBaht(rmfRoom)}</b> ·{' '}
              {STRINGS.ADVICE_TAX_SAVED} {formatBaht(fullTaxSaved)}{' '}
              {STRINGS.ADVICE_NET_COST} {formatBaht(rmfRoom - fullTaxSaved)}
            </span>
          </div>
        )}

        <p className="mut">
          {STRINGS.ADVICE_PER_1000(formatBaht(1000 * marginalRate))} ·{' '}
          <a href="#sim">{STRINGS.LINK_TRY_SIM}</a>
        </p>
      </div>
    </Card>
  );
}
