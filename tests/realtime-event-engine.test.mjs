import test from 'node:test';
import assert from 'node:assert/strict';
import { createRealtimeEventEngine } from '../blocks/realtime-event-engine/index.mjs';

const base = Object.freeze({ source: 'github', sourceIdentity: 'waldokolk-dotcom/woc', applicationId: 'woc', environment: 'repository', eventType: 'repository.commit', occurredAt: '2026-11-27T18:00:00Z', receivedAt: '2026-11-27T18:00:01Z', status: 'verified', severity: 'info', evidenceRef: 'https://github.com/waldo/woc/commit/abc', correlationId: 'abc', contractVersion: '1.0' });
const event = (eventId, overrides = {}) => ({ ...base, eventId, ...overrides });

test('engine accepteert, dedupliceert en publiceert gevalideerde events', async () => {
  const engine = createRealtimeEventEngine({ now: () => new Date('2026-11-27T18:01:00Z') });
  const received = [];
  const subscription = engine.subscribe(value => received.push(value.eventId));
  assert.equal(engine.ingest(event('evt-1')).accepted, true);
  assert.equal(engine.ingest(event('evt-1')).duplicate, true);
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(received, ['evt-1']);
  assert.equal(subscription.unsubscribe(), true);
});

test('batch faalt atomair op een ongeldig event', () => {
  const engine = createRealtimeEventEngine();
  assert.throws(() => engine.ingestBatch([event('evt-1'), event('evt-2', { evidenceRef: 'javascript:alert(1)' })]), /Invalid batch/);
  assert.equal(engine.replay().length, 0);
});

test('replay filtert begrensd op applicatie, type en tijdvenster', () => {
  const engine = createRealtimeEventEngine();
  engine.ingestBatch([event('evt-1'), event('evt-2', { applicationId: 'waf', occurredAt: '2026-11-27T18:05:00Z' }), event('evt-3', { occurredAt: '2026-11-27T18:10:00Z', eventType: 'release.completed' })]);
  assert.deepEqual(engine.replay({ applicationId: 'woc', eventType: 'repository.commit' }).map(value => value.eventId), ['evt-1']);
  assert.deepEqual(engine.replay({ since: '2026-11-27T18:04:00Z', until: '2026-11-27T18:06:00Z' }).map(value => value.eventId), ['evt-2']);
  assert.throws(() => engine.replay({ limit: 501 }), /safe bounds/);
});

test('retentie verwijdert verlopen events en actualiteit blijft expliciet', () => {
  const engine = createRealtimeEventEngine({ retentionMs: 60_000, now: () => new Date('2026-11-27T18:02:00Z') });
  engine.ingest(event('evt-old'));
  engine.ingest(event('evt-current', { occurredAt: '2026-11-27T18:01:30Z', receivedAt: '2026-11-27T18:01:31Z' }));
  assert.deepEqual(engine.replay().map(value => value.eventId), ['evt-current']);
  assert.equal(engine.freshness({ applicationId: 'woc', eventType: 'repository.commit', maxAgeMs: 60_000, now: new Date('2026-11-27T18:02:00Z') }).state, 'current');
});
