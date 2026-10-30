// Compare the two annual personal income tax methods before applying tax credits.
// The caller supplies the assessable income included in method 2, excluding 40(1).
export function compareIncomeTaxMethods(progressiveTax, otherAssessableIncome) {
  if (!Number.isFinite(progressiveTax) || progressiveTax < 0 ||
      !Number.isFinite(otherAssessableIncome) || otherAssessableIncome < 0) {
    throw new RangeError('Tax and assessable income must be non-negative finite numbers');
  }
  const applies = otherAssessableIncome >= 120000;
  const calculated = applies ? otherAssessableIncome * 0.005 : 0;
  const exempt = applies && calculated <= 5000;
  const methodTwo = exempt ? 0 : calculated;
  return {
    progressiveTax,
    applies,
    calculated,
    exempt,
    methodTwo,
    selectedMethod: methodTwo > progressiveTax ? 2 : 1,
    taxBeforeCredits: Math.max(progressiveTax, methodTwo),
  };
}
