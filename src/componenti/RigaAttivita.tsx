import type { ReactNode } from "react";
import { Lock } from "lucide-react";

import { TESTO_TONO, type Tono } from "../lib/toni";

/**
 * Riga di una checklist o della pagina Oggi: controllo (flag o Sì/No),
 * titolo da almeno 14 px, nota (regola rispettata o motivo del blocco),
 * data e autore in Roboto Mono.
 */
interface Props {
  controllo: ReactNode;
  titolo: ReactNode;
  /** Testo sotto il titolo (progetto, fase…). */
  sottotitolo?: ReactNode;
  nota?: ReactNode;
  tonoNota?: Tono;
  /** Data e autore, o scadenza ("01/10 · Gabriele", "entro 29/10"). */
  meta?: ReactNode;
  /** Meta in colore di accento (scadenza superata o bloccata). */
  metaInEvidenza?: boolean;
  /** Titolo attenuato (fatta o bloccata). */
  attenuata?: boolean;
  /** Azioni a destra (note, matita della rettifica…). */
  azioni?: ReactNode;
  /** Come elemento di elenco (<li>) o <div>. */
  come?: "li" | "div";
  className?: string;
}

export function RigaAttivita({
  controllo,
  titolo,
  sottotitolo,
  nota,
  tonoNota = "neutro",
  meta,
  metaInEvidenza = false,
  attenuata = false,
  azioni,
  come = "li",
  className = "",
}: Props) {
  const Tag = come;
  return (
    <Tag
      className={`flex items-center gap-3.5 border-t border-rule-soft px-5 py-3.5 hover:bg-surface-2/70 max-md:px-4 md:px-6 ${className}`}
    >
      {controllo}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className={`text-sm font-medium ${attenuata ? "text-ink-faint" : "text-ink"}`}>{titolo}</span>
        {sottotitolo && <span className="text-xs text-ink-faint">{sottotitolo}</span>}
        {nota && <span className={`text-xs font-semibold ${TESTO_TONO[tonoNota]}`}>{nota}</span>}
        {meta && (
          <span
            className={`font-mono text-xs md:hidden ${metaInEvidenza ? "font-semibold text-brand-bright" : "text-ink-faint"}`}
          >
            {meta}
          </span>
        )}
      </span>
      {meta && (
        <span
          className={`hidden font-mono text-xs whitespace-nowrap md:inline ${
            metaInEvidenza ? "font-semibold text-brand-bright" : "text-ink-faint"
          }`}
        >
          {meta}
        </span>
      )}
      {azioni}
    </Tag>
  );
}

/**
 * Elemento bloccato (PAG-06): riga con lucchetto, titolo attenuato e motivo
 * in colore di accento. Il flag non si può toccare. Il motivo arriva dal server già senza
 * importi per chi non vede i pagamenti.
 */
interface PropsBloccato {
  titolo: string;
  /** Es. "Bloccato: attende la contabile della 2ª tranche". */
  motivo: string;
  sottotitolo?: ReactNode;
  meta?: ReactNode;
  grande?: boolean;
  come?: "li" | "div";
  className?: string;
}

export function ElementoBloccato({ titolo, motivo, sottotitolo, meta, grande = false, come = "li", className }: PropsBloccato) {
  const dimensione = grande ? "size-11 rounded-[14px]" : "size-[30px] rounded-[10px] max-md:size-11 max-md:rounded-[14px]";
  return (
    <RigaAttivita
      come={come}
      className={className}
      controllo={
        <span
          role="img"
          aria-label={`Bloccata: ${titolo}`}
          className={`grid shrink-0 cursor-not-allowed place-items-center border-[1.5px] border-dashed border-rule text-brand-bright ${dimensione}`}
        >
          <Lock size={grande ? 16 : 13} strokeWidth={2.2} aria-hidden />
        </span>
      }
      titolo={titolo}
      attenuata
      sottotitolo={sottotitolo}
      nota={motivo}
      tonoNota="brand"
      meta={meta}
    />
  );
}
