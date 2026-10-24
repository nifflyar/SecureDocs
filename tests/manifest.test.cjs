'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const vm = require('node:vm');
const { buildManifest, parseTimestamp } = require('../prototype/manifest.js');
const { validateManifest } = require('../contracts/validate-manifest.cjs');
const sample = require('../contracts/sample-package.json');
const NOW = '2026-10-24T00:00:00+05:00';
const EXPIRES = '2026-10-31T00:00:00+05:00';

function state() {
  return {
    version: 1, loaded: true, fields: true, verification: 'confirmed', started: true,
    approvals: ['adviser', 'dean', 'registrar'].map(role => ({ role, version: 1 })),
    grant: 'active', sentVersion: 1, verifiedAt: NOW, sentAt: NOW, expiresAt: EXPIRES, events: []
  };
}
function freeze(value) {
  Object.values(value).forEach(item => { if (item && typeof item === 'object') freeze(item); });
  return Object.freeze(value);
}
const options = { role: 'recipient', now: NOW };

test('valid output matches the independent synthetic fixture and passes the standard validator', () => {
  const output = buildManifest(state(), options);
  assert.deepEqual(output, sample);
  assert.deepEqual(validateManifest(output, { requireActive: true, at: NOW }), { valid: true, errors: [] });
  assert.equal(output.documents[0].sha256, crypto.createHash('sha256').update('SecureDocs synthetic fixture v1').digest('hex'));
});
test('success is deterministic, accepts frozen inputs and returns independent objects', () => {
  const input = freeze(state()), opts = freeze({ ...options });
  const first = buildManifest(input, opts), second = buildManifest(input, opts);
  assert.deepEqual(first, second);
  first.approvals[0].role = 'changed'; first.documents[0].verification.limitations.push('changed');
  assert.deepEqual(second, sample);
  assert.deepEqual(input, state());
});
test('browser global works without require, a model, a clock read or network access', () => {
  const context = vm.createContext({ fetch() { throw new Error('Network forbidden'); } });
  vm.runInContext('Date.now = () => { throw new Error("Clock read forbidden"); };', context);
  vm.runInContext(fs.readFileSync(require.resolve('../prototype/manifest.js'), 'utf8'), context);
  assert.equal(typeof context.SecureDocsManifest.buildManifest, 'function');
  assert.deepEqual(JSON.parse(JSON.stringify(context.SecureDocsManifest.buildManifest(state(), options))), sample);
});
test('a later current version is mapped to every reference', () => {
  const input = state(); input.version = input.sentVersion = 7;
  input.approvals.forEach(item => { item.version = 7; });
  const result = buildManifest(input, options);
  assert.equal(result.documents[0].version, 7);
  assert.ok(result.approvals.every(item => item.version === 7));
});
for (const role of ['student', 'coordinator', 'adviser', 'dean', 'registrar', 'Recipient', 'unknown', undefined]) {
  test(`rejects export role ${String(role)}`, () => assert.throws(() => buildManifest(state(), { ...options, role }), /recipient/));
}
for (const outcome of ['not_checked', 'mismatch', 'not_found', 'unavailable', 'manual_review', undefined]) {
  test(`rejects source outcome ${String(outcome)}`, () => {
    assert.throws(() => buildManifest({ ...state(), verification: outcome }, options), /confirmed/);
  });
}
const invalidStates = [
  ['missing state', undefined], ['null state', null], ['array state', []],
  ['unloaded', { ...state(), loaded: false }], ['unconfirmed fields', { ...state(), fields: false }],
  ['truthy field flag', { ...state(), fields: 'true' }], ['route not started', { ...state(), started: false }],
  ['missing events', { ...state(), events: undefined }], ['zero version', { ...state(), version: 0 }],
  ['fractional version', { ...state(), version: 1.5 }], ['string version', { ...state(), version: '1' }],
  ['unsafe version', { ...state(), version: Number.MAX_SAFE_INTEGER + 1 }],
  ['stale sent version', { ...state(), sentVersion: 2 }],
  ['revoked grant', { ...state(), grant: 'revoked' }], ['expired grant', { ...state(), grant: 'expired' }],
  ['missing grant', { ...state(), grant: undefined }],
  ['missing approval', { ...state(), approvals: state().approvals.slice(1) }],
  ['extra approval', { ...state(), approvals: [...state().approvals, { role: 'registrar', version: 1 }] }],
  ['null approval', { ...state(), approvals: [null, ...state().approvals.slice(1)] }],
  ['wrong order', { ...state(), approvals: state().approvals.reverse() }],
  ['duplicate role', { ...state(), approvals: state().approvals.map(item => ({ ...item, role: 'adviser' })) }],
  ['stale approvals', { ...state(), approvals: state().approvals.map(item => ({ ...item, version: 2 })) }],
  ['missing timestamp', { ...state(), verifiedAt: null }],
  ['verification after send', { ...state(), verifiedAt: '2026-10-24T00:00:01+05:00' }],
  ['send in future', { ...state(), sentAt: '2026-10-24T00:00:01+05:00' }],
  ['expiry before verification', { ...state(), expiresAt: '2026-10-23T00:00:00+05:00' }]
];
for (const [name, input] of invalidStates) {
  test(`invalid state: ${name}; rejection does not mutate input`, () => {
    const before = structuredClone(input);
    if (input && typeof input === 'object') freeze(input);
    assert.throws(() => buildManifest(input, options), Error);
    assert.deepEqual(input, before);
  });
}
test('options and explicit time are mandatory', () => {
  for (const opts of [undefined, null, [], {}, { role: 'recipient' }]) assert.throws(() => buildManifest(state(), opts));
});
test('expiry boundary: one millisecond before passes; exact time and after fail', () => {
  buildManifest(state(), { role: 'recipient', now: '2026-10-30T18:59:59.999Z' });
  for (const now of ['2026-10-30T19:00:00Z', '2026-10-30T19:00:00.001Z']) {
    assert.throws(() => buildManifest(state(), { role: 'recipient', now }), /expiresAt/);
  }
});
test('equivalent timezone offsets compare by instant', () => {
  assert.deepEqual(buildManifest(state(), { role: 'recipient', now: '2026-10-23T19:00:00Z' }), sample);
});
for (const value of ['2026-02-29T00:00:00Z', '2026-04-31T00:00:00Z', '2026-13-01T00:00:00Z',
  '2026-10-24T24:00:00Z', '2026-10-24T00:60:00Z', '2026-10-24T00:00:60Z',
  '2026-10-24T00:00:00', '2026-10-24', '2026-10-24T00:00:00-00:00',
  '2026-10-24T00:00:00+24:00', '2026-10-24T00:00:00.1234Z', '0000-01-01T00:00:00Z', '', null]) {
  test(`rejects malformed timestamp ${String(value)}`, () => {
    assert.throws(() => parseTimestamp(value));
    assert.throws(() => buildManifest(state(), { ...options, now: value }));
  });
}
test('accepts leap dates and supported fractional seconds without calendar normalization', () => {
  assert.equal(parseTimestamp('2028-02-29T00:00:00.12Z'), Date.UTC(2028, 1, 29, 0, 0, 0, 120));
  assert.throws(() => parseTimestamp('2100-02-29T00:00:00Z'));
  assert.ok(Number.isFinite(parseTimestamp('2000-02-29T00:00:00Z')));
});
