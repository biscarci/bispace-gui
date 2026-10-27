import { useState, type ReactNode } from "react";

import { useOnline } from "../lib/online";
import { FinestraConferma } from "./FinestraConferma";

/**
 * Interruttore Sì/No: due pulsanti uniti.
 * Sì selezionato = verde, No selezionato = colore di accento. Le risposte già registrate da altri
 * sono in sola lettura (`solaLettura`). Con `effettoNo` la risposta "No" chiede conferma
 * e dice cosa succederà.
 */
interface Props {
  /** Domanda o attività: etichetta del gruppo per lo screen reader. */
  titolo: string;
  /** True = Sì, false = No, null = senza risposta. */
  valore: boolean | null;
  onRispondi: (valore: boolean) => void;
  solaLettura?: boolean;
  /** Effetto della risposta "No" (es. "Il progetto torna all'approvazione. Revisioni: 2 su 2."). */
  effettoNo?: ReactNode;
  /** Contenuto in più nella conferma del No (es. scelta degli ambienti modificati). */
  contenutoConfermaNo?: ReactNode;
  confermaNoDisattivata?: boolean;
}

export function SiNo({
  titolo,
  valore,
  onRispondi,
  solaLettura = false,
  effettoNo,
  contenutoConfermaNo,
  confermaNoDisattivata = false,
}: Props) {
  const online = useOnline();
  const [conferma, setConferma] = useState(false);
  const inattivo = solaLettura || !online;

  function rispondi(v: boolean) {
    if (inattivo || v === valore) return;
    if (!v && effettoNo) setConferma(true);
    else onRispondi(v);
  }

  const base =
    // 30 px da computer, 44 px al tocco su smartphone e tablet (sotto i 1200 px).
    "min-h-[30px] min-w-11 rounded-full px-3 text-xs font-semibold max-xl:min-h-11 max-xl:min-w-12 disabled:cursor-not-allowed";

  return (
    <>
      <span
        role="group"
        aria-label={titolo}
        className={`focus-interno inline-flex shrink-0 gap-0.5 overflow-hidden rounded-full border border-rule bg-surface-2 p-0.5 ${inattivo ? "border-dashed" : ""}`}
      >
        <button
          type="button"
          aria-pressed={valore === true}
          disabled={inattivo}
          onClick={() => rispondi(true)}
          className={`${base} ${valore === true ? "bg-ok text-white" : "bg-transparent text-ink-soft hover:bg-surface"}`}
        >
          Sì
        </button>
        <button
          type="button"
          aria-pressed={valore === false}
          disabled={inattivo}
          onClick={() => rispondi(false)}
          className={`${base} ${valore === false ? "bg-brand text-white" : "bg-transparent text-ink-soft hover:bg-surface"}`}
        >
          No
        </button>
      </span>
      <FinestraConferma
        aperta={conferma}
        titolo={`Rispondere «No» a «${titolo}»?`}
        descrizione={effettoNo}
        etichettaConferma="Conferma il No"
        confermaDisattivata={confermaNoDisattivata}
        onAnnulla={() => setConferma(false)}
        onConferma={() => {
          setConferma(false);
          onRispondi(false);
        }}
      >
        {contenutoConfermaNo}
      </FinestraConferma>
    </>
  );
}
