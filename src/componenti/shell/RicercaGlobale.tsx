import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";

/**
 * Ricerca globale dell'intestazione: un campo che passa il testo a `onCerca` (es. la pagina dei
 * risultati). `compatta` = pulsante tondo che chiama `onApri` (intestazione da smartphone).
 * `onInviata` avvisa dopo l'invio (la finestra "Cerca" del binario si chiude).
 */
export interface OpzioniRicerca {
  /** Nome accessibile del campo e del pulsante (es. "Cerca progetto, cliente, DL"). */
  etichetta: string;
  /** Testo a comparsa sull'icona del binario, se più breve dell'etichetta (deve esserne l'inizio). */
  suggerimento?: string;
  segnaposto?: string;
  /** Nota sotto il campo nella finestra "Cerca". */
  descrizione?: string;
  onCerca: (testo: string) => void;
  /** Pulsante compatto da smartphone; senza, apre la finestra "Cerca". */
  onApri?: () => void;
}

export function RicercaGlobale({
  opzioni,
  compatta = false,
  onInviata,
  className = "w-[280px] max-w-full",
}: {
  opzioni: OpzioniRicerca;
  compatta?: boolean;
  onInviata?: () => void;
  className?: string;
}) {
  const [testo, setTesto] = useState("");

  if (compatta)
    return (
      <button type="button" aria-label={opzioni.etichetta} onClick={opzioni.onApri} className="btn-tondo size-11">
        <Search size={18} strokeWidth={1.8} aria-hidden />
      </button>
    );

  function invia(e: FormEvent) {
    e.preventDefault();
    const q = testo.trim();
    if (!q) return;
    opzioni.onCerca(q);
    onInviata?.();
  }

  return (
    <form role="search" onSubmit={invia} className={className}>
      <label className="flex min-h-11 items-center gap-2.5 rounded-full border border-rule-soft bg-surface px-4 shadow-pulsante focus-within:border-brand has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-brand">
        <Search size={16} className="shrink-0 text-ink-faint" aria-hidden />
        <input
          type="search"
          value={testo}
          onChange={(e) => setTesto(e.target.value)}
          placeholder={opzioni.segnaposto ?? `${opzioni.etichetta}…`}
          aria-label={opzioni.etichetta}
          className="min-w-0 flex-1 border-0 bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
        />
      </label>
    </form>
  );
}
