import React from 'react';
import STRINGS from '../config/strings';
import TYPOGRAPHY from '../config/typography';
import COLORS from '../config/colors';

export default function OtherIncomeSummary({ plan }) {
  const other = plan?.otherIncomeSummary;
  if (!other || (other.includedIncome === 0 && other.excludedIncome === 0)) return null;
  const format = n => `฿${Math.round(n || 0).toLocaleString('en-US')}`;
  return <section style={{ background: COLORS.SURFACE, border: `1px solid ${COLORS.LINE}`, borderRadius: '10px', padding: '14px', display: 'grid', gap: '8px', fontSize: TYPOGRAPHY.SIZE_SMALL }}>
    <strong>{STRINGS.OTHER_TITLE}</strong>
    {other.incompleteCategories?.length > 0 && <div role="alert" style={{ color: COLORS.BAD }}>{STRINGS.OTHER_SUMMARY_INCOMPLETE}</div>}
    <div>{STRINGS.OTHER_SALARY}: {format(plan.domesticIncome)}</div>
    <div>{STRINGS.OTHER_SUMMARY}: {format(other.includedIncome)}</div>
    <div>{STRINGS.OTHER_EXCLUDED_SUMMARY}: {format(other.excludedIncome)}</div>
    <div>{STRINGS.OTHER_DIVIDEND_CREDIT}: {format(other.dividendTaxCredit)}</div>
    {plan.taxMethods?.applies && <div><strong>{STRINGS.OTHER_METHODS}</strong><div>{STRINGS.OTHER_METHOD1}: {format(plan.taxMethods.progressiveTax)}</div><div>{STRINGS.OTHER_METHOD2}: {format(plan.taxMethods.calculated)} {plan.taxMethods.exempt && STRINGS.OTHER_METHOD2_EXEMPT}</div><div>{STRINGS.OTHER_METHOD_USED}: {plan.taxMethods.selectedMethod}</div></div>}
  </section>;
}
