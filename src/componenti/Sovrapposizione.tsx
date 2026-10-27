import { useEffect, useEffectEvent, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * Base comune di finestre modali e pannelli laterali: si apre sopra la pagina,
 * tiene il focus dentro (tastiera), si chiude con Esc o toccando fuori e
 * restituisce il focus all'elemento che l'ha aperta.
 */

const FOCALIZZABILI =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Sovrapposizioni aperte, dalla più vecchia alla più recente: tastiera solo per l'ultima (es. conferma sopra un pannello). */
const pila: object[] = [];

export type PosizioneSovrapposizione = "centro" | "destra";

interface Props {
  aperta: boolean;
  onChiudi: () => void;
  /** Id dell'elemento con il titolo (aria-labelledby). */
  idTitolo: string;
  idDescrizione?: string;
  /** "centro" = finestra; "destra" = pannello laterale (da smartphone sale dal basso a tutta larghezza). */
  posizione?: PosizioneSovrapposizione;
  /** Ruolo ARIA: "alertdialog" per le conferme. */
  ruolo?: "dialog" | "alertdialog";
  /** Falso per impedire la chiusura toccando fuori (es. moduli lunghi). */
  chiudiToccandoFuori?: boolean;
  className?: string;
  children: ReactNode;
}

export function Sovrapposizione({
  aperta,
  onChiudi,
  idTitolo,
  idDescrizione,
  posizione = "centro",
  ruolo = "dialog",
  chiudiToccandoFuori = true,
  className = "",
  children,
}: Props) {
  const riquadro = useRef<HTMLDivElement>(null);
  const chiudi = useEffectEvent(() => onChiudi());

  useEffect(() => {
    if (!aperta) return;
    const io = {};
    pila.push(io);
    const precedente = document.activeElement as HTMLElement | null;
    const nodo = riquadro.current;
    const iniziale =
      nodo?.querySelector<HTMLElement>("[data-autofocus]") ?? nodo?.querySelector<HTMLElement>(FOCALIZZABILI) ?? nodo;
    iniziale?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function tasto(e: KeyboardEvent) {
      if (pila[pila.length - 1] !== io) return;
      if (e.key === "Escape") {
        e.stopPropagation();
        chiudi();
        return;
      }
      if (e.key !== "Tab" || !nodo) return;
      const elementi = Array.from(nodo.querySelectorAll<HTMLElement>(FOCALIZZABILI));
      if (elementi.length === 0) {
        e.preventDefault();
        return;
      }
      const primo = elementi[0];
      const ultimo = elementi[elementi.length - 1];
      if (e.shiftKey && document.activeElement === primo) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primo.focus();
      }
    }
    document.addEventListener("keydown", tasto);
    return () => {
      document.removeEventListener("keydown", tasto);
      pila.splice(pila.indexOf(io), 1);
      document.body.style.overflow = overflow;
      precedente?.focus?.();
    };
  }, [aperta]);

  if (!aperta) return null;

  const contenitore =
    posizione === "destra"
      ? "items-end md:items-stretch md:justify-end"
      : "items-end justify-center md:items-center md:p-6";
  const forma =
    posizione === "destra"
      ? "max-h-[92dvh] w-full rounded-t-[28px] md:m-3 md:max-h-none md:h-[calc(100%-24px)] md:max-w-[460px] md:rounded-[28px]"
      : "max-h-[92dvh] w-full rounded-t-[28px] md:max-w-lg md:rounded-[28px]";

  return createPortal(
    <div
      className={`fixed inset-0 z-40 flex bg-binario/30 backdrop-blur-[3px] ${contenitore}`}
      onMouseDown={(e) => {
        if (chiudiToccandoFuori && e.target === e.currentTarget) onChiudi();
      }}
    >
      <div
        ref={riquadro}
        role={ruolo}
        aria-modal="true"
        aria-labelledby={idTitolo}
        aria-describedby={idDescrizione}
        tabIndex={-1}
        className={`flex flex-col overflow-y-auto border border-white/70 bg-surface shadow-sollevata outline-none ${forma} ${className}`}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
