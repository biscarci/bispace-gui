import type { ReactNode } from "react";
import { Lock } from "lucide-react";

/**
 * Riquadro "Prossimo passo": bordo e fondo accento, a tutta larghezza
 * sotto la barra delle fasi. Titolo dell'attività, incaricato, scadenza e regola che l'ha generata.
 * È una regione live: si annuncia quando cambia lo stato.
 */
interface Props {
  titolo: string;
  incaricato?: string | null;
  /** Già formattata ("gio 29/10"). */
  scadenza?: string | null;
  /** Regola o nota (es. "controllo TL: Luca", "Il progetto torna alla modellazione"). */
  regola?: ReactNode;
  scaduta?: boolean;
  /** Motivo del blocco, se il prossimo passo è bloccato. */
  motivoBlocco?: string | null;
  /** Azioni (es. flag o Sì/No del passo). */
  azioni?: ReactNode;
}

export function ProssimoPasso({ titolo, incaricato, scadenza, regola, scaduta = false, motivoBlocco, azioni }: Props) {
  const dettagli = [scadenza ? `Entro ${scadenza}` : null, incaricato].filter(Boolean).join(" · ");
  return (
    <section
      aria-label="Prossimo passo"
      aria-live="polite"
      className="flex flex-wrap items-center gap-4 rounded-card border border-brand/25 bg-gradient-to-br from-brand-wash to-brand-soft px-5 py-5 shadow-morbida md:px-6"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <span className="lbl text-brand-bright">Prossimo passo</span>
        <span className="text-xl leading-tight font-semibold tracking-[-0.02em]">{titolo}</span>
        {(dettagli || regola) && (
          <span className="text-sm text-ink-soft">
            {dettagli && <span className={scaduta ? "font-semibold text-brand-bright" : ""}>{dettagli}</span>}
            {dettagli && regola ? " · " : null}
            {regola}
          </span>
        )}
        {motivoBlocco && (
          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-bright">
            <Lock size={14} aria-hidden /> {motivoBlocco}
          </span>
        )}
      </div>
      {azioni}
    </section>
  );
}
