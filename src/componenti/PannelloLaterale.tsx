import { useId, type ReactNode } from "react";
import { X } from "lucide-react";

import { Sovrapposizione } from "./Sovrapposizione";

/**
 * Pannello di dettaglio a destra (dettaglio di un elemento, nuovo inserimento, notifiche). Da smartphone sale dal basso a tutta larghezza.
 */
interface Props {
  aperto: boolean;
  titolo: ReactNode;
  sottotitolo?: ReactNode;
  onChiudi: () => void;
  /** Pulsanti in fondo (es. "Salva"), sempre visibili. */
  piede?: ReactNode;
  /** Falso per i moduli lunghi: non si chiude toccando fuori. */
  chiudiToccandoFuori?: boolean;
  children: ReactNode;
}

export function PannelloLaterale({
  aperto,
  titolo,
  sottotitolo,
  onChiudi,
  piede,
  chiudiToccandoFuori = true,
  children,
}: Props) {
  const id = useId();
  return (
    <Sovrapposizione
      aperta={aperto}
      onChiudi={onChiudi}
      idTitolo={`${id}-t`}
      posizione="destra"
      chiudiToccandoFuori={chiudiToccandoFuori}
    >
      <div className="sticky top-0 z-10 flex items-start gap-3 border-b border-rule-soft bg-surface px-6 pt-5 pb-4">
        <div className="min-w-0 flex-1 pt-1.5">
          <h2 id={`${id}-t`} className="text-lg leading-tight font-semibold tracking-[-0.01em]">
            {titolo}
          </h2>
          {sottotitolo && <div className="mt-1 text-[13px] text-ink-faint">{sottotitolo}</div>}
        </div>
        <button
          type="button"
          onClick={onChiudi}
          aria-label="Chiudi il pannello"
          className="btn-tondo size-11"
        >
          <X size={18} aria-hidden />
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-4 px-6 py-5">{children}</div>
      {piede && (
        <div className="sticky bottom-0 flex flex-wrap justify-end gap-2 border-t border-rule-soft bg-surface px-6 py-4">
          {piede}
        </div>
      )}
    </Sovrapposizione>
  );
}
