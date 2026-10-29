# AGRARPOLY – Render Deployment

Diese Version ist für Render als Node.js Web Service vorbereitet. Render unterstützt WebSockets, daher funktioniert die Socket.IO-Mehrspieler-Verbindung.

## Deployment über GitHub

1. Dieses Projekt in ein GitHub-Repository hochladen.
2. Bei Render **New → Web Service** wählen und das Repository verbinden.
3. Einstellungen:
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/health`
4. Einen geeigneten Render-Plan auswählen und **Create Web Service** starten.

Die Datei `render.yaml` enthält diese Einstellungen bereits als Blueprint-Konfiguration.

## Wichtig für AGRARPOLY

- Die App verwendet `process.env.PORT`.
- Der Server bindet auf `0.0.0.0`, wie von Render verlangt.
- Socket.IO/WebSockets werden über denselben Web-Service-Port verwendet.
- Der Spielzustand liegt derzeit im Arbeitsspeicher des Servers. Ein Neustart der Render-Instanz beendet deshalb laufende Spiele.
- Ereigniskarten werden nur nach Freigabe durch den Master sichtbar. Der Spieler deckt genau eine Karte auf; der Karteneffekt wird **nicht ausgeführt**. Mit **WEITER** geht es zum nächsten Spieler.

## OBS

Nach dem Deployment die von Render vergebene HTTPS-Adresse verwenden. Die OBS-Overlay-Seite ist unter `/overlay.html` erreichbar.

Beispiel:
`https://DEIN-DIENST.onrender.com/overlay.html`
