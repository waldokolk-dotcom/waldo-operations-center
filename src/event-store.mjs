import { validateEvent } from './event-contract.mjs';

export function createEventStore() {
  const events = new Map();

  return Object.freeze({
    append(event) {
      const validation = validateEvent(event);
      if (!validation.ok) throw new TypeError(`Invalid event: ${validation.errors.join(', ')}`);
      if (events.has(event.eventId)) return Object.freeze({ accepted: false, duplicate: true, event: events.get(event.eventId) });
      const stored = Object.freeze({ ...event });
      events.set(stored.eventId, stored);
      return Object.freeze({ accepted: true, duplicate: false, event: stored });
    },
    latest({ applicationId, eventType }) {
      return [...events.values()].reverse().find((event) => event.applicationId === applicationId && event.eventType === eventType) ?? null;
    },
    freshness({ applicationId, eventType, maxAgeMs, now = new Date() }) {
      if (!Number.isInteger(maxAgeMs) || maxAgeMs < 1) throw new TypeError('maxAgeMs must be positive');
      const event = this.latest({ applicationId, eventType });
      if (!event) return Object.freeze({ state: 'unknown', event: null, ageMs: null });
      const ageMs = now.getTime() - Date.parse(event.occurredAt);
      return Object.freeze({ state: ageMs <= maxAgeMs ? 'current' : 'stale', event, ageMs });
    },
    size() { return events.size; }
  });
}
