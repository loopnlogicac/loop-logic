import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { MemoryStore } from '../src/store/store.ts';
import { TutorialService } from '../src/app/tutorials.ts';
import { normalize } from '../src/library/retrieval.ts';
import { searchTokens, stem, TutorialIndex } from '../src/library/tutorial-search.ts';

const tutorials = new TutorialService(new MemoryStore(), join(import.meta.dirname, '..', 'content-kit'));
const BANGLA = /[ঀ-৿]/;

test('Bangla words keep their vowel signs, and simple endings are removed in both languages', () => {
  assert.deepEqual(normalize('লুপটা পাঁচবার চলবে'), ['লুপটা', 'পাঁচবার', 'চলবে']);
  assert.equal(stem('লুপের'), 'লুপ'); assert.equal(stem('লুপটা'), 'লুপ'); assert.equal(stem('pointers'), 'pointer'); assert.equal(stem('queues'), 'queue');
  assert.deepEqual(searchTokens('Pointers and arrays, 2024'), ['pointer', 'array']);
});

test('BM25 ranks the section that matches best, and boosts the current and related topics', () => {
  const doc = (topic: string, section: string, en: string) => ({ track: 't', topic, section, topicTitle: { en: topic, bn: null }, sectionTitle: { en: section, bn: null }, text: { en, bn: null } });
  const idx = new TutorialIndex([doc('a', 's1', 'a stack pushes and pops values from the top'), doc('b', 's1', 'a queue serves values in arrival order'), doc('c', 's1', 'a stack frame holds local values')]);
  assert.equal(idx.search('how does a queue work')[0]!.topic, 'b');
  assert.equal(idx.search('stack push')[0]!.topic, 'a');
  assert.equal(idx.search('stack', { topic: 'c' })[0]!.topic, 'c', 'the page the learner is on wins a tie');
  assert.deepEqual(idx.search(''), []);
});

test('site-wide search finds the right topic for English and Bangla questions', () => {
  assert.equal(tutorials.searchSections('normalization 3NF')[0]!.topic, 'db-normalization');
  assert.equal(tutorials.searchSections('malloc free memory leak')[0]!.topic, 'c-memory-leaks');
  assert.equal(tutorials.searchSections('হ্যাশ টেবিলে collision হলে কী করি')[0]!.topic, 'ds-hashing-intro');
  assert.ok(tutorials.searchSections('how are arrays and pointers related', 3).some((h) => h.topic === 'c-pointers-and-arrays'));
});

test('AI Teacher evidence: this topic first, strong matches from other topics, page language, no duplicates', () => {
  const c = tutorials.chatContext('c', 'c-arrays-intro', 'how are arrays and pointers related', 'en')!;
  assert.ok(c.evidence.length >= 3 && c.evidence.length <= 5);
  assert.ok(c.evidence.slice(0, 3).every((e) => e.id.startsWith('tutorial:c-arrays-intro#')), 'the open topic comes first');
  assert.ok(c.evidence.some((e) => e.id.startsWith('tutorial:c-pointers-and-arrays#')), 'a related topic is added');
  assert.equal(new Set(c.evidence.map((e) => e.id)).size, c.evidence.length);
  assert.ok(c.evidence.every((e) => e.url?.startsWith('/learn.html?track=')));
  const bn = tutorials.chatContext('data-structures', 'ds-hashing-intro', 'collision কী', 'bn')!;
  assert.ok(bn.evidence.filter((e) => e.id.startsWith('tutorial:ds-hashing-intro#')).every((e) => BANGLA.test(e.text)), 'Bangla pages get the Bangla text (English only where no Bangla exists)');
  const empty = tutorials.chatContext('data-structures', 'ds-hashing-intro', '', 'en')!;
  assert.equal(empty.evidence.length, 3, 'an empty question still gets the opening sections');
  assert.equal(tutorials.chatContext('c', 'no-such-topic', 'x'), null);
});

test('hidden tracks are never used as evidence', () => {
  const t = new TutorialService(new MemoryStore(), join(import.meta.dirname, '..', 'content-kit'));
  t.setHiddenTracks(['dbms']);
  assert.ok(t.searchSections('normalization 3NF', 10).every((h) => h.track !== 'dbms'));
  assert.equal(t.chatContext('dbms', 'db-normalization', '3NF'), null);
});
