import { ETICHETTE_STATO_FASE, type StatoVisivoFase } from "../lib/fasi";

/**
 * Quadratini delle fasi: un quadrato per fase.
 * Il colore non è l'unico segnale: il gruppo ha un'etichetta per lo screen reader
 * e ogni quadratino mostra numero, nome e stato al passaggio del mouse.
 */
const CLASSI: Record<StatoVisivoFase, string> = {
  conclusa: "bg-ok",
  in_corso: "bg-info",
  ritardo: "bg-brand",
  da_fare: "bg-rule-soft",
  pausa: "tratteggio-pausa",
};

interface Props {
  fasi: StatoVisivoFase[];
  /** Nomi brevi delle fasi, nello stesso ordine di `fasi`. */
  nomi: readonly string[];
  /** Quadratini più piccoli (schede da smartphone). */
  piccoli?: boolean;
}

export function QuadratiniFasi({ fasi, nomi, piccoli = false }: Props) {
  const descrizione = riassunto(fasi, nomi);
  return (
    <span role="img" aria-label={descrizione} title={descrizione} className="inline-flex gap-[3px]">
      {fasi.map((stato, i) => (
        <span
          key={i}
          data-stato={stato}
          title={`Fase ${i + 1} · ${nomi[i]}: ${ETICHETTE_STATO_FASE[stato]}`}
          className={`block shrink-0 rounded-[5px] ${piccoli ? "size-3 rounded-[4px]" : "size-4"} ${CLASSI[stato]}`}
        />
      ))}
    </span>
  );
}

function riassunto(fasi: StatoVisivoFase[], nomi: readonly string[]): string {
  const concluse = fasi.filter((s) => s === "conclusa").length;
  const attive = fasi
    .map((s, i) => ({ s, i }))
    .filter(({ s }) => s === "in_corso" || s === "ritardo" || s === "pausa")
    .map(({ s, i }) => `${i + 1}ª ${nomi[i]} ${ETICHETTE_STATO_FASE[s]}`);
  return `Fasi concluse ${concluse} su ${fasi.length}${attive.length ? ` · ${attive.join(", ")}` : ""}`;
}
