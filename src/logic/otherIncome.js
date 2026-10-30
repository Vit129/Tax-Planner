const VALID_TYPES = new Set(['2', '3', '4', '5', '6', '7', '8']);
const EXPENSE_CAP_12 = 100000;

function amount(value) {
  if (!Number.isFinite(value) || value < 0) throw new RangeError('Amount must be a non-negative finite number');
  return value;
}

// Each entry must already have its tax treatment and permitted expense amount
// established from its supporting documents; excluded income has no tax credit.
export function summarizeOtherIncome(entries, employmentIncome) {
  amount(employmentIncome);
  let includedIncome = 0;
  let income2 = 0;
  let otherExpenses = 0;
  let withholding = 0;
  let excludedIncome = 0;
  let finalTaxIncome = 0;
  let dividendTaxCredit = 0;
  let standard3Expenses = 0;
  const incompleteCategories = new Set();
  const electionTreatments = new Map();
  for (const entry of entries) {
    if (!VALID_TYPES.has(entry.type)) throw new RangeError('Invalid income type');
    const gross = amount(entry.gross);
    const taxWithheld = amount(entry.withholding);
    if (!['included', 'excluded'].includes(entry.treatment)) throw new RangeError('Invalid tax treatment');
    const eligibleExclusion = entry.type === '4' && ['interest', 'thai_dividend'].includes(entry.electionGroup || 'interest');
    if (entry.treatment === 'excluded' && !eligibleExclusion) throw new RangeError('Exclusion is only supported for eligible 40(4) interest or Thai dividends');
    if (entry.exclusionKind === 'final' && !eligibleExclusion) throw new RangeError('Final-tax treatment is only supported for eligible 40(4) interest or Thai dividends');
    const electionGroup = entry.type === '4' ? (entry.electionGroup || 'interest') : entry.electionGroup;
    if (entry.needsTreatmentReview) incompleteCategories.add(`40(${entry.type})`);
    if (entry.type === '4' && ['interest', 'thai_dividend'].includes(electionGroup) && gross > 0) {
      const prior = electionTreatments.get(electionGroup);
      if (prior && prior !== entry.treatment) throw new RangeError('Inconsistent treatment within election group');
      electionTreatments.set(electionGroup, entry.treatment);
    }
    if (entry.treatment === 'excluded') {
      if (entry.exclusionKind && !['final', 'exempt'].includes(entry.exclusionKind)) throw new RangeError('Invalid exclusion kind');
      excludedIncome += gross;
      if (entry.exclusionKind === 'final') finalTaxIncome += gross;
      continue;
    }
    const rate = entry.dividendCorpTaxRate ?? 0;
    if (!Number.isFinite(rate) || rate < 0 || rate >= 1 || (rate > 0 && entry.type !== '4')) throw new RangeError('Invalid dividend credit rate');
    const credit = gross * rate / (1 - rate);
    dividendTaxCredit += credit;
    includedIncome += gross + credit;
    withholding += taxWithheld;
    if (entry.type === '2') {
      if (entry.expenses != null && amount(entry.expenses) !== 0) throw new RangeError('Type 2 expenses use the shared employment expense allowance');
      income2 += gross;
    } else {
      let expenses = 0;
      const method = entry.expenseMethod || 'actual'; // legacy saved amounts were explicitly entered by the user
      const actual = entry.actualExpense ?? entry.expenses ?? 0;
      if (entry.type === '4') {
        if (entry.expenses != null && amount(entry.expenses) !== 0) throw new RangeError('Type 4 income has no expense deduction');
      } else if (method === 'actual') {
        expenses = amount(actual);
        if (expenses > gross) throw new RangeError('Actual expenses cannot exceed gross income');
        if (entry.actualExpenseEntered !== true && entry.expenses == null) incompleteCategories.add(`40(${entry.type})`);
      } else if (entry.type === '3' && entry.subType === 'rights') {
        const remainingCap = Math.max(0, 100000 - standard3Expenses);
        expenses = Math.min(gross * 0.5, remainingCap);
        standard3Expenses += expenses;
      } else if (entry.type === '5') {
        const rates = { building: 0.3, agri: 0.2, nonAgri: 0.15, vehicle: 0.3, other: 0.1, hirePurchaseBreach: 0.2 };
        if (!(entry.subType in rates)) throw new RangeError('Select a valid 40(5) subtype before using standard expenses');
        expenses = gross * rates[entry.subType];
      } else if (entry.type === '6') {
        expenses = gross * (entry.subType === 'medical' || entry.subType === 'fineArts' ? 0.6 : 0.3);
      } else if (entry.type === '7') {
        expenses = gross * 0.6;
      } else {
        throw new RangeError('Standard expenses are not available for this income subtype');
      }
      otherExpenses += expenses;
    }
  }
  const employmentExpenses = Math.min((employmentIncome + income2) * 0.5, EXPENSE_CAP_12);
  return {
    includedIncome,
    excludedIncome,
    finalTaxIncome,
    withholding,
    dividendTaxCredit,
    expenses: employmentExpenses + otherExpenses,
    methodTwoBase: includedIncome,
    form: includedIncome > 0 ? '90' : employmentIncome > 0 ? '91' : null,
    incompleteCategories: [...incompleteCategories],
  };
}
