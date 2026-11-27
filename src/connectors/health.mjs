import { checkHealth, evaluateHealthWindow } from '@waldokolk/waf-core/monitoring';
import { openIncident } from '@waldokolk/waf-core/incident';

const ID = /^[a-z0-9][a-z0-9-]{2,63}$/;

export function createHealthConnector({
  sourceIdentity,
  applicationId,
  environment,
  url,
  allowedOrigins,
  timeoutMs = 5000,
  failureThreshold = 3,
  fetcher = fetch,
  now = () => new Date(),
  eventId = () => crypto.randomUUID(),
  correlationId = () => crypto.randomUUID(),
  incidentId = () => `inc-${applicationId}`
}) {
  if (![sourceIdentity, applicationId, environment].every((value) => ID.test(value ?? ''))) throw new TypeError('Invalid connector identity');
  if (!Array.isArray(allowedOrigins) || allowedOrigins.length === 0) throw new TypeError('Approved origins required');
  const records = [];

  return Object.freeze({
    async poll() {
      const measurement = await checkHealth(url, { allowedOrigins, timeoutMs, fetcher, now });
      records.push(measurement);
      const window = evaluateHealthWindow(records, { failureThreshold });
      const receivedAt = now().toISOString();
      const event = Object.freeze({
        eventId: eventId(),
        source: 'waf-monitoring',
        sourceIdentity,
        applicationId,
        environment,
        eventType: 'health.checked',
        occurredAt: measurement.checkedAt,
        receivedAt,
        status: measurement.healthy ? 'operational' : 'failed',
        severity: measurement.healthy ? 'positive' : (window.incident ? 'critical' : 'warning'),
        evidenceRef: `urn:woc:health:${sourceIdentity}:${encodeURIComponent(measurement.checkedAt)}`,
        correlationId: correlationId(),
        contractVersion: '1.0'
      });
      const incident = window.incident ? openIncident({
        id: incidentId(),
        severity: 'sev1',
        summary: `${applicationId} health check failed ${failureThreshold} consecutive times`,
        detectedAt: measurement.checkedAt,
        service: applicationId
      }) : null;
      return Object.freeze({ measurement, window, event, incident });
    },
    recordCount() { return records.length; }
  });
}
