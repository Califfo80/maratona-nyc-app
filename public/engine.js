/* Motore di calcolo del piano maratona NYC 2027.
   Nessuna dipendenza, nessuna rete: gira nel browser e in Node (per i test). */
(function (root) {
  'use strict';

  var PLAN = [[1, [5, "facile"], [5, "facile"], null, [6, "lento"], "Se serve alterna 4' corsa e 1' cammino."], [1, [5, "facile"], [5, "facile"], null, [7, "lento"], ""], [1, [6, "facile"], [5, "facile + 4 allunghi"], null, [8, "lento"], ""], [1, [5, "facile"], [4, "facile"], null, [6, "lento"], "Scarico."], [1, [6, "facile"], [6, "facile + 6 allunghi"], null, [9, "lento"], ""], [1, [6, "facile"], [6, "facile + 6 allunghi"], null, [10, "lento"], "Natale: se salti una corsa, salta la più corta."], [1, [5, "facile"], [5, "facile"], null, [7, "lento"], "Scarico."], [1, [6, "facile"], [5, "facile + 4 allunghi"], null, [8, "TEST 5 km (2 risc + 5 + 1)"], "Test 5 km: l'obiettivo aggiornato è nell'app."], [2, [7, "facile"], [6, "fartlek 6×1' svelto / 2' piano"], null, [11, "lento"], ""], [2, [7, "facile"], [7, "progressivo: ultimi 2 km a ritmo medio"], null, [12, "lento"], ""], [2, [7, "facile"], [7, "fartlek 8×1' svelto / 2' piano"], [4, "facile"], [12, "lento"], "Si aggiunge la corsa del venerdì."], [2, [6, "facile"], [6, "facile + 6 allunghi"], [4, "facile"], [9, "lento"], "Scarico. Si apre il sorteggio NYRR: iscriviti."], [2, [7, "facile"], [8, "3×6' a ritmo soglia, rec. 2'"], [5, "facile"], [13, "lento"], ""], [2, [8, "facile"], [8, "3×8' a ritmo soglia, rec. 2'"], [5, "facile"], [14, "lento"], ""], [2, [8, "facile"], [9, "6×3' a ritmo ripetute, rec. 2'"], [5, "facile"], [15, "lento"], ""], [2, [6, "facile"], [7, "facile + 6 allunghi"], [4, "facile"], [11, "lento"], "Scarico. Esito sorteggio a marzo: se negativo, tour operator."], [2, [8, "facile"], [9, "2×12' a ritmo soglia, rec. 3'"], [5, "facile"], [16, "lento"], ""], [2, [8, "facile"], [9, "5×1000 m a ritmo ripetute, rec. 2'30\""], [6, "facile"], [16, "lento"], ""], [2, [8, "facile"], [10, "20' continui a ritmo soglia"], [6, "facile"], [16, "lento"], ""], [2, [7, "facile"], [6, "facile + 4 allunghi"], null, [13, "TEST 10 km (2 risc + 10 + 1)"], "Test 10 km: l'obiettivo aggiornato è nell'app."], [3, [8, "facile"], [9, "8×45\" in salita sostenuta, rec. in discesa"], [6, "facile"], [16, "lento"], ""], [3, [8, "facile"], [10, "3×10' a ritmo soglia, rec. 2'"], [6, "facile"], [17, "lento"], ""], [3, [9, "facile"], [10, "6×1000 m a ritmo ripetute, rec. 2'"], [6, "facile"], [18, "lento"], ""], [3, [7, "facile"], [8, "facile + 6 allunghi"], [5, "facile"], [14, "lento"], "Scarico."], [3, [9, "facile"], [10, "10×45\" in salita, rec. in discesa"], [6, "facile"], [18, "lento"], ""], [3, [9, "facile"], [11, "25' continui a ritmo soglia"], [6, "facile"], [19, "lento"], ""], [3, [9, "facile"], [10, "4×1500 m a ritmo soglia, rec. 90\""], [6, "facile"], [20, "lento"], ""], [3, [8, "facile"], [7, "facile + 4 allunghi"], null, [23, "TEST MEZZA (2 risc + 21,1)"], "Test mezza maratona: l'obiettivo aggiornato è nell'app."], [3, [6, "facile"], [8, "facile"], [5, "facile"], [14, "lento"], "Recupero dopo la mezza."], [3, [9, "facile"], [10, "3×12' a ritmo soglia, rec. 2'"], [6, "facile"], [19, "lento"], ""], [3, [9, "facile"], [10, "6×1000 m a ritmo ripetute, rec. 2'"], [6, "facile"], [20, "lento"], ""], [3, [9, "facile"], [10, "30' progressivo fino a ritmo soglia"], [6, "facile"], [21, "lento"], ""], [4, [7, "facile"], [8, "facile + 6 allunghi"], [5, "facile"], [15, "lento"], "Scarico. Corri prima delle 8."], [4, [8, "facile"], [9, "2×12' soglia a sensazione"], [5, "facile"], [18, "lento"], ""], [4, [8, "facile"], [9, "fartlek 10×1' svelto / 1'30\" piano"], [5, "facile"], [18, "lento"], ""], [4, [8, "facile"], [9, "3×10' soglia a sensazione"], [5, "facile"], [20, "lento"], ""], [4, [7, "facile"], [7, "facile + 4 allunghi"], [4, "facile"], [14, "lento"], "Scarico."], [4, [8, "facile"], [9, "8×45\" in salita, rec. in discesa"], [5, "facile"], [20, "lento"], ""], [5, [8, "facile"], [10, "3×2 km a ritmo gara, rec. 2'"], [5, "facile"], [24, "lento, prova i gel"], ""], [5, [9, "facile"], [10, "4×1500 m a ritmo soglia, rec. 90\""], [5, "facile"], [25, "lento"], ""], [5, [9, "facile"], [12, "8 km continui a ritmo gara"], [6, "facile"], [26, "lento"], ""], [5, [7, "facile"], [8, "facile + 6 allunghi"], [5, "facile"], [20, "lento"], "Scarico."], [5, [9, "facile"], [11, "5×1000 m a ritmo ripetute, rec. 2'"], [6, "facile"], [28, "lento"], ""], [5, [10, "facile"], [12, "2×4 km a ritmo soglia, rec. 3'"], [6, "facile"], [25, "ultimi 12 km a ritmo gara"], ""], [5, [10, "facile"], [13, "10 km continui a ritmo gara"], [6, "facile"], [30, "lento"], ""], [5, [8, "facile"], [8, "facile + 4 allunghi"], null, [23, "TEST MEZZA (2 risc + 21,1)"], "Test mezza: l'obiettivo aggiornato è nell'app. Scarpe e gel di gara."], [5, [9, "facile"], [12, "3×3 km a ritmo soglia, rec. 2'"], [6, "facile"], [32, "lento (max 3h15)"], "Lungo più lungo del piano."], [5, [10, "facile"], [11, "4×1600 m a ritmo soglia, rec. 90\""], [6, "facile"], [26, "ultimi 14 km a ritmo gara"], "Ultima seduta pesante."], [6, [8, "facile"], [10, "6 km a ritmo gara"], [5, "facile"], [22, "lento"], "Ultima palestra con gambe, leggera."], [6, [7, "facile"], [8, "4 km a ritmo gara"], [5, "facile"], [16, "lento"], "Solo core in palestra."], [6, [6, "facile con 3 km a ritmo gara"], [5, "facile + 4 allunghi"], [3, "sabato: 3 km sciolti a NYC"], [42.2, "MARATONA DI NEW YORK"], "Gara domenica 7 novembre. La notte prima negli USA torna l'ora solare: un'ora di sonno in più."]];

  var START = '2026-11-16';
  var RACE = '2027-11-07';
  var DAYMS = 86400000;
  var DAY_OFFSET = { mar: 1, gio: 3, ven: 4, sab: 5, dom: 6 };
  var DAY_NAME = { lun: 'Lunedì', mar: 'Martedì', mer: 'Mercoledì', gio: 'Giovedì', ven: 'Venerdì', sab: 'Sabato', dom: 'Domenica' };
  var PHASES = [
    { id: 1, name: 'Base', focus: 'Solo corsa facile, 3 uscite. Abitui tendini e articolazioni.' },
    { id: 2, name: 'Costruzione', focus: 'Arriva la quarta uscita e i primi lavori di qualità.' },
    { id: 3, name: 'Sviluppo', focus: 'Salite, soglia e lunghi fino a 21 km.' },
    { id: 4, name: 'Estate', focus: 'Mantenimento con il caldo: corse all\'alba, ritmi a sensazione.' },
    { id: 5, name: 'Specifico', focus: 'Lunghi da 24 a 32 km e blocchi a ritmo gara.' },
    { id: 6, name: 'Scarico', focus: 'Meno volume, stessa intensità. Arrivi fresco al via.' }
  ];
  // Test di controllo: distanza del tratto cronometrato e obiettivo del piano (secondi)
  var TESTS = {
    8: { dist: 5000, label: '5 km', target: 1920 },
    20: { dist: 10000, label: '10 km', target: 3720 },
    28: { dist: 21097.5, label: 'mezza', target: 7920 },
    46: { dist: 21097.5, label: 'mezza', target: 7560 }
  };
  // Traiettoria di forma prevista dal piano (settimane dall'inizio, VDOT)
  var CURVE = [[0, 25.7], [8, 28.5], [20, 31], [28, 32.5], [46, 34.5], [51, 34.75]];
  var DEBUT = 1.04; // prudenza per la prima maratona
  var BASELINE_VDOT = 25.7;
  var RPE_FRAC = { 1: 0.55, 2: 0.6, 3: 0.64, 4: 0.68, 5: 0.72, 6: 0.77, 7: 0.83, 8: 0.88, 9: 0.94, 10: 1 };
  // Test da sforzo in laboratorio (impostazioni: vo2max, vt1, vt2). Valori personali: stanno solo sul telefono.
  // VDOT di partenza = 92% del VO2max: il test a rampa da 1' sovrastima le velocità alle soglie.
  // La curva del piano porta comunque al suo punto d'arrivo (CURVE finale), con un guadagno minimo del 10%.
  var LAB_FRAC = 0.92, LAB_MIN_GAIN = 0.10;
  var EASY_FRAC = [0.72, 0.62], EASY_FRAC_LAB = [0.675, 0.6]; // con il test: facile = zone 1-2 del laboratorio
  var Z2_ABOVE_VT1 = 10; // zona 2 del laboratorio: da VT1 a VT1 + 10 bpm
  var HEALTH = { malattia: 1, dolore: 1 };

  /* ---------- date ---------- */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function parse(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function addDays(s, n) { var d = parse(s); d.setDate(d.getDate() + n); return iso(d); }
  function diffDays(a, b) { return Math.round((parse(b) - parse(a)) / DAYMS); } // b - a
  function todayIso() { return iso(new Date()); }

  /* ---------- Daniels / VDOT ---------- */
  function vo2(v) { return -4.6 + 0.182258 * v + 0.000104 * v * v; } // v in m/min
  function pctAt(tMin) { return 0.8 + 0.1894393 * Math.exp(-0.012778 * tMin) + 0.2989558 * Math.exp(-0.1932605 * tMin); }
  function vdotFrom(distM, sec) { var t = sec / 60; return vo2(distM / t) / pctAt(t); }
  function predictSec(vd, distM) {
    var lo = 1, hi = 2000;
    for (var i = 0; i < 80; i++) { var mid = (lo + hi) / 2; if (vdotFrom(distM, mid * 60) > vd) lo = mid; else hi = mid; }
    return (lo + hi) / 2 * 60;
  }
  function vFromVo2(x) { var a = 0.000104, b = 0.182258, c = -4.6 - x; return (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a); }
  function paceAtFrac(vd, frac) { return 60000 / vFromVo2(vd * frac); } // sec/km
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function round05(x) { return Math.round(x * 2) / 2; }

  function curveAt(x) {
    x = clamp(x, 0, 51);
    for (var i = 1; i < CURVE.length; i++) {
      var a = CURVE[i - 1], b = CURVE[i];
      if (x <= b[0]) return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]);
    }
    return CURVE[CURVE.length - 1][1];
  }

  /* ---------- piano base ---------- */
  function typeOf(day, desc, week) {
    if (day === 'dom') {
      if (/MARATONA/.test(desc)) return 'gara';
      if (/TEST/.test(desc)) return 'test';
      return 'lungo';
    }
    if (day === 'gio' && !/^facile/.test(desc)) return 'qualita';
    return 'facile';
  }
  var TYPE_TITLE = { facile: 'Corsa facile', qualita: 'Lavoro di qualità', lungo: 'Lungo', test: 'Test', gara: 'Maratona di New York' };

  function baseSessions() {
    var out = [];
    PLAN.forEach(function (w, i) {
      var n = i + 1, ws = addDays(START, 7 * i);
      ['mar', 'gio', 'ven', 'dom'].forEach(function (k, j) {
        var s = w[j + 1];
        if (!s) return;
        var day = k, desc = s[1];
        if (n === 51 && k === 'ven') { day = 'sab'; desc = '3 km sciolti a New York'; }
        var type = typeOf(k, desc, n);
        var test = type === 'test' ? TESTS[n] : (type === 'gara' ? { dist: 42195, label: 'maratona', target: null } : null);
        var detail = desc;
        if (type === 'lungo' && desc === 'lento') detail = 'Ritmo facile dall\'inizio alla fine.';
        if (type === 'facile' && desc === 'facile') detail = 'Devi riuscire a parlare a frasi intere.';
        if (type === 'test') detail = 'Riscaldamento 2 km, poi ' + test.label + ' a tutta, poi 1 km di defaticamento.';
        out.push({
          key: n + '-' + day, week: n, day: day, date: addDays(ws, DAY_OFFSET[day]), phase: w[0],
          baseKm: s[0], type: type, desc: desc, detail: detail, test: test,
          title: type === 'test' ? 'Test ' + test.label : TYPE_TITLE[type]
        });
      });
    });
    return out;
  }
  var BASE = baseSessions();
  var BASE_BY_KEY = {};
  BASE.forEach(function (s) { BASE_BY_KEY[s.key] = s; });

  function weekIndexOf(date) { return Math.floor(diffDays(START, date) / 7); } // 0-based, può essere <0 o >50

  /* ---------- stima della forma ---------- */
  function runEstimate(run, settings) {
    if (!run || !(run.km > 0) || !(run.sec > 0)) return null;
    var s = run.key ? BASE_BY_KEY[run.key] : null;
    var vd = null, w = 0, kind = 'easy';
    if (s && s.test && s.type === 'test' && run.testSec > 0) { vd = vdotFrom(s.test.dist, run.testSec); w = 4; kind = 'test'; }
    else if (s && s.type === 'gara') { vd = vdotFrom(42195, run.sec); w = 4; kind = 'gara'; }
    else if (run.max) { vd = vdotFrom(run.km * 1000, run.sec); w = 3; kind = 'gara'; }
    else {
      if (s && (s.type === 'qualita' || s.type === 'test')) return null; // ritmo medio falsato da recuperi
      if (run.sec < 15 * 60) return null;
      var v = run.km * 1000 / (run.sec / 60), frac = null;
      if (run.hr > 0 && settings.hrMax > 0) {
        if (settings.hrRest > 0 && settings.hrMax > settings.hrRest) frac = (run.hr - settings.hrRest) / (settings.hrMax - settings.hrRest);
        else frac = (run.hr / settings.hrMax - 0.37) / 0.64;
        w = 0.6; kind = 'hr';
      } else if (run.rpe > 0) {
        frac = run.rpe >= 10 ? pctAt(run.sec / 60) : RPE_FRAC[run.rpe];
        w = 0.3; kind = 'rpe';
      }
      if (!frac) return null;
      frac = clamp(frac, 0.5, 1);
      vd = vo2(v) / frac;
    }
    if (!isFinite(vd)) return null;
    return { date: run.date, vd: clamp(vd, 15, 70), w: w, kind: kind, id: run.id };
  }

  function estimateAt(ests, date, prior) {
    var num = prior ? prior.vd * prior.w : 0, den = prior ? prior.w : 0, last = null;
    for (var i = 0; i < ests.length; i++) {
      var e = ests[i];
      if (e.date > date) continue;
      var age = diffDays(e.date, date);
      if (!last || e.date >= last.date) last = e;
      if (age > 56) continue;
      var wt = e.w * Math.pow(0.5, age / 21);
      num += e.vd * wt; den += wt;
    }
    if (den > 0) return num / den;
    return last ? last.vd : BASELINE_VDOT;
  }

  /* ---------- test di laboratorio ---------- */
  function labVdot(settings) { var v = settings && +settings.vo2max; return v >= 15 && v <= 90 ? v * LAB_FRAC : null; }
  function hrZones(settings) {
    var vt1 = settings && +settings.vt1, vt2 = settings && +settings.vt2;
    if (!(vt1 > 80 && vt2 > vt1)) return null;
    return { vt1: vt1, vt2: vt2, easy: Math.min(vt1 + Z2_ABOVE_VT1, vt2 - 1), T: [vt2 - 8, vt2], I: vt2 + 1 };
  }
  // punto di partenza della curva e fattore che riscala i guadagni della curva del piano
  function startOf(settings, ests) {
    var lab = labVdot(settings), span = curveAt(51) - curveAt(0);
    if (lab) return { vd0: lab, k: Math.max(curveAt(51) - lab, lab * LAB_MIN_GAIN) / span, lab: true };
    var vd0 = BASELINE_VDOT;
    for (var i = 0; i < ests.length; i++) { if (ests[i].date < START) { vd0 = ests[i].vd; } }
    return { vd0: vd0, k: 1, lab: false };
  }
  function gainBetween(st, x0, x1) { return (curveAt(x1) - curveAt(x0)) * st.k; }

  // forma attesa se si segue il piano: punto di partenza personale + progressi del piano, pesati dalla costanza
  function priorAt(state, ests, date) {
    var st = startOf(state.settings, ests);
    var planned = 0, done = 0;
    BASE.forEach(function (s) { if (s.date < date && s.type !== 'gara') planned += s.baseKm; });
    state.runs.forEach(function (r) { if (r.date >= START && r.date < date) done += r.km || 0; });
    var adh = planned < 5 ? 1 : clamp(done / planned, 0.3, 1);
    var x = diffDays(START, date) / 7;
    return { vd: st.vd0 + gainBetween(st, 0, x) * adh, w: 1.2 };
  }

  // perdita di forma dopo giorni senza correre
  function detrain(vd, runs, date) {
    var last = null;
    runs.forEach(function (r) { if (r.date <= date && (!last || r.date > last)) last = r.date; });
    if (!last) return vd;
    var d = diffDays(last, date);
    return d > 10 ? vd * (1 - Math.min(0.07, (d - 10) * 0.003)) : vd;
  }
  function formAt(state, ests, runs, date) { return detrain(estimateAt(ests, date, priorAt(state, ests, date)), runs, date); }

  /* ---------- costanza ---------- */
  function adherenceAt(state, date) {
    var from = addDays(date, -42), planned = 0, done = 0;
    BASE.forEach(function (s) { if (s.date >= from && s.date < date && s.type !== 'gara') planned += s.baseKm; });
    state.runs.forEach(function (r) { if (r.date >= from && r.date < date && r.date >= START) done += r.km || 0; });
    if (planned < 5) return 1;
    return clamp(done / planned, 0.3, 1.1);
  }

  function endurance(L) {
    if (L >= 30) return 1;
    if (L >= 22) return 1 + (30 - L) / 8 * 0.05;
    if (L >= 16) return 1.05 + (22 - L) / 6 * 0.05;
    return 1.12;
  }

  /* ---------- calcolo completo ---------- */
  function compute(state, today) {
    today = today || todayIso();
    var settings = state.settings || {};
    var runs = (state.runs || []).slice().sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
    var skips = state.skips || [];
    var runByKey = {}, skipByKey = {};
    runs.forEach(function (r) { if (r.key) runByKey[r.key] = r; });
    skips.forEach(function (k) { skipByKey[k.key] = k; });

    // stime di forma
    var ests = [];
    runs.forEach(function (r) { var e = runEstimate(r, settings); if (e) ests.push(e); });
    var vdNow = formAt(state, ests, runs, today);
    var st0 = startOf(settings, ests), zones = hrZones(settings);

    // eventi di cautela (malattia, dolore)
    var events = [];
    skips.forEach(function (k) { if (HEALTH[k.reason]) { var s = BASE_BY_KEY[k.key]; events.push({ date: s ? s.date : k.date, reason: k.reason }); } });
    runs.forEach(function (r) { if (r.pain) events.push({ date: r.date, reason: 'dolore' }); });
    function cautionOn(date) {
      for (var i = 0; i < events.length; i++) { var d = diffDays(events[i].date, date); if (d > 0 && d <= 7) return events[i]; }
      return null;
    }
    var lastEvent = null;
    events.forEach(function (e) { if (e.date <= today && (!lastEvent || e.date > lastEvent.date)) lastEvent = e; });
    var caution = lastEvent && diffDays(lastEvent.date, today) < 7 ? { reason: lastEvent.reason, until: addDays(lastEvent.date, 7) } : null;

    // sessioni con stato e adattamenti, settimana per settimana
    var sessions = [], weeks = [], eff = [], longEff = [];
    for (var i = 0; i < 51; i++) {
      var n = i + 1, ws = addDays(START, 7 * i), we = addDays(ws, 6);
      var base = BASE.filter(function (s) { return s.week === n; });
      var baseKm = base.reduce(function (a, s) { return a + s.baseKm; }, 0);
      var weekRuns = runs.filter(function (r) { return r.date >= ws && r.date <= we; });
      var actualKm = weekRuns.reduce(function (a, r) { return a + (r.km || 0); }, 0);

      // tetto di volume dopo settimane in difetto
      var prev = eff.slice(Math.max(0, i - 3), i);
      var cap = prev.length ? Math.max(1.15 * Math.max.apply(null, prev) + 2, 0.5 * baseKm) : Infinity;
      var r = Math.min(1, cap / baseKm);
      // tetto del lungo: corsa più lunga delle 3 settimane precedenti
      var lref = 0;
      runs.forEach(function (x) { var d = diffDays(x.date, ws); if (d > 0 && d <= 21) lref = Math.max(lref, x.km || 0); });
      longEff.slice(Math.max(0, i - 3), i).forEach(function (v, j) {
        var wi = Math.max(0, i - 3) + j; if (addDays(START, 7 * wi + 6) >= today) lref = Math.max(lref, v);
      });
      var longCap = lref > 0 ? lref * 1.15 + 1.5 : Infinity;

      var wk = [];
      base.forEach(function (b) {
        var s = Object.assign({}, b);
        var run = runByKey[s.key], skip = skipByKey[s.key];
        s.adjKm = s.baseKm; s.adjType = s.type; s.adjDesc = s.desc; s.adjDetail = s.detail; s.notes = [];
        // con il test di laboratorio l'obiettivo dei test segue la curva attesa (arrotondato ai 30")
        if (st0.lab && s.type === 'test' && s.test) {
          var vdT = st0.vd0 + gainBetween(st0, 0, diffDays(START, s.date) / 7);
          s.test = Object.assign({}, s.test, { target: Math.round(predictSec(vdT, s.test.dist) / 30) * 30 });
        }
        if (run) { s.status = 'done'; s.runId = run.id; }
        else if (skip) { s.status = 'skipped'; s.skipReason = skip.reason; }
        else if (s.date < today) s.status = 'missed';
        else s.status = s.date === today ? 'today' : 'planned';
        var pending = s.status === 'today' || s.status === 'planned';
        if (pending) {
          var km = s.baseKm;
          if (s.type === 'facile' || s.type === 'qualita' || s.type === 'lungo') {
            if (r < 1) km = Math.max(3, round05(km * r));
            if (s.type === 'lungo' && km > longCap) km = Math.max(3, round05(longCap));
          }
          var c = cautionOn(s.date);
          if (c) {
            if (s.type === 'qualita') { s.adjType = 'facile'; s.adjDesc = 'facile'; s.adjDetail = 'Al posto del lavoro: corsa facile finché non stai bene.'; km = Math.max(3, round05(km * 0.8)); s.notes.push('Lavoro sostituito per prudenza'); }
            else if (s.type === 'lungo' || s.type === 'facile') { km = Math.max(3, round05(km * 0.8)); s.notes.push('Accorciata per prudenza'); }
            else if (s.type === 'test') s.notes.push('Se non stai ancora bene, rimanda il test di una settimana');
          }
          if (km < s.baseKm && !c) s.notes.push('Ridotta dopo le corse saltate');
          if (s.type === 'test' && r < 0.75 && !c) s.notes.push('Valuta di rimandare il test: il volume recente è basso');
          s.adjKm = km;
        }
        wk.push(s);
      });

      // giovedì di qualità saltato: passa al venerdì della stessa settimana
      var gio = wk.filter(function (s) { return s.day === 'gio'; })[0];
      var ven = wk.filter(function (s) { return s.day === 'ven'; })[0];
      if (gio && ven && gio.type === 'qualita' && (gio.status === 'skipped' || gio.status === 'missed') && !HEALTH[gio.skipReason] &&
          (ven.status === 'planned' || ven.status === 'today') && !cautionOn(ven.date)) {
        ven.adjType = 'qualita'; ven.adjDesc = gio.desc; ven.adjDetail = gio.detail;
        ven.adjKm = Math.max(ven.adjKm, Math.max(3, round05(gio.baseKm * r)));
        ven.notes = ['Lavoro spostato da giovedì'];
      }

      var pendingKm = wk.reduce(function (a, s) { return a + ((s.status === 'today' || s.status === 'planned') ? s.adjKm : 0); }, 0);
      var plannedAdj = wk.reduce(function (a, s) {
        if (s.status === 'done') return a + (runByKey[s.key].km || 0);
        return a + ((s.status === 'today' || s.status === 'planned') ? s.adjKm : s.baseKm);
      }, 0);
      eff.push(actualKm + pendingKm);
      var longPending = wk.reduce(function (a, s) { return (s.adjType === 'lungo' && (s.status === 'today' || s.status === 'planned')) ? Math.max(a, s.adjKm) : a; }, 0);
      var longDone = weekRuns.reduce(function (a, x) { return Math.max(a, x.km || 0); }, 0);
      longEff.push(Math.max(longPending, longDone));

      var past = we < today;
      weeks.push({
        n: n, start: ws, end: we, phase: PLAN[i][0], note: PLAN[i][5], baseKm: Math.round(baseKm * 10) / 10,
        plannedKm: Math.round(plannedAdj * 10) / 10, actualKm: Math.round(actualKm * 10) / 10,
        adjusted: wk.some(function (s) { return s.adjKm !== s.baseKm || s.adjType !== s.type; }),
        past: past, current: ws <= today && today <= we, sessions: wk,
        done: wk.filter(function (s) { return s.status === 'done'; }).length, count: wk.length
      });
      Array.prototype.push.apply(sessions, wk);
    }

    // previsione
    function forecastAt(date, vd) {
      var x = diffDays(START, date) / 7;
      var gain = Math.max(0, gainBetween(st0, x, 51));
      var adh = date < START ? 1 : adherenceAt(state, date);
      var vPlan = vd + gain, vCont = vd + gain * Math.min(1, adh);
      // lunghi della fase specifica (settimane 41-50)
      var w41 = addDays(START, 7 * 40);
      var longDone = 0, longPlan = 0;
      runs.forEach(function (rr) { if (rr.date >= w41 && rr.date <= date && rr.date < RACE) longDone = Math.max(longDone, rr.km || 0); });
      sessions.forEach(function (s) { if (s.week >= 41 && s.week <= 50 && s.date > date && s.adjType === 'lungo') longPlan = Math.max(longPlan, s.adjKm); });
      var Lplan = Math.max(longDone, longPlan), Lcont = Math.max(longDone, longPlan * Math.sqrt(Math.min(1, adh)));
      return {
        plan: predictSec(vPlan, 42195) * DEBUT * endurance(Lplan),
        cont: predictSec(vCont, 42195) * DEBUT * endurance(Lcont),
        adherence: adh, vdPlan: vPlan, vdCont: vCont
      };
    }
    var fc = forecastAt(today, vdNow);
    var goal = settings.goal || 16200;
    var status = fc.cont <= goal ? 'ok' : (fc.cont <= goal + 300 ? 'warn' : 'bad');
    var realistic = fc.cont <= goal ? goal : Math.ceil(fc.cont / 300) * 300;
    var lateStage = diffDays(START, today) / 7 >= 38;
    var raceTarget = Math.max(goal, Math.ceil((lateStage ? fc.cont : fc.plan) / 60) * 60);
    var racePace = raceTarget / 42.195;

    // storico della previsione (inizio di ogni settimana fino a oggi)
    var history = [];
    var firstRun = runs.length ? runs[0].date : today;
    var hStart = firstRun < START ? firstRun : START;
    if (hStart <= today) { var vh0 = formAt(state, ests, runs, hStart); history.push({ date: hStart, vd: vh0, fc: forecastAt(hStart, vh0) }); }
    for (var h = 0; h < 52; h++) {
      var d = addDays(START, 7 * h);
      if (d > today) break;
      if (d === hStart) continue;
      var vdh = formAt(state, ests, runs, d);
      history.push({ date: d, vd: vdh, fc: forecastAt(d, vdh) });
    }
    if (!history.length || history[history.length - 1].date !== today) history.push({ date: today, vd: vdNow, fc: fc });

    // ritmi attuali (sec/km)
    var paces = {
      easy: [paceAtFrac(vdNow, (st0.lab ? EASY_FRAC_LAB : EASY_FRAC)[0]), paceAtFrac(vdNow, (st0.lab ? EASY_FRAC_LAB : EASY_FRAC)[1])],
      T: paceAtFrac(vdNow, 0.88),
      I: paceAtFrac(vdNow, 0.975),
      M: [racePace - 9, racePace - 4],
      raceReal: racePace,
      hr: zones
    };

    var pending = sessions.filter(function (s) { return s.status === 'today' || s.status === 'planned'; });
    var next = pending[0] || null;
    var toLog = sessions.filter(function (s) { return s.status === 'missed' && diffDays(s.date, today) <= 10; });
    var cw = clamp(weekIndexOf(today), 0, 50);

    return {
      today: today, start: START, race: RACE, hrMax: settings.hrMax || null, zones: zones, lab: st0.lab, sessions: sessions, weeks: weeks, ests: ests,
      vdNow: vdNow, paces: paces, forecast: {
        plan: fc.plan, cont: fc.cont, adherence: fc.adherence, status: status, goal: goal,
        realistic: realistic, raceTarget: raceTarget, racePace: racePace
      },
      history: history, caution: caution, next: next, toLog: toLog,
      currentWeek: cw, beforeStart: today < START, afterRace: today > RACE,
      daysToRace: diffDays(today, RACE), curveAt: curveAt
    };
  }

  /* ---------- testi di supporto ---------- */
  function fmtPace(sec) {
    if (!isFinite(sec) || sec <= 0) return '—';
    var m = Math.floor(sec / 60), s = Math.round(sec - m * 60);
    if (s === 60) { m++; s = 0; }
    return m + ':' + pad(s);
  }
  function fmtTime(sec, withSec) {
    if (!isFinite(sec)) return '—';
    sec = Math.round(sec);
    var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    if (withSec === false) { if (s >= 30) { m++; if (m === 60) { h++; m = 0; } } return h + ':' + pad(m); }
    return h ? h + ':' + pad(m) + ':' + pad(s) : m + ':' + pad(s);
  }
  function fmtKm(km) { return (Math.round(km * 10) / 10).toString().replace('.', ','); }

  function paceHint(s, paces) {
    var t = s.adjType || s.type, d = s.adjDesc || s.desc, Z = paces.hr;
    var E = fmtPace(paces.easy[0]) + '–' + fmtPace(paces.easy[1]);
    var M = fmtPace(paces.M[0]) + '–' + fmtPace(paces.M[1]);
    var T = fmtPace(paces.T - 5) + '–' + fmtPace(paces.T + 5);
    var I = fmtPace(paces.I - 5) + '–' + fmtPace(paces.I + 5);
    // con le zone del test la frequenza cardiaca comanda, il ritmo è indicativo
    var fE = Z ? ' · FC sotto ' + Z.easy : '', fT = Z ? ' · FC ' + Z.T[0] + '–' + Z.T[1] : '', fI = Z ? ' · FC oltre ' + Z.vt2 + ' a fine tratto' : '';
    if (t === 'facile' && /ritmo gara/.test(d)) return 'Facile ' + E + fE + ', tratto a ritmo gara ' + M;
    if (t === 'facile' || (t === 'lungo' && !/ritmo gara/.test(d))) return 'Ritmo facile ' + E + ' /km' + fE;
    if (t === 'lungo') return 'Facile ' + E + fE + ', poi ritmo gara ' + M + ' /km';
    if (t === 'test') return 'Riscaldamento facile, poi a tutta in modo regolare' + (s.test && s.test.target ? ' · obiettivo ' + fmtTime(s.test.target) : '');
    if (t === 'gara') return 'Ritmo gara ' + M + ' /km sul GPS';
    if (/soglia/.test(d) && /sensazione/.test(d)) return 'Soglia a sensazione: poche parole possibili' + fT;
    if (/soglia/.test(d)) return 'Tratti a ' + T + ' /km' + fT + ', il resto facile';
    if (/ripetute/.test(d)) return 'Tratti a ' + I + ' /km' + fI + ', il resto facile';
    if (/ritmo gara/.test(d)) return 'Tratti a ' + M + ' /km, il resto facile';
    if (/salita/.test(d)) return 'Salite a sforzo duro, recupero scendendo piano';
    if (/fartlek/.test(d)) return 'Tratti svelti vicino a ' + fmtPace(paces.T) + ' /km';
    if (/progressivo/.test(d)) return 'Da facile fino a circa ' + fmtPace(paces.T + 15) + ' /km';
    return 'Ritmo facile ' + E + ' /km' + fE;
  }

  /* ---------- feedback per corsa ---------- */
  function feedbackRun(run, before, after) {
    var s = run.key ? before.sessions.filter(function (x) { return x.key === run.key; })[0] : null;
    var type = s ? s.adjType : (run.max ? 'test' : 'facile');
    var planned = s ? s.adjKm : null;
    var pace = run.sec / run.km;
    var items = [], score = 100;
    function add(tone, title, text) { items.push({ tone: tone, title: title, text: text }); score -= tone === 'bad' ? 30 : tone === 'warn' ? 15 : 0; }
    var P = before.paces;

    // distanza
    if (planned && type !== 'test' && type !== 'gara') {
      var ratio = run.km / planned;
      if (ratio >= 0.9 && ratio <= 1.12) add('good', 'Distanza centrata', fmtKm(run.km) + ' km su ' + fmtKm(planned) + ' previsti.');
      else if (ratio < 0.9) add('info', fmtKm(planned - run.km) + ' km in meno del previsto', 'Va bene così, non recuperarli nei prossimi giorni.');
      else add('warn', fmtKm(run.km - planned) + ' km in più del previsto', 'Il volume extra non accelera i progressi e aumenta il rischio di infortuni. Resta sul piano.');
    }

    // intensità
    if (type === 'facile' || type === 'lungo') {
      var fast = P.easy[0], slow = P.easy[1];
      var Z = before.zones;
      var hrHigh = run.hr > 0 && (Z ? run.hr > Z.easy : (before.hrMax && run.hr / before.hrMax > 0.82));
      var hard = (run.rpe >= 7) || hrHigh;
      var hrOk = Z && run.hr > 0 && !hrHigh; // con le zone del test, se la FC è in zona 2 il ritmo va bene
      if (pace < fast - 10 && !hrOk) add('warn', 'Troppo veloce per una corsa facile', 'Eri a ' + fmtPace(pace) + ' /km, la tua zona facile oggi è ' + fmtPace(fast) + '–' + fmtPace(slow) + '. Le corse facili costruiscono la base solo se restano facili.');
      else if (pace > slow + 40) add('info', 'Molto piano', 'Va benissimo se eri stanco o hai camminato. Conta il tempo sulle gambe.');
      else if (!hrOk) add('good', 'Ritmo facile giusto', fmtPace(pace) + ' /km, dentro la zona ' + fmtPace(fast) + '–' + fmtPace(slow) + '.');
      if (run.rpe >= 7) add('warn', 'Sforzo alto per una corsa facile', 'Hai dato ' + run.rpe + '/10. Se capita spesso, rallenta o inserisci un minuto di cammino ogni tanto.');
      else if (hrHigh && Z) add('warn', 'Frequenza cardiaca alta', 'Media di ' + run.hr + ' bpm, sopra i ' + Z.easy + ' della zona 2 del test. Nelle facili resta sotto: rallenta, anche camminando un minuto ogni tanto. È qui che si allena il consumo di grassi.');
      else if (hrHigh) add('warn', 'Frequenza cardiaca alta', 'Media al ' + Math.round(run.hr / before.hrMax * 100) + '% della massima. Per le facili resta sotto il 78–80%.');
      else if (Z && run.hr > 0) add('good', 'Frequenza cardiaca in zona', 'Media di ' + run.hr + ' bpm, sotto i ' + Z.easy + ' della zona 2: allenamento aerobico pieno.');
      if (type === 'lungo' && run.km >= 18) add('info', 'Carboidrati nei lunghi', 'Sopra i 90 minuti prendi 30–60 g di carboidrati l\'ora, poi sali verso 60–90 nei lunghi della fase specifica: a ritmo gara si bruciano soprattutto zuccheri. Allena lo stomaco come le gambe.');
      if (!hard && run.feel === 'good' && (pace >= fast - 10 || hrOk)) add('good', 'Sensazioni ottime', 'Gambe fresche e ritmo controllato: è la combinazione giusta.');
    } else if (type === 'qualita') {
      if (!run.rpe) add('info', 'Manca lo sforzo percepito', 'Per i lavori il ritmo medio non dice molto: indica lo sforzo da 1 a 10.');
      else if (run.rpe <= 5) add('info', 'Lavoro forse troppo blando', 'Sforzo ' + run.rpe + '/10. Nei tratti veloci puoi spingere un po\' di più.');
      else if (run.rpe <= 8) add('good', 'Intensità giusta', 'Sforzo ' + run.rpe + '/10: impegnativo ma controllato, come deve essere.');
      else add('warn', 'Troppo duro', 'Sforzo ' + run.rpe + '/10. Un lavoro ben fatto finisce con la sensazione di poterne fare ancora una ripetizione.');
    } else if (type === 'test' || type === 'gara') {
      var t = s && s.test;
      var tsec = run.testSec > 0 ? run.testSec : (run.max ? run.sec : null);
      var dist = run.testSec > 0 && t ? t.dist : run.km * 1000;
      if (tsec) {
        var vd = vdotFrom(dist, tsec);
        add('info', 'Forma misurata: VDOT ' + vd.toFixed(1).replace('.', ','), 'Ritmo medio sul tratto ' + fmtPace(tsec / (dist / 1000)) + ' /km.');
        if (t && t.target) {
          var diff = tsec - t.target;
          if (diff <= 0) add('good', 'Test superato', fmtTime(tsec) + ' contro un obiettivo di ' + fmtTime(t.target) + ': sei ' + fmtTime(-diff) + ' sotto. I ritmi si aggiornano.');
          else if (diff <= t.target * 0.03) add('info', 'Test quasi centrato', fmtTime(tsec) + ', ' + fmtTime(diff) + ' sopra l\'obiettivo di ' + fmtTime(t.target) + '. Sei ancora in linea: continua così.');
          else add('warn', 'Test sotto le attese', fmtTime(tsec) + ', ' + fmtTime(diff) + ' sopra l\'obiettivo. La previsione si aggiorna: guarda la scheda Oggi.');
        }
      } else if (s && s.type === 'test') add('info', 'Manca il tempo del test', 'Inserisci il tempo del tratto cronometrato per aggiornare la forma.');
    }

    // dolore e sensazioni
    if (run.pain) add('bad', 'Hai segnalato dolore' + (run.painWhere ? ' (' + run.painWhere + ')' : ''), 'Nei prossimi 7 giorni il piano propone solo corse facili e più corte. Se il dolore peggiora correndo o dura più di 3 giorni, fermati e senti un fisioterapista.');
    else if (run.feel === 'heavy') add('info', 'Gambe pesanti', 'Normale nelle settimane di carico. Dormi bene e tieni il sabato di riposo vero.');

    // cosa cambia
    var d0 = before.forecast.cont, d1 = after.forecast.cont;
    var delta = d1 - d0;
    var change = Math.abs(delta) >= 20 ? (delta < 0 ? 'migliora di ' : 'peggiora di ') + fmtTime(Math.abs(delta)) : 'stabile';

    score = clamp(score, 20, 100);
    var headline = score >= 90 ? 'Ottimo lavoro' : score >= 75 ? 'Buona corsa' : score >= 55 ? 'Corsa fatta, con qualche nota' : 'Ascolta il corpo';
    var testItem = items.filter(function (it) { return /^Test /.test(it.title); })[0];
    if (testItem && !run.pain) headline = testItem.title;
    if (type === 'gara') headline = run.pain ? 'Sei un maratoneta. Ora recupera' : 'Sei un maratoneta';
    var wk = after.weeks[weekIndexOf(run.date)] || null;
    return {
      score: score, headline: headline, items: items, type: type, title: s ? (s.adjType === s.type ? s.title : TYPE_TITLE[s.adjType]) : (run.max ? 'Gara o test' : 'Corsa extra'),
      pace: pace, forecastBefore: d0, forecastAfter: d1, change: change,
      vdBefore: before.vdNow, vdAfter: after.vdNow,
      week: wk ? { n: wk.n, done: wk.done, count: wk.count, actualKm: wk.actualKm, plannedKm: wk.plannedKm } : null
    };
  }

  function feedbackSkip(skip, before, after) {
    var s = before.sessions.filter(function (x) { return x.key === skip.key; })[0];
    var items = [];
    if (HEALTH[skip.reason]) {
      items.push({ tone: 'warn', title: skip.reason === 'malattia' ? 'Prima guarisci' : 'Prima il dolore deve passare', text: 'Riprendi solo quando stai bene. Per 7 giorni il piano propone solo corse facili e più corte, poi risale gradualmente.' });
      if (skip.reason === 'dolore') items.push({ tone: 'bad', title: 'Se dura più di 3 giorni', text: 'Senti un fisioterapista prima di riprendere i carichi.' });
    } else items.push({ tone: 'good', title: 'Non va recuperata', text: 'Aggiungere km per compensare è la via più rapida per infortunarsi. Il resto della settimana resta com\'è.' });
    if (s && s.adjType === 'qualita' && !HEALTH[skip.reason]) {
      var ven = after.sessions.filter(function (x) { return x.week === s.week && x.day === 'ven'; })[0];
      if (ven && ven.adjType === 'qualita') items.push({ tone: 'info', title: 'Il lavoro passa a venerdì', text: 'Venerdì fai ' + ven.adjDesc + ' al posto della corsa facile.' });
      else items.push({ tone: 'info', title: 'Lavoro saltato', text: 'Si riparte con il prossimo lavoro in calendario.' });
    }
    if (s && (s.adjType === 'lungo')) {
      var nl = after.sessions.filter(function (x) { return x.week === s.week + 1 && x.adjType === 'lungo'; })[0];
      if (nl) items.push({ tone: 'info', title: 'Il prossimo lungo', text: nl.adjKm < nl.baseKm ? 'Domenica prossima il lungo scende a ' + fmtKm(nl.adjKm) + ' km invece di ' + fmtKm(nl.baseKm) + ', per non fare salti troppo grandi.' : 'Domenica prossima resta di ' + fmtKm(nl.adjKm) + ' km.' });
    }
    if (s && s.type === 'test') items.push({ tone: 'info', title: 'Test non fatto', text: 'Puoi registrare una gara o una corsa a tutta come corsa extra: aggiorna la forma allo stesso modo.' });
    var delta = after.forecast.cont - before.forecast.cont;
    items.push({ tone: delta > 30 ? 'warn' : 'info', title: 'Previsione', text: Math.abs(delta) < 20 ? 'Previsione stabile: ' + fmtTime(after.forecast.cont, false) + '.' : 'Da ' + fmtTime(before.forecast.cont, false) + ' a ' + fmtTime(after.forecast.cont, false) + '. Se torni a seguire il piano, risale.' });
    return { items: items, title: s ? (s.adjType === s.type ? s.title : TYPE_TITLE[s.adjType]) : 'Corsa', session: s };
  }

  var api = {
    START: START, RACE: RACE, PHASES: PHASES, TESTS: TESTS, BASE: BASE, DAY_NAME: DAY_NAME, TYPE_TITLE: TYPE_TITLE,
    compute: compute, feedbackRun: feedbackRun, feedbackSkip: feedbackSkip, paceHint: paceHint,
    vdotFrom: vdotFrom, predictSec: predictSec, curveAt: curveAt,
    fmtPace: fmtPace, fmtTime: fmtTime, fmtKm: fmtKm, addDays: addDays, diffDays: diffDays, parse: parse, iso: iso, todayIso: todayIso,
    weekIndexOf: weekIndexOf
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Engine = api;
})(typeof window !== 'undefined' ? window : globalThis);
