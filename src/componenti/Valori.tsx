import type { ReactNode } from "react";

import { formattaData, formattaDataOra, formattaImporto, formattaOra, type DataLike } from "../lib/formato";

/**
 * Date, ore, importi e numeri in Roboto Mono (§2.2). Le date hanno un <time>
 * con il valore ISO, così lo screen reader e il browser le capiscono.
 */
interface PropsData {
  valore: DataLike | null | undefined;
  conAnno?: boolean;
  /** Mostra anche l'ora (`19/10 · 14:30`). */
  conOra?: boolean;
  /** Data prevista (riprese): `~13/11`. */
  prevista?: boolean;
  className?: string;
}

export function Data({ valore, conAnno = false, conOra = false, prevista = false, className = "" }: PropsData) {
  if (!valore) return <span className={`font-mono text-xs text-ink-faint ${className}`}>—</span>;
  const testo = conOra ? formattaDataOra(valore) : formattaData(valore, conAnno);
  const iso = typeof valore === "string" ? valore : valore.toISOString();
  return (
    <time dateTime={iso} className={`font-mono text-xs ${className}`}>
      {prevista ? "~" : ""}
      {testo}
    </time>
  );
}

export function Ora({ valore, className = "" }: { valore: DataLike; className?: string }) {
  const iso = typeof valore === "string" ? valore : valore.toISOString();
  return (
    <time dateTime={iso} className={`font-mono text-xs ${className}`}>
      {formattaOra(valore)}
    </time>
  );
}

/** `€ 3.600`. Da non usare per OPERATIVO e COMUNICAZIONE: il server non manda proprio l'importo. */
export function Importo({ valore, className = "" }: { valore: number | string | null | undefined; className?: string }) {
  return <span className={`font-mono text-[13px] ${className}`}>{formattaImporto(valore)}</span>;
}

/** Numero o contatore in Roboto Mono. */
export function Numero({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`font-mono text-[13px] ${className}`}>{children}</span>;
}
