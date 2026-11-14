// Test del promemoria su Google Calendar: piano pubblicato (public/piano.json) e logica dello script.
// Avvio: node --test test-calendario.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const piano = JSON.parse(fs.readFileSync(path.join(__dirname, 'public/piano.json'), 'utf8'));

test('piano.json: 51 settimane dal 16 novembre 2026', () => {
  assert.equal(piano.settimane.length, 51);
  assert.equal(piano.settimane[0].inizio, '2026-11-16');
  assert.equal(piano.settimane[0].fine, '2026-11-22');
});

test('piano.json: la prima corsa è martedì 17 novembre, facile da 5 km', () => {
  const s = piano.settimane[0].sessioni[0];
  assert.deepEqual(
    { data: s.data, giorno: s.giorno, tipo: s.tipo, titolo: s.titolo, km: s.km },
    { data: '2026-11-17', giorno: 'mar', tipo: 'facile', titolo: 'Corsa facile', km: 5 }
  );
  assert.equal(piano.settimane[0].km, 16);
});

test('piano.json: i lavori di qualità portano la descrizione del lavoro', () => {
  const gio = piano.settimane[10].sessioni.find(s => s.giorno === 'gio');
  assert.equal(gio.tipo, 'qualita');
  assert.match(gio.descrizione, /fartlek/);
});

test('piano.json: l\'ultima settimana finisce con la maratona del 7 novembre 2027', () => {
  const w = piano.settimane[50];
  const gara = w.sessioni[w.sessioni.length - 1];
  assert.deepEqual({ data: gara.data, tipo: gara.tipo, km: gara.km }, { data: '2027-11-07', tipo: 'gara', km: 42.2 });
  assert.equal(w.km, 56.2);
});

// Lo script gira su Google Apps Script: qui si caricano solo le sue funzioni pure, senza i servizi Google.
const vm = require('node:vm');
const gs = {};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'calendario/promemoria.gs'), 'utf8'), gs);

test('script: il sabato prepara la settimana che parte il lunedì dopo', () => {
  assert.equal(gs.lunediDopo('2026-11-14'), '2026-11-16'); // sabato
  assert.equal(gs.lunediDopo('2026-11-15'), '2026-11-16'); // domenica
  assert.equal(gs.lunediDopo('2026-11-16'), '2026-11-23'); // lunedì: la settimana in corso è già partita
  assert.equal(gs.lunediDopo('2026-12-26'), '2026-12-28');
  assert.equal(gs.lunediDopo('2027-03-27'), '2027-03-29'); // cambio dell'ora legale
});

test('script: trova la settimana del piano che parte quel lunedì, o nessuna', () => {
  assert.equal(gs.settimanaDel(piano, '2026-11-16').n, 1);
  assert.equal(gs.settimanaDel(piano, '2027-11-01').n, 51);
  assert.equal(gs.settimanaDel(piano, '2027-11-08'), null);
});

test('script: titolo breve dell\'evento, con la virgola decimale', () => {
  assert.equal(gs.titoloEvento({ titolo: 'Corsa facile', km: 5 }), 'Corsa facile · 5 km');
  assert.equal(gs.titoloEvento({ titolo: 'Test 5 km', km: 8 }), 'Test 5 km · 8 km');
  assert.equal(gs.titoloEvento({ titolo: 'Maratona di New York', km: 42.2 }), 'Maratona di New York · 42,2 km');
});

test('script: la descrizione dice cosa fare e rimanda all\'app', () => {
  const allunghi = piano.settimane[2].sessioni.find(s => s.giorno === 'gio');
  assert.match(gs.descrizioneEvento(allunghi, piano.app), /^Facile \+ 4 allunghi/);
  const facile = piano.settimane[0].sessioni[0];
  assert.match(gs.descrizioneEvento(facile, piano.app), /^Devi riuscire a parlare a frasi intere\./);
  assert.match(gs.descrizioneEvento(facile, piano.app), /corsa\.ragazzodelcoaching\.com/);
});

test('script: il riepilogo del sabato elenca le corse della settimana', () => {
  const r = gs.riepilogo(piano.settimane[0]);
  assert.equal(r.titolo, 'Settimana 1 · 3 corse · 16 km');
  assert.match(r.testo, /^mar 17 nov · Corsa facile · 5 km$/m);
  assert.match(r.testo, /^dom 22 nov · Lungo · 6 km$/m);
  assert.match(r.testo, /Fase Base\. Se serve alterna 4' corsa e 1' cammino\./);
});

test('script: la notifica suona alle 9, o tra 2 minuti se le 9 sono passate', () => {
  assert.equal(gs.minutiRiepilogo(7 * 60 + 12), 9 * 60);
  assert.equal(gs.minutiRiepilogo(9 * 60 + 30), 9 * 60 + 32);
});
