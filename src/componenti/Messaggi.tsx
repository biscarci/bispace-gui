import { useId, useState } from "react";
import { Copy, Mail, MessageCircle } from "lucide-react";

import { copiaTesto, linkEmail, linkWhatsApp } from "../lib/messaggi";
import { PannelloLaterale } from "./PannelloLaterale";
import { useToast } from "../lib/toast";

/**
 * Pulsante WhatsApp: apre una finestra con il testo già
 * compilato e modificabile e il destinatario; "Apri WhatsApp" apre WhatsApp Web da computer
 * o l'app da smartphone. Per i gruppi c'è la nota "Scegli il gruppo in WhatsApp".
 */
interface PropsWhatsApp {
  /** Testo già compilato dal modello. */
  testo: string;
  /** Telefono del destinatario; senza, è un messaggio a un gruppo. */
  telefono?: string | null;
  /** Nome del destinatario o del gruppo, mostrato nella finestra. */
  destinatario?: string;
  etichetta?: string;
  /** Solo icona (righe di tabella, rubrica). */
  soloIcona?: boolean;
  /** Avvisato all'apertura di WhatsApp (es. per registrare l'invio). */
  onInviato?: (testo: string) => void;
}

export function PulsanteWhatsApp({
  testo,
  telefono,
  destinatario,
  etichetta = "WhatsApp",
  soloIcona = false,
  onInviato,
}: PropsWhatsApp) {
  const [aperto, setAperto] = useState(false);
  const [bozza, setBozza] = useState(testo);
  const idTesto = useId();
  const toast = useToast();
  const gruppo = !telefono;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setBozza(testo);
          setAperto(true);
        }}
        aria-label={soloIcona ? `${etichetta}${destinatario ? ` a ${destinatario}` : ""}` : undefined}
        className={`btn border-whatsapp bg-whatsapp text-white hover:bg-whatsapp hover:brightness-110 ${soloIcona ? "px-2.5" : ""}`}
      >
        <MessageCircle size={16} aria-hidden />
        {!soloIcona && etichetta}
      </button>
      <PannelloLaterale
        aperto={aperto}
        onChiudi={() => setAperto(false)}
        titolo="Messaggio WhatsApp"
        sottotitolo={destinatario ? `A: ${destinatario}${telefono ? ` · ${telefono}` : ""}` : undefined}
        piede={
          <>
            <button
              type="button"
              className="btn"
              onClick={async () =>
                toast.mostra(
                  (await copiaTesto(bozza)) ? "Testo copiato negli appunti" : { messaggio: "Copia non riuscita", tono: "errore" },
                )
              }
            >
              <Copy size={16} aria-hidden /> Copia testo
            </button>
            <a
              href={linkWhatsApp(bozza, telefono)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn border-whatsapp bg-whatsapp text-white hover:bg-whatsapp hover:brightness-110"
              onClick={() => {
                onInviato?.(bozza);
                setAperto(false);
              }}
            >
              <MessageCircle size={16} aria-hidden /> Apri WhatsApp
            </a>
          </>
        }
      >
        {gruppo && (
          <p className="rounded-interno bg-surface-2 px-3.5 py-2.5 text-[13px] text-ink-soft">Scegli il gruppo in WhatsApp.</p>
        )}
        <label htmlFor={idTesto} className="lbl">
          Testo del messaggio
        </label>
        <textarea
          id={idTesto}
          value={bozza}
          onChange={(e) => setBozza(e.target.value)}
          rows={10}
          className="campo min-h-48 py-2 leading-relaxed"
        />
      </PannelloLaterale>
    </>
  );
}

/**
 * Pulsante email: "Apri nella posta" apre il programma di posta con
 * destinatario, oggetto e testo; "Copia testo" copia negli appunti con conferma.
 */
interface PropsEmail {
  destinatario: string;
  oggetto?: string;
  testo?: string;
  etichetta?: string;
  soloIcona?: boolean;
}

export function PulsanteEmail({ destinatario, oggetto = "", testo = "", etichetta = "Email", soloIcona = false }: PropsEmail) {
  const [aperto, setAperto] = useState(false);
  const [bozzaOggetto, setBozzaOggetto] = useState(oggetto);
  const [bozza, setBozza] = useState(testo);
  const id = useId();
  const toast = useToast();

  // Senza testo da preparare basta un link diretto.
  if (!testo && !oggetto)
    return (
      <a href={linkEmail(destinatario)} className={`btn ${soloIcona ? "px-2.5" : ""}`} aria-label={soloIcona ? `${etichetta} a ${destinatario}` : undefined}>
        <Mail size={16} aria-hidden />
        {!soloIcona && etichetta}
      </a>
    );

  return (
    <>
      <button
        type="button"
        className={`btn ${soloIcona ? "px-2.5" : ""}`}
        aria-label={soloIcona ? `${etichetta} a ${destinatario}` : undefined}
        onClick={() => {
          setBozzaOggetto(oggetto);
          setBozza(testo);
          setAperto(true);
        }}
      >
        <Mail size={16} aria-hidden />
        {!soloIcona && etichetta}
      </button>
      <PannelloLaterale
        aperto={aperto}
        onChiudi={() => setAperto(false)}
        titolo="Email"
        sottotitolo={`A: ${destinatario}`}
        piede={
          <>
            <button
              type="button"
              className="btn"
              onClick={async () =>
                toast.mostra(
                  (await copiaTesto(bozza)) ? "Testo copiato negli appunti" : { messaggio: "Copia non riuscita", tono: "errore" },
                )
              }
            >
              <Copy size={16} aria-hidden /> Copia testo
            </button>
            <a href={linkEmail(destinatario, bozzaOggetto, bozza)} className="btn btn-pri" onClick={() => setAperto(false)}>
              <Mail size={16} aria-hidden /> Apri nella posta
            </a>
          </>
        }
      >
        <label className="flex flex-col gap-1.5 text-sm font-medium" htmlFor={`${id}-o`}>
          Oggetto
        </label>
        <input id={`${id}-o`} className="campo" value={bozzaOggetto} onChange={(e) => setBozzaOggetto(e.target.value)} />
        <label className="flex flex-col gap-1.5 text-sm font-medium" htmlFor={`${id}-t`}>
          Testo
        </label>
        <textarea
          id={`${id}-t`}
          value={bozza}
          onChange={(e) => setBozza(e.target.value)}
          rows={10}
          className="campo min-h-48 py-2 leading-relaxed"
        />
      </PannelloLaterale>
    </>
  );
}
