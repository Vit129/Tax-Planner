import { describe, expect, it } from 'vitest';
import { migrateOtherIncome } from '../src/logic/migrateOtherIncome.js';
import { summarizeOtherIncome } from '../src/logic/otherIncome.js';
const row = (type, treatment, extra = {}) => ({ type, treatment, gross: 10000, withholding: 100, expenses: 0, ...extra });
describe('[BE-UT] legacy income election migration', () => {
  it('preserves an unsupported prior exclusion for review without crashing', () => {
    const entries = migrateOtherIncome([row('5', 'excluded', { exclusionKind: 'final' })]);
    expect(entries[0]).toMatchObject({ treatment: 'included', legacyTreatment: 'excluded', legacyExclusionKind: 'final', needsTreatmentReview: true });
    expect(summarizeOtherIncome(entries, 0)).toMatchObject({ includedIncome: 10000, incompleteCategories: ['40(5)'] });
  });
  it('normalizes legacy interest and flags conflicting elections in both rows', () => {
    const entries = migrateOtherIncome([row('4', 'included'), row('4', 'excluded', { electionGroup: 'interest' })]);
    expect(entries).toEqual(expect.arrayContaining([expect.objectContaining({ legacyTreatment: 'excluded', treatment: 'included', needsTreatmentReview: true })]));
    expect(summarizeOtherIncome(entries, 0)).toMatchObject({ includedIncome: 20000, incompleteCategories: ['40(4)'] });
  });
  it('validates inconsistent legacy interest even without migration', () => {
    expect(() => summarizeOtherIncome([row('4', 'included'), row('4', 'excluded', { electionGroup: 'interest' })], 0)).toThrow(/Inconsistent/);
  });
});
