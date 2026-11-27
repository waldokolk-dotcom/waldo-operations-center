import test from 'node:test';
import assert from 'node:assert/strict';
import { createHealthConnector } from '../src/connectors/health.mjs';
import { createEventStore } from '../src/event-store.mjs';

function connector(fetcher, failureThreshold = 3) {
  let sequence = 0;
  return createHealthConnector({
    sourceIdentity: 'render-verbindo', applicationId: 'verbindo', environment: 'test',
    url: 'https://verbindo.example/health', allowedOrigins: ['https://verbindo.example'],
    fetcher, failureThreshold,
    now: () => new Date('2026-11-27T18:00:00.000Z'),
    eventId: () => `evt-health-${++sequence}`,
    correlationId: () => `corr-health-${sequence}`,
    incidentId: () => 'inc-verbindo-health'
  });
}

test('WAF-monitoring wordt een gevalideerd en actueel WOC-event', async () => {
  const source = connector(async () => ({ ok: true, status: 200 }));
  const store = createEventStore();
  const result = await source.poll();
  assert.equal(result.measurement.healthy, true);
  assert.equal(result.event.severity, 'positive');
  assert.equal(result.incident, null);
  assert.equal(store.append(result.event).accepted, true);
  assert.equal(store.freshness({ applicationId: 'verbindo', eventType: 'health.checked', maxAgeMs: 300_000, now: new Date('2026-11-27T18:04:00Z') }).state, 'current');
});

test('drie opeenvolgende fouten openen via WAF een incident', async () => {
  const source = connector(async () => { throw new Error('network unavailable'); });
  assert.equal((await source.poll()).incident, null);
  assert.equal((await source.poll()).incident, null);
  const result = await source.poll();
  assert.equal(result.window.incident, true);
  assert.equal(result.event.severity, 'critical');
  assert.equal(result.incident.state, 'open');
});

test('niet-goedgekeurde origins en dubbele events sluiten fail-closed', async () => {
  const bad = createHealthConnector({
    sourceIdentity: 'render-verbindo', applicationId: 'verbindo', environment: 'test',
    url: 'https://evil.example/health', allowedOrigins: ['https://verbindo.example']
  });
  await assert.rejects(() => bad.poll(), /Target not approved/);
  const source = connector(async () => ({ ok: true, status: 200 }));
  const store = createEventStore();
  const event = (await source.poll()).event;
  assert.equal(store.append(event).accepted, true);
  assert.equal(store.append(event).duplicate, true);
  assert.equal(store.size(), 1);
});

test('ontbrekende en verlopen brondata worden unknown en stale', () => {
  const store = createEventStore();
  assert.equal(store.freshness({ applicationId: 'verbindo', eventType: 'health.checked', maxAgeMs: 300_000 }).state, 'unknown');
  store.append({eventId:'evt-old',source:'waf-monitoring',sourceIdentity:'render-verbindo',applicationId:'verbindo',environment:'test',eventType:'health.checked',occurredAt:'2026-11-27T17:00:00Z',receivedAt:'2026-11-27T17:00:01Z',status:'operational',severity:'positive',evidenceRef:'urn:woc:health:old',correlationId:'corr-old',contractVersion:'1.0'});
  assert.equal(store.freshness({ applicationId: 'verbindo', eventType: 'health.checked', maxAgeMs: 300_000, now: new Date('2026-11-27T18:00:00Z') }).state, 'stale');
});
