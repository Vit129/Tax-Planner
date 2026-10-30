import { describe, it, expect } from 'vitest';
import { summarizeOtherIncome } from '../src/logic/otherIncome.js';

const row = (type, gross, overrides = {}) => ({ type, gross, withholding: 0, expenses: 0, treatment: 'included', ...overrides });
describe('[BE-UT] other income summary', () => {
  it('[Success] shares the employment expense cap with 40(2)', () => {
    expect(summarizeOtherIncome([row('2', 100000)], 100000)).toMatchObject({ includedIncome: 100000, expenses: 100000, methodTwoBase: 100000, form: '90' });
  });
  it('[Edge] rejects manually entered 40(2) expenses because they share the employment allowance', () => {
    expect(() => summarizeOtherIncome([row('2', 100000, { expenses: 1 })], 0)).toThrow(/shared employment expense allowance/);
  });
  it('[Alternative] excludes final-tax withholding from the annual settlement', () => {
    expect(summarizeOtherIncome([row('4', 10000, { treatment: 'excluded', withholding: 1000 })], 0)).toMatchObject({ includedIncome: 0, excludedIncome: 10000, withholding: 0, form: null });
  });
  it('[Edge] rejects exclusion unless 40(4) is an eligible interest or Thai dividend source', () => {
    expect(() => summarizeOtherIncome([row('5', 10000, { treatment: 'excluded', exclusionKind: 'final' })], 0)).toThrow(/eligible 40\(4\)/);
    expect(() => summarizeOtherIncome([row('4', 10000, { electionGroup: 'other_investment', treatment: 'excluded', exclusionKind: 'final' })], 0)).toThrow(/eligible 40\(4\)/);
    expect(summarizeOtherIncome([row('4', 10000, { electionGroup: 'interest', treatment: 'excluded', exclusionKind: 'final' })], 0).finalTaxIncome).toBe(10000);
  });
  it('[Success] adds permitted expenses and withholding on included income', () => {
    expect(summarizeOtherIncome([row('5', 100000, { expenses: 30000, withholding: 5000 })], 100000)).toMatchObject({ expenses: 80000, withholding: 5000 });
  });
  it('[Success] aggregates the non-employment income types and their pre-validated expenses', () => {
    const entries = ['3', '5', '6', '7', '8'].map(type => row(type, 50000, { expenses: 10000 }));
    expect(summarizeOtherIncome(entries, 0)).toMatchObject({ includedIncome: 250000, expenses: 50000, methodTwoBase: 250000, form: '90' });
  });
  it('[Edge] rejects expenses greater than gross income and expenses on 40(4)', () => {
    expect(() => summarizeOtherIncome([row('5', 100, { expenses: 101 })], 0)).toThrow();
    expect(() => summarizeOtherIncome([row('4', 100, { expenses: 1 })], 0)).toThrow();
  });
});

describe('[BE-UT] dividend credit and consistent treatment', () => {
  it('[Success] includes eligible dividend credit in assessable income', () => {
    expect(summarizeOtherIncome([row('4', 80000, { dividendCorpTaxRate: 0.2, withholding: 8000 })], 0)).toMatchObject({ includedIncome: 100000, methodTwoBase: 100000, dividendTaxCredit: 20000, withholding: 8000 });
  });
  it('[Edge] rejects invalid dividend credit rates', () => {
    expect(() => summarizeOtherIncome([row('4', 100, { dividendCorpTaxRate: 1 })], 0)).toThrow();
    expect(() => summarizeOtherIncome([row('5', 100, { dividendCorpTaxRate: 0.2 })], 0)).toThrow();
  });
  it('[Edge] rejects mixed elections in the same named group', () => {
    expect(() => summarizeOtherIncome([row('4', 100, { electionGroup: 'dividend' }), row('4', 100, { electionGroup: 'dividend', treatment: 'excluded' })], 0)).toThrow();
  });
});

describe('[BE-UT] statutory expenses and legacy expense migration', () => {
  it('[Success] applies subtype-specific 40(3), 40(5), 40(6), and 40(7) standard rates', () => {
    const entries = [
      row('3', 300000, { subType: 'rights', expenseMethod: 'standard' }),
      row('3', 100000, { subType: 'rights', expenseMethod: 'standard' }),
      row('5', 100000, { subType: 'agri', expenseMethod: 'standard' }),
      row('5', 100000, { subType: 'hirePurchaseBreach', expenseMethod: 'standard' }),
      row('6', 100000, { subType: 'fineArts', expenseMethod: 'standard' }),
      row('7', 100000, { expenseMethod: 'standard' }),
    ];
    expect(summarizeOtherIncome(entries, 0).expenses).toBe(260000);
  });

  it('[Success] treats an existing saved expenses value as actual when no method was persisted', () => {
    expect(summarizeOtherIncome([row('5', 100000, { subType: 'building', expenses: 17000 })], 0).expenses).toBe(17000);
  });

  it('[Warning] marks 40(8) incomplete until a new actual-expense amount is entered', () => {
    expect(summarizeOtherIncome([{ type: '8', gross: 100000, withholding: 0, treatment: 'included', expenseMethod: 'actual', actualExpense: 0 }], 0).incompleteCategories).toEqual(['40(8)']);
    expect(summarizeOtherIncome([{ type: '8', gross: 100000, withholding: 0, treatment: 'included', expenseMethod: 'actual', actualExpense: 0, actualExpenseEntered: true }], 0).incompleteCategories).toEqual([]);
  });

  it('[Edge] does not apply standard expenses to 40(3) annuity income', () => {
    expect(() => summarizeOtherIncome([row('3', 100000, { subType: 'annuity', expenseMethod: 'standard' })], 0)).toThrow(/Standard expenses are not available/);
  });
});
