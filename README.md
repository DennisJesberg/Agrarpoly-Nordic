# AGRARPOLY – Render V3

Aktueller Stand:
- Master oder Master spielt mit
- variable Spielerzahl
- Master startet das Spiel
- Master gibt den Würfel für den aktuellen Spieler frei
- aktueller Spieler darf würfeln
- Master kann Spieler überspringen
- nach dem Würfeln entscheidet der Master über die Kartenfreigabe
- 20 verdeckte Ereigniskarten
- Spieler wählt genau eine Karte
- nur die gewählte Karte wird aufgedeckt
- KEIN Karteneffekt wird automatisch ausgeführt
- Master sieht die Kartenpositionen und Texte
- OBS-Overlay zeigt Würfel und Ereigniskartenstatus
- OBS-Overlay hat Schalter „ANDERE SPIELER EIN/AUS"
- bei EIN werden die übrigen Spieler im Overlay angezeigt

## Render
Build Command: `npm install`
Start Command: `npm start`
Health Check: `/health`

Wichtig für GitHub: `package.json`, `server.js`, `render.yaml` und der Ordner `public` müssen direkt im Repository-Root liegen.
