import { Mail, MessageCircle, Phone } from "lucide-react";

import { formattaTelefono, linkChatWhatsApp } from "../lib/telefoni";

/**
 * Recapiti di clienti, referenti, DL e rubrica.
 * I numeri arrivano dal server in E.164 (`+393331234567`) e si mostrano a gruppi;
 * il tocco sul numero chiama, il pulsante verde apre direttamente la chat WhatsApp
 * (senza testo preparato: per i messaggi dai modelli c'è PulsanteWhatsApp).
 */

interface PropsChat {
  telefono: string;
  /** Nome del contatto, per l'etichetta accessibile. */
  nome: string;
  soloIcona?: boolean;
}

/** Dal contatto si apre direttamente la chat WhatsApp. */
export function ChatWhatsApp({ telefono, nome, soloIcona = true }: PropsChat) {
  return (
    <a
      href={linkChatWhatsApp(telefono)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Apri la chat WhatsApp con ${nome}`}
      title="Apri la chat WhatsApp"
      className={`btn shrink-0 border-whatsapp bg-whatsapp text-white hover:bg-whatsapp hover:brightness-110 ${soloIcona ? "px-2.5 max-xl:min-w-11" : ""}`}
    >
      <MessageCircle size={16} aria-hidden />
      {!soloIcona && "WhatsApp"}
    </a>
  );
}

/** Numero cliccabile (chiama da smartphone) in Roboto Mono; alto 44 px su smartphone. */
export function NumeroTelefono({ telefono, className = "" }: { telefono: string; className?: string }) {
  return (
    <a href={`tel:${telefono}`} className={`inline-flex items-center gap-1.5 max-md:min-h-11 font-mono text-[13px] text-ink no-underline hover:text-brand-bright ${className}`}>
      <Phone size={13} className="shrink-0 text-ink-faint" aria-hidden />
      <span className="whitespace-nowrap">{formattaTelefono(telefono)}</span>
    </a>
  );
}

/** Indirizzo email cliccabile, troncato se lungo; alto 44 px su smartphone. */
export function IndirizzoEmail({ email, className = "" }: { email: string; className?: string }) {
  return (
    <a href={`mailto:${email}`} className={`inline-flex min-w-0 items-center gap-1.5 max-md:min-h-11 text-[13px] text-ink no-underline hover:text-brand-bright ${className}`}>
      <Mail size={13} className="shrink-0 text-ink-faint" aria-hidden />
      <span className="truncate">{email}</span>
    </a>
  );
}

/** Riga di recapiti: numero ed email. */
export function RecapitiInLinea({ telefono, email }: { telefono?: string; email?: string }) {
  if (!telefono && !email) return <span className="text-[13px] text-ink-faint">Nessun recapito</span>;
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1.5">
      {telefono && <NumeroTelefono telefono={telefono} />}
      {email && <IndirizzoEmail email={email} />}
    </div>
  );
}
