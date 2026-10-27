/**
 * Formati di date, ore e importi: `gg/mm`, `gg/mm/aaaa`, ore a 24 ore, `€ 3.600`,
 * giorni abbreviati (lun, mar…). Le date dell'API arrivano come stringhe ISO:
 * `2026-10-19` (solo data, da leggere come giorno locale) o `2026-10-19T10:42:00+02:00`.
 */

export type DataLike = Date | string;

const GIORNI_BREVI = ["dom", "lun", "mar", "mer", "gio", "ven", "sab"];
const GIORNI = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];
const MESI = [
  "gennaio",
  "febbraio",
  "marzo",
  "aprile",
  "maggio",
  "giugno",
  "luglio",
  "agosto",
  "settembre",
  "ottobre",
  "novembre",
  "dicembre",
];

const due = (n: number) => String(n).padStart(2, "0");

/** Converte in Date. Una data senza ora (`aaaa-mm-gg`) è il giorno locale, non la mezzanotte UTC. */
export function aData(valore: DataLike): Date {
  if (valore instanceof Date) return valore;
  const soloData = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valore);
  if (soloData) return new Date(Number(soloData[1]), Number(soloData[2]) - 1, Number(soloData[3]));
  return new Date(valore);
}

/** `19/10`, oppure `19/10/2026` con `conAnno`. */
export function formattaData(valore: DataLike, conAnno = false): string {
  const d = aData(valore);
  const base = `${due(d.getDate())}/${due(d.getMonth() + 1)}`;
  return conAnno ? `${base}/${d.getFullYear()}` : base;
}

/** `14:30`. */
export function formattaOra(valore: DataLike): string {
  const d = aData(valore);
  return `${due(d.getHours())}:${due(d.getMinutes())}`;
}

/** `19/10 · 14:30` (come nella cronologia). */
export function formattaDataOra(valore: DataLike): string {
  return `${formattaData(valore)} · ${formattaOra(valore)}`;
}

/** `lun`, `mar`… */
export function giornoBreve(valore: DataLike): string {
  return GIORNI_BREVI[aData(valore).getDay()];
}

/** `lun 19/10`. */
export function formattaGiorno(valore: DataLike): string {
  return `${giornoBreve(valore)} ${formattaData(valore)}`;
}

/** `Lunedì 19 ottobre` (saluto della dashboard e della pagina Oggi). */
export function formattaDataLunga(valore: DataLike): string {
  const d = aData(valore);
  const testo = `${GIORNI[d.getDay()]} ${d.getDate()} ${MESI[d.getMonth()]}`;
  return testo.charAt(0).toUpperCase() + testo.slice(1);
}

/** `ottobre 2026` (intestazione della vista mese). */
export function formattaMese(valore: DataLike): string {
  const d = aData(valore);
  return `${MESI[d.getMonth()]} ${d.getFullYear()}`;
}

/** Data in formato ISO `aaaa-mm-gg` nel fuso locale (per i parametri delle API e gli input date). */
export function isoGiorno(valore: DataLike = new Date()): string {
  const d = aData(valore);
  return `${d.getFullYear()}-${due(d.getMonth() + 1)}-${due(d.getDate())}`;
}

/** Numero della settimana ISO 8601 (la settimana inizia di lunedì; la 1ª contiene il primo giovedì). */
export function settimanaIso(valore: DataLike = new Date()): number {
  const d = aData(valore);
  const giovedi = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  giovedi.setUTCDate(giovedi.getUTCDate() + 4 - (giovedi.getUTCDay() || 7));
  const inizioAnno = Date.UTC(giovedi.getUTCFullYear(), 0, 1);
  return Math.ceil(((giovedi.getTime() - inizioAnno) / 86_400_000 + 1) / 7);
}

/** Lunedì della settimana che contiene la data. */
export function lunediDellaSettimana(valore: DataLike = new Date()): Date {
  const d = aData(valore);
  const lunedi = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  lunedi.setDate(lunedi.getDate() - ((lunedi.getDay() + 6) % 7));
  return lunedi;
}

/** Aggiunge giorni di calendario (non lavorativi: quelli li calcola il server, §7). */
export function aggiungiGiorni(valore: DataLike, giorni: number): Date {
  const d = aData(valore);
  const risultato = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  risultato.setDate(risultato.getDate() + giorni);
  return risultato;
}

/** I cinque giorni lun–ven della settimana che contiene la data. */
export function giorniLavorativiSettimana(valore: DataLike = new Date()): Date[] {
  const lunedi = lunediDellaSettimana(valore);
  return [0, 1, 2, 3, 4].map((i) => aggiungiGiorni(lunedi, i));
}

export function stessoGiorno(a: DataLike, b: DataLike): boolean {
  return isoGiorno(a) === isoGiorno(b);
}

/** Vero se la data (giorno) è prima di oggi. */
export function scaduta(valore: DataLike, oggi: DataLike = new Date()): boolean {
  return isoGiorno(valore) < isoGiorno(oggi);
}

// "always": in italiano Intl non raggrupperebbe i numeri di 4 cifre (3600), lo studio scrive 3.600.
const IMPORTO_INTERO = new Intl.NumberFormat("it-IT", { maximumFractionDigits: 0, useGrouping: "always" });
const IMPORTO_DECIMALI = new Intl.NumberFormat("it-IT", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: "always",
});

/**
 * `€ 3.600` · `€ 1.250,50`. Accetta anche le stringhe decimali dell'API (`"3600.00"`).
 * I decimali compaiono solo se diversi da zero.
 */
export function formattaImporto(valore: number | string | null | undefined): string {
  const numero = typeof valore === "string" ? Number(valore) : valore;
  if (numero === null || numero === undefined || !Number.isFinite(numero)) return "—";
  const conDecimali = Math.round(numero * 100) % 100 !== 0;
  return `€ ${(conDecimali ? IMPORTO_DECIMALI : IMPORTO_INTERO).format(numero)}`;
}

/** `65%`. */
export function formattaPercentuale(valore: number): string {
  return `${Math.round(valore)}%`;
}

/** Iniziali da nome e cognome (`Pina Esposito` → `PE`), se l'API non le fornisce già. */
export function iniziali(nome: string, cognome = ""): string {
  const parti = `${nome} ${cognome}`.trim().split(/\s+/).filter(Boolean);
  if (parti.length === 0) return "?";
  if (parti.length === 1) return parti[0].slice(0, 2).toUpperCase();
  return (parti[0][0] + parti[parti.length - 1][0]).toUpperCase();
}

/** `3ª` (fasi, tranche). */
export function ordinale(n: number): string {
  return `${n}ª`;
}
