# Maratona NYC 2027 · CLAUDE.md

Web app (PWA) personale di Simone per prepararsi alla Maratona di New York del 7 novembre 2027, con obiettivo massimo 4:30:00. Piano di 51 settimane, dal 16/11/2026 al 7/11/2027. Simone registra ogni corsa, il piano si adatta alle corse saltate, la previsione e l'obiettivo si aggiornano e ogni corsa riceve un feedback calcolato offline.

## Principi
- **Nessuna dipendenza e nessun backend.** HTML, CSS e JS vanilla. I dati stanno in `localStorage` (chiave `nycplan.v1`) sul telefono; il backup si fa da Impostazioni → Esporta (JSON).
- **Offline.** `public/sw.js` usa la strategia "rete prima, cache se offline". Alza `CACHE` (`nyc27-vN`) a ogni rilascio.
- **Aspetto Apple (iOS HIG).** Font di sistema (SF), colori di sistema iOS con tema chiaro e scuro, liste raggruppate, fogli dal basso, tab bar, anelli. Niente librerie UI.
- **Interfaccia in italiano**, numeri all'italiana (virgola decimale), ritmi in min/km.

## Struttura
```
src/index.html       interfaccia (CSS + JS inline): schede Oggi, Piano, Andamento, Diario e fogli modali
src/engine.js        motore puro con placeholder __PLAN__ (sostituito in build)
src/plan-data.json   le 51 settimane: [fase, mar, gio, ven, dom, nota], sessione = [km, descrizione]
build.py             copia src/ in public/ e inietta il piano dentro engine.js
public/              ciò che viene servito (index.html, engine.js, sw.js, manifest, icons/)
test-engine.js       scenari di prova del motore in Node (stampa a video, non asserisce)
Dockerfile, nginx.conf   immagine nginx:alpine per Coolify (porta 80)
```

## Comandi
```bash
python3 build.py                      # sempre, dopo ogni modifica a src/
node test-engine.js                   # scenari: piano seguito, malattia, settimane ferme, giovedì saltato, feedback
cd public && python3 -m http.server 8765   # prova in locale; ?oggi=2027-02-11 simula una data
docker build -t nyc27 . && docker run -p 8080:80 nyc27
```

## Motore (`engine.js`): regole da rispettare
- **Forma (VDOT, Daniels).** Media pesata delle stime per corsa: test ×4, gare o corse a tutta ×3, FC media ×0.6, sforzo percepito ×0.3, con decadimento di 21 giorni. Si aggiunge una stima "a priori": partenza personale + curva `CURVE` del piano × costanza, peso 1.2. Dopo 10 giorni senza corse la forma cala dello 0,3% al giorno, fino a un massimo del 7%.
- **Previsione.** `predict(VDOT + guadagno restante della curva × costanza 6 settimane) × 1.04` (margine prima maratona) × fattore di resistenza in base al lungo massimo delle settimane 41–50.
- **Adattamento.** Le corse saltate non si recuperano mai. Il giovedì di qualità saltato passa al venerdì della stessa settimana. Il tetto settimanale è `1.15 × max(km effettivi delle 3 settimane precedenti) + 2`, mai sotto il 50% del piano. Il tetto del lungo è `1.15 × corsa più lunga degli ultimi 21 giorni + 1.5`. Malattia o dolore attivano 7 giorni di prudenza: qualità sostituita da corsa facile, km × 0.8. Una sessione passata e non registrata conta come saltata ("missed").
- **Obiettivo.** Lo stato è `ok` / `warn` (+5 min) / `bad`. L'obiettivo realistico è la previsione arrotondata ai 5 minuti superiori. Il ritmo gara usa `max(obiettivo, previsione)`: dalla settimana 38 la previsione "se continui così", prima quella "se segui il piano".
- I test di controllo e i loro obiettivi stanno in `TESTS`: settimane 8, 20, 28 e 46.

## Convenzioni
- Modifica `src/`, poi lancia `build.py`. Non toccare a mano `public/index.html` e `public/engine.js`.
- Ogni modifica al motore va provata con `node test-engine.js` prima del commit.
- Non mettere nel repository dati personali o backup JSON di corse.
- Lo stato del lavoro in corso sta in `HANDOFF.md`, che è volatile; questo file resta stabile.
