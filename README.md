# AGRARPOLY – Online Multiplayer

AGRARPOLY ist ein Online-Würfelspiel mit Master, Mitspielern, Ereigniskarten und OBS-Overlay.

## Funktionen
- Master erstellt einen Raum und erhält einen 5-stelligen Spielcode.
- 1–100 Mitspieler möglich.
- Der Master entscheidet beim Start, ob er selbst mitspielt oder nur Master ist.
- Der Master gibt jeden Wurf einzeln frei.
- Nur der aktuelle Spieler darf würfeln.
- Der Master kann Spieler überspringen.
- Nach dem Würfeln entscheidet der Master, ob die 20 Ereigniskarten freigegeben werden.
- Der Spieler wählt eine verdeckte Karte; nur diese Karte wird aufgedeckt.
- Karteneffekte werden nicht automatisch und nicht durch `WEITER` ausgeführt.
- Danach geht es mit `WEITER` zum nächsten Spieler.
- OBS-Overlay für den Stream.

## Lokal starten
```bash
npm install
npm start
```
Danach `http://localhost:3000` öffnen.

## Render
Siehe `README_RENDER.md`.
