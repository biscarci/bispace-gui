import { useId, type ReactNode } from "react";

import { Sovrapposizione } from "./Sovrapposizione";

/**
 * Finestra di conferma. Solo per azioni che riportano indietro o tolgono dati
 * (risposta "No", riapertura, pausa, rimozione di una competenza): dice cosa succederà,
 * es. "Il progetto torna all'approvazione. Revisioni: 2 su 2.".
 */
interface Props {
  aperta: boolean;
  titolo: string;
  /** Cosa succederà confermando. */
  descrizione: ReactNode;
  /** Contenuto in più (es. la scelta degli ambienti modificati). */
  children?: ReactNode;
  etichettaConferma?: string;
  etichettaAnnulla?: string;
  /** Pulsante di conferma in accento (azione che riporta indietro). Predefinito: sì. */
  pericolosa?: boolean;
  /** Disattiva la conferma (es. finché non si sceglie un ambiente). */
  confermaDisattivata?: boolean;
  inCorso?: boolean;
  onConferma: () => void;
  onAnnulla: () => void;
}

export function FinestraConferma({
  aperta,
  titolo,
  descrizione,
  children,
  etichettaConferma = "Conferma",
  etichettaAnnulla = "Annulla",
  pericolosa = true,
  confermaDisattivata = false,
  inCorso = false,
  onConferma,
  onAnnulla,
}: Props) {
  const id = useId();
  return (
    <Sovrapposizione
      aperta={aperta}
      onChiudi={onAnnulla}
      idTitolo={`${id}-t`}
      idDescrizione={`${id}-d`}
      ruolo="alertdialog"
    >
      <div className="flex flex-col gap-4 p-6 md:p-7">
        <h2 id={`${id}-t`} className="text-lg leading-tight font-semibold tracking-[-0.01em]">
          {titolo}
        </h2>
        <div id={`${id}-d`} className="text-sm text-ink-soft">
          {descrizione}
        </div>
        {children}
        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <button type="button" className="btn" onClick={onAnnulla} data-autofocus>
            {etichettaAnnulla}
          </button>
          <button
            type="button"
            className={pericolosa ? "btn btn-pri" : "btn"}
            onClick={onConferma}
            disabled={confermaDisattivata || inCorso}
          >
            {inCorso ? "Attendi…" : etichettaConferma}
          </button>
        </div>
      </div>
    </Sovrapposizione>
  );
}
