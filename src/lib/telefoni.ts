import { numeroWhatsApp } from "./messaggi";

/** Numeri di telefono salvati in E.164 dal server (§12 documento tecnico). */

/** `+393331234567` → `+39 333 123 4567`; `+390811234567` → `+39 081 1234567`. */
export function formattaTelefono(numero: string): string {
  if (!numero.startsWith("+39")) return numero.replace(/^(\+\d{2})(\d+)$/, "$1 $2");
  const n = numero.slice(3);
  if (n.startsWith("3") && n.length === 10) return `+39 ${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6)}`;
  if (n.startsWith("0")) {
    // Fissi: prefisso di 2 cifre per Roma e Milano (06, 02), di 3 per gli altri (081, 089…).
    const lunghezza = n.startsWith("02") || n.startsWith("06") ? 2 : 3;
    return `+39 ${n.slice(0, lunghezza)} ${n.slice(lunghezza)}`;
  }
  return `+39 ${n}`;
}

/** Link `https://wa.me/<numero>`: apre WhatsApp Web da computer e l'app da smartphone. */
export function linkChatWhatsApp(telefono: string): string {
  return `https://wa.me/${numeroWhatsApp(telefono)}`;
}
