// Replay explicit inputs with the same state model as the course player.
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';
import assert from 'node:assert/strict';
import {loadTrace, playTrace} from '../../../tools/labs.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const requests = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const results = [];
for (const request of requests) {
  const source = readFileSync(resolve(root, request.path, 'trace.js'), 'utf8');
  const trace = loadTrace(source);
  const before = JSON.stringify(request.input);
  const first = trace(request.input);
  assert.equal(JSON.stringify(request.input), before, 'Input was mutated');
  assert.equal(JSON.stringify(trace(request.input)), JSON.stringify(first), 'Impure replay');
  const lab = JSON.parse(readFileSync(resolve(root, request.path, 'lab.json'), 'utf8'));
  const state = playTrace('ml', first, {lines: lab.pseudocode.length});
  assert.equal(first.steps.at(-1).op, 'done');
  if (request.preset) assert(first.steps.length >= 20 && first.steps.length <= 400, `${request.path}: ${first.steps.length} preset steps`);
  results.push({state, init: first.init, length: first.steps.length});
}
process.stdout.write(JSON.stringify(results));
