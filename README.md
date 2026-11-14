# Maratona NYC 2027 · app di allenamento

Web app installabile su iPhone (icona nella schermata Home). Funziona offline: i dati restano sul telefono.

- **Oggi**: previsione del tempo in maratona, prossima corsa con ritmi, corse da registrare, settimana in corso.
- **Piano**: 51 settimane. Le settimane cambiate dopo corse saltate sono segnate come *Adattata*.
- **Andamento**: previsione nel tempo, forma stimata (VDOT), chilometri a settimana, ritmi aggiornati.
- **Diario**: tutte le corse con il loro feedback; + per aggiungere una corsa fuori piano o una gara.

## Pubblicare su Coolify (VPS Hostinger)

1. **Repository.** Crea un repository Git, anche privato (GitHub, GitLab o Gitea), e carica il contenuto di questa cartella così com'è, `Dockerfile` compreso.
2. **Risorsa.** In Coolify: *Projects* → il tuo progetto → *+ New* → *Private Repository (with GitHub App)*, oppure *Public Repository* → scegli il repository e il branch `main`.
3. **Build.** *Build Pack*: **Dockerfile**. *Ports Exposes*: **80**.
4. **Dominio.** In *Domains* inserisci per esempio `https://corsa.tuodominio.it`. Nel DNS (Hostinger o Cloudflare) crea un record **A** che punta all'IP del VPS. Coolify genera da solo il certificato HTTPS, che serve perché l'app funzioni offline. Con Cloudflare in modalità proxy, imposta SSL/TLS su *Full*.
5. **Deploy.** Al termine apri il dominio e controlla che l'app si carichi.

Per gli aggiornamenti basta un push sul repository: con l'auto deploy attivo Coolify ripubblica da solo.

## Installare su iPhone

1. Apri il dominio in **Safari**.
2. Tocca **Condividi** → **Aggiungi alla schermata Home**.
3. Apri l'app dall'icona: si avvia a schermo intero e funziona anche senza rete.

I dati sono salvati nel browser del telefono (localStorage) e non passano dal server. Da *Oggi* → icona impostazioni → **Esporta i dati** fai un backup in JSON, che puoi reimportare su un altro dispositivo.

## Promemoria su Google Calendar

Ogni sabato mattina le corse della settimana dopo compaiono in un calendario "Maratona NYC" (es. *Corsa facile · 5 km*) e alle 9:00 arriva una notifica con il riepilogo. Il calendario segue il piano di base: i km adattati li trovi nell'app.

1. Vai su [script.google.com](https://script.google.com) → **Nuovo progetto**.
2. Cancella il codice di esempio e incolla il contenuto di `calendario/promemoria.gs`. Salva.
3. In alto scegli la funzione **installa** → **Esegui** → autorizza con il tuo account Google.

Per fermarlo esegui **disinstalla**. Dopo ogni modifica a `promemoria.gs` va reincollato su script.google.com.

## Come ragiona l'app

- **Forma (VDOT).** Si stima con le formule di Jack Daniels. I test e le gare pesano molto. Le corse facili contano meno e usano FC media (se imposti la FC massima) o sforzo percepito. Le corse vecchie pesano sempre meno e dopo più di 10 giorni senza correre la forma cala.
- **Previsione.** Forma attuale più i progressi previsti dal piano, moltiplicati per la costanza delle ultime 6 settimane (km fatti rispetto a km previsti). Margine del 4% per la prima maratona e correzione se nella fase specifica mancano lunghi da 30 km.
- **Corse saltate.** Non si recuperano mai. Il giovedì di qualità saltato passa al venerdì della stessa settimana. Dopo settimane in difetto il volume riparte al massimo del 15% sopra il meglio delle ultime 3 settimane, e il lungo al massimo del 15% sopra la corsa più lunga recente. Con malattia o dolore scattano 7 giorni di prudenza: niente lavori e corse più corte.
- **Obiettivo.** Se la previsione supera l'obiettivo, l'app mostra l'obiettivo realistico. Nella fase specifica il ritmo gara si allinea al tempo che puoi davvero tenere.
- **Feedback.** Dopo ogni corsa: distanza rispetto al piano, ritmo rispetto alla tua zona del giorno, sforzo e FC, esito dei test, segnali di dolore, cosa cambia nella previsione.

## File

```
public/          l'app pubblicata
  index.html     interfaccia
  engine.js      calcoli (piano, adattamento, previsione, feedback)
  sw.js          funzionamento offline
  manifest.webmanifest, icons/
src/             sorgenti (build.py li copia in public/)
Dockerfile, nginx.conf
```

Per provare l'app in una data futura aggiungi all'indirizzo `?oggi=2027-03-15`.
