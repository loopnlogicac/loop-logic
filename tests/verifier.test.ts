import { test } from 'node:test';
import assert from 'node:assert/strict';
import { taka, percent, parseLearnerNumber, formatTaka } from '../src/core/money.ts';
import { verifyPricing, minimumPriceForMargin, discountedPrice, percentMatches, VerifierError } from '../src/core/verifier.ts';

test('demo fixture from the product specification', () => {
  const f = verifyPricing({ cost: taka(800), listPrice: taka(1000), discountBps: percent(10), requiredMarginBps: percent(15) });
  assert.equal(f.salePrice, taka(900));
  assert.equal(f.profit, taka(100));
  assert.equal(f.markupPct, 12.5);
  assert.equal(f.marginPct, 11.11);
  assert.equal(f.meetsPolicy, false);
  assert.equal(f.correctDecision, 'reject');
  // 800 / 0.85 = 941.176… → rounded UP to the taka
  assert.equal(f.minimumPrice, taka(942));
});

test('boundary equality meets the policy (margin exactly at the minimum)', () => {
  // cost 850, price 1000 → margin exactly 15%
  const f = verifyPricing({ cost: taka(850), listPrice: taka(1000), discountBps: 0, requiredMarginBps: percent(15) });
  assert.equal(f.marginPct, 15);
  assert.equal(f.meetsPolicy, true);
  assert.equal(f.correctDecision, 'accept');
});

test('policy check uses exact values, not rounded display', () => {
  // margin 14.995% displays as 15.00% but must NOT meet a 15% rule
  const f = verifyPricing({ cost: taka(850.05), listPrice: taka(1000), discountBps: 0, requiredMarginBps: percent(15) });
  assert.equal(f.marginPct, 15);
  assert.equal(f.meetsPolicy, false);
});

test('fees are part of total cost', () => {
  const f = verifyPricing({ cost: taka(900), feePaisa: taka(60), listPrice: taka(1300), discountBps: percent(10), requiredMarginBps: percent(15) });
  assert.equal(f.totalCost, taka(960));
  assert.equal(f.salePrice, taka(1170));
  assert.equal(f.profit, taka(210));
  assert.equal(f.meetsPolicy, true); // 210/1170 = 17.95%
  assert.equal(f.minimumPrice, taka(1130)); // 960/0.85 = 1129.41 → 1130
});

test('discount rounding is half-up to the paisa', () => {
  assert.equal(discountedPrice(taka(999.99), percent(12.5)), 87499); // 874.99125 → 874.99
  assert.equal(discountedPrice(1, 5000), 1); // 0.5 paisa → 1
});

test('minimum price rounds up to the increment', () => {
  assert.equal(minimumPriceForMargin(taka(800), percent(15), 100), taka(942));
  assert.equal(minimumPriceForMargin(taka(800), percent(15), 1000), taka(950));
  assert.equal(minimumPriceForMargin(taka(850), percent(15), 100), taka(1000)); // exact, no extra step
});

test('invalid inputs are rejected', () => {
  const ok = { cost: taka(800), listPrice: taka(1000), discountBps: percent(10), requiredMarginBps: percent(15) };
  assert.throws(() => verifyPricing({ ...ok, listPrice: 0 }), VerifierError);
  assert.throws(() => verifyPricing({ ...ok, cost: -1 }), VerifierError);
  assert.throws(() => verifyPricing({ ...ok, discountBps: 10_000 }), VerifierError);
  assert.throws(() => verifyPricing({ ...ok, requiredMarginBps: 10_000 }), VerifierError);
  assert.throws(() => verifyPricing({ ...ok, cost: 0 }), VerifierError); // markup undefined
  assert.throws(() => verifyPricing({ ...ok, cost: 800.5 }), /whole number of paisa/);
});

test('learner percent answers within 0.05 points are accepted', () => {
  const margin = { num: 100n, den: 900n }; // 11.111…%
  assert.ok(percentMatches(11.11, margin));
  assert.ok(percentMatches(11.1, margin));
  assert.ok(!percentMatches(11, margin));
  assert.ok(!percentMatches(12.5, margin));
});

test('learner numbers in Bangla digits and with symbols are understood', () => {
  assert.equal(parseLearnerNumber('৯০০'), 900);
  assert.equal(parseLearnerNumber('৳1,000'), 1000);
  assert.equal(parseLearnerNumber('১১.১%'), 11.1);
  assert.equal(parseLearnerNumber('abc'), null);
  assert.equal(parseLearnerNumber(''), null);
  assert.equal(formatTaka(taka(1000), 'bn'), '৳১,০০০');
});
