import { useSyncExternalStore } from "react";

/**
 * Larghezze di smartphone, tablet e computer. In CSS si usano le varianti di Tailwind:
 * `md:` = da tablet (≥ 768 px), `xl:` = da computer (≥ 1200 px, ridefinito in tema.css).
 */
export const LARGHEZZA_TABLET = 768;
export const LARGHEZZA_COMPUTER = 1200;

export type Dispositivo = "smartphone" | "tablet" | "computer";

const QUERY_SMARTPHONE = `(max-width: ${LARGHEZZA_TABLET - 0.02}px)`;
const QUERY_COMPUTER = `(min-width: ${LARGHEZZA_COMPUTER}px)`;

function corrisponde(query: string): boolean {
  return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia(query).matches;
}

export function dispositivoAttuale(): Dispositivo {
  if (corrisponde(QUERY_SMARTPHONE)) return "smartphone";
  return corrisponde(QUERY_COMPUTER) ? "computer" : "tablet";
}

function iscrivi(avvisa: () => void) {
  if (typeof window.matchMedia !== "function") return () => {};
  const elenco = [window.matchMedia(QUERY_SMARTPHONE), window.matchMedia(QUERY_COMPUTER)];
  elenco.forEach((m) => m.addEventListener("change", avvisa));
  return () => elenco.forEach((m) => m.removeEventListener("change", avvisa));
}

/** Solo per ciò che il CSS non basta a fare (es. aprire "Oggi" come prima pagina da smartphone). */
export function useDispositivo(): Dispositivo {
  return useSyncExternalStore(iscrivi, dispositivoAttuale, () => "computer");
}
