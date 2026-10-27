# @bispace/ui

Componenti React e tema Tailwind "Tavola" (chiaro, superfici bianche arrotondate, card pastello di
stato) condivisi dai gestionali Bispace. Nato dal gestionale ARK*, che è il primo progetto a usarlo.

Contiene il tema (`src/tema.css`): token, classi `.btn` `.card` `.campo` e font. Contiene i componenti
(`Shell`, `Tabella`, `Pulsante`, moduli, stati, card, pannelli, toast…) e alcune utilità (formati di
date e importi, link WhatsApp ed email, stato della connessione, larghezza del dispositivo). Guida di
stile: [STILE.md](STILE.md).

Il pacchetto si distribuisce come sorgente TypeScript, senza build: lo compila Vite del progetto che lo usa.

## Requisiti del progetto

React 19, Vite, Tailwind CSS 4 (`@tailwindcss/vite`), `lucide-react` e TypeScript con
`"moduleResolution": "bundler"`.

## Installazione

```bash
npm install github:biscarci/bispace-gui#v0.1.0
npm install react react-dom lucide-react tailwindcss @tailwindcss/vite
```

Il numero dopo `#` è la versione (tag git). Per aggiornare si installa il tag nuovo.

**`src/index.css`** del progetto:

```css
@import "tailwindcss";
@import "@bispace/ui/tema.css";

/* Colore di accento del progetto (predefinito: indaco). */
@theme {
  --color-brand: #7d0a0f;        /* accento: pulsante principale, link, focus, voce attiva */
  --color-brand-bright: #a3151b; /* testo in accento (≥ 4,5:1 su bianco e sui fondi tenui) */
  --color-brand-wash: #f7eaeb;   /* fondo tenue */
  --color-brand-soft: #f1dadb;   /* fondo della voce attiva e del filtro scelto */
  --color-brand-su-notte: #ffb3b6;     /* accento sulla card blu notte */
  --color-brand-wash-notte: #533549;
  --color-brand-soft-notte: #5e3a50;
}
```

Il tema dice da solo a Tailwind di leggere le classi dei componenti del pacchetto: non serve un `@source`.

**`vite.config.ts`**: una sola copia di React, anche quando il pacchetto è collegato in locale:

```ts
resolve: { dedupe: ["react", "react-dom", "lucide-react"] },
```

## Collegamento al router

I componenti con link (`Tabella`, `Riquadro`, `CardStato`, `Shell`…) ricevono destinazioni del tipo
`{ to: "/progetti/$id", params: { id: 12 }, search: { q: "a" } }`. Senza configurazione diventano
semplici `<a href>`. Con TanStack Router si collega così, in un componente che avvolge le pagine
(es. la route radice):

```tsx
import { Link, useNavigate } from "@tanstack/react-router";
import { ProviderUI, type ConfigurazioneUI, type Destinazione, type PropsLink } from "@bispace/ui";

const parametri = (a: Destinazione) =>
  a.params ? Object.fromEntries(Object.entries(a.params).map(([k, v]) => [k, String(v)])) : undefined;

function LinkRouter({ a, ...resto }: PropsLink) {
  return <Link to={a.to as "/"} params={parametri(a) as never} search={a.search as never} {...resto} />;
}

function useNaviga() {
  const navigate = useNavigate();
  return (a: Destinazione) => navigate({ to: a.to as "/", params: parametri(a) as never, search: a.search as never });
}

const CONFIGURAZIONE: ConfigurazioneUI = {
  Link: LinkRouter,
  useNaviga,
  // Facoltativo: frase da mostrare per un errore delle API (StatoErrore).
  messaggioErrore: (errore, predefinito) => (errore instanceof Error ? errore.message : predefinito),
};

export function ProviderApp({ children }: { children: React.ReactNode }) {
  return <ProviderUI configurazione={CONFIGURAZIONE}>{children}</ProviderUI>;
}
```

Per i toast serve anche `<ToastProvider>` intorno all'applicazione; poi `useToast().mostra("Salvato")`.

## Impaginazione

```tsx
import { Shell, type VoceShell } from "@bispace/ui";
import { FolderClosed, Home, LayoutDashboard } from "lucide-react";

const VOCI: VoceShell[] = [
  { etichetta: "Dashboard", to: "/", icona: LayoutDashboard },
  { etichetta: "Progetti", to: "/progetti", icona: FolderClosed, badge: 3 },
];

<Shell
  percorso={location.pathname}
  logo={<MioLogo />}
  voci={VOCI}
  vociBarra={[{ etichetta: "Oggi", to: "/oggi", icona: Home }, ...VOCI]}
  utente={{ nome: "Pina Esposito", iniziali: "PE", ruolo: "Titolare", linkProfilo: "/profilo" }}
  ricerca={{ etichetta: "Cerca", onCerca: (q) => navigate({ to: "/cerca", search: { q } }) }}
  onEsci={esci}
>
  <Outlet />
</Shell>
```

Esempio completo: il gestionale ARK* (`frontend/src/components/shell/Shell.tsx`).

## Sviluppo del pacchetto

```bash
npm install
npm run verifica      # tipi, lint e test
```

Per provare una modifica in un progetto prima di pubblicarla, dal progetto installa una copia locale:

```bash
npm install ../bispace-ui --install-links
```

Dopo la prova si torna alla versione pubblicata: `npm install github:biscarci/bispace-gui#vX.Y.Z`.
Un progetto non va pubblicato con il pacchetto installato dalla cartella locale: sul server di build
quella cartella non esiste.

Per pubblicare una versione nuova:

```bash
npm version minor     # o patch / major: aggiorna package.json e crea il tag
git push --follow-tags
```

Poi si aggiorna ogni progetto con `npm install github:biscarci/bispace-gui#vX.Y.Z`.

## Build in Docker (Railway)

`npm ci` scarica il pacchetto da GitHub. Se il repository è privato, il build ha bisogno di un token
(variabile `GITHUB_TOKEN` e `git config --global url."https://${GITHUB_TOKEN}@github.com/".insteadOf "ssh://git@github.com/"`
prima di `npm ci`). Con il repository pubblico non serve nulla oltre a `git` nell'immagine.
