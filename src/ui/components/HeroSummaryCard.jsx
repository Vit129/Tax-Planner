import React from 'react';
import Card from '../shared/Card';
import BreakdownTile from '../shared/BreakdownTile';
import STRINGS from '../../config/strings';
import { BRACKET_RATES_PCT } from '../../config/taxRules';
import { formatBaht } from '../../logic/evalExpression';

export default function HeroSummaryCard({ basePlan }) {
  const {
    isRefund,
    settlement,
    totalWithholding,
    whRealAll,
    taxPayable,
    totalIncome,
    expenses,
    deductions,
    netIncome,
    marginalRate,
  } = basePlan;

  const mePct = Math.round(marginalRate * 100);

  return (
    <Card dataTestId="hero-summary-card">
      <div className={`hero ${isRefund ? 'ok' : 'pay'}`} id="hero" role="status" aria-live="polite">
        <span>{isRefund ? STRINGS.HERO_REFUND_TITLE : STRINGS.HERO_PAY_TITLE}</span>
        <span className="big">
          {isRefund ? '+' : '−'}
          {formatBaht(settlement)}
        </span>
        <span className="mut">
          {STRINGS.HERO_SUB_PREFIX} {formatBaht(totalWithholding)}{' '}
          <span className={`badge${whRealAll ? ' real' : ''}`}>
            {whRealAll ? STRINGS.BADGE_FROM_50TAWI : STRINGS.BADGE_ESTIMATED}
          </span>{' '}
          {STRINGS.HERO_SUB_TAX} {formatBaht(taxPayable)}
        </span>
      </div>

      <div className="tiles" id="tiles">
        <BreakdownTile label={STRINGS.TILE_ANNUAL_INCOME} value={formatBaht(totalIncome)} />
        <BreakdownTile label={STRINGS.TILE_TOTAL_DED} value={formatBaht(expenses + deductions)} />
        <BreakdownTile label={STRINGS.TILE_NET_INCOME} value={formatBaht(netIncome)} />
        <BreakdownTile label={STRINGS.TILE_ANNUAL_TAX} value={formatBaht(taxPayable)} />
      </div>

      <div className="ladder" id="ladder">
        {BRACKET_RATES_PCT.map((s) => (
          <span
            key={s}
            className={s === mePct ? 'me' : s < mePct ? 'on' : ''}
          >
            {s}%
          </span>
        ))}
      </div>
    </Card>
  );
}
