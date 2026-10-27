import { createContext, useContext } from "react";

/** Tipi e hook dei toast; il contenitore è components/Toast.tsx. */

export type TonoToast = "info" | "ok" | "errore";

export interface AzioneToast {
  etichetta: string;
  esegui: () => void;
}

export interface OpzioniToast {
  messaggio: string;
  tono?: TonoToast;
  /** "Annulla" per le chiusure: chiude il toast ed esegue la funzione. */
  annulla?: () => void;
  /** Un'azione diversa da "Annulla" (es. "Ricarica" sui conflitti). */
  azione?: AzioneToast;
  /** Millisecondi; 0 = resta finché non si chiude. */
  durata?: number;
}

export interface ContestoToast {
  mostra: (opzioni: OpzioniToast | string) => number;
  chiudi: (id: number) => void;
}

export const ContestoToastReact = createContext<ContestoToast | null>(null);

export const DURATA_TOAST = 4000;
export const DURATA_TOAST_ANNULLA = 5000;

/** `const toast = useToast(); toast.mostra("Chiusa alle 10:42 · registrata a tuo nome")`. */
export function useToast(): ContestoToast {
  const c = useContext(ContestoToastReact);
  if (!c) throw new Error("useToast va usato dentro <ToastProvider>");
  return c;
}
