# Mission Control WAF en WOC

**MISSION CONTROL — Your digital ecosystem. Alive.**

Mission Control is het centrale, teamgerichte operationele werkvlak voor WAF en WOC. Deze repository bevat geen tweede applicatiefabriek: ontwikkelstandaarden en herbruikbare bouwblokken blijven eigendom van `waldokolk-dotcom/waldo-application-factory`.

## Lokale start

Vereist Node.js 22 of nieuwer.

```powershell
npm test
npm start
```

Open daarna `http://localhost:4173`. De huidige M01-basis toont uitsluitend expliciet als demo gemarkeerde voorbeeldgegevens. Productieconnectors en autonome acties staan fail-closed uit totdat hun zelfstandige credentials, toestemmingen en acceptatiebewijs zijn geconfigureerd.

## Bewijsgrens

- M00: productspecificatie, architectuur, bronnen- en bouwblokkeninventaris.
- M01-basis: installeerbare PWA-shell, security headers, health/version, event- en rechtencontracten en tests.
- Niet geclaimd: productieauthenticatie, realtime connectors, deployment, onafhankelijke UX-acceptatie of productieacceptatie.

Zie `docs/milestones.md` en `docs/specifications/mission-control-1.0.md`.
