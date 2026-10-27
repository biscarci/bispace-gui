import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";

import {
  ContestoToastReact,
  DURATA_TOAST,
  DURATA_TOAST_ANNULLA,
  type OpzioniToast,
} from "../lib/toast";

/**
 * Messaggio di conferma (toast) e errori di salvataggio.
 * Compare in basso per 4 secondi (5 se offre "Annulla"); gli errori restano finché
 * non si chiudono. È una regione live: lo screen reader lo annuncia.
 */

interface ToastAttivo extends OpzioniToast {
  id: number;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [elenco, setElenco] = useState<ToastAttivo[]>([]);
  const prossimoId = useRef(1);

  const chiudi = useCallback((id: number) => setElenco((e) => e.filter((t) => t.id !== id)), []);

  const mostra = useCallback((opzioni: OpzioniToast | string) => {
    const o = typeof opzioni === "string" ? { messaggio: opzioni } : opzioni;
    const id = prossimoId.current++;
    // Al massimo tre toast insieme: i più vecchi lasciano il posto.
    setElenco((e) => [...e.slice(-2), { ...o, id }]);
    return id;
  }, []);

  const valore = useMemo(() => ({ mostra, chiudi }), [mostra, chiudi]);

  return (
    <ContestoToastReact.Provider value={valore}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-[104px] z-50 flex flex-col items-center gap-2 md:bottom-6 md:left-auto md:right-6 md:items-end"
      >
        {elenco.map((t) => (
          <VoceToast key={t.id} toast={t} chiudi={chiudi} />
        ))}
      </div>
    </ContestoToastReact.Provider>
  );
}

function VoceToast({ toast, chiudi }: { toast: ToastAttivo; chiudi: (id: number) => void }) {
  const { id } = toast;
  const onChiudi = () => chiudi(id);
  const tono = toast.tono ?? "info";
  const durata =
    toast.durata ?? (tono === "errore" ? 0 : toast.annulla ? DURATA_TOAST_ANNULLA : DURATA_TOAST);

  useEffect(() => {
    if (!durata) return;
    const timer = window.setTimeout(() => chiudi(id), durata);
    return () => window.clearTimeout(timer);
  }, [durata, id, chiudi]);

  const colori =
    tono === "errore"
      ? "bg-brand text-white"
      : tono === "ok"
        ? "bg-ok text-white"
        : "bg-binario text-white";

  return (
    <div
      role={tono === "errore" ? "alert" : "status"}
      className={`pointer-events-auto flex w-full max-w-md items-center gap-2 rounded-[22px] py-1.5 pr-3 pl-5 text-[13px] font-semibold shadow-sollevata ${colori}`}
    >
      <span className="flex-1">{toast.messaggio}</span>
      {toast.annulla && (
        <button
          type="button"
          className="min-h-11 min-w-11 rounded-full px-3 font-bold underline underline-offset-2 hover:bg-white/15"
          onClick={() => {
            toast.annulla?.();
            onChiudi();
          }}
        >
          Annulla
        </button>
      )}
      {toast.azione && (
        <button
          type="button"
          className="min-h-11 min-w-11 rounded-full px-3 font-bold underline underline-offset-2 hover:bg-white/15"
          onClick={() => {
            toast.azione?.esegui();
            onChiudi();
          }}
        >
          {toast.azione.etichetta}
        </button>
      )}
      <button
        type="button"
        aria-label="Chiudi il messaggio"
        className="-mr-1.5 grid size-11 shrink-0 place-items-center rounded-full hover:bg-white/15"
        onClick={onChiudi}
      >
        <X size={16} aria-hidden />
      </button>
    </div>
  );
}
