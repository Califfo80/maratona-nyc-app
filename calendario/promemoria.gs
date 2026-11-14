/**
 * Maratona NYC 2027 · promemoria del sabato su Google Calendar.
 *
 * Ogni sabato mattina mette nel calendario "Maratona NYC" le corse della settimana dopo
 * (eventi di giornata intera, es. "Corsa facile · 5 km") e alle 9:00 manda una notifica
 * con il riepilogo. Legge il piano di base da https://corsa.ragazzodelcoaching.com/piano.json.
 *
 * Installazione (una volta): script.google.com → Nuovo progetto → incolla questo file →
 * salva → scegli la funzione "installa" → Esegui → autorizza con il tuo account Google.
 * Per fermarlo: esegui "disinstalla".
 */

var CONFIG = {
  piano: 'https://corsa.ragazzodelcoaching.com/piano.json',
  calendario: 'Maratona NYC',
  fuso: 'Europe/Rome',
  oraScript: 7,          // il sabato lo script parte tra le 7 e le 8; la notifica arriva alle 9
  etichetta: 'maratonaNyc'
};

/* ---------- servizi Google ---------- */

/** Da eseguire una volta: crea il calendario, attiva il sabato e prepara subito la prossima settimana. */
function installa() {
  disinstalla();
  ScriptApp.newTrigger('aggiornaSettimana').timeBased()
    .onWeekDay(ScriptApp.WeekDay.SATURDAY).atHour(CONFIG.oraScript).inTimezone(CONFIG.fuso).create();
  aggiornaSettimana();
}

/** Ferma l'aggiornamento del sabato. Calendario ed eventi già creati restano. */
function disinstalla() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'aggiornaSettimana') ScriptApp.deleteTrigger(t);
  });
}

/** Mette nel calendario la settimana che parte il lunedì dopo oggi e programma la notifica di riepilogo. */
function aggiornaSettimana() {
  var piano = JSON.parse(UrlFetchApp.fetch(CONFIG.piano).getContentText());
  var adesso = new Date();
  var oggi = Utilities.formatDate(adesso, CONFIG.fuso, 'yyyy-MM-dd');
  var sett = settimanaDel(piano, lunediDopo(oggi));
  if (!sett) { console.log('Piano finito: nessuna settimana dopo il ' + oggi); return; }
  var cal = calendario_();

  // se lo script gira due volte sulla stessa settimana, la rifà senza doppioni
  cal.getEvents(giorno_(sett.inizio, 0), giorno_(sett.fine, 24)).forEach(function (ev) {
    if (ev.getTag(CONFIG.etichetta) === 'corsa') ev.deleteEvent();
  });
  sett.sessioni.forEach(function (s) {
    // mezzogiorno di Roma: la data resta giusta qualunque sia il fuso del progetto
    var ev = cal.createAllDayEvent(titoloEvento(s), giorno_(s.data, 12), { description: descrizioneEvento(s, piano.app) });
    ev.removeAllReminders();
    ev.setTag(CONFIG.etichetta, 'corsa');
  });

  var r = riepilogo(sett, piano.app);
  var ora = Utilities.formatDate(adesso, CONFIG.fuso, 'HH:mm').split(':');
  var inizio = new Date(giorno_(oggi, 0).getTime() + minutiRiepilogo(+ora[0] * 60 + +ora[1]) * 60000);
  cal.getEvents(giorno_(oggi, 0), giorno_(oggi, 48)).forEach(function (ev) {
    if (ev.getTag(CONFIG.etichetta) === 'riepilogo-' + sett.n) ev.deleteEvent();
  });
  var nota = cal.createEvent(r.titolo, inizio, new Date(inizio.getTime() + 15 * 60000), { description: r.testo });
  nota.removeAllReminders();
  nota.addPopupReminder(0);
  nota.setTag(CONFIG.etichetta, 'riepilogo-' + sett.n);
  console.log(r.titolo + ' · notifica il ' + Utilities.formatDate(inizio, CONFIG.fuso, 'dd/MM alle HH:mm'));
}

function calendario_() {
  var c = CalendarApp.getCalendarsByName(CONFIG.calendario);
  if (c.length) return c[0];
  return CalendarApp.createCalendar(CONFIG.calendario, { timeZone: CONFIG.fuso, summary: 'Piano di allenamento per la Maratona di New York 2027' });
}

/** Data ISO + ore, nel fuso di Roma. */
function giorno_(iso, ore) {
  return new Date(Utilities.parseDate(iso, CONFIG.fuso, 'yyyy-MM-dd').getTime() + ore * 3600000);
}

/* ---------- calcoli (provati in test-calendario.js) ---------- */

var GIORNI_ = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'];
var MESI_ = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];

function kmIt_(km) { return String(Math.round(km * 10) / 10).replace('.', ','); }
function maiuscola_(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function utc_(iso) { var p = iso.split('-'); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); }

/** Il primo lunedì dopo la data (mai la data stessa). */
function lunediDopo(iso) {
  var d = utc_(iso);
  d.setUTCDate(d.getUTCDate() + ((8 - d.getUTCDay()) % 7 || 7));
  return d.toISOString().slice(0, 10);
}

function settimanaDel(piano, lunedi) {
  for (var i = 0; i < piano.settimane.length; i++) if (piano.settimane[i].inizio === lunedi) return piano.settimane[i];
  return null;
}

function titoloEvento(s) { return s.titolo + ' · ' + kmIt_(s.km) + ' km'; }

function descrizioneEvento(s, app) {
  var righe = [];
  if (s.tipo === 'test' || s.descrizione === 'facile' || s.descrizione === 'lento') righe.push(s.dettaglio);
  else if (s.tipo !== 'gara') righe.push(maiuscola_(s.descrizione));
  righe.push('Ritmi e km aggiornati nell\'app: ' + app);
  return righe.join('\n');
}

function riepilogo(sett, app) {
  var righe = sett.sessioni.map(function (s) {
    var d = utc_(s.data);
    return GIORNI_[d.getUTCDay()] + ' ' + d.getUTCDate() + ' ' + MESI_[d.getUTCMonth()] + ' · ' + titoloEvento(s);
  });
  righe.push('', 'Fase ' + sett.fase + '.' + (sett.nota ? ' ' + sett.nota : ''));
  if (app) righe.push(app);
  return {
    titolo: 'Settimana ' + sett.n + ' · ' + sett.sessioni.length + ' corse · ' + kmIt_(sett.km) + ' km',
    testo: righe.join('\n')
  };
}

/** Minuto del giorno della notifica: alle 9, oppure 2 minuti dopo adesso se le 9 sono già passate. */
function minutiRiepilogo(minutiAdesso) {
  return minutiAdesso < 9 * 60 - 2 ? 9 * 60 : minutiAdesso + 2;
}
