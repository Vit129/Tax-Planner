import React, { useState } from 'react';
import STRINGS from '../config/strings';
import COLORS from '../config/colors';
import TYPOGRAPHY from '../config/typography';

export default function OtherIncomeStep({ salary, entries, onChange }) {
  const [tab, setTab] = useState('salary');
  const update = (index, field, value) => onChange(entries.map((item, i) => i === index || (field === 'treatment' && entries[index].electionGroup && item.electionGroup === entries[index].electionGroup) ? { ...item, [field]: value, ...(field === 'gross' ? { actualExpense: Math.min(item.actualExpense ?? item.expenses ?? 0, value), expenses: item.expenses == null ? undefined : Math.min(item.expenses, value) } : {}), ...(field === 'actualExpense' ? { actualExpenseEntered: true } : {}) } : item));
  const add = () => onChange([...entries, { type: '2', gross: 0, withholding: 0, treatment: 'included', exclusionKind: 'exempt' }]);
  const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '4px' };
  const subtypes = { '3': [['rights', STRINGS.OTHER_40_3_RIGHTS], ['annuity', STRINGS.OTHER_40_3_ANNUITY]], '5': [['building', STRINGS.OTHER_RENT_BUILDING], ['agri', STRINGS.OTHER_RENT_AGRI], ['nonAgri', STRINGS.OTHER_RENT_NONAGRI], ['vehicle', STRINGS.OTHER_RENT_VEHICLE], ['other', STRINGS.OTHER_RENT_OTHER], ['hirePurchaseBreach', STRINGS.OTHER_RENT_BREACH]], '6': [['medical', STRINGS.OTHER_PROF_MEDICAL], ['fineArts', STRINGS.OTHER_PROF_FINEARTS], ['profession', STRINGS.OTHER_PROF_OTHER]] };
  const getExpenseMethod = (entry) => entry.expenseMethod || 'actual';
  return <div style={{ display: 'grid', gap: '14px' }}>
    <div role="tablist" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {['salary', 'other'].map(id => <button type="button" role="tab" aria-selected={tab === id} className="btn" key={id} onClick={() => setTab(id)} style={{ color: tab === id ? COLORS.BLUE : COLORS.FG }}>{id === 'salary' ? STRINGS.INCOME_TAB_SALARY : STRINGS.INCOME_TAB_OTHER}</button>)}
    </div>
    {tab === 'salary' ? salary : <section style={{ display: 'grid', gap: '14px' }}>
      <div><h2 style={{ fontSize: TYPOGRAPHY.SIZE_H2 }}>{STRINGS.OTHER_TITLE}</h2><p>{STRINGS.OTHER_NOTE}</p><p style={{ color: COLORS.BAD }}>{STRINGS.OTHER_WARNING}</p></div>
      {entries.length === 0 && <p>{STRINGS.OTHER_EMPTY}</p>}
      {entries.map((entry, index) => <div key={index} className="card" style={{ display: 'grid', gap: '12px', padding: '16px' }}>
        {entry.needsTreatmentReview && <div role="alert" style={{ color: COLORS.BAD }}>{STRINGS.OTHER_LEGACY_REVIEW} <button type="button" onClick={() => update(index, 'needsTreatmentReview', false)}>{STRINGS.OTHER_LEGACY_CONFIRM}</button></div>}
        <button type="button" onClick={() => onChange(entries.filter((_, i) => i !== index))} style={{ justifySelf: 'end', background: 'none', border: 0, color: COLORS.BAD, cursor: 'pointer', minHeight: '36px', fontSize: TYPOGRAPHY.SIZE_SMALL, fontWeight: 700 }}>{STRINGS.OTHER_DELETE}</button>
        <label style={fieldStyle}>{STRINGS.OTHER_TYPE}<select value={entry.type} onChange={e => { const type = e.target.value; const subType = subtypes[type]?.[0]?.[0]; const expenseMethod = type === '8' ? 'actual' : ['2', '4'].includes(type) ? undefined : subType === 'annuity' ? 'actual' : 'standard'; onChange(entries.map((item, i) => i === index ? { ...item, type, subType, expenses: undefined, actualExpense: 0, actualExpenseEntered: false, expenseMethod, electionGroup: type === '4' ? 'interest' : undefined, treatment: 'included', dividendCorpTaxRate: undefined, exclusionKind: 'final' } : item)); }}>{Object.entries(STRINGS.OTHER_TYPES).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
        {entry.type === '4' && <label style={fieldStyle}>{STRINGS.OTHER_KIND}<select value={entry.electionGroup || 'interest'} onChange={e => { const group = e.target.value; const prior = entries.find(item => item.electionGroup === group && group); onChange(entries.map((item, i) => i === index ? { ...item, electionGroup: group, treatment: ['interest', 'thai_dividend'].includes(group) ? prior?.treatment || 'included' : 'included', exclusionKind: 'final', dividendCorpTaxRate: undefined } : item)); }}><option value="interest">{STRINGS.OTHER_KIND_DEFAULT}</option><option value="thai_dividend">{STRINGS.OTHER_KIND_DIVIDEND}</option><option value="other_investment">{STRINGS.OTHER_KIND_OTHER}</option></select></label>}
        {subtypes[entry.type] && <label style={fieldStyle}>{STRINGS.OTHER_SUBTYPE}<select value={entry.subType || subtypes[entry.type][0][0]} onChange={e => { const subType = e.target.value; const expenseMethod = ['hirePurchaseBreach'].includes(subType) ? 'standard' : subType === 'annuity' ? 'actual' : getExpenseMethod(entry); onChange(entries.map((item, i) => i === index ? { ...item, subType, expenseMethod } : item)); }}>{subtypes[entry.type].map(([value, name]) => <option key={value} value={value}>{name}</option>)}</select></label>}
        {entry.type === '4' && ['interest', 'thai_dividend'].includes(entry.electionGroup || 'interest') && <label style={fieldStyle}>{STRINGS.OTHER_TREATMENT}<select value={entry.treatment} onChange={e => update(index, 'treatment', e.target.value)}><option value="included">{STRINGS.OTHER_INCLUDED}</option><option value="excluded">{STRINGS.OTHER_EXCLUDED}</option></select></label>}
        {entry.type === '4' && ['interest', 'thai_dividend'].includes(entry.electionGroup || 'interest') && entry.treatment === 'excluded' && <label style={fieldStyle}>{STRINGS.OTHER_EXCLUSION}<select value={entry.exclusionKind || 'final'} onChange={e => update(index, 'exclusionKind', e.target.value)}><option value="final">{STRINGS.OTHER_FINAL}</option><option value="exempt">{STRINGS.OTHER_EXEMPT}</option></select></label>}
        {['gross', 'withholding'].map(field => <label key={field} style={fieldStyle}>{field === 'gross' ? STRINGS.OTHER_GROSS : STRINGS.OTHER_WITHHOLDING}<input type="number" min="0" value={entry[field]} onChange={e => update(index, field, Math.max(0, Number(e.target.value) || 0))} /></label>)}
        {![ '2', '4' ].includes(entry.type) && <>
          <label style={fieldStyle}>{STRINGS.OTHER_EXPENSE_METHOD}<select value={getExpenseMethod(entry)} disabled={entry.type === '8' || entry.subType === 'annuity' || entry.subType === 'hirePurchaseBreach'} onChange={e => update(index, 'expenseMethod', e.target.value)}>
            {entry.type !== '8' && entry.subType !== 'annuity' && <option value="standard">{STRINGS.OTHER_EXPENSE_STANDARD}</option>}
            {entry.subType !== 'hirePurchaseBreach' && <option value="actual">{STRINGS.OTHER_EXPENSE_ACTUAL}</option>}
          </select></label>
          {getExpenseMethod(entry) === 'actual' && <label style={fieldStyle}>{STRINGS.OTHER_EXPENSE_ACTUAL_AMOUNT}<input type="number" min="0" max={entry.gross} value={entry.actualExpense ?? entry.expenses ?? 0} onChange={e => update(index, 'actualExpense', Math.min(entry.gross, Math.max(0, Number(e.target.value) || 0)))} /></label>}
          {entry.type === '8' && <small style={{ color: COLORS.BAD }}>{STRINGS.OTHER_40_8_WARNING}{entry.actualExpenseEntered || (entry.expenses != null && entry.expenseMethod == null) ? '' : STRINGS.OTHER_INCOMPLETE_SUFFIX}</small>}
          {entry.type !== '8' && getExpenseMethod(entry) === 'actual' && !entry.actualExpenseEntered && !(entry.expenses != null && entry.expenseMethod == null) && <small style={{ color: COLORS.BAD }}>{STRINGS.OTHER_EXPENSE_INCOMPLETE}</small>}
        </>}
        {entry.type === '4' && entry.electionGroup === 'thai_dividend' && entry.treatment === 'included' && <label style={fieldStyle}>{STRINGS.OTHER_DIVIDEND_RATE}<input type="number" min="0" max="99" value={entry.dividendCorpTaxRate == null ? '' : entry.dividendCorpTaxRate * 100} onChange={e => update(index, 'dividendCorpTaxRate', e.target.value === '' ? undefined : Math.min(99, Math.max(0, Number(e.target.value) || 0)) / 100)} /><small>{STRINGS.OTHER_DIVIDEND_HELP}</small></label>}
      </div>)}
      <button type="button" className="btn" onClick={add}>{STRINGS.OTHER_ADD}</button>
    </section>}
  </div>;
}
