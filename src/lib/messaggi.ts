/** Link per WhatsApp ed email. */

/**
 * Numero per wa.me: solo cifre, con prefisso internazionale.
 * I numeri italiani scritti senza prefisso (`333 1234567`, `081 123456`) ricevono il 39.
 */
export function numeroWhatsApp(telefono: string): string {
  const pulito = telefono.trim();
  const cifre = pulito.replace(/\D/g, "");
  if (pulito.startsWith("+")) return cifre;
  if (cifre.startsWith("00")) return cifre.slice(2);
  if (cifre.startsWith("39") && cifre.length >= 11) return cifre;
  return `39${cifre}`;
}

/**
 * Link che apre WhatsApp Web da computer e l'app da smartphone, col testo già scritto.
 * Senza numero (messaggio al gruppo) WhatsApp chiede di scegliere la chat.
 */
export function linkWhatsApp(testo: string, telefono?: string | null): string {
  const numero = telefono ? numeroWhatsApp(telefono) : "";
  return `https://wa.me/${numero}?text=${encodeURIComponent(testo)}`;
}

/** `mailto:` con uno o più destinatari (separati da virgola, come vuole RFC 6068), oggetto e testo. */
export function linkEmail(destinatario: string | string[], oggetto = "", testo = ""): string {
  const parti: string[] = [];
  if (oggetto) parti.push(`subject=${encodeURIComponent(oggetto)}`);
  if (testo) parti.push(`body=${encodeURIComponent(testo)}`);
  const indirizzi = (Array.isArray(destinatario) ? destinatario : [destinatario])
    .map((d) => encodeURIComponent(d).replace(/%40/g, "@"))
    .join(",");
  return `mailto:${indirizzi}${parti.length ? `?${parti.join("&")}` : ""}`;
}

/** Copia negli appunti; restituisce falso se il browser non lo permette. */
export async function copiaTesto(testo: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(testo);
    return true;
  } catch {
    return false;
  }
}
