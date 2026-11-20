import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, rmSync, cpSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const pkg = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const kit = resolve(pkg, '../..');
const topics = join(pkg, 'topics');
function sandbox(fn) {
  const dir = mkdtempSync(join(tmpdir(), 'c-batch-six-test-'));
  try { return fn(dir); } finally { rmSync(dir, { recursive: true, force: true }); }
}
function build(dir, source, flags = []) {
  const exe = join(dir, 'program');
  const r = spawnSync('gcc', ['-std=c17', '-Wall', '-Wextra', '-Wpedantic', '-Werror', '-O2', source, ...flags, '-o', exe], { cwd: kit, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  return exe;
}
function run(exe, dir, input = '', args = [], expectedStatus = 0) {
  const r = spawnSync(exe, args, { cwd: dir, input, encoding: 'utf8', timeout: 5000 });
  assert.equal(r.status, expectedStatus, r.stderr);
  return r.stdout;
}
const project = id => join(topics, 'practice-exam', id, 'examples/ex-1.c');

test('records survive restart; rejected edits preserve persisted bytes; corrupt files are not replaced', () => sandbox(dir => {
  const exe = build(dir, project('c-mini-project-student-records'));
  writeFileSync(join(dir, 'students.txt'), '');
  run(exe, dir, 'A 101 72\nA 102 90\nU 101 80\nD 102\nQ\n');
  assert.equal(readFileSync(join(dir, 'students.txt'), 'utf8'), '101 80\n');
  assert.match(run(exe, dir, 'L\nQ\n'), /101 80\nCount: 1/);
  run(exe, dir, 'A 101 10\nU 101 101\nA 999999999999999999999 20\nQ\n');
  assert.equal(readFileSync(join(dir, 'students.txt'), 'utf8'), '101 80\n');
  writeFileSync(join(dir, 'students.txt'), '101 broken\n');
  run(exe, dir, 'A 103 50\nQ\n', [], 1);
  assert.equal(readFileSync(join(dir, 'students.txt'), 'utf8'), '101 broken\n');
}));

test('record capacity and overlong input reject without losing a subsequent valid command', () => sandbox(dir => {
  const exe = build(dir, project('c-mini-project-student-records'));
  writeFileSync(join(dir, 'students.txt'), '');
  const commands = Array.from({ length: 20 }, (_, i) => `A ${i + 1} ${i}`).join('\n');
  const out = run(exe, dir, `${commands}\nA 21 50\n${'x'.repeat(150)}\nS 20\nQ\n`);
  assert.match(out, /full\ninvalid\n20 19\n/);
  assert.equal(readFileSync(join(dir, 'students.txt'), 'utf8').trim().split('\n').length, 20);
}));

test('account replays only accepted changes and enforces balance and history limits', () => sandbox(dir => {
  const exe = build(dir, project('c-mini-project-bank-account'));
  writeFileSync(join(dir, 'account.txt'), '');
  run(exe, dir, 'D 500\nW 120\nW 400\nD 0\nQ\n');
  assert.equal(readFileSync(join(dir, 'account.txt'), 'utf8'), 'D 500\nW 120\n');
  assert.match(run(exe, dir, 'B\nW 380\nH\nQ\n'), /Balance: 380[\s\S]*3 W 380 -> 0\nEntries: 3/);
  writeFileSync(join(dir, 'account.txt'), 'D 100000\n'.repeat(10));
  assert.match(run(exe, dir, 'D 1\nB\nQ\n'), /balance limit\nBalance: 1000000/);
  assert.equal(readFileSync(join(dir, 'account.txt'), 'utf8'), 'D 100000\n'.repeat(10));
  writeFileSync(join(dir, 'account.txt'), 'D 1\nW 1\n'.repeat(50));
  assert.match(run(exe, dir, 'D 1\nH\nQ\n'), /history full[\s\S]*Entries: 100/);
  writeFileSync(join(dir, 'account.txt'), 'W 1\nD 1\n');
  run(exe, dir, 'B\nQ\n', [], 1);
  assert.equal(readFileSync(join(dir, 'account.txt'), 'utf8'), 'W 1\nD 1\n');
}));

test('tic-tac-toe recognises all eight winning lines, a draw, and turn-preserving rejection', () => sandbox(dir => {
  const exe = build(dir, project('c-mini-project-tic-tac-toe'));
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  const cell = i => `${Math.floor(i / 3) + 1} ${i % 3 + 1}\n`;
  for (const line of lines) {
    const others = Array.from({ length: 9 }, (_, i) => i).filter(i => !line.includes(i));
    const moves = [line[0], others[0], line[1], others[1], line[2]];
    const out = run(exe, dir, moves.map(cell).join('') + '9 9\n');
    assert.match(out, /Winner: X\n$/);
    assert.doesNotMatch(out, /Draw|invalid/);
  }
  const draw = [0,1,2,4,3,5,7,6,8].map(cell).join('');
  assert.match(run(exe, dir, draw), /Draw\n$/);
  assert.match(run(exe, dir, '0 1\n1 1\n1 1\n2 2\n'), /invalid[\s\S]*O row col \(1-3\):\noccupied\nO row col/);
}));

test('circular and linked queues agree with an independent FIFO model through repeated wraparound', () => sandbox(dir => {
  const module = join(topics, 'data-structures/c-queue/module');
  const source = join(dir, 'queue-test.c');
  writeFileSync(source, `#include <assert.h>
#include "queue.h"
int main(void) {
    struct ArrayQueue a = {0};
    struct LinkedQueue b = {0};
    int model[4];
    int count = 0;
    unsigned int state = 17U;
    for (int i = 0; i < 1000; ++i) {
        state = state * 1664525U + 1013904223U;
        if ((state >> 24) % 3U != 0U) {
            int value = i - 500;
            int ok = enqueue(&a, value);
            assert(ok == (count < 4));
            if (ok) { assert(linked_enqueue(&b, value)); model[count++] = value; }
        } else {
            int x = 777;
            int y = 777;
            assert(dequeue(&a, &x) == (count > 0));
            assert(linked_dequeue(&b, &y) == (count > 0));
            if (count > 0) {
                assert(x == model[0] && y == model[0]);
                for (int j = 1; j < count; ++j) { model[j - 1] = model[j]; }
                --count;
            } else { assert(x == 777 && y == 777); }
        }
        assert(a.count == (size_t)count);
        assert((b.front == NULL) == (count == 0));
        assert((b.rear == NULL) == (count == 0));
        if (b.rear != NULL) { assert(b.rear->next == NULL); }
    }
    queue_clear(&b);
    assert(b.front == NULL && b.rear == NULL);
    return 0;
}
`);
  const exe = build(dir, source, ['-I', module, join(module, 'queue.c')]);
  run(exe, dir);
}));

test('command-line sum rejects whole-token failures and conversion or accumulation overflow', () => sandbox(dir => {
  const exe = build(dir, join(topics, 'advanced/c-command-line-arguments/examples/ex-3.c'));
  assert.equal(run(exe, dir, '', ['20', '-8', '3']), 'Sum: 15\n');
  for (const args of [[], [''], ['+'], ['12kg'], ['12 '], ['9999999999999999999999999999999999999999'], ['9223372036854775807', '1']]) {
    run(exe, dir, '', args, 1);
  }
}));

test('the multi-file Makefile builds and an unchanged build is up to date', () => sandbox(dir => {
  cpSync(join(topics, 'advanced/c-multi-file-programs/project'), dir, { recursive: true });
  const built = spawnSync('make', [], { cwd: dir, encoding: 'utf8' });
  assert.equal(built.status, 0, built.stderr);
  assert.equal(run(join(dir, 'marks-demo'), dir), 'Passed: 2\n');
  assert.equal(spawnSync('make', ['-q'], { cwd: dir }).status, 0);
  assert.equal(spawnSync('make', ['clean'], { cwd: dir }).status, 0);
  assert.equal(existsSync(join(dir, 'marks-demo')), false);
}));
