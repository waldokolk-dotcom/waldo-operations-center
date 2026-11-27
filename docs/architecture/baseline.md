# Architectuurbaseline 0.1.0

## Besluit

Hybride eventgedreven architectuur. Ingest adapters normaliseren naar eventcontract 1.0; een durable event store wordt de bron voor afgeleide status, replay en audit. De browser ontvangt alleen noodzakelijke, geautoriseerde statuswijzigingen. Heartbeats worden server-side geaggregeerd. UI-animatie volgt de bewezen status en veroorzaakt die nooit.

## Grenzen

- WAF: versiegebonden generieke bouwblokken en kwaliteits-/releasecontracten.
- WOC: productintegratie, bronadapters, operationele status, intelligence en gecontroleerde acties.
- Externe bronnen: afzonderlijke least-privilege service-identiteiten; input wordt gevalideerd, begrensd en als onbetrouwbaar opgeslagen.
- UI: Intelligence Workspace en toegankelijke 2D-alternatieven; geen direct secret- of service-rolegebruik.

## Actuele afhankelijkheden

WAF registry 0.3.2 bevat 21 geselecteerde blokken als approved/productionVerified. Dat registerbewijs vervangt geen WOC-integratietest. WOC pint de contractversies in `waf-lock.json`, importeert alleen publieke WAF-package-exports en houdt WOC-specifieke policy/eventgrenzen lokaal.

De eerste verticale koppeling importeert de publieke exports van `@waldokolk/waf-core`: WAF voert de begrensde HTTPS-healthcheck, failure-window en incidentvalidatie uit; WOC vertaalt de uitkomst naar eventcontract 1.0, dedupliceert op event-ID en bewaakt `current`, `stale` en `unknown`. De huidige event store is bewust proceslokaal testbewijs en geen duurzame productieopslag. Productie vereist een exacte WAF-commit/package, zelfstandige read-only broncredentials en PostgreSQL-retentie.

## Specialistische voorzieningen

Afzonderlijke centrale contracten/blokken: Realtime Event Engine, Application Discovery, Agent Telemetry, External Intelligence, Threat Intelligence, Social Listening, Marketing & Product Analytics, Financial Intelligence en Autonomous Orchestration. Productinterne engines: Motion & Animation, Interactive Network, Timeline & Replay en Progress & Stagnation. PWA & Web Push breidt het centrale notifications/distribution-contract uit en wordt geen los duplicaat.

Techniekselectie voor M02+ blijft afhankelijk van gratis quota, toegangsrechten en proof-of-fit. PostgreSQL/Supabase Realtime, OpenTelemetry, OSV, officiële API's, service workers, React Flow/ELK en een begrensde queue zijn kandidaten, geen geactiveerde productieclaims.
