import { createContext, createElement, useContext, type AnchorHTMLAttributes, type ComponentType, type ReactNode } from "react";

/**
 * Collegamento della libreria al progetto che la usa: router, navigazione e testo degli errori.
 * Senza <ProviderUI> i link sono semplici <a href> e gli errori mostrano il testo predefinito.
 *
 *   <ProviderUI configurazione={{ Link: LinkRouter, useNaviga, messaggioErrore }}>…</ProviderUI>
 */

/**
 * Destinazione di un link scritta come semplice percorso: serve ai componenti generici
 * (riquadri, tabelle, notifiche) che ricevono la destinazione dall'esterno.
 * Esempio: `{ to: "/progetti/$id", params: { id: "12" }, search: { stato: "ritardo" } }`.
 */
export interface Destinazione {
  to: string;
  params?: Record<string, string | number>;
  search?: Record<string, string | number | boolean | undefined>;
}

export interface PropsLink extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  a: Destinazione;
  children?: ReactNode;
}

export interface ConfigurazioneUI {
  /** Componente link del router (es. adattatore del Link di TanStack Router). */
  Link?: ComponentType<PropsLink>;
  /** Hook che restituisce la funzione di navigazione (tocco sull'intera riga di una tabella). */
  useNaviga?: () => (a: Destinazione) => void;
  /** Frase da mostrare per un errore (es. letta dal corpo della risposta delle API). */
  messaggioErrore?: (errore: unknown, predefinito: string) => string;
}

export const ContestoUI = createContext<ConfigurazioneUI>({});

/** `{ to: "/progetti/$id", params: { id: 12 }, search: { q: "a" } }` → `/progetti/12?q=a`. */
export function href(a: Destinazione): string {
  const percorso = a.to.replace(/\$(\w+)/g, (_, nome: string) => encodeURIComponent(String(a.params?.[nome] ?? "")));
  const query = new URLSearchParams();
  for (const [k, v] of Object.entries(a.search ?? {})) if (v !== undefined) query.set(k, String(v));
  const testo = query.toString();
  return testo ? `${percorso}?${testo}` : percorso;
}

function LinkSemplice({ a, ...resto }: PropsLink) {
  return createElement("a", { href: href(a), ...resto });
}

function useNavigaSemplice() {
  return (a: Destinazione) => window.location.assign(href(a));
}

export function useConfigurazioneUI() {
  const c = useContext(ContestoUI);
  return {
    Link: c.Link ?? LinkSemplice,
    useNaviga: c.useNaviga ?? useNavigaSemplice,
    messaggioErrore: c.messaggioErrore ?? ((_errore: unknown, predefinito: string) => predefinito),
  };
}
