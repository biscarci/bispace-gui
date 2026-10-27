import { useEffect, useState } from "react";
import { Download, Search } from "lucide-react";

/**
 * Filtri a pulsante sopra le tabelle e campo di ricerca.
 * Il valore scelto va messo nell'indirizzo della pagina: vedi `useFiltri` in lib/filtri.ts.
 */
export interface OpzioneFiltro<V extends string = string> {
  valore: V;
  etichetta: string;
  /** Contatore accanto all'etichetta. */
  numero?: number;
}

interface PropsFiltri<V extends string> {
  etichetta: string;
  opzioni: OpzioneFiltro<V>[];
  valore: V;
  onCambia: (valore: V) => void;
}

/** Gruppo di pillole a scelta singola ("Tutti", "Progettazione", "Cantiere"…): quella scelta in accento tenue. */
export function FiltriPulsante<V extends string>({ etichetta, opzioni, valore, onCambia }: PropsFiltri<V>) {
  return (
    <div role="group" aria-label={etichetta} className="flex flex-wrap gap-2">
      {opzioni.map((o) => {
        const attivo = o.valore === valore;
        return (
          <button
            key={o.valore}
            type="button"
            aria-pressed={attivo}
            onClick={() => onCambia(o.valore)}
            className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-[13px] font-semibold shadow-pulsante max-xl:min-h-11 ${
              attivo
                ? "border-brand-soft bg-brand-soft text-brand"
                : "border-rule-soft bg-surface text-ink-soft hover:bg-surface-2 hover:text-ink"
            }`}
          >
            {o.etichetta}
            {o.numero !== undefined && (
              <span
                className={`grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-xs font-semibold tabular-nums ${
                  attivo ? "bg-white/70 text-brand" : "bg-surface-2 text-ink-soft"
                }`}
              >
                {o.numero}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

interface PropsRicerca {
  valore: string;
  onCambia: (valore: string) => void;
  segnaposto?: string;
  etichetta?: string;
  /** Attesa prima di avvisare (ms), per non filtrare a ogni tasto. */
  attesa?: number;
  className?: string;
}

/** Campo di ricerca a pillola con lente; avvisa dopo una breve pausa nella digitazione. */
export function CampoRicerca({
  valore,
  onCambia,
  segnaposto = "Cerca…",
  etichetta = "Cerca",
  attesa = 250,
  className = "",
}: PropsRicerca) {
  const [testo, setTesto] = useState(valore);
  // Se il valore cambia da fuori (es. indietro nel browser) il campo si riallinea.
  const [ultimoValore, setUltimoValore] = useState(valore);
  if (valore !== ultimoValore) {
    setUltimoValore(valore);
    setTesto(valore);
  }
  useEffect(() => {
    if (testo === valore) return;
    const timer = window.setTimeout(() => onCambia(testo), attesa);
    return () => window.clearTimeout(timer);
  }, [testo, valore, onCambia, attesa]);

  return (
    <label
      className={`flex min-h-10 items-center gap-2.5 rounded-full border border-rule-soft bg-surface px-4 shadow-pulsante focus-within:border-brand has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-brand max-xl:min-h-11 ${className}`}
    >
      <Search size={15} className="shrink-0 text-ink-faint" aria-hidden />
      <input
        type="search"
        value={testo}
        onChange={(e) => setTesto(e.target.value)}
        placeholder={segnaposto}
        aria-label={etichetta}
        className="min-w-0 flex-1 border-0 bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
      />
    </label>
  );
}

/**
 * Menu a tendina a pillola nella fila dei filtri (collaboratore, progetto, tipo, periodo): stessa
 * forma di FiltriPulsante e CampoRicerca. L'etichetta resta solo per lo screen reader; `vuota`
 * è la prima voce ("Tutti i progetti"). Su smartphone occupa tutta la riga se `largoSuSmartphone`.
 */
export function SelettoreFiltro({
  etichetta,
  valore,
  onCambia,
  opzioni,
  vuota,
  largoSuSmartphone = true,
  className = "",
}: {
  etichetta: string;
  valore: string;
  onCambia: (valore: string) => void;
  opzioni: { valore: string; etichetta: string }[];
  /** Prima voce senza valore (es. "Tutti i progetti"); senza, si sceglie solo tra le opzioni. */
  vuota?: string;
  largoSuSmartphone?: boolean;
  className?: string;
}) {
  return (
    <label className={`flex min-w-0 ${largoSuSmartphone ? "max-md:flex-[1_1_100%]" : ""} ${className}`}>
      <span className="sr-only">{etichetta}</span>
      <select
        value={valore}
        onChange={(e) => onCambia(e.target.value)}
        className={`campo w-auto max-w-full truncate rounded-full border-rule-soft pl-4 text-[13px] font-semibold shadow-pulsante hover:bg-surface-2 ${valore ? "text-ink" : "text-ink-soft"} ${
          largoSuSmartphone ? "max-md:w-full" : ""
        }`}
      >
        {vuota !== undefined && <option value="">{vuota}</option>}
        {opzioni.map((o) => (
          <option key={o.valore} value={o.valore}>
            {o.etichetta}
          </option>
        ))}
      </select>
    </label>
  );
}

/** "Esporta Excel" a destra dei filtri (EXP-01): scarica dall'URL dell'API con gli stessi filtri. */
export function PulsanteEsporta({ href, etichetta = "Esporta Excel" }: { href: string; etichetta?: string }) {
  return (
    <a href={href} className="btn" download>
      <Download size={16} aria-hidden />
      {etichetta}
    </a>
  );
}
