import { COLORE_TONO, type Tono } from "../lib/toni";

/** Barra di avanzamento sottile e arrotondata, con percentuale in Roboto Mono. */
interface Props {
  percentuale: number;
  /** Colore della barra: info in progettazione, warn in cantiere, brand in ritardo. */
  tono?: Tono;
  /** Nasconde il numero accanto (resta per lo screen reader). */
  senzaNumero?: boolean;
  larghezza?: string;
}

export function BarraAvanzamento({ percentuale, tono = "info", senzaNumero = false, larghezza = "w-[90px]" }: Props) {
  const valore = Math.max(0, Math.min(100, Math.round(percentuale)));
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        role="progressbar"
        aria-valuenow={valore}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Avanzamento ${valore}%`}
        className={`block h-1.5 overflow-hidden rounded-full bg-surface-3 ${larghezza}`}
      >
        <span className={`block h-full rounded-full ${COLORE_TONO[tono]}`} style={{ width: `${Math.max(valore, 3)}%` }} />
      </span>
      {!senzaNumero && <span className="font-mono text-xs font-medium">{valore}%</span>}
    </span>
  );
}
