# AGRARPOLY – Railway Multiplayer

## Spielablauf
1. Master erstellt ein Spiel und legt die Anzahl der Spieler fest.
2. Master entscheidet vor dem Start: **Ja, ich spiele mit** oder **Nein, ich bin nur Master**.
3. Spieler treten mit Spielcode und Namen bei.
4. Master startet das Spiel.
5. Master klickt **WÜRFEL FREIGEBEN**.
6. Nur der aktuelle Spieler darf würfeln. Die Freigabe wird serverseitig geprüft.
7. Nach dem Wurf entsteht die Ereigniskarten-Phase.
8. Der Master klickt **EREIGNISKARTEN FREIGEBEN**.
9. Erst dann bekommt ausschließlich der aktuelle Spieler die 20 verdeckten Karten angezeigt. Vorher erhält der Spieler keine Kartendaten.
10. Der Spieler klickt eine Karte. Der Server löst anhand der Position die Karte auf.
11. Nur die ausgewählte Karte wird aufgedeckt. Die übrigen Karten bleiben verborgen.
12. Nach der Auswahl werden die 20 Karten neu gemischt und der nächste Spieler ist an der Reihe.
13. Der Master sieht während der Auswahl jederzeit die Position, den Namen und den Effekt aller 20 Karten.

## OBS Overlay
`/overlay.html?code=SPIELCODE`

- Vor der Kartenfreigabe: **keine Ereigniskarten sichtbar**.
- Nach der Kartenfreigabe: 20 verdeckte Karten sichtbar.
- Nach Auswahl: nur die ausgewählte Ereigniskarte wird angezeigt.
