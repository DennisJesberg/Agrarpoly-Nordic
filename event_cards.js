// 20 original board-game-style event cards for the dice game.
// They are inspired by classic chance/event mechanics, but use original names and artwork-free text.
const EVENT_CARDS = [
  {id:1,title:"Glückstag",text:"Du bekommst sofort +2 Punkte.",type:"self",value:2},
  {id:2,title:"Jackpot",text:"Starker Treffer! Du bekommst +5 Punkte.",type:"self",value:5},
  {id:3,title:"Kleiner Bonus",text:"Ein kleiner Vorteil: +1 Punkt.",type:"self",value:1},
  {id:4,title:"Pechsträhne",text:"Du verlierst 2 Punkte.",type:"self",value:-2},
  {id:5,title:"Großer Rückschlag",text:"Du verlierst 5 Punkte.",type:"self",value:-5},
  {id:6,title:"Doppelwurf",text:"Dein gewürfelter Wert zählt doppelt.",type:"doubleRoll"},
  {id:7,title:"Bonuszahlung",text:"Du erhältst +3 Punkte.",type:"self",value:3},
  {id:8,title:"Fehlstart",text:"Du verlierst 1 Punkt.",type:"self",value:-1},
  {id:9,title:"Glücksbringer",text:"Du erhältst +4 Punkte.",type:"self",value:4},
  {id:10,title:"Sparrunde",text:"Heute bleibt dein Punktestand unangetastet: +0 Punkte.",type:"self",value:0},
  {id:11,title:"Turbo",text:"Dein Wurf zählt zusätzlich noch einmal als +2 Punkte.",type:"self",value:2},
  {id:12,title:"Missgeschick",text:"Du verlierst 3 Punkte.",type:"self",value:-3},
  {id:13,title:"Team-Bonus",text:"Alle Spieler erhalten +1 Punkt.",type:"all",value:1},
  {id:14,title:"Rückgabe",text:"Du bekommst +3 Punkte zurück.",type:"self",value:3},
  {id:15,title:"Glückswurf",text:"Du bekommst +6 Punkte.",type:"self",value:6},
  {id:16,title:"Kleine Strafe",text:"Du verlierst 1 Punkt.",type:"self",value:-1},
  {id:17,title:"Bonuskarte",text:"Du erhältst +2 Punkte.",type:"self",value:2},
  {id:18,title:"Pech gehabt",text:"Du verlierst 4 Punkte.",type:"self",value:-4},
  {id:19,title:"Siegesserie",text:"Du erhältst +3 Punkte.",type:"self",value:3},
  {id:20,title:"Freier Bonus",text:"Du erhältst +1 Punkt.",type:"self",value:1}
];
