import type { ReactNode } from "react";

import { CLASSI_TONO, type Tono } from "../lib/toni";

/**
 * Etichetta di stato a pillola: testo breve su fondo tenue del colore di stato (toni
 * in lib/toni.ts), es. "In ritardo", "3 · Render", "Contabile ricevuta".
 * `piena` = fondo pieno e testo bianco (allarmi, ritardi in evidenza).
 */
const PIENA: Record<Tono, string> = {
  ok: "bg-ok text-white",
  info: "bg-info text-white",
  warn: "bg-warn text-white",
  brand: "bg-brand text-white",
  neutro: "bg-binario text-white",
};

interface Props {
  tono?: Tono;
  /** Testo in Roboto Mono (percentuali, contatori). */
  mono?: boolean;
  /** Spiegazione al passaggio del mouse (es. "Contabile ricevuta 10/09"). */
  titolo?: string;
  className?: string;
  /** Fondo pieno e testo bianco. */
  piena?: boolean;
  children: ReactNode;
}

export function EtichettaStato({ tono = "neutro", mono = false, titolo, className = "", piena = false, children }: Props) {
  return (
    <span
      title={titolo}
      className={`pillola ${mono ? "font-mono font-medium" : ""} ${piena ? PIENA[tono] : CLASSI_TONO[tono]} ${className}`}
    >
      {children}
    </span>
  );
}
