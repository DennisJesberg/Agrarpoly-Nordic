// AGRARPOLY – 20 Ereigniskarten.
// Wichtig: Karten werden nur angezeigt/aufgedeckt. Es wird KEIN Karteneffekt automatisch ausgeführt.
const EVENT_CARDS = [
  {id:1,title:"Glückstag",text:"+2 Punkte",type:"info",value:2},
  {id:2,title:"Jackpot",text:"+5 Punkte",type:"info",value:5},
  {id:3,title:"Pechsträhne",text:"−2 Punkte",type:"info",value:-2},
  {id:4,title:"Doppelwurf",text:"Gewürfelte Zahl zählt doppelt",type:"info",value:0},
  {id:5,title:"Team-Bonus",text:"Alle Spieler +1",type:"info",value:1},
  {id:6,title:"Großer Rückschlag",text:"−5 Punkte",type:"info",value:-5},
  {id:7,title:"Zusatzrunde",text:"Noch einmal würfeln",type:"info",value:0},
  {id:8,title:"Schutzschild",text:"Nächster negativer Effekt hat keine Wirkung",type:"info",value:0},
  {id:9,title:"Volltanken",text:"+3 Punkte",type:"info",value:3},
  {id:10,title:"Reparatur",text:"Entfernt −2 Punkte",type:"info",value:0},
  {id:11,title:"Diebstahl",text:"2 Punkte von einem anderen Spieler stehlen",type:"info",value:0},
  {id:12,title:"Platztausch",text:"Position mit einem Spieler tauschen",type:"info",value:0},
  {id:13,title:"Aussetzen",text:"Nächster Spieler setzt eine Runde aus",type:"info",value:0},
  {id:14,title:"Zufall",text:"1–3 Punkte gewinnen oder verlieren",type:"info",value:0},
  {id:15,title:"Freunde helfen",text:"Gewählter Spieler +2 Punkte",type:"info",value:2},
  {id:16,title:"Zusatzladung",text:"+4 Punkte",type:"info",value:4},
  {id:17,title:"Wetterpech",text:"−3 Punkte",type:"info",value:-3},
  {id:18,title:"Sonderbonus",text:"+3 Punkte",type:"info",value:3},
  {id:19,title:"Mystery",text:"Überraschungseffekt",type:"info",value:0},
  {id:20,title:"Zeitdruck",text:"−1 Punkt",type:"info",value:-1}
];
