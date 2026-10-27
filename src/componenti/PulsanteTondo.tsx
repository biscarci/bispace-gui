import type { ButtonHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";

import { Collegamento, type Destinazione } from "./Collegamento";

/**
 * Pulsante tondo solo icona (+, ↗, …, ✓) delle intestazioni delle card e delle card pastello.
 * 40 px da computer, 44 px sotto i 1200 px. `etichetta` è il nome accessibile
 * e il suggerimento al passaggio. Con `a` diventa un link.
 *
 *   <PulsanteTondo icona={ArrowUpRight} etichetta="Apri l'elenco dei progetti" a={{ to: "/progetti" }} />
 *   <PulsanteTondo icona={Plus} etichetta="Nuovo appuntamento" onClick={apri} variante="scuro" />
 */
type Variante = "chiaro" | "scuro" | "principale" | "vetro";

const VARIANTI: Record<Variante, string> = {
  // Bianco con ombra (sulle card bianche e sullo sfondo).
  chiaro: "",
  // Blu notte pieno (azione sulle card pastello, come il "Fire" di una comanda).
  scuro: "border-binario bg-binario text-white hover:bg-binario-2 hover:text-white",
  principale: "border-brand bg-brand text-white shadow-brand hover:bg-brand-bright hover:text-white",
  // Bianco semitrasparente (sopra le card pastello).
  vetro: "border-white/60 bg-white/70 shadow-none hover:bg-white",
};

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  icona: LucideIcon;
  etichetta: string;
  variante?: Variante;
  a?: Destinazione;
  /** Grandezza dell'icona (predefinita 18). */
  dimensioneIcona?: number;
}

export function PulsanteTondo({ icona: Icona, etichetta, variante = "chiaro", a, dimensioneIcona = 18, className = "", type = "button", ...resto }: Props) {
  const classi = `btn-tondo ${VARIANTI[variante]} ${className}`;
  const icona = <Icona size={dimensioneIcona} strokeWidth={1.8} aria-hidden />;
  if (a)
    return (
      <Collegamento a={a} aria-label={etichetta} title={etichetta} className={classi}>
        {icona}
      </Collegamento>
    );
  return (
    <button type={type} aria-label={etichetta} title={etichetta} className={classi} {...resto}>
      {icona}
    </button>
  );
}
