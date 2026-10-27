import type { ReactNode } from "react";
import { Construction } from "lucide-react";

import { IntestazionePagina, type VocePercorso } from "./Pagina";

/**
 * Pagina provvisoria delle sezioni ancora da sviluppare: titolo, percorso e i requisiti
 * che la pagina dovrà coprire. Ogni rotta ha il suo file in src/routes/<area>/ che la sostituisce.
 */
export function Segnaposto({
  titolo,
  requisiti,
  descrizione,
  percorso,
  children,
}: {
  titolo: string;
  /** Codici SCR/FRS coperti dalla pagina. */
  requisiti: string;
  descrizione: string;
  percorso?: VocePercorso[];
  children?: ReactNode;
}) {
  return (
    <>
      <IntestazionePagina titolo={titolo} percorso={percorso} />
      <section className="card flex flex-col items-start gap-3 p-6">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft">
          <Construction size={18} aria-hidden /> Sezione in costruzione
        </span>
        <p className="max-w-2xl text-sm text-ink-soft">{descrizione}</p>
        <p className="font-mono text-xs text-ink-faint">{requisiti}</p>
        {children}
      </section>
    </>
  );
}
