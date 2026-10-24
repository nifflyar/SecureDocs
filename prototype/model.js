(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SecureDocsModel = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const ROLES = Object.freeze(['student', 'coordinator', 'adviser', 'dean', 'registrar', 'recipient']);
  const STAGES = Object.freeze(['adviser', 'dean', 'registrar']);
  const OUTCOMES = Object.freeze(['not_checked', 'confirmed', 'mismatch', 'not_found', 'unavailable', 'manual_review']);
  const WEEK = 7 * 24 * 60 * 60 * 1000;
  function initialState() {
    return { version: 1, loaded: false, fields: false, verification: 'not_checked', started: false,
      approvals: [], grant: 'inactive', sentVersion: null, verifiedAt: null, sentAt: null,
      expiresAt: null, returnReason: '', events: [] };
  }
  function check(ok, message) { if (!ok) throw new Error(message); }
  function clockTime(now) {
    const match = typeof now === 'string' && /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/.exec(now);
    check(match && Number.isFinite(Date.parse(now)), 'A valid timezone-qualified clock is required.');
    const [, date, hour, minute, second, zone] = match;
    check(!date.startsWith('0000') && new Date(date + 'T00:00:00Z').toISOString().slice(0, 10) === date
      && Number(hour) < 24 && Number(minute) < 60 && Number(second) < 60 && zone !== '-00:00'
      && (zone === 'Z' || (Number(zone.slice(1, 3)) < 24 && Number(zone.slice(4)) < 60)), 'Invalid calendar date, time or timezone.');
    return Date.parse(now);
  }
  function clearRoute(state) {
    state.started = false; state.approvals = []; state.grant = 'inactive';
    state.sentVersion = null; state.sentAt = null; state.expiresAt = null;
  }
  function current(state) {
    check(state.loaded === true && state.fields === true, 'Load the synthetic ISP and confirm its fields first.');
    check(state.verification === 'confirmed' && state.verifiedAt !== null, 'Confirm the current source before starting or approving.');
  }
  function completed(state) {
    current(state);
    check(state.started && state.approvals.length === 3 && state.approvals.every((a, i) =>
      a.role === STAGES[i] && a.version === state.version), 'Three ordered approvals for the current version are required.');
  }
  // Pure transition: denied actions never mutate input or append successful events.
  // The optional clock preserves the four-argument browser call shape.
  function act(state, role, type, value, { now = new Date().toISOString() } = {}) {
    check(ROLES.includes(role), 'Unknown demonstration role.');
    const time = clockTime(now), stamp = new Date(time).toISOString();
    check(Number.isSafeInteger(state.version) && state.version > 0, 'Invalid document version.');
    const previous = state.events.at(-1);
    check(!previous || time >= Date.parse(previous.at), 'The demonstration clock cannot move backwards.');
    const next = { ...state, approvals: state.approvals.map(a => ({ ...a })), events: state.events.map(e => ({ ...e })) };
    const requireRole = expected => check(role === expected, `Only ${expected} may perform this action.`);
    if (next.grant === 'active' && time >= Date.parse(next.expiresAt)) next.grant = 'expired';
    switch (type) {
      case 'load':
        requireRole('student'); check(!next.loaded, 'The ISP is already loaded; use replacement for a new version.');
        next.loaded = true; break;
      case 'confirm':
        requireRole('student'); check(next.loaded, 'Load the synthetic ISP first.');
        check(!next.fields, 'The current fields are already confirmed.'); next.fields = true; break;
      case 'replace':
        requireRole('student'); check(next.loaded, 'Load the synthetic ISP first.');
        check(Number.isSafeInteger(next.version + 1), 'The version limit has been reached.');
        next.version += 1; next.fields = false; next.verification = 'not_checked'; next.verifiedAt = null;
        next.returnReason = ''; clearRoute(next); break;
      case 'verify':
        requireRole('coordinator'); check(next.loaded && next.fields, 'Load the synthetic ISP and confirm its fields first.');
        check(OUTCOMES.includes(value), 'Unknown source outcome.');
        clearRoute(next); next.verification = value;
        next.verifiedAt = value === 'confirmed' ? stamp : null; break;
      case 'start':
        requireRole('coordinator'); current(next); check(!next.started, 'The route is already started.');
        next.started = true; next.returnReason = ''; break;
      case 'approve':
      case 'return':
        current(next); check(next.started, 'Start or restart the approval route first.');
        check(STAGES[next.approvals.length] === role, 'Only the expected approval role may decide at this stage.');
        check(next.approvals.every((a, i) => a.role === STAGES[i] && a.version === next.version), 'Previous approvals must match the current version and order.');
        if (type === 'return') {
          check(typeof value === 'string' && value.trim().length > 0, 'A return reason is required.');
          next.returnReason = value.trim(); clearRoute(next);
        } else next.approvals.push({ role, version: next.version });
        break;
      case 'send':
        requireRole('coordinator'); completed(next);
        check(next.grant !== 'active', 'An active send already exists.');
        check(Date.parse(next.verifiedAt) <= time, 'Source confirmation cannot be in the future.');
        next.grant = 'active'; next.sentVersion = next.version; next.sentAt = stamp;
        next.expiresAt = new Date(time + WEEK).toISOString(); break;
      case 'download':
        requireRole('recipient'); completed(next);
        check(next.grant === 'active' && next.sentVersion === next.version, 'No active access to the current version.');
        check(Date.parse(next.verifiedAt) <= Date.parse(next.sentAt) && Date.parse(next.sentAt) <= time
          && time < Date.parse(next.expiresAt), 'Access has expired or its timestamps are invalid.'); break;
      case 'revoke':
        requireRole('coordinator'); check(next.grant === 'active', 'Only active access can be revoked.');
        next.grant = 'revoked'; break;
      case 'expire':
        requireRole('coordinator'); check(next.grant === 'active' || next.grant === 'expired', 'Send the approved ISP before simulating expiry.');
        next.grant = 'expired'; next.expiresAt = stamp; break;
      default: throw new Error('Unknown workflow action.');
    }
    next.events.push({ at: stamp, role, type, version: next.version,
      detail: type === 'verify' ? value : type === 'return' ? next.returnReason : '' });
    return next;
  }
  return Object.freeze({ initialState, act, ROLES, STAGES, OUTCOMES });
}));
