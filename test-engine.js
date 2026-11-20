const E = require('./public/engine.js');
const T = E.fmtTime, K = E.fmtKm;
function st(runs=[], skips=[], settings={goal:16200}){ return {settings, runs, skips}; }
const first = {id:'r0', date:'2026-11-14', key:null, km:6.5, sec:2760, rpe:8};
function show(label, m){
  console.log(`\n== ${label} (oggi ${m.today})`);
  console.log(` VDOT ${m.vdNow.toFixed(2)}  prev. piano ${T(m.forecast.plan)}  continua ${T(m.forecast.cont)}  adh ${m.forecast.adherence.toFixed(2)} stato ${m.forecast.status} realistico ${T(m.forecast.realistic)} M ${E.fmtPace(m.paces.M[0])}-${E.fmtPace(m.paces.M[1])}`);
  console.log(` facile ${E.fmtPace(m.paces.easy[0])}-${E.fmtPace(m.paces.easy[1])} T ${E.fmtPace(m.paces.T)} I ${E.fmtPace(m.paces.I)}  next ${m.next && m.next.key} ${m.next && m.next.adjKm}  caution ${JSON.stringify(m.caution)}`);
}
function weeks(m, a, b){ m.weeks.slice(a-1,b).forEach(w=>console.log(`  W${w.n} base ${w.baseKm} plan ${w.plannedKm} act ${w.actualKm} ${w.adjusted?'ADJ':''} | `+w.sessions.map(s=>`${s.day}:${s.status[0]}:${K(s.adjKm)}${s.adjType!==s.type?'('+s.adjType+')':''}${s.notes.length?'*':''}`).join(' '))); }

// 1. oggi, solo la prima corsa
let m = E.compute(st([first]), '2026-11-14'); show('inizio', m); weeks(m,1,3);

// 2. segue il piano perfettamente per 10 settimane, con facili a RPE 4
let runs=[first];
E.BASE.filter(s=>s.week<=10).forEach((s,i)=>{ runs.push({id:'p'+i, date:s.date, key:s.key, km:s.baseKm, sec: Math.round(s.baseKm*480), rpe: s.type==='qualita'?7:4, testSec: s.type==='test'? 1890: null}); });
m = E.compute(st(runs), '2027-01-25'); show('piano seguito fino a W10 (5k 31:30)', m); weeks(m,9,13);

// 3. salta l'intera W11 e W12 (malattia)
let skips = E.BASE.filter(s=>s.week===11||s.week===12).map((s,i)=>({id:'k'+i,key:s.key,date:s.date,reason:'malattia'}));
m = E.compute(st(runs, skips), '2027-02-08'); show('malato W11-W12', m); weeks(m,11,16);

// 4. giovedì di qualità saltato per impegni, oggi venerdì
let runs4 = runs.slice(); 
m = E.compute(st(runs4, [{id:'x',key:'13-gio',date:'2027-02-11',reason:'impegni'}]), '2027-02-12'); weeks(m,13,13);

// 5. salta tre settimane in fase specifica senza registrare nulla
let runs5=[first]; E.BASE.filter(s=>s.week<=42).forEach((s,i)=>runs5.push({id:'q'+i,date:s.date,key:s.key,km:s.baseKm,sec:Math.round(s.baseKm*430),rpe:s.type==='qualita'?7:4,testSec:s.week===8?1900:s.week===20?3700:s.week===28?7900:null}));
m = E.compute(st(runs5), '2027-09-27'); show('nessuna corsa W43-W45', m); weeks(m,43,49);
m = E.compute(st(runs5), '2027-09-06'); show('stesso, a inizio W43', m);

// 6. feedback: corsa facile troppo veloce
let before = E.compute(st([first]), '2026-11-17');
let r = {id:'z', date:'2026-11-17', key:'1-mar', km:5, sec:5*420, rpe:6, feel:'ok'};
let after = E.compute(st([first, r]), '2026-11-17');
let fb = E.feedbackRun(r, before, after); console.log('\nFB', fb.score, fb.headline, fb.change); fb.items.forEach(i=>console.log('  ',i.tone, i.title,'|',i.text));
// feedback test
let pre = runs.filter(x=>!(x.key==='8-dom'));
before = E.compute(st(pre), '2027-01-10'); r = {id:'t', date:'2027-01-10', key:'8-dom', km:8, sec:3000, rpe:10, testSec:1980};
after = E.compute(st(pre.concat([r])), '2027-01-10'); fb = E.feedbackRun(r, before, after); console.log('\nFB test', fb.score, fb.headline, fb.change); fb.items.forEach(i=>console.log('  ',i.tone, i.title,'|',i.text));
let sk = {id:'s', key:'2-dom', date:'2026-11-29', reason:'impegni'};
before = E.compute(st([first]), '2026-11-29'); after = E.compute(st([first],[sk]), '2026-11-29');
console.log('\nSKIP', JSON.stringify(E.feedbackSkip(sk, before, after).items, null, 0));
console.log('history len', after.history.length);

// 7. con il test da sforzo (valori di esempio: VO2max 32, VT1 137, VT2 168)
const lab = {goal:16200, hrMax:179, hrRest:60, vo2max:32, vt1:137, vt2:168};
m = E.compute(st([first], [], lab), '2026-11-21'); show('test da sforzo, inizio', m);
console.log(' zone', JSON.stringify(m.paces.hr), 'test', m.sessions.filter(s=>s.type==='test').map(s=>s.week+':'+T(s.test.target)).join(' '));
console.log(' hint facile:', E.paceHint(m.sessions.find(s=>s.key==='2-mar'), m.paces), '| soglia:', E.paceHint(m.sessions.find(s=>s.key==='13-gio'), m.paces), '| test:', E.paceHint(m.sessions.find(s=>s.key==='8-dom'), m.paces));
let runsL=[first]; E.BASE.filter(s=>s.week<=42).forEach((s,i)=>runsL.push({id:'l'+i,date:s.date,key:s.key,km:s.baseKm,sec:Math.round(s.baseKm*470),hr:s.type==='qualita'?160:142,rpe:s.type==='qualita'?7:4}));
m = E.compute(st(runsL, [], lab), '2027-09-06'); show('test da sforzo, piano seguito fino a W42', m);
before = E.compute(st([first], [], lab), '2026-11-24');
r = {id:'h', date:'2026-11-24', key:'2-mar', km:5, sec:5*450, hr:152, rpe:4, feel:'ok'};
after = E.compute(st([first, r], [], lab), '2026-11-24'); fb = E.feedbackRun(r, before, after); console.log('\nFB FC alta', fb.score, fb.headline); fb.items.forEach(i=>console.log('  ',i.tone, i.title,'|',i.text));
r = Object.assign({}, r, {hr:143});
after = E.compute(st([first, r], [], lab), '2026-11-24'); fb = E.feedbackRun(r, before, after); console.log('FB FC in zona', fb.score, fb.headline); fb.items.forEach(i=>console.log('  ',i.tone, i.title,'|',i.text));
