const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir));

// Explicit routes for Render/browser access.
app.get("/", (req, res) => res.sendFile(path.join(publicDir, "index.html")));
app.get("/overlay.html", (req, res) => res.sendFile(path.join(publicDir, "overlay.html")));
app.get("/player.html", (req, res) => res.sendFile(path.join(publicDir, "player.html")));

app.get("/health", (req, res) => res.status(200).json({ ok: true, service: "AGRARPOLY" }));

const rooms = new Map();
const CARD_COUNT = 20;

function makeCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let c;
  do c = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  while (rooms.has(c));
  return c;
}

function shuffle(cards) {
  const a = [...cards];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeCards() {
  return shuffle([
    { id: 1, title: "Glückstag", text: "+2 Punkte", type: "info", value: 2 },
    { id: 2, title: "Jackpot", text: "+5 Punkte", type: "info", value: 5 },
    { id: 3, title: "Pechsträhne", text: "−2 Punkte", type: "info", value: -2 },
    { id: 4, title: "Doppelwurf", text: "Gewürfelte Zahl zählt doppelt", type: "info", value: 0 },
    { id: 5, title: "Team-Bonus", text: "Alle Spieler +1", type: "info", value: 1 },
    { id: 6, title: "Großer Rückschlag", text: "−5 Punkte", type: "info", value: -5 },
    { id: 7, title: "Zusatzrunde", text: "Noch einmal würfeln", type: "info", value: 0 },
    { id: 8, title: "Schutzschild", text: "Nächster negativer Effekt hat keine Wirkung", type: "info", value: 0 },
    { id: 9, title: "Volltanken", text: "+3 Punkte", type: "info", value: 3 },
    { id: 10, title: "Reparatur", text: "Entfernt −2 Punkte", type: "info", value: 0 },
    { id: 11, title: "Diebstahl", text: "2 Punkte von einem anderen Spieler stehlen", type: "info", value: 0 },
    { id: 12, title: "Platztausch", text: "Position mit einem Spieler tauschen", type: "info", value: 0 },
    { id: 13, title: "Aussetzen", text: "Nächster Spieler setzt eine Runde aus", type: "info", value: 0 },
    { id: 14, title: "Zufall", text: "1–3 Punkte gewinnen oder verlieren", type: "info", value: 0 },
    { id: 15, title: "Freunde helfen", text: "Gewählter Spieler +2 Punkte", type: "info", value: 2 },
    { id: 16, title: "Zusatzladung", text: "+4 Punkte", type: "info", value: 4 },
    { id: 17, title: "Wetterpech", text: "−3 Punkte", type: "info", value: -3 },
    { id: 18, title: "Sonderbonus", text: "+3 Punkte", type: "info", value: 3 },
    { id: 19, title: "Mystery", text: "Überraschungseffekt", type: "info", value: 0 },
    { id: 20, title: "Zeitdruck", text: "−1 Punkt", type: "info", value: -1 }
  ]);
}

function cardPublic(card) {
  return { title: card.title, text: card.text, type: card.type, value: card.value };
}

function publicState(room, socketId, role) {
  const ownPlayer = room.players.find(p => p.socketId === socketId);
  const event = room.event ? {
    playerId: room.event.playerId,
    rollValue: room.event.rollValue,
    accessGranted: !!room.event.accessGranted,
    revealedSlot: room.event.revealedSlot ?? null,
    revealedCard: room.event.revealedCard ? cardPublic(room.event.revealedCard) : null,
    // IMPORTANT: only card backs are sent after the master grants access.
    cards: (room.event.accessGranted && (role === "observer" || ((role === "player") || (role === "master" && room.masterParticipates)) && ownPlayer?.id === room.event.playerId))
      ? Array.from({ length: CARD_COUNT }, (_, i) => {
          const revealed = room.event.revealedSlot === i ? room.event.revealedCard : null;
          return revealed ? { slot: i, revealed: true, ...cardPublic(revealed) } : { slot: i, revealed: false };
        })
      : undefined,
    // The master always sees the exact card mapping, including the hidden card texts.
    masterCards: (role === "master" && room.event)
      ? room.eventDeck.map((card, i) => ({ slot: i, ...cardPublic(card) }))
      : undefined
  } : null;

  const lastEvent = room.lastEvent && (
    role === "master" || role === "observer" || ownPlayer?.id === room.lastEvent.playerId
  ) ? cardPublic(room.lastEvent.card) : null;

  return {
    code: room.code,
    started: room.started,
    released: room.released,
    currentPlayer: room.currentPlayer,
    round: room.round,
    players: room.players.map(p => ({
      id: p.id,
      name: p.name,
      total: p.total,
      // Other players never receive another player's roll.
      last: role === "master" || p.socketId === socketId || role === "observer" ? p.last : null,
      rolled: p.rolled,
      active: room.started && room.currentPlayer === p.id,
      connected: !!p.socketId,
      isMasterPlayer: !!p.isMasterPlayer
    })),
    isMaster: room.master === socketId,
    masterParticipates: !!room.masterParticipates,
    masterPlayerId: room.masterPlayerId ?? null,
    masterChoiceMade: !!room.masterChoiceMade,
    event,
    lastEvent,
    eventResultPlayerId: room.lastEvent?.playerId ?? null
  };
}

function broadcast(room) {
  for (const id of room.members) {
    io.to(id).emit("state", publicState(room, id, io.sockets.sockets.get(id)?.data?.role));
  }
}

function currentPlayer(room) {
  return room.players[room.currentPlayer];
}

function advance(room) {
  if (room.currentPlayer < room.players.length - 1) room.currentPlayer++;
  else room.started = false;
}


io.on("connection", socket => {
  socket.on("observe", ({ code }) => {
    const room = rooms.get(String(code || "").toUpperCase());
    if (!room) return socket.emit("errorMsg", "Spielcode nicht gefunden.");
    room.members.add(socket.id);
    socket.join(room.code);
    socket.data.room = room.code;
    socket.data.role = "observer";
    broadcast(room);
  });

  socket.on("create", ({ count }) => {
    const room = {
      code: makeCode(),
      master: socket.id,
      members: new Set([socket.id]),
      started: false,
      currentPlayer: 0,
      round: 1,
      released: false,
      event: null,
      lastEvent: null,
      eventDeck: makeCards(),
      masterParticipates: false,
      masterChoiceMade: false,
      masterPlayerId: 0,
      players: [
        { id: 0, name: "Master", total: 0, last: null, rolled: false, socketId: null, isMasterPlayer: true },
        ...Array.from({ length: Math.max(1, Math.min(100, Number(count) || 1)) }, (_, i) => ({
          id: i + 1, name: `Spieler ${i + 1}`, total: 0, last: null, rolled: false, socketId: null, isMasterPlayer: false
        }))
      ]
    };
    rooms.set(room.code, room);
    socket.join(room.code);
    socket.data.room = room.code;
    socket.data.role = "master";
    socket.data.playerId = null;
    socket.emit("created", { code: room.code });
    broadcast(room);
  });

  socket.on("join", ({ code, name }) => {
    const room = rooms.get(String(code || "").toUpperCase());
    if (!room) return socket.emit("errorMsg", "Spielcode nicht gefunden.");
    const free = room.players.find(p => !p.isMasterPlayer && !p.socketId);
    if (!free) return socket.emit("errorMsg", "Alle Spielerplätze sind belegt.");
    free.socketId = socket.id;
    if (name && name.trim()) free.name = name.trim().slice(0, 30);
    room.members.add(socket.id);
    socket.join(room.code);
    socket.data.room = room.code;
    socket.data.role = "player";
    socket.data.playerId = free.id;
    socket.emit("joined", { code: room.code, playerId: free.id });
    broadcast(room);
  });

  socket.on("rename", ({ name }) => {
    const room = rooms.get(socket.data.room);
    const p = room?.players[socket.data.playerId];
    if (!room || socket.data.role !== "player" || !p) return;
    p.name = (name || "").trim().slice(0, 30) || `Spieler ${p.id + 1}`;
    broadcast(room);
  });

  socket.on("masterPlay", ({ participate, name }) => {
    const room = rooms.get(socket.data.room);
    if (!room || socket.data.role !== "master" || room.started) return;
    const masterPlayer = room.players.find(p => p.isMasterPlayer);
    if (!masterPlayer) return;
    room.masterParticipates = !!participate;
    room.masterChoiceMade = true;
    masterPlayer.socketId = room.masterParticipates ? socket.id : null;
    socket.data.playerId = room.masterParticipates ? masterPlayer.id : null;
    masterPlayer.name = (name || "Master").trim().slice(0, 30) || "Master";
    broadcast(room);
  });

  socket.on("start", () => {
    const room = rooms.get(socket.data.room);
    if (!room || socket.data.role !== "master" || !room.masterChoiceMade) return;
    room.started = true;
    room.currentPlayer = room.masterParticipates ? room.masterPlayerId : 1;
    room.released = false;
    room.event = null;
    room.lastEvent = null;
    room.eventDeck = makeCards();
    const masterPlayer = room.players.find(p => p.isMasterPlayer);
    if (masterPlayer) masterPlayer.socketId = room.masterParticipates ? socket.id : null;
    room.players.forEach(p => { p.last = null; p.rolled = false; p.total = 0; });
    broadcast(room);
  });

  socket.on("release", () => {
    const room = rooms.get(socket.data.room);
    const p = room && currentPlayer(room);
    if (!room || socket.data.role !== "master" || !room.started || room.released || room.event || !p || p.rolled || !p.socketId) return;
    room.released = true;
    broadcast(room);
  });

  socket.on("skip", () => {
    const room = rooms.get(socket.data.room);
    const p = room && currentPlayer(room);
    if (!room || socket.data.role !== "master" || !room.started || room.released || room.event || !p || p.rolled) return;
    p.last = null;
    p.rolled = true;
    advance(room);
    broadcast(room);
  });

  socket.on("roll", () => {
    const room = rooms.get(socket.data.room);
    if (!room || !room.started || !room.released) return;

    const isMasterPlayer = socket.data.role === "master" && room.masterParticipates;
    const p = isMasterPlayer
      ? room.players.find(x => x.isMasterPlayer && x.socketId === socket.id)
      : (socket.data.role === "player" ? room.players[socket.data.playerId] : null);

    if (!p) return socket.emit("errorMsg", "Du bist nicht als Spieler dieser Runde registriert.");
    if (p.id !== room.currentPlayer) return socket.emit("errorMsg", "Du bist noch nicht an der Reihe.");
    if (p.rolled) return socket.emit("errorMsg", "Du hast bereits gewürfelt.");

    const value = Math.floor(Math.random() * 6) + 1;
    p.last = value;
    p.total += value;
    p.rolled = true;
    room.released = false;
    room.eventDeck = makeCards();
    room.event = { playerId: p.id, rollValue: value, accessGranted: false, revealedSlot: null, revealedCard: null };
    room.lastEvent = null;
    broadcast(room);
  });

  // Master only decides whether the current player gets access to the 20 card backs.
  socket.on("releaseEvent", () => {
    const room = rooms.get(socket.data.room);
    if (!room || socket.data.role !== "master" || !room.started || !room.event || room.event.accessGranted) return;
    room.event.accessGranted = true;
    broadcast(room);
  });

  // The player only reveals a card. No card effect is ever executed.
  socket.on("claimEvent", ({ slot }) => {
    const room = rooms.get(socket.data.room);
    const isMasterPlayer = room && socket.data.role === "master" && room.masterParticipates;
    const p = room && (isMasterPlayer ? room.players.find(x => x.isMasterPlayer) : room.players[socket.data.playerId]);
    if (!room || (!isMasterPlayer && socket.data.role !== "player") || !room.started || !room.event?.accessGranted || !p) return;
    if (p.id !== room.currentPlayer || room.event.playerId !== p.id || room.event.revealedSlot !== null) return;

    const index = Number(slot);
    if (!Number.isInteger(index) || index < 0 || index >= CARD_COUNT) return;

    const card = room.eventDeck[index];
    if (!card) return;
    room.event.revealedSlot = index;
    room.event.revealedCard = card;
    broadcast(room);
  });

  // The master only continues after the card has been revealed.
  // No card effect is executed. The revealed card is informational only.
  socket.on("continueEvent", () => {
    const room = rooms.get(socket.data.room);
    if (!room || socket.data.role !== "master" || !room.started || !room.event?.revealedCard) return;
    room.lastEvent = null;
    room.event = null;
    room.eventDeck = makeCards();
    room.released = false;
    advance(room);
    broadcast(room);
  });

  socket.on("newRound", () => {
    const room = rooms.get(socket.data.room);
    if (!room || socket.data.role !== "master") return;
    room.round++;
    room.currentPlayer = room.masterParticipates ? room.masterPlayerId : 1;
    room.started = true;
    room.released = false;
    room.event = null;
    room.lastEvent = null;
    room.eventDeck = makeCards();
    room.players.forEach(p => { p.last = null; p.rolled = false; });
    broadcast(room);
  });

  socket.on("reset", () => {
    const room = rooms.get(socket.data.room);
    if (!room || socket.data.role !== "master") return;
    room.round = 1;
    room.currentPlayer = room.masterParticipates ? room.masterPlayerId : 1;
    room.started = false;
    room.released = false;
    room.event = null;
    room.lastEvent = null;
    room.eventDeck = makeCards();
    const masterPlayer = room.players.find(p => p.isMasterPlayer);
    if (masterPlayer) masterPlayer.socketId = room.masterParticipates ? socket.id : null;
    room.players.forEach(p => { p.last = null; p.total = 0; p.rolled = false; });
    broadcast(room);
  });

  socket.on("disconnect", () => {
    const room = rooms.get(socket.data.room);
    if (!room) return;
    room.members.delete(socket.id);
    const p = room.players[socket.data.playerId];
    if (p) p.socketId = null;
    if (room.master === socket.id) {
      room.master = null;
      const masterPlayer = room.players.find(p => p.isMasterPlayer);
      if (masterPlayer) masterPlayer.socketId = null;
    }
    if (room.members.size === 0) rooms.delete(room.code);
    else broadcast(room);
  });
});

server.listen(PORT, "0.0.0.0", () => console.log(`AGRARPOLY läuft auf Port ${PORT}`));
