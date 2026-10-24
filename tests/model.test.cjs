'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { initialState, act, ROLES, STAGES, OUTCOMES } = require('../prototype/model.js');
const { buildManifest } = require('../prototype/manifest.js');
const { validateManifest } = require('../contracts/validate-manifest.cjs');
const NOW = '2026-10-24T10:00:00.000Z';
const LATER = '2026-10-24T11:00:00.000Z';
const step = (s, r, t, v, now = NOW) => act(s, r, t, v, { now });
function prepared() { return step(step(initialState(), 'student', 'load'), 'student', 'confirm'); }
function started() { return step(step(prepared(), 'coordinator', 'verify', 'confirmed'), 'coordinator', 'start'); }
function approved() { return STAGES.reduce((s, r) => step(s, r, 'approve'), started()); }
function sent() { return step(approved(), 'coordinator', 'send'); }
function denied(state, role, type, value, now = NOW) {
  const before = JSON.stringify(state);
  assert.throws(() => step(state, role, type, value, now), Error);
  assert.equal(JSON.stringify(state), before, 'denial must not mutate state');
}
test('complete synthetic route integrates with the merged builder and active validator', () => {
  const state = step(sent(), 'recipient', 'download');
  assert.equal(state.expiresAt, '2026-10-31T10:00:00.000Z');
  const manifest = buildManifest(state, { role: 'recipient', now: NOW });
  assert.deepEqual(validateManifest(manifest, { requireActive: true, at: NOW }), { valid: true, errors: [] });
  assert.equal(manifest.documents[0].type, 'learning_agreement');
});
test('preparation gates verification, route and send; repeated load is not replacement', () => {
  denied(initialState(), 'student', 'confirm');
  denied(initialState(), 'coordinator', 'verify', 'confirmed');
  denied(prepared(), 'coordinator', 'start');
  denied(prepared(), 'coordinator', 'send');
  denied(prepared(), 'student', 'load');
  denied(prepared(), 'student', 'confirm');
});
const allowed = { load: ['student', initialState()], confirm: ['student', step(initialState(), 'student', 'load')],
  replace: ['student', sent()], verify: ['coordinator', prepared(), 'confirmed'], start: ['coordinator', step(prepared(), 'coordinator', 'verify', 'confirmed')],
  send: ['coordinator', approved()], revoke: ['coordinator', sent()], expire: ['coordinator', sent()], download: ['recipient', sent()] };
for (const [type, [expected, state, value]] of Object.entries(allowed)) {
  test(`${type}: all five other roles are denied`, () => { for (const role of ROLES.filter(r => r !== expected)) denied(state, role, type, value); });
}
test('each approval and return require the expected role and current ordered decisions', () => {
  let state = started();
  for (const expected of STAGES) {
    for (const wrong of ROLES.filter(r => r !== expected)) { denied(state, wrong, 'approve'); denied(state, wrong, 'return', 'Correction needed'); }
    state = step(state, expected, 'approve');
  }
  for (const role of ROLES) denied(state, role, 'approve');
  denied({ ...started(), approvals: [{ role: 'adviser', version: 2 }] }, 'dean', 'approve');
  denied({ ...approved(), approvals: [{role:'dean',version:1},{role:'adviser',version:1},{role:'registrar',version:1}] }, 'coordinator', 'send');
});
for (const outcome of OUTCOMES) {
  test(`new verification ${outcome} invalidates every old approval, send and timestamp`, () => {
    const state = step(sent(), 'coordinator', 'verify', outcome, LATER);
    assert.equal(state.verification, outcome); assert.deepEqual(state.approvals, []);
    assert.equal(state.started, false); assert.equal(state.grant, 'inactive');
    for (const key of ['sentVersion', 'sentAt', 'expiresAt']) assert.equal(state[key], null);
    assert.equal(state.verifiedAt, outcome === 'confirmed' ? LATER : null);
    denied(state, 'recipient', 'download', undefined, LATER);
    denied(state, 'coordinator', 'send', undefined, LATER);
    if (outcome !== 'confirmed') denied(state, 'coordinator', 'start', undefined, LATER);
    else assert.equal(step(state, 'coordinator', 'start', undefined, LATER).approvals.length, 0);
  });
}
test('replacement invalidates confirmation, verification, approvals, grant and all timestamps', () => {
  const original = sent(), state = step(original, 'student', 'replace', undefined, LATER);
  assert.equal(original.version, 1); assert.equal(original.grant, 'active');
  assert.equal(state.version, 2); assert.equal(state.loaded, true); assert.equal(state.fields, false);
  assert.equal(state.verification, 'not_checked'); assert.equal(state.started, false); assert.deepEqual(state.approvals, []);
  for (const key of ['verifiedAt', 'sentAt', 'expiresAt', 'sentVersion']) assert.equal(state[key], null);
  denied(state, 'recipient', 'download', undefined, LATER);
  denied(state, 'coordinator', 'start', undefined, LATER);
});
test('return needs a reason at each stage and requires an explicit fresh route', () => {
  let state = started();
  for (const role of STAGES) {
    for (const reason of [undefined, '', '   ', 42]) denied(state, role, 'return', reason);
    const returned = step(state, role, 'return', '  Correct course  ');
    assert.equal(returned.returnReason, 'Correct course'); assert.equal(returned.started, false);
    assert.deepEqual(returned.approvals, []); denied(returned, 'adviser', 'approve');
    const restart = step(returned, 'coordinator', 'start');
    assert.equal(restart.returnReason, ''); assert.deepEqual(restart.approvals, []);
    state = step(state, role, 'approve');
  }
});
test('duplicate live send is denied, while resend after revocation establishes new timestamps', () => {
  const original = sent(); denied(original, 'coordinator', 'send');
  const revoked = step(original, 'coordinator', 'revoke');
  denied(revoked, 'recipient', 'download');
  assert.throws(() => buildManifest(revoked, { role: 'recipient', now: NOW }));
  const resent = step(revoked, 'coordinator', 'send', undefined, LATER);
  assert.equal(resent.sentAt, LATER); assert.equal(resent.expiresAt, '2026-10-31T11:00:00.000Z');
});
test('exact expiry boundary is enforced by model, builder and validator with explicit clocks', () => {
  const state = sent(), boundary = state.expiresAt, before = '2026-10-31T09:59:59.999Z';
  step(state, 'recipient', 'download', undefined, before);
  for (const now of [boundary, '2026-10-31T10:00:00.001Z']) {
    denied(state, 'recipient', 'download', undefined, now);
    assert.throws(() => buildManifest(state, { role: 'recipient', now }));
    assert.equal(validateManifest(buildManifest(state, { role: 'recipient', now: NOW }), { requireActive: true, at: now }).valid, false);
  }
  assert.equal(step(state, 'coordinator', 'send', undefined, boundary).sentAt, boundary);
});
test('simulated expiry changes the actual deadline and blocks export', () => {
  const state = step(sent(), 'coordinator', 'expire', undefined, LATER);
  assert.equal(state.grant, 'expired'); assert.equal(state.expiresAt, LATER);
  denied(state, 'recipient', 'download', undefined, LATER);
  assert.throws(() => buildManifest(state, { role: 'recipient', now: LATER }));
});
test('bad actions, roles, clocks and version overflow fail without mutation', () => {
  denied(prepared(), 'admin', 'verify', 'confirmed'); denied(prepared(), 'coordinator', 'unknown');
  denied(prepared(), 'coordinator', 'verify', 'yes');
  denied(prepared(), 'coordinator', 'verify', 'confirmed', 'not-a-date');
  denied(sent(), 'coordinator', 'revoke', undefined, '2026-10-24T09:59:59.999Z');
  denied({ ...prepared(), version: Number.MAX_SAFE_INTEGER }, 'student', 'replace');
});
test('independent sessions and transitions do not share mutable arrays', () => {
  const a = initialState(), b = initialState(); a.events.push({ type: 'test' }); assert.deepEqual(b.events, []);
  const before = started(), after = step(before, 'adviser', 'approve'); after.events[0].type = 'changed';
  assert.equal(before.events[0].type, 'load'); assert.deepEqual(before.approvals, []);
});
test('optional fifth argument retains the original four-argument call shape', () => {
  assert.equal(act(initialState(), 'student', 'load', undefined).loaded, true);
});
test('clock rejects impossible dates and unsupported ISO profiles instead of normalising them', () => {
  for (const now of ['2026-02-29T10:00:00Z', '2026-04-31T10:00:00Z', '2026-10-24T24:00:00Z',
    '2026-10-24T10:00:00-00:00', '2026-10-24T10:00:00.1234Z', '2026-10-24T10:00:00', '0000-01-01T00:00:00Z']) {
    denied(initialState(), 'student', 'load', undefined, now);
  }
  assert.equal(step(initialState(), 'student', 'load', undefined, '2026-10-24T15:00:00+05:00').events[0].at, NOW);
});
test('replacement can complete a fresh route and exports only version 2 references', () => {
  let state = step(sent(), 'student', 'replace');
  state = step(state, 'student', 'confirm'); state = step(state, 'coordinator', 'verify', 'confirmed');
  state = step(state, 'coordinator', 'start');
  for (const role of STAGES) state = step(state, role, 'approve');
  state = step(state, 'coordinator', 'send');
  const manifest = buildManifest(state, { role: 'recipient', now: NOW });
  assert.equal(manifest.documents[0].version, 2);
  assert.ok(manifest.approvals.every(a => a.version === 2));
  assert.equal(validateManifest(manifest, { requireActive: true, at: NOW }).valid, true);
});
