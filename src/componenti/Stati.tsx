import { useEffect, useState, type ReactNode } from "react";
import { AlertTriangle, Inbox, Loader2, WifiOff } from "lucide-react";

import { useConfigurazioneUI } from "../lib/configurazione";
import { useOnline } from "../lib/online";

/**
 * Stati di pagina: caricamento con sagome grigie, elenchi vuoti con
 * frase e azione utile, errori, connessione assente.
 */

/** Sagome a forma di righe. Oltre 1 secondo compare un indicatore discreto. */
export function SagomaRighe({ righe = 4, altezza = "h-12" }: { righe?: number; altezza?: string }) {
  return (
    <div className="flex flex-col gap-2 px-5 py-3" aria-busy="true" aria-label="Caricamento">
      {Array.from({ length: righe }, (_, i) => (
        <div key={i} className={`${altezza} animate-pulse rounded-interno bg-surface-2`} />
      ))}
      <IndicatoreLento />
    </div>
  );
}

/** Sagome a forma di riquadri (KPI, schede). */
export function SagomaRiquadri({ numero = 4, altezza = "h-24" }: { numero?: number; altezza?: string }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3.5" aria-busy="true" aria-label="Caricamento">
      {Array.from({ length: numero }, (_, i) => (
        <div key={i} className={`${altezza} animate-pulse rounded-card bg-surface/70`} />
      ))}
    </div>
  );
}

/** Indicatore che compare solo se il caricamento dura più di un secondo. */
export function IndicatoreLento({ dopo = 1000 }: { dopo?: number }) {
  const [visibile, setVisibile] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setVisibile(true), dopo);
    return () => window.clearTimeout(timer);
  }, [dopo]);
  if (!visibile) return null;
  return (
    <span role="status" className="inline-flex items-center gap-2 self-center text-xs text-ink-faint">
      <Loader2 size={14} className="animate-spin" aria-hidden /> Caricamento…
    </span>
  );
}

/** Frase che spiega e azione utile. */
export function StatoVuoto({
  messaggio,
  dettaglio,
  azione,
  icona = true,
}: {
  messaggio: string;
  dettaglio?: ReactNode;
  azione?: ReactNode;
  icona?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
      {icona && (
        <span aria-hidden className="grid size-14 place-items-center rounded-full bg-surface-2 text-ink-faint">
          <Inbox size={24} strokeWidth={1.6} />
        </span>
      )}
      <p className="text-[15px] font-semibold text-ink-soft">{messaggio}</p>
      {dettaglio && <p className="max-w-md text-[13px] text-ink-faint">{dettaglio}</p>}
      {azione}
    </div>
  );
}

/** Errore nel caricamento di un riquadro o di una pagina, con "Riprova". */
export function StatoErrore({ errore, onRiprova }: { errore: unknown; onRiprova?: () => void }) {
  const { messaggioErrore } = useConfigurazioneUI();
  return (
    <div role="alert" className="flex flex-col items-center gap-3 px-5 py-10 text-center">
      <span aria-hidden className="grid size-14 place-items-center rounded-full bg-brand-wash text-brand-bright">
        <AlertTriangle size={24} strokeWidth={1.8} />
      </span>
      <p className="text-sm font-semibold text-brand-bright">
        {messaggioErrore(errore, "Impossibile caricare i dati: controlla la connessione e riprova.")}
      </p>
      {onRiprova && (
        <button type="button" className="btn" onClick={onRiprova}>
          Riprova
        </button>
      )}
    </div>
  );
}

/** Errore sotto un campo o un modulo, in colore di accento e in parole semplici. */
export function MessaggioErrore({ children }: { children: ReactNode }) {
  if (!children) return null;
  return (
    <p role="alert" className="rounded-interno bg-brand-wash px-4 py-2.5 text-sm font-medium text-brand">
      {children}
    </p>
  );
}

/** Barra in alto quando manca la connessione (la shell la tiene ancorata insieme all'intestazione). */
export function BarraOffline() {
  const online = useOnline();
  if (online) return null;
  return (
    <div
      role="alert"
      className="flex items-center justify-center gap-2 bg-brand px-4 py-2 text-[13px] font-semibold text-white md:fixed md:top-3 md:left-1/2 md:z-50 md:-translate-x-1/2 md:rounded-full md:px-5 md:shadow-brand"
    >
      <WifiOff size={16} aria-hidden /> Sei offline: le modifiche non verranno salvate
    </div>
  );
}

/** Barra in alto nelle pagine che l'utente può solo consultare. */
export function AvvisoSolaLettura({ children = "Sola lettura" }: { children?: ReactNode }) {
  return (
    <div role="note" className="rounded-interno border border-rule-soft bg-surface/80 px-4 py-2.5 text-[13px] font-semibold text-ink-soft shadow-pulsante">
      {children}
    </div>
  );
}
