// Preserve previous choices for review rather than crashing or silently losing them.
export function migrateOtherIncome(entries) {
  if (!Array.isArray(entries)) return [];
  const normalized = entries.map((item) => {
    const group = item.type === '4' ? (item.electionGroup || 'interest') : item.electionGroup;
    const eligible = item.type === '4' && ['interest', 'thai_dividend'].includes(group);
    if (item.treatment === 'excluded' && !eligible) {
      return { ...item, legacyTreatment: item.legacyTreatment || item.treatment, legacyExclusionKind: item.exclusionKind, treatment: 'included', exclusionKind: undefined, needsTreatmentReview: true };
    }
    return item.type === '4' ? { ...item, electionGroup: group } : item;
  });
  const elections = new Map();
  normalized.forEach((item) => {
    if (item.type !== '4' || !['interest', 'thai_dividend'].includes(item.electionGroup) || !(item.gross > 0)) return;
    const values = elections.get(item.electionGroup) || new Set();
    values.add(item.treatment);
    elections.set(item.electionGroup, values);
  });
  return normalized.map((item) => {
    if ((elections.get(item.electionGroup)?.size || 0) < 2) return item;
    return { ...item, legacyTreatment: item.legacyTreatment || item.treatment, legacyExclusionKind: item.exclusionKind, treatment: 'included', exclusionKind: undefined, needsTreatmentReview: true };
  });
}
