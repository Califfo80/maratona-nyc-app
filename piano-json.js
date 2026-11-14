// Genera public/piano.json dal motore (piano di base, settimana per settimana).
// Lo legge lo script Google che manda il promemoria del sabato (calendario/promemoria.gs).
// Si lancia da build.py, dopo che public/engine.js è stato generato.
const fs = require('node:fs');
const path = require('node:path');
const E = require('./public/engine.js');

const PLAN = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/plan-data.json'), 'utf8'));
const r1 = x => Math.round(x * 10) / 10;

const settimane = PLAN.map((w, i) => {
  const n = i + 1;
  const sessioni = E.BASE.filter(s => s.week === n).map(s => ({
    data: s.date, giorno: s.day, tipo: s.type, titolo: s.title, km: s.baseKm,
    descrizione: s.desc, dettaglio: s.detail
  }));
  const inizio = E.addDays(E.START, 7 * i);
  return {
    n, inizio, fine: E.addDays(inizio, 6), fase: E.PHASES[w[0] - 1].name, nota: w[5],
    km: r1(sessioni.reduce((a, s) => a + s.km, 0)), sessioni
  };
});

const out = { inizio: E.START, gara: E.RACE, app: 'https://corsa.ragazzodelcoaching.com', settimane };
fs.writeFileSync(path.join(__dirname, 'public/piano.json'), JSON.stringify(out, null, 1) + '\n');
