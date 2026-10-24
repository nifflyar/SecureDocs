'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { validateManifest } = require('../contracts/validate-manifest.cjs');
const sample = require('../contracts/sample-package.json');
const AT = '2026-10-24T00:00:00+05:00';
const active = { requireActive: true, at: AT };
const copy = () => structuredClone(sample);

test('the independent fixture validates without modifying its contents', () => {
  const input = copy(), before = JSON.stringify(input);
  assert.deepEqual(validateManifest(input, active), { valid: true, errors: [] });
  assert.equal(JSON.stringify(input), before);
});
const bad = [
  ['unknown schema version', m => { m.schemaVersion = '2.0'; }, /Schema/],
  ['missing required property', m => { delete m.packageId; }, /Schema/],
  ['unexpected root property', m => { m.sentAt = AT; }, /Schema/],
  ['unexpected nested property', m => { m.documents[0].signature = 'fake'; }, /Schema/],
  ['wrong type without coercion', m => { m.documents[0].version = '1'; }, /Schema/],
  ['fractional version', m => { m.documents[0].version = 1.5; }, /Schema/],
  ['invalid hash', m => { m.documents[0].sha256 = 'wrong'; }, /Schema/],
  ['empty documents', m => { m.documents = []; }, /Schema/],
  ['false demo marker', m => { m.demo = false; }, /demo=true/],
  ['same organisations', m => { m.recipientOrganizationId = m.senderOrganizationId; }, /distinct/],
  ['blank organisation', m => { m.senderOrganizationId = ' '; }, /nonblank/],
  ['blank package ID', m => { m.packageId = ' '; }, /blank/],
  ['duplicate document', m => { m.documents.push(structuredClone(m.documents[0])); }, /Duplicate/],
  ['blank document ID', m => { m.documents[0].documentId = ' '; }, /blank/],
  ['unsafe version', m => { m.documents[0].version = Number.MAX_SAFE_INTEGER + 1; }, /safe integer/],
  ['unknown reference', m => { m.approvals[0].documentId = 'absent'; }, /existing current/],
  ['stale approval version', m => { m.approvals[0].version = 2; }, /existing current/],
  ['returned decision', m => { m.approvals[0].decision = 'returned'; }, /returned/],
  ['wrong role', m => { m.approvals[0].role = 'student'; }, /role/],
  ['translated role', m => { m.approvals[0].role = 'Academic adviser'; }, /role/],
  ['wrong order', m => { m.approvals.reverse(); }, /in order/],
  ['missing approval', m => { m.approvals.pop(); }, /exactly/],
  ['duplicate approval', m => { m.approvals.push(structuredClone(m.approvals[0])); }, /exactly/],
  ['student provenance', m => { m.documents[0].provenance = 'student_copy'; }, /student copy/],
  ['blank method', m => { m.documents[0].verification.method = ' '; }, /method and source/],
  ['blank source', m => { m.documents[0].verification.sourceRef = ' '; }, /method and source/],
  ['missing limitations', m => { m.documents[0].verification.limitations = []; }, /limitations/],
  ['blank limitations', m => { m.documents[0].verification.limitations = [' ']; }, /limitations/],
  ['null checkedAt', m => { m.documents[0].verification.checkedAt = null; }, /timestamp/],
  ['invalid calendar date', m => { m.documents[0].verification.checkedAt = '2026-02-30T00:00:00Z'; }, /calendar/],
  ['timezone absent', m => { m.access.expiresAt = '2026-10-31T00:00:00'; }, /timezone/],
  ['verification in future', m => { m.documents[0].verification.checkedAt = '2026-10-24T00:00:01+05:00'; }, /future/],
  ['verification at expiry', m => { m.documents[0].verification.checkedAt = m.access.expiresAt; }, /before access expires/],
  ['revoked access', m => { m.access.status = 'revoked'; }, /Active access/],
  ['expired access', m => { m.access.status = 'expired'; }, /Active access/]
];
for (const outcome of ['not_checked', 'mismatch', 'not_found', 'unavailable', 'manual_review']) {
  bad.push([`source ${outcome}`, m => { m.documents[0].verification.outcome = outcome; }, /confirmed/]);
}
for (const [name, change, expected] of bad) {
  test(`contract rejects ${name} without mutation`, () => {
    const input = copy(); change(input); const before = JSON.stringify(input);
    const result = validateManifest(input, active);
    assert.equal(result.valid, false); assert.match(result.errors.join('\n'), expected);
    assert.equal(JSON.stringify(input), before);
  });
}
test('schema rejects non-object and malformed nested input without semantic crashes', () => {
  for (const input of [null, [], true, 1, 'text', {}, { ...sample, approvals: null }, { ...sample, documents: [null] }]) {
    assert.equal(validateManifest(input).valid, false);
  }
});
test('exact expiry and after fail; one millisecond before passes', () => {
  assert.equal(validateManifest(sample, { requireActive: true, at: '2026-10-30T18:59:59.999Z' }).valid, true);
  for (const at of ['2026-10-30T19:00:00Z', '2026-10-30T19:00:00.001Z']) {
    assert.equal(validateManifest(sample, { requireActive: true, at }).valid, false);
  }
});
test('archive validation accepts revoked/expired grants but active validation rejects them', () => {
  for (const status of ['revoked', 'expired']) {
    const input = copy(); input.access.status = status;
    assert.equal(validateManifest(input).valid, true);
    assert.equal(validateManifest(input, active).valid, false);
  }
  assert.equal(validateManifest(sample, { at: '2030-01-01T00:00:00Z' }).valid, true);
});
test('active validation uses the current clock only when at is omitted', t => {
  t.mock.method(Date, 'now', () => Date.parse('2026-10-30T19:00:00Z'));
  assert.equal(validateManifest(sample, { requireActive: true }).valid, false);
  assert.equal(validateManifest(sample, active).valid, true);
});
test('invalid at and requireActive options fail explicitly', () => {
  assert.equal(validateManifest(sample, { at: 'invalid' }).valid, false);
  assert.equal(validateManifest(sample, { requireActive: 'true', at: AT }).valid, false);
});
test('each document needs its own current ordered approvals', () => {
  const input = copy(), other = structuredClone(input.documents[0]); other.documentId = 'DOC-DEMO-002';
  input.documents.push(other);
  assert.equal(validateManifest(input, active).valid, false);
  input.approvals.push(...sample.approvals.map(a => ({ ...a, documentId: other.documentId })));
  assert.equal(validateManifest(input, active).valid, true);
});

const cli = path.resolve(__dirname, '../contracts/validate-manifest.cjs');
const fixture = path.resolve(__dirname, '../contracts/sample-package.json');
function run(...args) { return spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8' }); }
test('CLI runs from another directory and clearly limits its claim', () => {
  const result = spawnSync(process.execPath, [cli, fixture, '--require-active', '--at', AT], { encoding: 'utf8', cwd: os.tmpdir() });
  assert.equal(result.status, 0, result.stderr); assert.match(result.stdout, /Not proof of document authenticity/);
});
test('CLI returns 1 for invalid data or expired access', () => {
  const result = run(fixture, '--require-active', '--at', '2026-10-30T19:00:00Z');
  assert.equal(result.status, 1); assert.match(result.stderr, /expired/);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'securedocs-contract-'));
  try {
    const file = path.join(dir, 'invalid.json'); fs.writeFileSync(file, '{}');
    assert.equal(run(file).status, 1);
    fs.writeFileSync(file, '{bad json'); assert.equal(run(file).status, 2);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
test('CLI rejects missing files, malformed flags, invalid timestamps and duplicated options', () => {
  for (const args of [[], ['--unknown'], [fixture, '--unknown'], [fixture, '--at'],
    [fixture, '--at', 'invalid'], [fixture, '--at', AT, '--at', AT],
    [fixture, '--require-active', '--require-active'], [fixture, 'extra'],
    [path.join(os.tmpdir(), 'securedocs-does-not-exist', 'absent.json')]]) {
    assert.equal(run(...args).status, 2, JSON.stringify(args));
  }
  assert.equal(run('--help').status, 0);
});
