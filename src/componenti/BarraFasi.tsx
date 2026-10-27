import { ETICHETTE_STATO_FASE, type StatoVisivoFase } from "../lib/fasi";

/**
 * Barra delle fasi: un segmento per fase con numero e nome breve sotto.
 * La fase in corso è in colore di accento e in grassetto.
 * Con `onSeleziona` i segmenti diventano pulsanti per aprire anche le fasi concluse.
 */
const COLORE_SEGMENTO: Record<StatoVisivoFase, string> = {
  conclusa: "bg-ok",
  in_corso: "bg-brand",
  ritardo: "bg-brand",
  da_fare: "bg-rule-soft",
  pausa: "tratteggio-pausa",
};

interface Props {
  fasi: StatoVisivoFase[];
  /** Nomi brevi delle fasi, nello stesso ordine di `fasi`. */
  nomi: readonly string[];
  /** Nome accessibile della barra. */
  etichetta?: string;
  /** Fase mostrata sotto (evidenziata con un bordo), se diversa da quella in corso. */
  selezionata?: number;
  onSeleziona?: (numero: number) => void;
}

export function BarraFasi({ fasi, nomi, etichetta: etichettaBarra = "Fasi", selezionata, onSeleziona }: Props) {
  return (
    <section aria-label={etichettaBarra} className="card px-4 pt-4 pb-3 md:px-5">
      <ol
        className="focus-interno senza-barra relative grid gap-1.5 overflow-x-auto pb-1"
        style={{ gridTemplateColumns: `repeat(${fasi.length}, minmax(76px, 1fr))` }}
      >
        {fasi.map((stato, i) => {
          const numero = i + 1;
          const attiva = stato === "in_corso" || stato === "ritardo" || stato === "pausa";
          const testo = attiva
            ? "font-bold text-brand-bright"
            : stato === "conclusa"
              ? "text-ink-soft"
              : "text-ink-faint";
          // Il nome accessibile comincia col testo visibile «N · Nome» e aggiunge lo stato.
          const etichetta = `${numero} · ${nomi[i]}: fase ${ETICHETTE_STATO_FASE[stato]}`;
          const contenuto = (
            <>
              <span className={`block h-2 rounded-full ${COLORE_SEGMENTO[stato]}`} aria-hidden />
              <span className={`text-xs ${testo}`}>
                {numero} · {nomi[i]}
              </span>
            </>
          );
          return (
            <li key={numero} data-stato={stato} aria-current={attiva ? "step" : undefined}>
              {onSeleziona ? (
                <button
                  type="button"
                  onClick={() => onSeleziona(numero)}
                  aria-label={etichetta}
                  aria-pressed={selezionata === numero}
                  className={`flex min-h-11 w-full flex-col gap-2 rounded-interno px-2 pt-2 pb-1.5 text-left hover:bg-surface-2 ${
                    selezionata === numero ? "bg-surface-2 ring-1 ring-rule" : ""
                  }`}
                >
                  {contenuto}
                </button>
              ) : (
                <span className="flex flex-col gap-2 px-2 pt-2 pb-1.5" title={etichetta}>
                  {contenuto}
                  <span className="sr-only">{ETICHETTE_STATO_FASE[stato]}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
