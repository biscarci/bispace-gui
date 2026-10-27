/**
 * Stato visivo delle fasi di un percorso a tappe (BarraFasi, QuadratiniFasi):
 * verde = conclusa, blu = in corso, accento = in ritardo, grigio = da fare, tratteggio = in pausa.
 * I nomi delle fasi li passa il progetto che usa i componenti.
 */
export type StatoVisivoFase = "conclusa" | "in_corso" | "ritardo" | "da_fare" | "pausa";

export const ETICHETTE_STATO_FASE: Record<StatoVisivoFase, string> = {
  conclusa: "conclusa",
  in_corso: "in corso",
  ritardo: "in ritardo",
  da_fare: "da fare",
  pausa: "in pausa",
};
