import React from 'react';
import Card from '../shared/Card';
import STRINGS from '../../config/strings';
import { formatBaht } from '../../logic/evalExpression';

export default function TaxDetailsCard({ basePlan, taxYear }) {
  const { totalIncome, expenses, deductionItems, netIncome, taxPayable } = basePlan;
  const checklistItems = STRINGS.DETAILS_CHECKLIST_ITEMS(taxYear.be, taxYear.fileBe);

  return (
    <Card dataTestId="tax-details-card">
      <details>
        <summary>{STRINGS.DETAILS_WATERFALL_TITLE}</summary>
        <div id="waterfall">
          <div className="line">
            <span>{STRINGS.WF_TOTAL_INCOME}</span>
            <span className="num">{formatBaht(totalIncome)}</span>
          </div>
          <div className="line">
            <span>{STRINGS.WF_EXPENSE}</span>
            <span className="num">−{formatBaht(expenses)}</span>
          </div>
          {deductionItems.map((item, idx) => (
            <div key={idx} className="line">
              <span className="mut">
                {STRINGS.WF_DED_PREFIX}
                {item.label}
              </span>
              <span className="num">−{formatBaht(item.amount)}</span>
            </div>
          ))}
          <div className="line">
            <b>{STRINGS.WF_NET_INCOME}</b>
            <b className="num">{formatBaht(netIncome)}</b>
          </div>
          <div className="line">
            <b>{STRINGS.WF_ANNUAL_TAX}</b>
            <b className="num">{formatBaht(taxPayable)}</b>
          </div>
        </div>
      </details>

      <details>
        <summary>{STRINGS.DETAILS_RMF_PVD_TITLE}</summary>
        <ul>
          {STRINGS.DETAILS_RMF_PVD_ITEMS.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </details>

      <details>
        <summary>{STRINGS.DETAILS_CHECKLIST_TITLE}</summary>
        <ul>
          {checklistItems.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </details>

      <p className="note">{STRINGS.NOTE_DETAILS_FOOTER}</p>
    </Card>
  );
}
