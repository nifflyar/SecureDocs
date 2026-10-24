(function () {
  'use strict';
  const model = window.SecureDocsModel;
  const $ = id => document.getElementById(id);
  const labels = { student: 'Student', coordinator: 'Sending coordinator', adviser: 'Academic adviser', dean: 'Dean', registrar: 'Registrar', recipient: 'Receiving staff' };
  const outcomes = { not_checked: 'Not checked', confirmed: 'Confirmed (simulation)', mismatch: 'Mismatch', not_found: 'Not found', unavailable: 'Source unavailable', manual_review: 'Manual review needed' };
  let state = model.initialState();
  const clock = () => new Date().toISOString();
  const valueFor = type => type === 'verify' ? $('outcome').value : type === 'return' ? $('reason').value : undefined;
  function notify(message, error = false) { $('notice').textContent = message; $('notice').classList.toggle('error', error); }
  function render() {
    $('version').textContent = `Version ${state.version}`;
    $('prepared').textContent = state.fields ? 'Fields confirmed' : state.loaded ? 'Fields need confirmation' : 'Not loaded';
    $('verification').textContent = `${outcomes[state.verification]}${state.verifiedAt ? ' · ' + state.verifiedAt : ''}`;
    $('route-status').textContent = !state.started ? 'Route not started' : state.approvals.length === 3 ? 'All three approvals complete' : `Waiting for ${labels[model.STAGES[state.approvals.length]]}`;
    $('approvals').replaceChildren(...model.STAGES.map((role, i) => {
      const li = document.createElement('li'); const approved = state.approvals[i]?.role === role;
      li.textContent = `${labels[role]} · ${approved ? 'Approved version ' + state.version : 'Awaiting decision'}`;
      li.className = approved ? 'done' : ''; return li;
    }));
    $('returned').textContent = state.returnReason ? `Returned: ${state.returnReason}. The coordinator must explicitly restart the route after correction.` : '';
    const access = state.grant === 'active' && Date.parse(clock()) >= Date.parse(state.expiresAt) ? 'expired' : state.grant;
    $('access').textContent = `Recipient access: ${access}${state.sentVersion ? ' · version ' + state.sentVersion : ''}`;
    $('deadline').textContent = state.expiresAt ? `Sent: ${state.sentAt}. Expires: ${state.expiresAt} (exclusive).` : 'No transfer has been made.';
    $('report').textContent = `Source: ${outcomes[state.verification]}. Method: simulated coordinator confirmation. No external registry was queried. No signature is attached. Schema validation is not proof of authenticity.`;
    $('events').replaceChildren(...state.events.map(event => {
      const li = document.createElement('li'); li.textContent = `${event.at} · ${labels[event.role]} · ${event.type} · v${event.version}${event.detail ? ' · ' + event.detail : ''}`; return li;
    }));
    // Keep controls reachable so wrong-role and prerequisite failures are explained in text.
    const ready = typeof window.SecureDocsManifest?.buildManifest === 'function';
    $('download').disabled = !ready;
    $('integration').textContent = ready ? 'Exports securedocs-demo-manifest.json using the shared schema 1.0 builder. Receiving staff must have active access.' : 'Manifest integration pending: the shared builder is unavailable. Export is disabled.';
  }
  document.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => {
    try { state = model.act(state, $('role').value, button.dataset.action, valueFor(button.dataset.action), { now: clock() }); notify(`Completed: ${button.textContent}.`); }
    catch (error) { notify(error.message, true); }
    render();
  }));
  $('download').addEventListener('click', () => {
    try {
      const now = clock(), role = $('role').value;
      // Recheck at the action boundary. Never reconstruct or substitute the shared format.
      if (typeof window.SecureDocsManifest?.buildManifest !== 'function') throw new Error('Manifest integration pending. Export is disabled.');
      const next = model.act(state, role, 'download', undefined, { now });
      const manifest = window.SecureDocsManifest.buildManifest(next, { role, now });
      const url = URL.createObjectURL(new Blob([JSON.stringify(manifest, null, 2) + '\n'], { type: 'application/json' }));
      const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'securedocs-demo-manifest.json';
      document.body.append(anchor); anchor.click(); anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      state = next; notify('Manifest download requested. Its validity does not establish authenticity or live access.');
    } catch (error) { notify(error.message, true); }
    render();
  });
  $('role').addEventListener('change', render);
  $('reset').addEventListener('click', () => { state = model.initialState(); $('role').value = 'student'; $('outcome').value = 'confirmed'; $('reason').value = ''; notify('Demo reset. Load the synthetic ISP to begin.'); render(); });
  setInterval(render, 1000);
  render();
}());
