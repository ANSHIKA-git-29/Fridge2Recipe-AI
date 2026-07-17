import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const roots = ['src', 'backend', 'tests'];
const failures = [];

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  }));
  return nested.flat();
}

for (const root of roots) {
  for (const file of await filesIn(root)) {
    if (!/\.(js|jsx|css)$/.test(file)) continue;
    const content = await readFile(file, 'utf8');
    const label = relative(process.cwd(), file);
    if (/^(<{7}|={7}|>{7})/m.test(content)) failures.push(`${label}: unresolved merge marker`);
    if (root === 'src' && /\bconsole\.(log|debug)\s*\(/.test(content)) failures.push(`${label}: debug console statement`);
    if (/\bVITE_(?:GEMINI|OPENAI|API)_?KEY\b/.test(content)) failures.push(`${label}: browser-exposed API key reference`);
  }
}

const clientService = await readFile('src/services/ai.js', 'utf8');
if (!clientService.includes("fetch('/api/recipe'")) failures.push('src/services/ai.js: client must call /api/recipe');
if (/generativelanguage\.googleapis\.com|GEMINI_API_KEY/.test(clientService)) failures.push('src/services/ai.js: provider credentials leaked to client');

if (failures.length) {
  console.error(`Static checks failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log('Static checks passed: no merge markers, debug statements, or browser API-key references.');
