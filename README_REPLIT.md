# Würfelspiel Online – Replit + OBS

## Was enthalten ist
- Online-Multiplayer für 1–100 Spieler
- Master erstellt einen Raum
- 5-stelliger Spielcode
- Spieler treten per Code bei
- Nur der vom Master freigegebene Spieler kann seinen Würfel auslösen
- Master sieht alle Spieler und Würfe
- Der Master gibt jeden Wurf einzeln frei; danach geht es zum nächsten Spieler
- Mehrere Runden und Gesamtpunkte
- OBS-Overlay unter `/overlay.html`

## Auf Replit starten
1. Neues Replit-Projekt mit **Node.js** erstellen.
2. Den gesamten Inhalt dieses ZIPs in das Projekt hochladen.
3. Replit installiert beim Start über `npm install` die benötigten Pakete.
4. Mit `npm start` starten.
5. Replit stellt danach eine öffentliche Webadresse bereit.

## Nutzung
### Master
Die öffentliche Replit-Adresse öffnen, Spieleranzahl eingeben und `SPIEL ERSTELLEN` drücken.
Der angezeigte Spielcode wird an die Spieler weitergegeben.

### Spieler
Die gleiche Adresse öffnen, Spielcode und Namen eingeben und `BEITRETEN` drücken.

### OBS
In OBS eine Browserquelle hinzufügen:
- URL: `https://DEINE-REPLIT-URL/overlay.html`
- Breite: 1920
- Höhe: 1080
- Hintergrund bleibt transparent.

Das Overlay verbindet sich mit demselben Server und aktualisiert sich live.

## Hinweis
Wenn Replit eine andere Port-Konfiguration verlangt, muss der Startbefehl bzw. die Webserver-Konfiguration entsprechend der aktuellen Replit-Umgebung angepasst werden.
