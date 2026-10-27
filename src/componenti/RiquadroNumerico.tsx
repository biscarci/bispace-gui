import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { Collegamento, type Destinazione } from "./Collegamento";
import { CLASSI_TONO, COLORE_TONO, type Tono } from "../lib/toni";

/**
 * Riquadro numerico (KPI): card bianca con numero grande, descrizione sotto e
 * il colore del gruppo (filetto corto in alto, o l'icona in un cerchio del tono).
 * È cliccabile e apre l'elenco filtrato.
 * Per la fila di indicatori accanto al titolo della pagina c'è <IndicatoreTestata> (Pagina.tsx).
 */
interface Props {
  valore: ReactNode;
  descrizione: string;
  tono?: Tono;
  /** Icona in un cerchio del colore del tono (al posto del filetto). */
  icona?: LucideIcon;
  /** Badge a pillola accanto al numero (es. "+2 questa settimana"). */
  badge?: ReactNode;
  /** Dove porta il tocco. */
  a?: Destinazione;
  onClick?: () => void;
  /** Numero in Roboto Mono e colore accento (es. "110%" del carico). */
  mono?: boolean;
  compatto?: boolean;
}

export function RiquadroNumerico({
  valore,
  descrizione,
  tono = "info",
  icona: Icona,
  badge,
  a,
  onClick,
  mono = false,
  compatto = false,
}: Props) {
  const classi = `card relative flex flex-col text-inherit no-underline transition-shadow ${
    compatto ? "gap-1 rounded-[18px] px-3.5 py-3" : "gap-2.5 px-5 py-5 md:px-6"
  } ${a || onClick ? "hover:text-inherit hover:shadow-sollevata" : ""}`;
  const contenuto = (
    <>
      {Icona ? (
        <span aria-hidden className={`grid shrink-0 place-items-center rounded-full ${CLASSI_TONO[tono]} ${compatto ? "size-8" : "size-10"}`}>
          <Icona size={compatto ? 16 : 18} strokeWidth={1.8} />
        </span>
      ) : (
        <span aria-hidden className={`block h-1 rounded-full ${COLORE_TONO[tono]} ${compatto ? "w-6" : "w-9"}`} />
      )}
      <span className="flex flex-wrap items-center gap-2">
        <span
          className={
            mono
              ? `font-mono font-medium text-brand-bright ${compatto ? "text-lg" : "text-[30px] leading-none"}`
              : `leading-none font-bold tracking-[-0.03em] ${compatto ? "text-[22px]" : "text-[38px]"}`
          }
        >
          {valore}
        </span>
        {badge}
      </span>
      <span className={compatto ? "text-xs text-ink-faint" : "text-sm text-ink-soft"}>{descrizione}</span>
    </>
  );
  if (a)
    return (
      <Collegamento a={a} className={classi}>
        {contenuto}
      </Collegamento>
    );
  if (onClick)
    return (
      <button type="button" onClick={onClick} className={`${classi} text-left`}>
        {contenuto}
      </button>
    );
  return <div className={classi}>{contenuto}</div>;
}
