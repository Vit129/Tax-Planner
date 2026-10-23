/**
 * Safely parses input string or number into a non-negative number.
 * Supports formulas like "2500+1500" or "3000*2".
 */
export function evalNumber(raw) {
  if (raw == null) return 0;
  if (typeof raw === 'number') return isFinite(raw) && raw > 0 ? raw : 0;
  
  const clean = String(raw).replace(/,/g, '').trim();
  if (!clean) return 0;

  // Only allow digits, basic math operators, parentheses, and decimals
  if (!/^[\d+\-*/.() ]+$/.test(clean)) {
    const num = parseFloat(clean);
    return isFinite(num) && num > 0 ? num : 0;
  }

  try {
    // Evaluates simple arithmetic expression safely
    const fn = new Function(`"use strict"; return (${clean});`);
    const val = fn();
    return typeof val === 'number' && isFinite(val) && val > 0 ? val : 0;
  } catch {
    const num = parseFloat(clean);
    return isFinite(num) && num > 0 ? num : 0;
  }
}

export function formatCurrency(amount) {
  if (amount == null || isNaN(amount)) return '0';
  return Math.round(amount).toLocaleString('th-TH');
}
