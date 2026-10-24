import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import STRINGS from '../src/config/strings.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.resolve(__dirname, '../src');

function getAllFiles(dir, exts = ['.js', '.jsx']) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllFiles(full, exts));
    } else if (exts.includes(path.extname(entry.name))) {
      results.push(full);
    }
  }
  return results;
}

function stripComments(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');
}

describe('Tax-Planner Architecture Guard (Logic / UI / Translator / Color / Typography / Shared UI)', () => {
  const allSrcFiles = getAllFiles(SRC_DIR);

  it('has zero missing STRINGS keys across all source files', () => {
    const missing = [];
    for (const file of allSrcFiles) {
      const content = stripComments(fs.readFileSync(file, 'utf8'));
      const matches = content.matchAll(/\bSTRINGS\.([A-Z0-9_]+)\b/g);
      for (const m of matches) {
        const key = m[1];
        if (!(key in STRINGS)) {
          missing.push(`${path.relative(SRC_DIR, file)}: STRINGS.${key}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it('has zero hardcoded Thai words/characters outside src/config/strings.js', () => {
    const violations = [];
    const thaiRe = /[\u0E01-\u0E3A\u0E40-\u0E7F]/;
    for (const file of allSrcFiles) {
      const rel = path.relative(SRC_DIR, file).replace(/\\/g, '/');
      if (rel === 'config/strings.js') continue;
      const clean = stripComments(fs.readFileSync(file, 'utf8'));
      const lines = clean.split('\n');
      lines.forEach((line, idx) => {
        if (thaiRe.test(line)) {
          violations.push(`${rel}:${idx + 1}: ${line.trim()}`);
        }
      });
    }
    expect(violations).toEqual([]);
  });

  it('has zero hardcoded #hex colors outside src/config/colors.js', () => {
    const violations = [];
    const hexRe = /#[0-9a-fA-F]{3,8}\b/;
    for (const file of allSrcFiles) {
      const rel = path.relative(SRC_DIR, file).replace(/\\/g, '/');
      if (rel === 'config/colors.js') continue;
      const clean = stripComments(fs.readFileSync(file, 'utf8'));
      const lines = clean.split('\n');
      lines.forEach((line, idx) => {
        if (hexRe.test(line)) {
          violations.push(`${rel}:${idx + 1}: ${line.trim()}`);
        }
      });
    }
    expect(violations).toEqual([]);
  });

  it('has zero hardcoded fontSize or fontFamily outside src/config/typography.js', () => {
    const violations = [];
    const fontRe = /\b(fontSize|fontFamily)\s*:(?!\s*TYPOGRAPHY\.)/;
    for (const file of allSrcFiles) {
      const rel = path.relative(SRC_DIR, file).replace(/\\/g, '/');
      if (rel === 'config/typography.js') continue;
      const clean = stripComments(fs.readFileSync(file, 'utf8'));
      const lines = clean.split('\n');
      lines.forEach((line, idx) => {
        if (fontRe.test(line)) {
          violations.push(`${rel}:${idx + 1}: ${line.trim()}`);
        }
      });
    }
    expect(violations).toEqual([]);
  });

  it('has zero missing imports for TYPOGRAPHY, COLORS, and STRINGS when referenced', () => {
    const missing = [];
    for (const file of allSrcFiles) {
      const rel = path.relative(SRC_DIR, file).replace(/\\/g, '/');
      if (rel.startsWith('config/')) continue;
      const content = stripComments(fs.readFileSync(file, 'utf8'));
      if (/\bTYPOGRAPHY\./.test(content) && !/import.*TYPOGRAPHY/.test(content)) {
        missing.push(`${rel}: missing import TYPOGRAPHY`);
      }
      if (/\bCOLORS\./.test(content) && !/import.*COLORS/.test(content)) {
        missing.push(`${rel}: missing import COLORS`);
      }
      if (/\bSTRINGS\./.test(content) && !/import.*STRINGS/.test(content)) {
        missing.push(`${rel}: missing import STRINGS`);
      }
    }
    expect(missing).toEqual([]);
  });
});
