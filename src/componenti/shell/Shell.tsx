import { useEffect, useRef, useState, type ReactNode } from "react";
import { LogOut, Menu, Search, type LucideIcon } from "lucide-react";

import { formattaData, formattaOra } from "../../lib/formato";
import { useOnline } from "../../lib/online";
import { Avatar } from "../Avatar";
import { Collegamento } from "../Collegamento";
import { PannelloLaterale } from "../PannelloLaterale";
import { BarraOffline } from "../Stati";
import { Sovrapposizione } from "../Sovrapposizione";
import { voceAttiva, type UtenteShell, type VoceShell } from "../../lib/shell";
import { RicercaGlobale, type OpzioniRicerca } from "./RicercaGlobale";

interface Props {
  /** Percorso corrente (pathname), per evidenziare la voce attiva. */
  percorso: string;
  logo: ReactNode;
  /** Dove porta il logo (es. una pagina diversa da smartphone). */
  linkLogo?: string;
  /** Menu principale a pillola (da tablet e computer) e pillole delle sezioni da smartphone. */
  voci: VoceShell[];
  /** Barra flottante in basso da smartphone: al più 5 voci, poi "Altro". */
  vociBarra: VoceShell[];
  /** Contenuto del pannello "Altro" da smartphone (predefinito: le voci non nella barra). */
  vociAltro?: VoceShell[];
  /** Scorciatoie del binario a sinistra (da tablet e computer), tra la ricerca ed "Esci". */
  vociRapide?: VoceShell[];
  utente: UtenteShell;
  /** Ricerca globale: icona nel binario e pulsante tondo nell'intestazione da smartphone. */
  ricerca?: OpzioniRicerca;
  /** Pulsanti in più nell'intestazione, prima dell'avatar (es. la campanella delle notifiche). */
  strumenti?: ReactNode;
  onEsci?: () => void;
  /** Testo dopo il numero del badge per lo screen reader («Richieste, 3 da gestire»). */
  testoBadge?: string;
  children: ReactNode;
}

/**
 * Impaginazione dell'applicazione (stile "Tavola"):
 * - in alto: logo, menu principale a pillola e, a destra, data e ora, strumenti (es. campanella)
 *   e avatar che apre "Il mio profilo";
 * - a sinistra, da tablet e computer: binario chiaro con le azioni rapide (ricerca, scorciatoie, esci);
 * - computer ≥ 1400 px: menu sulla stessa riga del logo; 1200–1399 px: menu su una seconda riga;
 * - tablet 768–1199 px: menu di sole icone, il nome compare al passaggio, al tocco o al focus;
 * - smartphone < 768 px: intestazione con logo, ricerca, strumenti e avatar; sotto, le sezioni come
 *   pillole scorrevoli; in basso la barra flottante chiara con le voci della barra + "Altro".
 */
export function Shell({
  percorso,
  logo,
  linkLogo = "/",
  voci,
  vociBarra,
  vociAltro = voci.filter((v) => !vociBarra.some((b) => b.to === v.to)),
  vociRapide = [],
  utente,
  ricerca,
  strumenti,
  onEsci,
  testoBadge = "da gestire",
  children,
}: Props) {
  const [altroAperto, setAltroAperto] = useState(false);
  const [ricercaAperta, setRicercaAperta] = useState(false);

  const altroAttivo = vociAltro.some((v) => voceAttiva(v, percorso)) && !vociBarra.some((v) => voceAttiva(v, percorso));
  const titoloAvatar = utente.ruolo ? `${utente.nome} · ${utente.ruolo}` : utente.nome;

  return (
    <div className="min-h-dvh">
      <a
        href="#contenuto"
        className="sr-only z-50 rounded-full bg-surface px-4 py-2 shadow-sollevata focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Vai al contenuto
      </a>

      {/* Barra offline e intestazione nello stesso blocco: da smartphone resta ancorato
          in alto e scorrendo la barra non copre logo, ricerca e strumenti. */}
      <div className="z-30 max-md:sticky max-md:top-0 max-md:bg-ground/85 max-md:backdrop-blur-md">
        <BarraOffline />
        <header className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center gap-x-6 gap-y-3 px-4 py-2.5 md:px-6 md:pt-5 md:pb-3 xl:pr-8 xl:pl-[104px]">
          <Collegamento
            a={{ to: linkLogo }}
            className="order-1 inline-flex min-h-11 min-w-11 shrink-0 items-center rounded-2xl text-ink no-underline"
          >
            {logo}
          </Collegamento>

          {/* Menu principale a pillola. Nascosto da smartphone. */}
          <div className="order-2 hidden min-w-0 flex-1 justify-center md:flex xl:order-3 xl:basis-full 2xl:order-2 2xl:basis-0">
            <nav
              aria-label="Menu principale"
              className="focus-interno flex max-w-full items-center gap-0.5 rounded-full border border-white/70 bg-surface p-1 shadow-morbida xl:senza-barra xl:overflow-x-auto"
            >
              {voci.map((v) => (
                <VoceMenu key={v.to} voce={v} attiva={voceAttiva(v, percorso)} testoBadge={testoBadge} />
              ))}
            </nav>
          </div>

          <div className="order-2 ml-auto flex shrink-0 items-center gap-2 md:order-3 md:ml-0 xl:order-2 xl:ml-auto 2xl:order-3 2xl:ml-0">
            <Orologio />
            {ricerca && (
              <span className="md:hidden">
                <RicercaGlobale opzioni={{ ...ricerca, onApri: ricerca.onApri ?? (() => setRicercaAperta(true)) }} compatta />
              </span>
            )}
            {strumenti}
            {/* Nome accessibile dal contenuto (WCAG 2.5.3): «Il mio profilo: nome, ruolo».
                Le iniziali dell'avatar sono decorative; il nome completo compare al passaggio. */}
            <Collegamento
              a={{ to: utente.linkProfilo }}
              title={titoloAvatar}
              className="group relative inline-grid size-11 shrink-0 place-items-center rounded-full bg-surface text-ink no-underline shadow-pulsante hover:brightness-[0.98]"
            >
              <span className="sr-only">Il mio profilo: </span>
              <span aria-hidden className="inline-flex">
                <Avatar iniziali={utente.iniziali} nome={utente.nome} dimensione="lg" evidenza />
              </span>
              <span className="sr-only">
                {utente.nome}
                {utente.ruolo && `, ${utente.ruolo}`}
              </span>
            </Collegamento>
          </div>
        </header>
      </div>

      {/* Smartphone: le sezioni come pillole scorrevoli sotto l'intestazione. */}
      <SezioniSmartphone voci={voci} percorso={percorso} testoBadge={testoBadge} />

      {/* Binario delle azioni rapide (da tablet e computer). */}
      <aside
        aria-label="Azioni rapide"
        className="fixed top-1/2 left-4 z-20 hidden w-16 -translate-y-1/2 flex-col items-center gap-1.5 rounded-[32px] border border-rule-soft bg-surface/95 px-2.5 py-3 shadow-sollevata backdrop-blur-md md:flex"
      >
        {ricerca && (
          <>
            <AzioneBinario
              etichetta={ricerca.etichetta}
              suggerimento={ricerca.suggerimento ?? "Cerca"}
              icona={Search}
              onClick={() => setRicercaAperta(true)}
            />
            <span aria-hidden className="my-1 h-px w-7 bg-rule-soft" />
          </>
        )}
        {vociRapide.map((v) => (
          <AzioneBinario key={v.to} etichetta={v.etichetta} icona={v.icona} a={v.to} attiva={voceAttiva(v, percorso)} />
        ))}
        {onEsci && (
          <>
            {vociRapide.length > 0 && <span aria-hidden className="my-1 h-px w-7 bg-rule-soft" />}
            <AzioneBinario etichetta="Esci" icona={LogOut} onClick={onEsci} />
          </>
        )}
      </aside>

      <main
        id="contenuto"
        tabIndex={-1}
        className="mx-auto flex w-full max-w-[1600px] min-w-0 flex-col gap-6 px-4 pt-2 pb-32 outline-none md:pt-3 md:pr-6 md:pb-12 md:pl-[104px] xl:pr-8"
      >
        {children}
      </main>

      {/* Barra flottante da smartphone: icona ed etichetta per ogni voce.
          Il contenitore arriva al bordo dello schermo; la pillola bianca galleggia sopra. */}
      <nav
        aria-label="Navigazione"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-20 px-2.5 pb-[max(10px,env(safe-area-inset-bottom))] md:hidden"
      >
        <div className="focus-interno pointer-events-auto flex gap-0.5 rounded-[26px] border border-rule-soft bg-surface/95 p-1.5 shadow-sollevata backdrop-blur-md">
          {vociBarra.map((v) => {
            const attiva = voceAttiva(v, percorso);
            return (
              <Collegamento
                key={v.to}
                a={{ to: v.to }}
                aria-current={attiva ? "page" : undefined}
                className={`flex min-h-[52px] min-w-11 flex-[1_1_auto] flex-col items-center justify-center gap-[3px] rounded-[20px] px-1 text-xs font-semibold no-underline ${
                  attiva ? "bg-brand-soft text-brand-bright hover:text-brand-bright" : "text-ink-soft hover:bg-brand-wash hover:text-brand"
                }`}
              >
                <v.icona size={20} strokeWidth={1.8} aria-hidden />
                {v.etichetta}
              </Collegamento>
            );
          })}
          {(vociAltro.length > 0 || onEsci) && (
            <button
              type="button"
              onClick={() => setAltroAperto(true)}
              aria-haspopup="dialog"
              className={`flex min-h-[52px] min-w-11 flex-[1_1_auto] flex-col items-center justify-center gap-[3px] rounded-[20px] px-1 text-xs font-semibold ${
                altroAttivo ? "bg-brand-soft text-brand-bright" : "text-ink-soft hover:bg-brand-wash hover:text-brand"
              }`}
            >
              <Menu size={20} strokeWidth={1.8} aria-hidden />
              Altro
            </button>
          )}
        </div>
      </nav>

      <PannelloLaterale aperto={altroAperto} onChiudi={() => setAltroAperto(false)} titolo="Altro">
        <nav aria-label="Altre sezioni">
          <ul className="flex flex-col gap-0.5">
            {vociAltro.map((v) => (
              <li key={v.to}>
                <Collegamento
                  a={{ to: v.to }}
                  onClick={() => setAltroAperto(false)}
                  aria-current={voceAttiva(v, percorso) ? "page" : undefined}
                  className="flex min-h-12 items-center gap-3 rounded-2xl px-3 text-[15px] font-medium text-ink no-underline hover:bg-surface-2 hover:text-ink aria-[current=page]:bg-brand-soft aria-[current=page]:text-brand"
                >
                  <v.icona size={20} strokeWidth={1.8} aria-hidden className="shrink-0" />
                  <span className="flex-1">{v.etichetta}</span>
                  {!!v.badge && <span className="pillola bg-brand font-mono text-white">{v.badge}</span>}
                </Collegamento>
              </li>
            ))}
            {onEsci && (
              <li className="mt-2 border-t border-rule-soft pt-2">
                <button
                  type="button"
                  onClick={onEsci}
                  className="flex min-h-12 w-full items-center gap-3 rounded-2xl px-3 text-[15px] font-medium text-ink-soft hover:bg-surface-2"
                >
                  <LogOut size={20} strokeWidth={1.8} aria-hidden />
                  Esci
                </button>
              </li>
            )}
          </ul>
        </nav>
      </PannelloLaterale>

      {ricerca && <FinestraRicerca ricerca={ricerca} aperta={ricercaAperta} onChiudi={() => setRicercaAperta(false)} />}
    </div>
  );
}

/** Voce del menu principale: testo da computer, sola icona con nome a comparsa da tablet. */
function VoceMenu({ voce: v, attiva, testoBadge }: { voce: VoceShell; attiva: boolean; testoBadge: string }) {
  const numero = v.badge ?? 0;
  return (
    <Collegamento
      a={{ to: v.to }}
      aria-current={attiva ? "page" : undefined}
      className={`group relative flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-full text-sm font-medium whitespace-nowrap no-underline xl:min-h-10 xl:px-3.5 ${
        attiva ? "bg-brand-soft font-semibold text-brand hover:text-brand" : "text-ink-soft hover:bg-surface-2 hover:text-ink"
      }`}
    >
      <v.icona size={18} strokeWidth={1.8} aria-hidden className="shrink-0 xl:hidden" />
      <span className="sr-only xl:not-sr-only">{v.etichetta}</span>
      {numero > 0 && (
        <span
          aria-hidden
          className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1.5 font-mono text-xs font-bold text-white max-xl:absolute max-xl:-top-0.5 max-xl:-right-0.5 max-xl:px-1"
        >
          {numero}
        </span>
      )}
      {/* Nome accessibile dal contenuto (WCAG 2.5.3): «Richieste, 3 da gestire». */}
      {numero > 0 && (
        <span className="sr-only">
          , {numero} {testoBadge}
        </span>
      )}
      {/* Tablet: etichetta al passaggio, al tocco o al focus: regole in tema.css,
          perché group-hover di Tailwind vale solo con @media (hover: hover), mai sui touch. */}
      <span
        aria-hidden
        className="etichetta-menu pointer-events-none absolute top-full left-1/2 z-40 mt-2 hidden -translate-x-1/2 rounded-full bg-binario px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-white shadow-sollevata"
      >
        {v.etichetta}
      </span>
    </Collegamento>
  );
}

/** Icona del binario: link o pulsante tondo con il nome a comparsa (suggerimento) a destra. */
function AzioneBinario({
  etichetta,
  suggerimento,
  icona: Icona,
  a,
  attiva = false,
  onClick,
}: {
  etichetta: string;
  /** Testo a comparsa, se più breve del nome accessibile (deve esserne l'inizio, WCAG 2.5.3). */
  suggerimento?: string;
  icona: LucideIcon;
  a?: string;
  attiva?: boolean;
  onClick?: () => void;
}) {
  const classi = `group relative grid size-11 place-items-center rounded-full no-underline ${
    attiva ? "bg-brand-soft text-brand hover:text-brand" : "text-ink-soft hover:bg-brand-wash hover:text-brand"
  }`;
  const contenuto: ReactNode = (
    <>
      <Icona size={20} strokeWidth={1.8} aria-hidden />
      <span className="sr-only">{etichetta}</span>
      <span
        aria-hidden
        className="suggerimento pointer-events-none absolute top-1/2 left-full z-40 ml-4 -translate-y-1/2 rounded-full bg-binario px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-white shadow-sollevata"
      >
        {suggerimento ?? etichetta}
      </span>
    </>
  );
  if (a)
    return (
      <Collegamento a={{ to: a }} aria-current={attiva ? "page" : undefined} className={classi}>
        {contenuto}
      </Collegamento>
    );
  return (
    <button type="button" onClick={onClick} className={classi}>
      {contenuto}
    </button>
  );
}

/** Data, ora e stato della connessione in una pillola (solo su schermi larghi). */
function Orologio() {
  const online = useOnline();
  const [adesso, setAdesso] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setAdesso(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <span className="hidden h-11 items-center gap-2 rounded-full bg-surface px-4 text-[13px] font-semibold text-ink shadow-pulsante min-[1600px]:inline-flex">
      <span aria-hidden className={`size-2 rounded-full ${online ? "bg-ok" : "bg-brand"}`} />
      <span className="sr-only">{online ? "In linea" : "Offline"} · </span>
      <span className="font-mono">
        {formattaData(adesso)} · {formattaOra(adesso)}
      </span>
    </span>
  );
}

/** Pillole delle sezioni da smartphone: scorrono in orizzontale; quella attiva resta in vista. */
function SezioniSmartphone({ voci, percorso, testoBadge }: { voci: VoceShell[]; percorso: string; testoBadge: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const nodo = ref.current;
    const attiva = nodo?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!nodo || !attiva) return;
    nodo.scrollLeft = attiva.offsetLeft - (nodo.clientWidth - attiva.offsetWidth) / 2;
  }, [percorso]);
  return (
    <nav ref={ref} aria-label="Sezioni" className="focus-interno senza-barra flex gap-1 overflow-x-auto px-4 pt-1 pb-2 md:hidden">
      {voci.map((v) => {
        const attiva = voceAttiva(v, percorso);
        const numero = v.badge ?? 0;
        return (
          <Collegamento
            key={v.to}
            a={{ to: v.to }}
            aria-current={attiva ? "page" : undefined}
            className={`flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-medium whitespace-nowrap no-underline ${
              attiva ? "bg-brand-soft font-semibold text-brand hover:text-brand" : "text-ink-soft hover:text-ink"
            }`}
          >
            {v.etichetta}
            {numero > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1.5 font-mono text-xs font-bold text-white">
                {numero}
                <span className="sr-only"> {testoBadge}</span>
              </span>
            )}
          </Collegamento>
        );
      })}
    </nav>
  );
}

/** Finestra "Cerca" aperta dal binario: ricerca globale con il cursore già nel campo. */
function FinestraRicerca({ ricerca, aperta, onChiudi }: { ricerca: OpzioniRicerca; aperta: boolean; onChiudi: () => void }) {
  return (
    <Sovrapposizione aperta={aperta} onChiudi={onChiudi} idTitolo="titolo-ricerca-globale">
      <div className="flex flex-col gap-4 p-6">
        <h2 id="titolo-ricerca-globale" className="text-[17px] font-semibold">
          Cerca
        </h2>
        <RicercaGlobale opzioni={ricerca} className="w-full" onInviata={onChiudi} />
        {ricerca.descrizione && <p className="text-[13px] text-ink-faint">{ricerca.descrizione}</p>}
      </div>
    </Sovrapposizione>
  );
}
