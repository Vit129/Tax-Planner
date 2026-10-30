import { describe, expect, it } from 'vitest';
import { needsReleaseCommit, planPatchVersion } from '../scripts/patch-version.js';
describe('[BE-UT] patch release version planning', () => {
  it('tags existing HEAD instead of making an empty commit when release files are unchanged', () => expect(needsReleaseCommit('')).toBe(false));
  it('commits when version or README changes are staged', () => expect(needsReleaseCommit('package.json\nREADME.md')).toBe(true));
  it('uses a pre-bumped manifest without incrementing again', () => expect(planPatchVersion('1.4.1', ['v1.3.0'])).toBe('1.4.1'));
  it('bumps the latest tag when it is newer than the manifest', () => expect(planPatchVersion('1.4.0', ['v1.5.0'])).toBe('1.5.1'));
  it('bumps when manifest and latest tag match', () => expect(planPatchVersion('1.4.1', ['v1.4.1'])).toBe('1.4.2'));
  it('ignores non-semver tags', () => expect(planPatchVersion('1.4.0', ['v1.3.0', 'nightly'])).toBe('1.4.0'));
});
