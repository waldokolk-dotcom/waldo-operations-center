# WAF–WOC-koppeling 0.1.0

## Werkende keten

`@waldokolk/waf-core` is exact gepind op commit `a72b9acba9c88881203b1c552ee0398ce0fa4580`. WOC importeert uitsluitend de publieke package-exports:

1. WAF `checkHealth` accepteert alleen allowlisted HTTPS-origins en begrensde time-outs.
2. WAF `evaluateHealthWindow` opent pas na de ingestelde opeenvolgende fouten een incidentpad.
3. WOC vertaalt de meting naar eventcontract 1.0 met bewijs- en correlatie-ID.
4. WOC valideert en dedupliceert het event en classificeert de bron als `current`, `stale` of `unknown`.
5. WAF `openIncident` valideert het incident voordat verdere operationele workflows het ontvangen.

## Private dependency

WAF is een private repository. Een schone CI- of productie-installatie heeft daarom een afzonderlijke, read-only GitHub-identiteit nodig met uitsluitend Contents: Read voor `waldo-application-factory`. Configureer die credential in de deploymentomgeving, nooit in deze repository, npm-config, frontend of logs. Zonder credential moet `npm ci` falen; er is geen fallback naar een ongepinde kopie.

Package-publicatie naar een private registry is de voorkeursvervolgstap zodra het centrale releasecontract en de credential door de eigenaar zijn goedgekeurd. Tot die tijd is de volledige commit-SHA de distributiegrens.

## Nog geen productieclaim

De event store is proceslokaal en dient als contract- en integratiebewijs. Productie vereist PostgreSQL-opslag, 90-dagenretentie, auditlogging, ingest-authenticatie, retries en een geverifieerde live target. Geen connector wordt door deze wijziging automatisch geactiveerd.
