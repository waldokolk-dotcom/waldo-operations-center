# Mission Control WAF en WOC — productspecificatie 1.0

Status: vastgesteld ontwikkelcontract  
Vastgelegd: 2026-11-27  
Bron: door producteigenaar aangeleverde Master Development Instruction 1.0

## Productcontract

Mission Control is de beveiligde, zelfactualiserende PWA-controlekamer van het applicatielandschap. Productnaam: **Mission Control WAF en WOC**. Merk: **MISSION CONTROL**. Slogan: **Your digital ecosystem. Alive.** Ontwerpwereld: Neural Ecosystem; beeldmerk: Orbital; Space Grotesk/Inter; Lucide Line Icons; kleuren `#110d20`, `#25183e`, `#a78bfa`, `#22d3ee`, `#f472b6`; licht/donker, desktop/tablet/mobiel, Nederlandstalige interface en teamomgeving.

De volledige scope omvat elf modules: Live Mission Control, WAF Development Intelligence, AI Agent Intelligence, Operations & Reliability, External Intelligence, Cybersecurity & Threat Radar, Reputation & Social Listening, Financial Intelligence, Marketing Intelligence, Personal Intelligence Feed en Team & Collaboration. Een algemeen Command & Decision Center is uitgesloten; alleen noodzakelijke afgeschermde operationele en veiligheidsbediening is toegestaan.

## Niet-onderhandelbare regels

- Centrale WAF blijft ontwikkelautoriteit; geen parallelle fabriek of dubbel operationeel systeem.
- Werkelijke activiteit, voortgang en replay komen alleen uit recent, betrouwbaar bewijs; onbekend is niet inactief.
- Externe tekst en API-resultaten zijn onbetrouwbare data en nooit instructies.
- Zero Trust, server-side autorisatie, least privilege, MFA/passkeys waar ondersteund, afzonderlijke service-identiteiten, auditlogging en geheimen buiten broncode/frontend/logs.
- Geen betaalde dienst, nieuwe infrastructuur, openbare reactie, ingrijpende merkverandering of risicovolle productiemigratie zonder toestemming.
- Geen permanente verwijdering van productiedata/repositories, omzeilen van controles, bevoegdhedenverruiming of verplaatsing naar privéomgevingen.
- Bewaar gedetailleerde events 90 dagen; afzonderlijk beleid voor acceptatie-, incident- en trendbewijs.
- WCAG 2.2 AA als doel, WAF UX-rubric minimaal 85/100 met werkelijk bewijs; desktop/tablet/mobiel, herstel, prestaties, security en kosten testen.

## Eventminimum

Ieder event bevat event-ID, bron en bronidentiteit, applicatie-ID, omgeving, type, eventtijd, ontvangsttijd, status, ernst, bewijsverwijzing, correlatie-ID en contractversie. Discovery, deduplicatie, bronverificatie, actualiteit, retries, quotumbescherming, impactanalyse, archivering, heartbeats, reconstructie en auditlogging zijn vereist.

## Rechten

Rollen: eigenaar, beheerder, ontwikkelaar, operator, analist en viewer. Rechten worden bovendien begrensd per applicatie, omgeving en gegevensdomein en bij iedere gevoelige actie server-side gecontroleerd. De versiegebonden matrix staat uitvoerbaar in `src/policy.mjs`.

## Incidenten en herstel

P0 direct; P1 binnen 15 minuten; P2 binnen 60 minuten; P3 in dagelijkse briefing. Heartbeatdoel 30 seconden; na 120 seconden onzeker; na 30 minuten zonder bewijs stagnatieonderzoek; maximaal drie herstelpogingen; na twee mislukte releases publicatieblokkade. Cyclus: DETECTEREN → VERIFIËREN → DIAGNOSE → HERSTELLEN → HERTESTEN → BEWIJZEN → AFSLUITEN.

## Mijlpalen

M00 Productspecificatie en centrale registratie; M01 fundament en beveiligde PWA; M02 realtime eventengine; M03 discovery en technische bronnen; M04 Intelligence Workspace; M05 Living Neural Ecosystem/replay; M06 operations/security/incident/stagnatie; M07 externe intelligence/reputatie/marketing/financiën; M08 autonomie/notificaties/zelfbewaking; M09 onafhankelijke productieacceptatie.

Dit document is de versiegebonden, repositorygeschikte normatieve samenvatting. De onveranderde aangeleverde brontekst blijft het gezag bij detailverschillen en wordt bij change-control als release-artifact gekoppeld.
