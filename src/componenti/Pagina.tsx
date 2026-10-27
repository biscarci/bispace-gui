import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { CLASSI_TONO, type Tono } from "../lib/toni";
import { Collegamento, type Destinazione } from "./Collegamento";

/**
 * Intestazione dell'area di lavoro (restyle "Tavola"): titolo grande a sinistra, sotto
 * sottotitolo ed etichette; a destra la fila di indicatori (KPI) e le azioni della pagina.
 * Ricerca globale e campanella stanno nella shell (binario e intestazione), per tutte le pagine.
 * Nelle pagine di dettaglio il percorso riporta all'elenco.
 */
export interface VocePercorso {
  etichetta: string;
  /** Senza `to` è la pagina corrente. */
  to?: string;
}

export function Percorso({ voci }: { voci: VocePercorso[] }) {
  return (
    <nav aria-label="Percorso" className="text-[13px] font-medium text-ink-faint">
      <ol className="flex flex-wrap items-center gap-2">
        {voci.map((v, i) => (
          <li key={`${v.etichetta}-${i}`} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden>/</span>}
            {v.to ? (
              // Area toccabile di 44 px senza alzare la riga del percorso (margini negativi).
              <Collegamento
                a={{ to: v.to }}
                className="-my-3 inline-flex min-h-11 min-w-11 items-center text-ink-faint no-underline hover:text-brand-bright"
              >
                {v.etichetta}
              </Collegamento>
            ) : (
              <span aria-current="page" className="text-ink">
                {v.etichetta}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

interface Props {
  titolo: ReactNode;
  /** Riga sotto il titolo (data, settimana, conteggi). */
  sottotitolo?: ReactNode;
  percorso?: VocePercorso[];
  /** Etichette accanto al titolo (esperienza, percentuale). */
  etichette?: ReactNode;
  /** Fila di indicatori a destra del titolo: usare <IndicatoreTestata> (al più 3–4). */
  kpi?: ReactNode;
  /** Nome accessibile della fila di indicatori: la rende una regione (es. "Riepilogo"). */
  etichettaKpi?: string;
  /** Azione principale e secondarie (es. "+ Nuova richiesta"). */
  azioni?: ReactNode;
  /** @deprecated Ricerca e campanella sono nella shell: non ha più effetto. */
  senzaStrumenti?: boolean;
}

export function IntestazionePagina({ titolo, sottotitolo, percorso, etichette, kpi, etichettaKpi, azioni }: Props) {
  const ContenitoreKpi = etichettaKpi ? "section" : "div";
  return (
    <div className="flex flex-col gap-3">
      {percorso && <Percorso voci={percorso} />}
      <header className="flex flex-wrap items-center gap-x-10 gap-y-4">
        <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-1.5 xl:max-w-[440px] xl:flex-[0_1_auto]">
          <h1 className="text-[32px] leading-[1.05] font-semibold tracking-[-0.03em] text-balance md:text-[40px]">{titolo}</h1>
          {sottotitolo && <div className="text-sm text-ink-faint">{sottotitolo}</div>}
          {etichette && <div className="mt-1 flex flex-wrap items-center gap-2">{etichette}</div>}
        </div>
        {kpi && (
          <ContenitoreKpi
            aria-label={etichettaKpi}
            className="grid min-w-0 flex-[1_1_480px] grid-cols-2 gap-x-6 gap-y-4 md:gap-x-10 xl:flex xl:flex-wrap xl:items-center"
          >
            {kpi}
          </ContenitoreKpi>
        )}
        {azioni && <div className="ml-auto flex flex-wrap items-center gap-2">{azioni}</div>}
      </header>
    </div>
  );
}

/**
 * Indicatore dell'intestazione (fila di KPI accanto al titolo): icona in un cerchio bianco,
 * numero grande, badge a pillola facoltativo e descrizione grigia sotto. Con `a` è un link.
 *
 *   <IndicatoreTestata icona={FolderClosed} valore={31} descrizione="Progetti in corso"
 *     badge={{ testo: "4 in ritardo", tono: "brand" }} a={{ to: "/progetti", search: { stato: "ritardo" } }} />
 */
export function IndicatoreTestata({
  icona: Icona,
  valore,
  descrizione,
  badge,
  a,
  mono = false,
  tono,
}: {
  icona?: LucideIcon;
  /** Colore del gruppo nel cerchio dell'icona (es. info = progettazione); senza, cerchio bianco. */
  tono?: Tono;
  valore: ReactNode;
  descrizione: ReactNode;
  badge?: { testo: ReactNode; tono?: Tono };
  a?: Destinazione;
  /** Valore in Roboto Mono (importi, ore). */
  mono?: boolean;
}) {
  const contenuto = (
    <>
      {Icona && (
        <span
          aria-hidden
          className={`grid size-12 shrink-0 place-items-center rounded-full shadow-pulsante max-md:size-10 ${tono ? CLASSI_TONO[tono] : "bg-surface text-ink-soft"}`}
        >
          <Icona size={19} strokeWidth={1.8} />
        </span>
      )}
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="flex flex-wrap items-center gap-2">
          <span className={`text-[22px] leading-tight font-bold tracking-[-0.02em] text-ink ${mono ? "font-mono text-xl font-medium whitespace-nowrap" : ""}`}>
            {valore}
          </span>
          {badge && <span className={`pillola ${CLASSI_TONO[badge.tono ?? "neutro"]}`}>{badge.testo}</span>}
        </span>
        {/* Spazio tra numero e descrizione nel nome accessibile ("3 da sollecitare", non "3da sollecitare"). */}{" "}
        <span className="text-[13px] leading-snug text-ink-faint">{descrizione}</span>
      </span>
    </>
  );
  const classi = "flex min-w-0 items-center gap-3.5 text-inherit no-underline";
  if (a)
    return (
      <Collegamento a={a} className={`${classi} -m-1.5 rounded-[20px] p-1.5 hover:bg-surface/60`}>
        {contenuto}
      </Collegamento>
    );
  return <div className={classi}>{contenuto}</div>;
}

/**
 * Card con intestazione (riquadro): titolo piccolo in alto a sinistra; a destra contatori grigi
 * (`conteggio`) e azioni (pulsanti tondi, scelte segmentate). Superficie bianca da 26 px di raggio.
 */
export function Riquadro({
  titolo,
  id,
  azioni,
  conteggio,
  children,
  className = "",
  senzaPadding = false,
}: {
  titolo: ReactNode;
  /** Id del titolo (aria-labelledby): obbligatorio per avere una regione con nome. */
  id: string;
  azioni?: ReactNode;
  /** Contatori grigi a destra del titolo (es. "12 aperte · 2 pronte"). */
  conteggio?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Contenuto a filo (tabelle, elenchi con righe a tutta larghezza). */
  senzaPadding?: boolean;
}) {
  return (
    <section aria-labelledby={id} className={`card flex min-w-0 flex-col ${senzaPadding ? "pt-4 pb-2" : "p-5 md:p-6"} ${className}`}>
      <div className={`flex min-h-11 flex-wrap items-center gap-x-3 gap-y-2 ${senzaPadding ? "px-5 pb-3 md:px-6" : "pb-4"}`}>
        <h2 id={id} className="mr-auto text-base font-semibold tracking-[-0.01em]">
          {titolo}
        </h2>
        {conteggio !== undefined && <span className="text-[13px] font-medium text-ink-faint">{conteggio}</span>}
        {azioni && <div className="flex flex-wrap items-center gap-2">{azioni}</div>}
      </div>
      {children}
    </section>
  );
}
