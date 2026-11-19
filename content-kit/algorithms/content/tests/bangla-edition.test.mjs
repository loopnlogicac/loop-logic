import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { loadTrace, fuzzInputs } from '../../../tools/labs.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const manifest = JSON.parse(readFileSync(join(root, 'manifest.json')));
const topics = manifest.modules.flatMap(module => module.topics.map(id => ({ id, module: module.id }))).slice(0, 28);
const text = path => readFileSync(path, 'utf8');
const matches = (source, pattern) => Array.from(source.matchAll(pattern), match => match[0]);

test('the first 28 curriculum topics have complete Bangla bodies with working lesson references', () => {
  assert.equal(topics.length, 28);
  assert.equal(topics.at(-1).id, 'algo-knapsack-01');
  for (const topic of topics) {
    const dir = join(root, 'topics', topic.module, topic.id);
    const en = text(join(dir, 'body.en.html'));
    const bn = text(join(dir, 'body.bn.html'));
    assert.match(bn, /[\u0980-\u09ff]/u, topic.id);
    for (const pattern of [/<h2 id="[^"]+"/g, /data-example="[^"]+"/g, /data-lab="[^"]+"/g, /href="[^"]+"/g, /src="[^"]+"/g, /<pre><code[\s\S]*?<\/code><\/pre>/g, /<p\b/g, /<h3\b/g]) {
      assert.deepEqual(matches(bn, pattern), matches(en, pattern), `${topic.id}: ${pattern}`);
    }
    const metadata = JSON.parse(text(join(dir, 'topic.json')));
    for (const value of [metadata.title, metadata.summary, ...metadata.keyPoints]) {
      assert.match(value.bn, /[\u0980-\u09ff]/u, topic.id);
    }
  }
});

test('all first-half labs have Bangla explanations for every narrated path sampled', () => {
  let labs = 0;
  for (const topic of topics) {
    const dir = join(root, 'topics', topic.module, topic.id);
    const metadata = JSON.parse(text(join(dir, 'topic.json')));
    for (const id of metadata.labs ?? []) {
      const labDir = join(dir, 'labs', id);
      const lab = JSON.parse(text(join(labDir, 'lab.json')));
      assert.match(lab.title.bn, /[\u0980-\u09ff]/u, id);
      assert.match(lab.summary.bn, /[\u0980-\u09ff]/u, id);
      const trace = loadTrace(text(join(labDir, 'trace.js')));
      const inputs = [...lab.presets.map(preset => preset.input), ...lab.checks.map(check => check.input), ...Array.from(fuzzInputs(lab.inputs)).slice(0, 50)];
      for (const input of inputs) {
        for (const step of trace(input).steps) {
          if (step.note?.en) assert.match(step.note.bn, /[\u0980-\u09ff]/u, `${id}: ${step.note.en}`);
        }
      }
      labs++;
    }
  }
  assert.equal(labs, 15);
});
