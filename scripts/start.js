import { spawn } from 'child_process';
import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
        display: '3) Deploy to GitHub Pages (Live Web)',
        value: 'deploy'
      },
      {
        display: '4) Commit + Push (main)',
        value: 'commit-push'
      },
      {
        display: '5) Full Cycle: Test + Commit + Deploy to GitHub Pages',
        value: 'full-cycle'
      },
      {
        display: '6) Preview Production Build Locally',
        value: 'preview'
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
      console.log('\n🧪 Step 1/3: Running Test Suite & Architecture Guard...\n');
      await runCommand('npm', ['test']);

      console.log('\n📝 Step 2/3: Git Commit & Push...\n');
      const msg = await promptMessage('Enter commit message (or press Enter for auto message): ');
      const finalMsg = msg || `chore: release v${currentVersion} update`;
      try {
        await runCommand('git', ['add', '.']);
        await runCommand('git', ['commit', '-m', finalMsg]);
        await runCommand('git', ['push', 'origin', 'main']);
      } catch (e) {
        console.log('ℹ️ Nothing new to commit or push, proceeding to deploy...');
      }

      console.log('\n🚀 Step 3/3: Deploying to GitHub Pages...\n');
      await runCommand('bash', [path.join(REPO_ROOT, 'scripts/deploy-gh-pages.sh')]);
      console.log('\n🎉 Full cycle complete! Live at: https://vit129.github.io/Tax-Planner/\n');
    } else if (choice === 'preview') {
      await runCommand('npm', ['run', 'build']);
      await runCommand('npm', ['run', 'preview']);
    }
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    process.exit(1);
  }
}

main();
