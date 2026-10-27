# Guida di stile "Tavola" (@bispace/ui)

Aspetto chiaro ispirato alla versione chiara del template "Tavola" (solo forme e impaginazione,
nessun codice, immagine o testo copiato). Token e classi in `src/tema.css`, componenti in `src/componenti`.
Ogni progetto sceglie il proprio colore di accento ridefinendo i token `--color-brand*` (vedi README).

## Regole in breve

- Solo tema chiaro. Font **Urbanist** per tutto; **Roboto Mono** (`font-mono`) per date, ore,
  importi, percentuali e codici. I caratteri `ª º` sono corretti da un font di sistema.
- Sfondo grigio-azzurro con alone (lo dà la pagina: non mettere fondi alle schermate).
- Superfici bianche grandi: classe `.card` (raggio 26 px, ombra morbida, bordo quasi invisibile).
  Dentro una card i riquadri interni usano `.card-interna` (16 px, `bg-surface-2`).
- Pulsanti, filtri, badge e campi di ricerca **a pillola** (`rounded-full`). Campi dei moduli 14 px (`.campo`).
- Colore di accento: voce attiva, pulsante principale (uno per pagina), link, focus, allarmi/ritardi.
- Stati: card pastello piene (`CardStato`) o etichette a pillola (`EtichettaStato`). Il colore non è
  mai l'unico segnale: sempre anche la parola o l'icona.
- Accessibilità: testo ≥ 4,5:1, focus 2 px nel colore di accento, bersagli ≥ 44 px sotto 1200 px
  (`max-xl:size-11`, `max-md:min-h-11`), testo minimo `text-xs`, non cambiare nomi accessibili,
  etichette, testi dei pulsanti, `aria-*` (i test end-to-end li usano).

## Token (`@theme` in `src/tema.css`)

| Token | Valore | Uso |
|---|---|---|
| `ground` | #eef1f6 | sfondo pagina (con alone) |
| `surface` / `surface-2` / `surface-3` | #fff / #f3f5f9 / #e8ecf2 | card · hover, campi, riquadri interni · chip neutri, binari delle barre |
| `side` | #e6eaf1 | vassoi e colonne (es. colonne della bacheca) |
| `rule` / `rule-soft` | #d6dce5 / #e8ecf2 | bordi di campi · separatori di righe |
| `ink` / `ink-soft` / `ink-faint` | #1b1f29 / #454c59 / #5f6676 | testo · descrizioni · metadati (≥ 5:1 su bianco, ground, *-wash) |
| `brand` / `brand-bright` | #3a2f9e / #4a3fc0 (predefiniti, indaco) | accento, testo accento |
| `brand-wash` / `brand-soft` | #eeedfa / #e0def6 | fondo accento tenue · voce attiva e filtro scelto (testo `text-brand`) |
| `ok`, `warn`, `info` + `*-wash` | verde, ocra, blu | colori di stato |
| `menta`, `rosa`, `sabbia`, `cielo`, `notte` (+ `-chiaro`) | pastelli | card di stato (usare `CardStato`, non i colori a mano) |
| `binario` / `binario-2` | #262f43 / #343e55 | blu notte di servizio: tooltip, toast, pulsante tondo scuro |
| `rounded-card` / `rounded-interno` / `rounded-campo` | 26 / 16 / 14 px | card · riquadri interni · campi |
| `shadow-morbida` / `shadow-sollevata` / `shadow-pulsante` / `shadow-brand` | | card · pannelli e menu flottanti · pulsanti bianchi · pulsante principale |
| `2xl` | 1400 px | punto di rottura in più (menu principale sulla riga del logo) |

Punti di rottura: smartphone `< md` (768), tablet `md`–`xl` (1200), computer `xl+`.

## Classi (in `@layer components` / `utilities`)

| Classe | Cosa fa |
|---|---|
| `.card` | superficie bianca grande (26 px, ombra morbida) |
| `.card-interna` | riquadro interno grigio chiarissimo (16 px) |
| `.btn` | pulsante secondario a pillola bianco (40 px, 44 sotto i 1200 px) — anche su `<a>` |
| `.btn .btn-pri` | pulsante principale nel colore di accento |
| `.btn-tondo` | pulsante tondo solo icona (40 px, 44 sotto 1200 px): **serve `aria-label`** (meglio `<PulsanteTondo>`) |
| `.campo` | campo di modulo (input, select con freccia disegnata, textarea) |
| `.lbl` | etichetta maiuscola piccola (intestazioni di colonna e sezione) |
| `.pillola` | forma di badge a pillola (colore a parte, es. `CLASSI_TONO[tono]`) |
| `.tinta-menta/-rosa/-sabbia/-cielo/-notte` | fondo pastello con testo leggibile (i grigi e i colori di stato si scuriscono; in `notte` diventano chiari) |
| `.senza-barra` | scorrimento orizzontale senza barra visibile (`@utility`, ammette varianti) |
| `.focus-interno` | il contorno del focus si disegna all'interno (contenitori con overflow) |
| `.suggerimento` | tooltip che compare al passaggio/tocco/focus del `.group` padre (testo `aria-hidden`) |
| `.tratteggio-pausa/-assenza/-attesa` | motivi grafici di stato (invariati) |

Toni (`src/lib/toni.ts`): `CLASSI_TONO` (fondo tenue + testo), `COLORE_TONO` (pieno), `TESTO_TONO`,
`TINTA_DA_TONO` (ok → menta, brand → rosa, warn → sabbia, info → cielo, neutro → notte).

## Componenti (importare da `"@bispace/ui"`)

### Impaginazione
- **Shell**`({ percorso, logo, voci, vociBarra, vociAltro?, vociRapide?, utente, ricerca?, strumenti?, onEsci?, children })`:
  logo, menu principale a pillola in alto, a destra data/ora (≥ 1600 px), `strumenti` (es. campanella)
  e avatar → "Il mio profilo"; a sinistra il binario chiaro delle azioni rapide (ricerca, `vociRapide`,
  Esci); da smartphone intestazione + pillole delle sezioni + barra flottante chiara in basso con
  `vociBarra` e "Altro". Le voci (`VoceShell`: etichetta, to, icona, prefissi?, badge?) le sceglie il
  progetto, già filtrate per profilo. Ricerca globale e campanella non vanno messe nelle pagine.
- `IntestazionePagina({ titolo, sottotitolo?, percorso?, etichette?, kpi?, azioni? })`: titolo grande
  (40 px, va a capo da solo), a destra la fila `kpi` e le `azioni`. `senzaStrumenti` non serve più.
- `IndicatoreTestata({ icona?, valore, descrizione, badge?: { testo, tono? }, a?, mono? })`: KPI
  dell'intestazione (icona in cerchio bianco, numero grande, badge a pillola, descrizione grigia).
  Da smartphone e tablet vanno in griglia a 2 colonne da soli; da computer in fila.
- `Riquadro({ id, titolo, conteggio?, azioni?, senzaPadding?, className? })`: card con titolo
  piccolo a sinistra, a destra contatori grigi e azioni (pulsanti tondi, `SceltaSegmentata`).
  `id` obbligatorio (regione con nome).
- `Percorso({ voci })`: percorso di ritorno all'elenco nelle pagine di dettaglio.

### Pulsanti e controlli
- `Pulsante({ variante: "principale" | "secondario" | "testo", icona?, inCorso?, richiedeRete? })`.
- `PulsanteTondo({ icona, etichetta, variante?: "chiaro" | "scuro" | "principale" | "vetro", a?, dimensioneIcona?, onClick… })`:
  `etichetta` = nome accessibile + tooltip. `vetro` sopra le card pastello, `scuro` = azione forte su pastello.
- `SceltaSegmentata({ etichetta, opzioni, valore, onCambia, nome?, etichettaNascosta? })`: pillole
  dentro un binario grigio (es. "Bacheca | Elenco" nell'intestazione di una card con `etichettaNascosta`).
- `FiltriPulsante({ etichetta, opzioni: { valore, etichetta, numero? }[], valore, onCambia })`:
  pillole bianche, quella scelta in accento tenue con contatore.
- `CampoRicerca({ valore, onCambia, segnaposto?, etichetta? })`: ricerca a pillola.
- `PulsanteEsporta({ href })`, `SiNo` (pillola con Sì verde / No nel colore di accento), `FlagCompletamento`,
  `CampoTesto/Data/Ora/Selezione`, `AreaTesto`.

### Stato e dati
- `CardStato({ tinta, codice?, badge?, menu?, titolo, livelloTitolo?, children?, valore?, nota?, azione?, a?, className? })`:
  card pastello piena (stile "comanda"): codice mono + badge in alto, titolo, riquadro interno
  semitrasparente (`children`), numero grande + nota a pillola, pulsante tondo in basso a destra.
  Con `a` il titolo diventa il link.
- `EtichettaStato({ tono?, mono?, titolo?, piena?, className? })`: badge a pillola; `piena` = fondo
  pieno e testo bianco (allarmi).
- `RiquadroNumerico({ valore, descrizione, tono?, icona?, badge?, a?, onClick?, mono?, compatto? })`:
  card KPI bianca con filetto corto del tono (o icona nel cerchio del tono).
- `Avatar({ iniziali, nome, dimensione?: "sm" | "md" | "lg", evidenza? })`, `GruppoAvatar`.
- `BarraAvanzamento({ percentuale, tono?, senzaNumero?, larghezza? })`: sottile, arrotondata.
- `QuadratiniFasi({ fasi, nomi, piccoli? })`, `BarraFasi({ fasi, nomi, etichetta?, selezionata?, onSeleziona? })`:
  un elemento per fase, stato `StatoVisivoFase` (conclusa, in_corso, ritardo, da_fare, pausa).
- `ProssimoPasso`, `ContatoreLimite`, `RigaAttivita`, `ElementoBloccato`.
- `Tabella({ etichetta, colonne, righe, chiaveRiga, linkRiga?, onApriRiga?, … })`: righe da 60 px senza
  griglia pesante, intestazioni `.lbl`; su smartphone schede (o scorrimento con `suSmartphone="scorri"`).
- `PannelloLaterale` (flottante, 28 px), `FinestraConferma`, `Toast` (blu notte, sopra la barra in
  basso), `StatoVuoto`/`StatoErrore` (icona in cerchio), `SagomaRighe`/`SagomaRiquadri`,
  `MessaggioErrore`, `AvvisoSolaLettura`, `BarraOffline` (pillola fissa in alto da tablet/computer).
- `PulsanteWhatsApp`, `PulsanteEmail`, `ChatWhatsApp`, `NumeroTelefono`, `IndirizzoEmail`: messaggi e recapiti.
- `Data`, `Ora`, `Importo`, `Numero`: valori formattati in Roboto Mono (formati in `src/lib/formato.ts`).

## Ricette

```tsx
<IntestazionePagina
  titolo="Richieste"
  sottotitolo="17 aperte · settimana 43"
  kpi={<>
    <IndicatoreTestata icona={Inbox} valore={17} descrizione="Richieste aperte" badge={{ testo: "3 da sollecitare", tono: "brand" }} />
    <IndicatoreTestata icona={Euro} valore="€ 3.600" mono descrizione="Preventivi inviati" />
  </>}
  azioni={<Pulsante variante="principale" icona={Plus}>Nuova richiesta</Pulsante>}
/>

<Riquadro id="h-oggi" titolo="Da gestire" conteggio="12 aperte · 2 pronte"
  azioni={<><PulsanteTondo icona={Plus} etichetta="Nuovo appuntamento" onClick={apri} />
           <PulsanteTondo icona={ArrowUpRight} etichetta="Apri il calendario" a={{ to: "/calendario" }} /></>}>
  <div className="grid gap-4 sm:grid-cols-2">
    <CardStato tinta={TINTA_DA_TONO[tono]} codice="P-03" titolo={p.nome} valore={`${p.percentuale}%`} nota={testo} a={{ to: "/progetti/$id", params: { id: p.id } }}>
      …
    </CardStato>
  </div>
</Riquadro>
```

Griglie di card: `grid gap-4 md:gap-5`, colonne `sm:grid-cols-2 xl:grid-cols-3`; spazio tra blocchi
della pagina già dato da `main` (`gap-6`).

## Da evitare
- Colori esadecimali o grigi Tailwind standard (`gray-*`, `slate-*`): solo token.
- `rounded-md/lg` su card e pulsanti (usare `rounded-card`, `rounded-interno`, `rounded-full`).
- Bordi pesanti e griglie di tabella; ombre `shadow-lg/xl` (usare quelle del tema).
- `text-ink-faint` su fondi pastello fuori da `.tinta-*` (contrasto < 4,5:1); testo più piccolo di `text-xs`.
- Duplicare ricerca globale o campanella nelle pagine; aggiungere link con nomi uguali a voci del menu.
- Tema scuro e interruttori di tema (il tema è solo chiaro).
- Copiare testi, immagini o icone di Tavola: icone solo da `lucide-react`.
