import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2, type LucideIcon } from "lucide-react";

import { useOnline } from "../lib/online";

/**
 * Pulsante a pillola. Principale: fondo colore di accento, testo bianco, uno per pagina.
 * Secondario: bianco con ombra leggera. Testo: solo scritta colore di accento. Altezza 40 px (44 su smartphone e tablet).
 * Per i pulsanti solo icona c'è <PulsanteTondo>.
 * Le classi `.btn` e `.btn-pri` di index.css si possono usare anche su link.
 *
 * senza connessione i pulsanti che salvano si disattivano. Salvano quelli principali,
 * quelli di invio e quelli che mostrano l'attesa (`inCorso`); `richiedeRete` lo forza
 * (true per un'azione che salva, false per chiudere, annullare o navigare).
 */
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: "principale" | "secondario" | "testo";
  icona?: LucideIcon;
  inCorso?: boolean;
  richiedeRete?: boolean;
  children?: ReactNode;
}

export function Pulsante({
  variante = "secondario",
  icona: Icona,
  inCorso,
  richiedeRete,
  children,
  className = "",
  disabled,
  type = "button",
  title,
  ...resto
}: Props) {
  const online = useOnline();
  const offline = !online && (richiedeRete ?? (variante === "principale" || type === "submit" || inCorso !== undefined));
  const classi =
    variante === "principale"
      ? "btn btn-pri"
      : variante === "testo"
        ? "inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-[13px] font-semibold text-brand-bright hover:bg-brand-wash max-xl:min-h-11"
        : "btn";
  return (
    <button
      type={type}
      className={`${classi} ${className}`}
      disabled={disabled || inCorso || offline}
      aria-busy={inCorso || undefined}
      title={offline ? "Sei offline: non si può salvare" : title}
      {...resto}
    >
      {inCorso ? <Loader2 size={16} className="animate-spin" aria-hidden /> : Icona ? <Icona size={16} aria-hidden /> : null}
      {children}
    </button>
  );
}
