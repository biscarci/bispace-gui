import type { ReactNode } from "react";

import type { TintaStato } from "../lib/toni";
import { Collegamento, type Destinazione } from "./Collegamento";

/**
 * Card pastello piena per lo stato di un elemento (richiesta, progetto, ripresa, tranche…),
 * nello stile delle comande di "Tavola": codice e badge in alto, titolo, riquadro interno
 * semitrasparente con il contenuto, numero grande in basso con una nota e un pulsante tondo.
 *
 * Tinte (TintaStato, TINTA_DA_TONO in lib/toni.ts): menta = ok/pronto/approvato, rosa = attenzione/ritardo/azione richiesta,
 * sabbia = nuovo/in attesa/cantiere, cielo = in corso, notte = chiuso/archiviato.
 * Dentro la tinta i grigi tenui diventano più scuri (classi .tinta-* in index.css): il testo
 * resta ≥ 4,5:1. Il colore non è mai l'unico segnale: mettere sempre lo stato a parole
 * (badge o `nota`).
 *
 *   <CardStato tinta="rosa" codice="F3-03" badge={<EtichettaStato tono="brand">2 gg di ritardo</EtichettaStato>}
 *     titolo="Residenza Bianchi" valore="€ 3.600" nota="In ritardo · 3ª fase"
 *     azione={<PulsanteTondo icona={ArrowUpRight} etichetta="Apri Residenza Bianchi" variante="vetro" a={...} />}>
 *     <ul>…</ul>
 *   </CardStato>
 */

interface Props {
  tinta: TintaStato;
  /** Codice in alto a sinistra (in Roboto Mono): "F3-03", "#1061". */
  codice?: ReactNode;
  /** Badge accanto al codice (tempo, stato). */
  badge?: ReactNode;
  /** Azioni in alto a destra (es. PulsanteTondo "…"). */
  menu?: ReactNode;
  titolo: ReactNode;
  /** Livello del titolo (predefinito h3). */
  livelloTitolo?: 2 | 3 | 4;
  /** Contenuto del riquadro interno semitrasparente (elenco, dettagli). */
  children?: ReactNode;
  /** Numero grande in basso (importo, percentuale, conteggio). */
  valore?: ReactNode;
  /** Nota a pillola sotto il valore (es. "Pronta · 7 attività"). */
  nota?: ReactNode;
  /** Pulsante tondo in basso a destra. */
  azione?: ReactNode;
  /** Tutta la card porta qui (il titolo diventa il link; alto 44 px sotto i 1200 px). */
  a?: Destinazione;
  className?: string;
}

export function CardStato({
  tinta,
  codice,
  badge,
  menu,
  titolo,
  livelloTitolo = 3,
  children,
  valore,
  nota,
  azione,
  a,
  className = "",
}: Props) {
  const Titolo = `h${livelloTitolo}` as const;
  const vetro = tinta === "notte" ? "bg-white/10" : "bg-white/45";
  return (
    <article
      data-tinta={tinta}
      className={`tinta-${tinta} relative flex min-w-0 flex-col gap-3 rounded-card p-4 shadow-morbida md:p-5 ${className}`}
    >
      {(codice || badge || menu) && (
        <div className="flex items-center gap-2">
          {codice && <span className="font-mono text-[13px] font-medium">{codice}</span>}
          {badge}
          {menu && <div className="ml-auto flex items-center gap-1.5">{menu}</div>}
        </div>
      )}
      <Titolo className="text-xl leading-tight font-semibold tracking-[-0.02em]">
        {a ? (
          <Collegamento
            a={a}
            className="text-inherit no-underline hover:text-inherit hover:underline max-xl:inline-flex max-xl:min-h-11 max-xl:items-center"
          >
            {titolo}
          </Collegamento>
        ) : (
          titolo
        )}
      </Titolo>
      {children && <div className={`rounded-interno px-3.5 py-3 text-sm ${vetro}`}>{children}</div>}
      {(valore !== undefined || nota || azione) && (
        <div className="mt-auto flex items-end gap-3 pt-1">
          <div className="flex min-w-0 flex-col items-start gap-1.5">
            {valore !== undefined && <span className="text-2xl leading-none font-bold tracking-[-0.02em]">{valore}</span>}
            {nota && <span className={`pillola font-medium ${vetro}`}>{nota}</span>}
          </div>
          {azione && <div className="ml-auto">{azione}</div>}
        </div>
      )}
    </article>
  );
}
