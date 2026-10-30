import { spawn } from 'child_process';
import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { needsReleaseCommit, planPatchVersion } from './patch-version.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

let currentVersion = '1.1.0';
try {
  const pkg = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf8'));
  currentVersion = pkg.version || '1.1.0';
} catch (e) {
  // fallback
}

function runCommand(command, args, cwd = REPO_ROOT) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', cwd });
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
    child.on('error', reject);
  });
}

async function runPatchRelease() {
  const branch = await runCommandCapture('git', ['branch', '--show-current']);
  if (branch !== 'main') {
    throw new Error(`Patch release must run from main (current branch: ${branch}).`);
  }

  await runCommand('git', ['fetch', 'origin', 'main', '--tags']);
  const dirty = await runCommandCapture('git', ['status', '--porcelain']);
  if (dirty) {
    throw new Error('Release requires a clean working tree. Inspect and preserve any intended edits first; if a prior release attempt left partial metadata changes, resolve those changes manually, verify package.json and CHANGELOG.md match the latest tag, then retry.');
  }

  console.log('\n🧪 Running tests and production build before release...\n');
  await runCommand('npm', ['test']);
  await runCommand('npm', ['run', 'build']);
  const sharedCommit = await getSharedPackagesCommit();

  // Refresh refs before selecting a version and never release a stale local main.
  const head = await runCommandCapture('git', ['rev-parse', 'HEAD']);
  const remoteHead = await runCommandCapture('git', ['rev-parse', 'origin/main']);

  const currentVersionValue = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf8')).version;
  const tags = (await runCommandCapture('git', ['tag', '--list'])).split('\n').filter(Boolean);
  const currentTag = await runCommandCapture('git', ['rev-parse', '--verify', `refs/tags/v${currentVersionValue}^{}`]).catch(() => '');
  if (head !== remoteHead && !currentTag) {
    const subject = await runCommandCapture('git', ['log', '-1', '--format=%s']);
    if (subject !== `chore: release v${currentVersionValue}`) {
      throw new Error('Local main differs from origin/main and is not an identifiable release commit; synchronize manually before release.');
    }
    await runCommand('git', ['merge-base', '--is-ancestor', 'origin/main', 'HEAD']);
    await runCommand('git', ['tag', `v${currentVersionValue}`]);
  }
  const effectiveCurrentTag = currentTag || await runCommandCapture('git', ['rev-parse', '--verify', `refs/tags/v${currentVersionValue}^{}`]).catch(() => '');
  if (head !== remoteHead) {
    if (effectiveCurrentTag !== head) throw new Error('Local main differs from origin/main and has no matching release tag; synchronize manually before release.');
    await runCommand('git', ['merge-base', '--is-ancestor', 'origin/main', 'HEAD']);
    console.log(`\n🔁 Resuming push of v${currentVersionValue} to origin...\n`);
    await runCommand('git', ['push', 'origin', 'main', `v${currentVersionValue}`]);
  } else if (effectiveCurrentTag === head) {
    // A previous push may have updated main but failed before pushing the tag.
    await runCommand('git', ['push', 'origin', 'main', `v${currentVersionValue}`]);
  }

  if (effectiveCurrentTag === head) {
    const releaseManifest = readReleaseManifest();
    const published = await getPagesDeployInfo();
    const releaseExists = await runCommandCapture('gh', ['release', 'view', `v${currentVersionValue}`, '--json', 'tagName']).then(() => true).catch(() => false);
    const expectedSharedCommit = releaseManifest?.sharedCommit || sharedCommit;
    const alreadyComplete = releaseExists && published?.commit === head && published?.version === currentVersionValue && published?.sharedCommit === expectedSharedCommit;
    if (!alreadyComplete && releaseManifest?.sharedCommit && releaseManifest.sharedCommit !== sharedCommit) {
      throw new Error(`Pending v${currentVersionValue} requires My-Investment-Port ${releaseManifest.sharedCommit}; current main is ${sharedCommit}. Check out the recorded commit in a clean worktree and set SHARED_PACKAGES_ROOT to its packages directory to resume.`);
    }
    if (!releaseExists) {
      console.log(`\n🏷️ Completing GitHub Release v${currentVersionValue}...\n`);
      await runCommand('gh', ['release', 'create', `v${currentVersionValue}`, '--title', `v${currentVersionValue}`, '--generate-notes']);
    }
    if (!alreadyComplete) {
      console.log(`\n🔁 Resuming GitHub Pages deploy for v${currentVersionValue}...\n`);
      await runCommand('bash', [path.join(REPO_ROOT, 'scripts/deploy-gh-pages.sh')]);
    }
    if (!alreadyComplete) {
      console.log(`\n✅ Completed pending release v${currentVersionValue}.\n`);
      return;
    }
  }

  await runCommand('git', ['cliff', '--version']);
  const version = planPatchVersion(currentVersionValue, tags);
  const changelog = await runCommandCapture('git', ['cliff', '--tag', `v${version}`]);
  if (version !== currentVersionValue) await runCommand('npm', ['version', version, '--no-git-tag-version']);
  const existingTag = await runCommandCapture('git', ['tag', '--list', `v${version}`]);
  if (existingTag) throw new Error(`Release tag v${version} already exists.`);

  const readmePath = path.join(REPO_ROOT, 'README.md');
  const readme = fs.readFileSync(readmePath, 'utf8');
  fs.writeFileSync(readmePath, readme.replace(/^# 🇹🇭 Tax-Planner \(v[^)]+\)/m, `# 🇹🇭 Tax-Planner (v${version})`));
  fs.writeFileSync(path.join(REPO_ROOT, 'release-manifest.json'), `${JSON.stringify({ version, sharedCommit }, null, 2)}\n`);
  fs.writeFileSync(path.join(REPO_ROOT, 'CHANGELOG.md'), changelog);

  console.log(`\n📦 Committing and tagging v${version}...\n`);
  await runCommand('git', ['add', 'package.json', 'package-lock.json', 'README.md', 'CHANGELOG.md', 'release-manifest.json']);
  const staged = await runCommandCapture('git', ['diff', '--cached', '--name-only']);
  if (needsReleaseCommit(staged)) await runCommand('git', ['commit', '-m', `chore: release v${version}`]);
  else console.log('Version already committed; tagging current HEAD.');
  await runCommand('git', ['tag', `v${version}`]);
  await runCommand('git', ['push', 'origin', 'main', `v${version}`]);

  console.log(`\n🏷️ Creating GitHub Release v${version}...\n`);
  await runCommand('gh', ['release', 'create', `v${version}`, '--title', `v${version}`, '--generate-notes']);

  console.log('\n🚀 Deploying the released build to GitHub Pages...\n');
  await runCommand('bash', [path.join(REPO_ROOT, 'scripts/deploy-gh-pages.sh')]);
  console.log(`\n🎉 Released v${version} and deployed to https://vit129.github.io/Tax-Planner/\n`);
}

async function getPagesDeployInfo() {
  try {
    await runCommand('git', ['fetch', 'origin', 'gh-pages']);
    const raw = await runCommandCapture('git', ['show', 'FETCH_HEAD:deploy-info.json']);
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function getSharedPackagesCommit() {
  const isPinnedWorktree = Boolean(process.env.SHARED_PACKAGES_ROOT);
  const root = isPinnedWorktree
    ? path.dirname(path.resolve(process.env.SHARED_PACKAGES_ROOT))
    : path.resolve(REPO_ROOT, '..', 'My-Investment-Port');
  const dirty = await runCommandCapture('git', ['status', '--porcelain'], root);
  if (dirty) throw new Error('Shared My-Investment-Port packages require a clean working tree.');
  const head = await runCommandCapture('git', ['rev-parse', 'HEAD'], root);
  if (isPinnedWorktree) return head;
  const branch = await runCommandCapture('git', ['branch', '--show-current'], root);
  if (branch !== 'main') throw new Error(`Shared My-Investment-Port packages must be on main (current branch: ${branch}).`);
  await runCommand('git', ['fetch', 'origin', 'main'], root);
  const remote = await runCommandCapture('git', ['rev-parse', 'origin/main'], root);
  if (head !== remote) throw new Error('My-Investment-Port main differs from origin/main; synchronize shared packages before release.');
  return head;
}

function readReleaseManifest() {
  try {
    return JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'release-manifest.json'), 'utf8'));
  } catch {
    return null;
  }
}

function runCommandCapture(command, args, cwd = REPO_ROOT) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, encoding: 'utf8' });
    let output = '';
    let errorOutput = '';
    child.stdout.on('data', (chunk) => { output += chunk.toString(); });
    child.stderr.on('data', (chunk) => { errorOutput += chunk.toString(); });
    child.on('close', (code) => {
      if (code === 0) resolve(output.trim());
      else reject(new Error(errorOutput.trim() || `Command failed with code ${code}`));
    });
    child.on('error', reject);
  });
}

async function selectWithArrows(options) {
  if (!process.stdin.isTTY) {
    return selectWithReadline(options);
  }

  let selected = 0;

  const displayMenu = () => {
    console.clear?.() || console.log('\x1Bc');
    console.log('\n🇹🇭 Tax-Planner Development & Deployment Workflow');
    console.log(`\x1b[2mCurrent Version:\x1b[0m \x1b[1;33mv${currentVersion}\x1b[0m\n`);
    options.forEach((opt, i) => {
      const prefix = i === selected ? '❯ ' : '  ';
      const style = i === selected ? '\x1b[1;36m' : '\x1b[0m';
      console.log(`${prefix}${style}${opt.display}\x1b[0m`);
    });
    console.log('\n(Use ↑/↓ arrows and press Enter)\n');
  };

  displayMenu();

  return new Promise((resolve) => {
    process.stdin.setRawMode(true);
    process.stdin.setEncoding('utf8');
    process.stdin.resume();

    const onData = (char) => {
      const code = char.charCodeAt(0);

      if (code === 3) {
        process.stdin.setRawMode(false);
        process.exit(0);
      }

      if (code === 13) {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdin.removeListener('data', onData);
        console.log(`\n✅ Selected: ${options[selected].display}\n`);
        resolve(options[selected].value);
        return;
      }

      if (char === '\x1b[A') {
        selected = (selected - 1 + options.length) % options.length;
        displayMenu();
      } else if (char === '\x1b[B') {
        selected = (selected + 1) % options.length;
        displayMenu();
      }
    };

    process.stdin.on('data', onData);
  });
}

async function selectWithReadline(options) {
  console.log('\n🇹🇭 Tax-Planner Development & Deployment Workflow');
  console.log(`\x1b[2mCurrent Version:\x1b[0m \x1b[1;33mv${currentVersion}\x1b[0m\n`);
  options.forEach((opt, i) => {
    console.log(`  ${i + 1}) ${opt.display}`);
  });

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question('\nEnter choice (1-' + options.length + '): ', (answer) => {
      rl.close();
      const idx = parseInt(answer) - 1;
      if (idx >= 0 && idx < options.length) {
        console.log(`\n✅ Selected: ${options[idx].display}\n`);
        resolve(options[idx].value);
      } else {
        console.log('❌ Invalid choice');
        process.exit(1);
      }
    });
  });
}

async function promptMessage(promptText) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(promptText, (ans) => {
      rl.close();
      resolve(ans.trim());
    });
  });
}

async function main() {
  try {
    if (process.argv.includes('--release')) {
      await runPatchRelease();
      return;
    }

    const options = [
      {
        display: '1) Dev Server (localhost:5180)',
        value: 'dev'
      },
      {
        display: '2) Test Suite & Architecture Guard',
        value: 'test'
      },
      {
        display: '3) Deploy Only to GitHub Pages (Production)',
        value: 'deploy'
      },
      {
        display: '4) Commit + Push (main)',
        value: 'commit-push'
      },
      {
        display: '5) Full Cycle: Test + Commit + Release + Deploy to GitHub Pages',
        value: 'full-cycle'
      },
      {
        display: '6) Preview Production Build Locally',
        value: 'preview'
      },
      {
        display: '7) Release + Deploy: Test + Version + GitHub Release + Pages (main only)',
        value: 'patch-release'
      }
    ];

    const choice = await selectWithArrows(options);

    if (choice === 'dev') {
      await runCommand('npm', ['run', 'dev']);
    } else if (choice === 'test') {
      await runCommand('npm', ['test']);
    } else if (choice === 'deploy') {
      console.log('\n🌐 Deploying to GitHub Pages...\n');
      await runCommand('bash', [path.join(REPO_ROOT, 'scripts/deploy-gh-pages.sh')]);
    } else if (choice === 'commit-push') {
      const msg = await promptMessage('Enter commit message: ');
      if (!msg) {
        console.log('❌ Commit cancelled: message required');
        return;
      }
      await runCommand('git', ['add', '.']);
      await runCommand('git', ['commit', '-m', msg]);
      await runCommand('git', ['push', 'origin', 'main']);
      console.log('\n✅ Pushed to main!\n');
    } else if (choice === 'full-cycle') {
      const branch = await runCommandCapture('git', ['branch', '--show-current']);
      if (branch !== 'main') throw new Error(`Full cycle must run from main (current branch: ${branch}).`);
      await getSharedPackagesCommit();
      console.log('\n🧪 Verifying changes before pushing to main...\n');
      await runCommand('npm', ['test']);
      await runCommand('npm', ['run', 'build']);
      console.log('\n📝 Committing changes before release...\n');
      const msg = await promptMessage('Enter commit message (or press Enter for auto message): ');
      const finalMsg = msg || `chore: release v${currentVersion} update`;
      const dirty = await runCommandCapture('git', ['status', '--porcelain']);
      if (dirty) {
        await runCommand('git', ['add', '.']);
        await runCommand('git', ['commit', '-m', finalMsg]);
      } else {
        console.log('ℹ️ Working tree clean; continuing with the current main commit.');
      }
      await runCommand('git', ['push', 'origin', 'main']);
      await runPatchRelease();
    } else if (choice === 'preview') {
      await runCommand('npm', ['run', 'build']);
      await runCommand('npm', ['run', 'preview']);
    } else if (choice === 'patch-release') {
      await runPatchRelease();
    }
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    process.exit(1);
  }
}

main();
