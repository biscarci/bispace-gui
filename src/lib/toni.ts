/**
 * Colori di stato e loro classi Tailwind, condivisi dai componenti.
 * ok = concluso/approvato, info = in corso, warn = cantiere/in attesa,
 * brand = ritardo/blocco/azione richiesta, neutro = da fare/in pausa.
 */
export type Tono = "ok" | "info" | "warn" | "brand" | "neutro";

/** Tinte delle card pastello (CardStato): menta, rosa, sabbia, cielo, notte. */
export type TintaStato = "menta" | "rosa" | "sabbia" | "cielo" | "notte";

/** Tinta pastello corrispondente a un tono di stato: ok → menta, brand → rosa, warn → sabbia, info → cielo, neutro → notte. */
export const TINTA_DA_TONO: Record<Tono, TintaStato> = {
  ok: "menta",
  brand: "rosa",
  warn: "sabbia",
  info: "cielo",
  neutro: "notte",
};

/** Fondo tenue + testo del tono (etichette di stato). */
export const CLASSI_TONO: Record<Tono, string> = {
  ok: "bg-ok-wash text-ok",
  info: "bg-info-wash text-info",
  warn: "bg-warn-wash text-warn",
  brand: "bg-brand-wash text-brand-bright",
  neutro: "bg-surface-3 text-ink-soft",
};

/** Colore pieno del tono (filetti, barre, punti). */
export const COLORE_TONO: Record<Tono, string> = {
  ok: "bg-ok",
  info: "bg-info",
  warn: "bg-warn",
  brand: "bg-brand",
  neutro: "bg-rule",
};

/** Solo il colore del testo. */
export const TESTO_TONO: Record<Tono, string> = {
  ok: "text-ok",
  info: "text-info",
  warn: "text-warn",
  brand: "text-brand-bright",
  neutro: "text-ink-faint",
};
