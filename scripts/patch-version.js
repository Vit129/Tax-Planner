const VERSION_PATTERN = /^v?(\d+)\.(\d+)\.(\d+)$/;
const parts = (version) => {
  const match = String(version).match(VERSION_PATTERN);
  if (!match) throw new Error(`Invalid version: ${version}`);
  return match.slice(1).map(Number);
};
const compare = (a, b) => {
  for (let i = 0; i < 3; i += 1) if (a[i] !== b[i]) return a[i] - b[i];
  return 0;
};
export function planPatchVersion(manifest, tags) {
  const current = parts(manifest);
  const validTags = tags.filter((tag) => VERSION_PATTERN.test(String(tag)));
  const latest = validTags.map(parts).sort((a, b) => compare(b, a))[0] || [0, 0, 0];
  if (compare(current, latest) > 0) return current.join('.');
  return [latest[0], latest[1], latest[2] + 1].join('.');
}

export function needsReleaseCommit(stagedPaths) {
  return stagedPaths.trim().length > 0;
}
