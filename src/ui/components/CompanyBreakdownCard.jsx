import React from 'react';
import Card from '../shared/Card';
import STRINGS from '../../config/strings';
import COLORS from '../../config/colors';
import TYPOGRAPHY from '../../config/typography';
import { MONTH_SHORT_TH } from '../../config/taxRules';
import { evalNumber, formatBaht } from '../../logic/evalExpression';

export default function CompanyBreakdownCard({ companies, basePlan }) {
  const { companyBreakdowns, totalIncome, totalWithholding } = basePlan;

  return (
    <Card id="coCard" title={STRINGS.CARD_BY_COMPANY_TITLE} dataTestId="company-breakdown-card">
      <div id="coTable" style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: TYPOGRAPHY.SIZE_LABEL,
          }}
        >
          <thead>
            <tr className="mut">
              <th style={{ textAlign: 'left' }}>{STRINGS.TH_COMPANY}</th>
              <th style={{ textAlign: 'right' }}>{STRINGS.TH_INCOME}</th>
              <th style={{ textAlign: 'right' }}>{STRINGS.TH_WITHHELD}</th>
            </tr>
          </thead>
          <tbody>
            {companyBreakdowns.map((bd, idx) => {
              const co = companies[idx] || {};
              const st = Math.max(1, Math.min(12, Math.round(evalNumber(co.startMonth)) || 1));
              const en = Math.max(1, Math.min(12, Math.round(evalNumber(co.endMonth)) || 12));
              const name = co.name || `${STRINGS.COMPANY_DEFAULT_PREFIX} ${idx + 1}`;
              return (
                <tr key={idx}>
                  <td>
                    {name}{' '}
                    <span className="mut">
                      {MONTH_SHORT_TH[st - 1]}–{MONTH_SHORT_TH[en - 1]}
                    </span>
                  </td>
                  <td className="num" style={{ textAlign: 'right' }}>
                    {formatBaht(bd.income)}
                  </td>
                  <td className="num" style={{ textAlign: 'right' }}>
                    {formatBaht(bd.wh)}{' '}
                    {!bd.whReal && <span className="badge">{STRINGS.BADGE_ESTIMATED}</span>}
                  </td>
                </tr>
              );
            })}
            <tr style={{ borderTop: `1px solid ${COLORS.LINE}` }}>
              <td>
                <b>{STRINGS.TR_TOTAL_YEAR}</b>
              </td>
              <td className="num" style={{ textAlign: 'right' }}>
                <b>{formatBaht(totalIncome)}</b>
              </td>
              <td className="num" style={{ textAlign: 'right' }}>
                <b>{formatBaht(totalWithholding)}</b>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {companies.length > 1 && <p className="mut" id="coNote">{STRINGS.NOTE_MULTI_COMPANY}</p>}
    </Card>
  );
}
