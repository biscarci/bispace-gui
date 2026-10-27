import { useId, useState, type ReactNode } from "react";
import { Check, Lock } from "lucide-react";

import { useOnline } from "../lib/online";
import { FinestraConferma } from "./FinestraConferma";

/**
 * Flag di completamento. Casella quadrata da 30 px (44 px su smartphone e
 * tablet).
 * Vuota = da fare; verde con spunta = fatta; bordo tratteggiato con lucchetto = bloccata.
 * Un tocco la chiude; un secondo tocco chiede conferma e la riapre.
 * Bloccata, in sola lettura o senza connessione non si può toccare.
 */
interface Props {
  /** Titolo dell'attività: serve all'etichetta per lo screen reader. */
  titolo: string;
  fatta: boolean;
  bloccata?: boolean;
  /** Motivo del blocco, letto dallo screen reader (il testo visibile lo mostra la riga). */
  motivoBlocco?: string;
  /** Progetto non assegnato o profilo senza modifica. */
  solaLettura?: boolean;
  onCompleta: () => void;
  onRiapri: () => void;
  /** Cosa succede riaprendo. */
  effettoRiapertura?: ReactNode;
  /** Sempre 44 px (pagina Oggi). */
  grande?: boolean;
}

export function FlagCompletamento({
  titolo,
  fatta,
  bloccata = false,
  motivoBlocco,
  solaLettura = false,
  onCompleta,
  onRiapri,
  effettoRiapertura,
  grande = false,
}: Props) {
  const online = useOnline();
  const [conferma, setConferma] = useState(false);
  const idMotivo = useId();
  const inattivo = bloccata || solaLettura || !online;

  const etichetta = bloccata
    ? `Bloccata: ${titolo}`
    : fatta
      ? `Riapri: ${titolo}`
      : `Segna come completata: ${titolo}`;

  function tocca() {
    if (inattivo) return;
    if (fatta) setConferma(true);
    else onCompleta();
  }

  // 30 px da computer; 44 px al tocco, su smartphone e tablet (sotto i 1200 px).
  const dimensione = grande ? "size-11 rounded-[14px]" : "size-[30px] rounded-[10px] max-xl:size-11 max-xl:rounded-[14px]";
  const aspetto = bloccata
    ? "border-dashed border-rule text-brand-bright cursor-not-allowed"
    : fatta
      ? "border-ok bg-ok text-white"
      : "border-rule bg-surface hover:border-ink-faint";

  return (
    <>
      <button
        type="button"
        onClick={tocca}
        aria-label={etichetta}
        aria-pressed={fatta}
        aria-disabled={inattivo || undefined}
        aria-describedby={bloccata && motivoBlocco ? idMotivo : undefined}
        title={solaLettura && !bloccata ? "Sola lettura" : undefined}
        data-stato={bloccata ? "bloccata" : fatta ? "fatta" : "da_fare"}
        className={`grid shrink-0 place-items-center border-[1.5px] p-0 ${dimensione} ${aspetto} ${
          inattivo && !bloccata ? "cursor-not-allowed opacity-60" : ""
        }`}
      >
        {bloccata ? (
          <Lock size={grande ? 16 : 13} strokeWidth={2.2} aria-hidden />
        ) : fatta ? (
          <Check size={grande ? 20 : 15} strokeWidth={3} aria-hidden />
        ) : null}
      </button>
      {bloccata && motivoBlocco && (
        <span id={idMotivo} className="sr-only">
          {motivoBlocco}
        </span>
      )}
      <FinestraConferma
        aperta={conferma}
        titolo={`Riaprire «${titolo}»?`}
        descrizione={effettoRiapertura ?? "L'attività torna da fare. La chiusura precedente resta in cronologia."}
        etichettaConferma="Riapri"
        onAnnulla={() => setConferma(false)}
        onConferma={() => {
          setConferma(false);
          onRiapri();
        }}
      />
    </>
  );
}
