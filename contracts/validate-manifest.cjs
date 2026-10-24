'use strict';

const fs = require('node:fs');
const Ajv2020 = require('ajv/dist/2020');
const schema = require('./package.schema.json');
const { parseTimestamp } = require('../prototype/manifest.js');
const ajv = new Ajv2020({ strict: true, allErrors: true });
const validateSchema = ajv.compile(schema);
const STAGES = ['adviser', 'dean', 'registrar'];

// Structural contract validation plus the completed demonstration's invariants.
// No coercion, defaults, removal of properties, source requests or authenticity checks.
function validateManifest(manifest, { requireActive = false, at } = {}) {
  const errors = [];
  if (!validateSchema(manifest)) {
    return { valid: false, errors: validateSchema.errors.map(error =>
      `Schema ${error.instancePath || '/'}: ${error.message}`) };
  }
  function check(condition, message) { if (!condition) errors.push(message); }
  function timestamp(value, label) {
    try { return parseTimestamp(value, label); }
    catch (error) { errors.push(error.message); return NaN; }
  }
  check(typeof requireActive === 'boolean', 'requireActive must be a boolean.');
  check(manifest.demo === true, 'The demonstration profile requires demo=true.');
  check(manifest.senderOrganizationId.trim().length > 0 && manifest.recipientOrganizationId.trim().length > 0
    && manifest.senderOrganizationId !== manifest.recipientOrganizationId,
  'Sender and recipient must be nonblank, distinct organisations.');
  check(manifest.packageId.trim().length > 0, 'packageId must not be blank.');
  const expires = timestamp(manifest.access.expiresAt, 'access.expiresAt');
  const reference = at !== undefined ? timestamp(at, 'at') : requireActive ? Date.now() : undefined;
  if (requireActive) {
    check(manifest.access.status === 'active', 'Active access is required; revoked or expired grants are rejected.');
    check(reference < expires, 'Active access has expired (at must be strictly before expiresAt).');
  }
  const documents = new Map();
  for (const doc of manifest.documents) {
    check(doc.documentId.trim().length > 0, 'documentId must not be blank.');
    check(!documents.has(doc.documentId), `Duplicate documentId: ${doc.documentId}.`);
    documents.set(doc.documentId, doc);
    check(Number.isSafeInteger(doc.version), `Document ${doc.documentId} version must be a safe integer.`);
    check(doc.verification.outcome === 'confirmed', `Document ${doc.documentId} source must be confirmed.`);
    check(doc.provenance !== 'student_copy', `Document ${doc.documentId} cannot rely on an unconfirmed student copy.`);
    check(doc.verification.method.trim().length > 0 && doc.verification.sourceRef.trim().length > 0,
      `Document ${doc.documentId} must identify its verification method and source.`);
    check(doc.verification.limitations.length > 0 && doc.verification.limitations.every(item => item.trim().length > 0),
      `Document ${doc.documentId} must disclose verification limitations.`);
    const checked = timestamp(doc.verification.checkedAt, `${doc.documentId}.checkedAt`);
    check(checked < expires, `Document ${doc.documentId} must be verified before access expires.`);
    if (reference !== undefined) check(checked <= reference, `Document ${doc.documentId} verification is in the future.`);
  }
  for (const approval of manifest.approvals) {
    const doc = documents.get(approval.documentId);
    check(Boolean(doc) && approval.version === doc.version,
      `Approval must reference an existing current document/version: ${approval.documentId}.`);
    check(approval.decision === 'approved', 'A returned decision cannot authorise a completed manifest.');
    check(STAGES.includes(approval.role), `Invalid approval role: ${approval.role}.`);
  }
  for (const doc of manifest.documents) {
    const approvals = manifest.approvals.filter(item => item.documentId === doc.documentId);
    check(approvals.length === STAGES.length && approvals.every((item, index) => item.role === STAGES[index]),
      `Document ${doc.documentId} requires exactly adviser, dean, registrar approvals in order.`);
  }
  return { valid: errors.length === 0, errors };
}

function main(args) {
  const usage = 'Usage: node contracts/validate-manifest.cjs FILE [--require-active] [--at ISO_TIME]';
  if (args.length === 1 && args[0] === '--help') { console.log(usage); return 0; }
  const [file, ...flags] = args;
  if (!file || file.startsWith('--')) { console.error(usage); return 2; }
  const options = {};
  for (let i = 0; i < flags.length; i += 1) {
    if (flags[i] === '--require-active' && options.requireActive === undefined) options.requireActive = true;
    else if (flags[i] === '--at' && options.at === undefined && flags[i + 1] && !flags[i + 1].startsWith('--')) {
      options.at = flags[++i];
      try { parseTimestamp(options.at, '--at'); }
      catch (error) { console.error(error.message); return 2; }
    } else { console.error(`Invalid or repeated option: ${flags[i]}\n${usage}`); return 2; }
  }
  let manifest;
  try { manifest = JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (error) { console.error(`Cannot read JSON manifest: ${error.message}`); return 2; }
  const result = validateManifest(manifest, options);
  if (!result.valid) {
    console.error('INVALID demonstration manifest:\n' + result.errors.map(error => `- ${error}`).join('\n'));
    return 1;
  }
  console.log('VALID demonstration structure and invariants. Not proof of document authenticity, identity, signature or live access.');
  return 0;
}

if (require.main === module) process.exitCode = main(process.argv.slice(2));
module.exports = { validateManifest };
