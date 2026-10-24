(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SecureDocsManifest = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const STAGES = ['adviser', 'dean', 'registrar'];
  const HASH = 'b07a05e8e843826674eebcf130f4bbdcb0ea4f1e5e1a2de6b28ddf8cda71c448';

  // A strict, millisecond-precision ISO 8601 profile shared with the CLI.
  // Date.parse alone silently normalizes impossible calendar dates.
  function parseTimestamp(value, label = 'Timestamp') {
    const match = typeof value === 'string' && /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|[+-]\d{2}:\d{2})$/.exec(value);
    if (!match) throw new Error(`${label} must be an ISO timestamp with seconds and a timezone.`);
    const [, yearText, monthText, dayText, hour, minute, second, , zone] = match;
    const year = Number(yearText), month = Number(monthText), day = Number(dayText);
    const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (year < 1 || month < 1 || month > 12 || day < 1 || day > days[month - 1]
      || Number(hour) > 23 || Number(minute) > 59 || Number(second) > 59
      || zone === '-00:00'
      || (zone !== 'Z' && (Number(zone.slice(1, 3)) > 23 || Number(zone.slice(4)) > 59))) {
      throw new Error(`${label} contains an invalid calendar date, time or timezone.`);
    }
    const time = Date.parse(value);
    if (!Number.isFinite(time)) throw new Error(`${label} is not a valid timestamp.`);
    return time;
  }

  function requireState(condition, message) {
    if (!condition) throw new Error(message);
  }

  function buildManifest(state, options) {
    requireState(state !== null && typeof state === 'object' && !Array.isArray(state), 'State must be an object.');
    requireState(options !== null && typeof options === 'object' && !Array.isArray(options), 'Export options are required.');
    requireState(options.role === 'recipient', 'Only the recipient may export the demonstration manifest.');
    const now = parseTimestamp(options.now, 'now');
    requireState(Number.isSafeInteger(state.version) && state.version > 0, 'The document version must be a positive safe integer.');
    requireState(state.loaded === true && state.fields === true, 'Load the demonstration document and confirm its fields before export.');
    requireState(state.verification === 'confirmed', 'The current source verification must be confirmed.');
    requireState(state.started === true, 'The approval route must be started.');
    requireState(Array.isArray(state.events), 'State events must be an array.');
    requireState(state.grant === 'active', 'The access grant must be active.');
    requireState(state.sentVersion === state.version, 'The sent version must match the current document version.');
    requireState(Array.isArray(state.approvals) && state.approvals.length === STAGES.length,
      'Exactly three current approvals are required.');
    for (let i = 0; i < STAGES.length; i += 1) {
      const approval = state.approvals[i];
      requireState(approval !== null && typeof approval === 'object' && !Array.isArray(approval)
        && approval.role === STAGES[i] && approval.version === state.version,
      'Approvals must be adviser, dean, registrar in order, all for the current version.');
    }
    const verified = parseTimestamp(state.verifiedAt, 'verifiedAt');
    const sent = parseTimestamp(state.sentAt, 'sentAt');
    const expires = parseTimestamp(state.expiresAt, 'expiresAt');
    requireState(verified <= sent && sent <= now && now < expires,
      'Export requires verifiedAt <= sentAt <= now < expiresAt.');

    return {
      schemaVersion: '1.0', demo: true, packageId: 'SD-DEMO-001',
      senderOrganizationId: 'DEMO-HOME', recipientOrganizationId: 'DEMO-PARTNER',
      purpose: 'academic_mobility',
      documents: [{
        documentId: 'DOC-DEMO-001', type: 'learning_agreement', version: state.version,
        sha256: HASH, provenance: 'manual_confirmed',
        verification: {
          outcome: 'confirmed', method: 'simulated_coordinator_confirmation',
          sourceRef: 'demo://coordinator/1', checkedAt: state.verifiedAt,
          limitations: ['Synthetic fixture. No external registry was queried. No signature is attached.']
        }
      }],
      approvals: STAGES.map(role => ({
        documentId: 'DOC-DEMO-001', version: state.version, role, decision: 'approved'
      })),
      access: { status: 'active', expiresAt: state.expiresAt }
    };
  }

  return Object.freeze({ buildManifest, parseTimestamp });
}));
