import { validateEvent } from '../../src/event-contract.mjs';
import { createEventStore } from '../../src/event-store.mjs';

const freeze = value => Object.freeze(value);

export function createRealtimeEventEngine({ now = () => new Date(), retentionMs = 90 * 24 * 60 * 60 * 1000, maxEvents = 10_000 } = {}) {
  if (!Number.isInteger(retentionMs) || retentionMs < 60_000) throw new TypeError('retentionMs must be at least one minute');
  if (!Number.isInteger(maxEvents) || maxEvents < 1 || maxEvents > 100_000) throw new TypeError('maxEvents outside safe bounds');
  const store = createEventStore();
  const ordered = [];
  const subscribers = new Set();

  function prune() {
    const cutoff = now().getTime() - retentionMs;
    while (ordered.length && (Date.parse(ordered[0].receivedAt) < cutoff || ordered.length > maxEvents)) ordered.shift();
  }

  function ingest(event) {
    const validation = validateEvent(event);
    if (!validation.ok) throw new TypeError(`Invalid event: ${validation.errors.join(', ')}`);
    const result = store.append(event);
    if (!result.accepted) return result;
    ordered.push(result.event);
    ordered.sort((a, b) => Date.parse(a.occurredAt) - Date.parse(b.occurredAt));
    prune();
    for (const notify of subscribers) queueMicrotask(() => notify(result.event));
    return result;
  }

  return freeze({
    ingest,
    ingestBatch(events) {
      if (!Array.isArray(events) || !events.length || events.length > 500) throw new TypeError('Batch outside safe bounds');
      const errors = events.flatMap((event, index) => { const result = validateEvent(event); return result.ok ? [] : [{ index, errors: result.errors }]; });
      if (errors.length) throw new TypeError(`Invalid batch: ${JSON.stringify(errors)}`);
      return freeze(events.map(ingest));
    },
    subscribe(notify) {
      if (typeof notify !== 'function') throw new TypeError('Subscriber must be a function');
      subscribers.add(notify);
      return freeze({ unsubscribe: () => subscribers.delete(notify) });
    },
    replay({ applicationId, source, eventType, since, until, limit = 100 } = {}) {
      if (!Number.isInteger(limit) || limit < 1 || limit > 500) throw new TypeError('Replay limit outside safe bounds');
      for (const value of [since, until]) if (value !== undefined && Number.isNaN(Date.parse(value))) throw new TypeError('Invalid replay window');
      const from = since ? Date.parse(since) : -Infinity;
      const to = until ? Date.parse(until) : Infinity;
      return freeze(ordered.filter(event => (!applicationId || event.applicationId === applicationId) && (!source || event.source === source) && (!eventType || event.eventType === eventType) && Date.parse(event.occurredAt) >= from && Date.parse(event.occurredAt) <= to).slice(-limit).map(event => freeze({ ...event })));
    },
    freshness(query) { return store.freshness(query); },
    stats() { prune(); return freeze({ retained: ordered.length, deduplicated: store.size() - ordered.length, subscribers: subscribers.size, retentionMs, maxEvents }); }
  });
}
