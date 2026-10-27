import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { useConfigurazioneUI } from "../lib/configurazione";
import { Collegamento, type Destinazione } from "./Collegamento";
import { SagomaRighe, StatoErrore, StatoVuoto } from "./Stati";

/**
 * Tabella: intestazioni in maiuscoletto, righe da 52–60 px, evidenza al passaggio,
 * intera riga cliccabile. Su smartphone (< 768 px) diventa un elenco di schede
 * oppure, con `suSmartphone="scorri"`, scorre in orizzontale dentro il riquadro.
 * Per la tastiera la colonna `principale` contiene il vero link (o pulsante) della riga: il suo
 * nome accessibile è il testo visibile della cella (WCAG 2.5.3), senza aria-label.
 * Quando la tabella scorre in orizzontale, il contenitore si raggiunge da tastiera.
 */
export interface Colonna<T> {
  chiave: string;
  intestazione: string;
  cella: (riga: T) => ReactNode;
  /** La colonna col nome dell'elemento: porta il link e fa da titolo della scheda su smartphone. */
  principale?: boolean;
  /**
   * @deprecated Non più usato: il nome del link è il testo visibile della cella (WCAG 2.5.3,
   * "label in name"). Un aria-label diverso dal testo visibile è un errore axe serio.
   */
  testoLink?: (riga: T) => string;
  allinea?: "sinistra" | "destra" | "centro";
  /** Classi aggiuntive della cella (larghezza, ecc.). */
  className?: string;
  /** Non mostrare nelle schede da smartphone. */
  nascostaSuSmartphone?: boolean;
}

interface Props<T> {
  /** Descrizione della tabella per lo screen reader (caption). */
  etichetta: string;
  colonne: Colonna<T>[];
  righe: T[] | undefined;
  chiaveRiga: (riga: T) => string | number;
  /** Dove porta il tocco sulla riga. */
  linkRiga?: (riga: T) => Destinazione;
  /** In alternativa al link: azione sulla riga (es. aprire un pannello laterale). */
  onApriRiga?: (riga: T) => void;
  /** Riga selezionata (pannello aperto). */
  selezionata?: string | number;
  caricamento?: boolean;
  errore?: unknown;
  onRiprova?: () => void;
  /** Contenuto quando non ci sono righe. */
  vuoto?: ReactNode;
  suSmartphone?: "schede" | "scorri";
  /** Larghezza minima prima dello scorrimento orizzontale. */
  larghezzaMinima?: string;
  /** Righe evidenziate (es. in ritardo). */
  evidenziaRiga?: (riga: T) => boolean;
}

const ALLINEA = { sinistra: "text-left", destra: "text-right", centro: "text-center" };
const INTERATTIVI = "a,button,input,select,textarea,label,[role=button],[role=checkbox]";

export function Tabella<T>({
  etichetta,
  colonne,
  righe,
  chiaveRiga,
  linkRiga,
  onApriRiga,
  selezionata,
  caricamento = false,
  errore,
  onRiprova,
  vuoto,
  suSmartphone = "schede",
  larghezzaMinima = "min-w-[720px]",
  evidenziaRiga,
}: Props<T>) {
  const naviga = useConfigurazioneUI().useNaviga();

  if (caricamento) return <SagomaRighe />;
  if (errore) return <StatoErrore errore={errore} onRiprova={onRiprova} />;
  if (!righe || righe.length === 0) return <>{vuoto ?? <StatoVuoto messaggio="Nessun elemento da mostrare." />}</>;

  const cliccabile = Boolean(linkRiga || onApriRiga);

  function apri(riga: T, e: MouseEvent<HTMLElement>) {
    // I controlli dentro la riga (flag, pulsanti, link) fanno la loro azione.
    if ((e.target as HTMLElement).closest(INTERATTIVI)) return;
    if (linkRiga) naviga(linkRiga(riga));
    else onApriRiga?.(riga);
  }

  function principale(colonna: Colonna<T>, riga: T): ReactNode {
    const contenuto = colonna.cella(riga);
    if (linkRiga)
      return (
        <Collegamento a={linkRiga(riga)} className="font-bold text-ink no-underline hover:text-brand-bright hover:underline">
          {contenuto}
        </Collegamento>
      );
    if (onApriRiga)
      return (
        <button
          type="button"
          onClick={() => onApriRiga(riga)}
          className="text-left font-bold text-ink hover:text-brand-bright hover:underline"
        >
          {contenuto}
        </button>
      );
    return contenuto;
  }

  const tabella = (
    <Scorrevole
      etichetta={etichetta}
      className={suSmartphone === "schede" ? "relative hidden overflow-x-auto md:block" : "relative overflow-x-auto"}
    >
      <table className={`w-full border-collapse text-sm ${larghezzaMinima}`}>
        <caption className="sr-only">{etichetta}</caption>
        <thead>
          <tr>
            {colonne.map((c, i) => (
              <th
                key={c.chiave}
                scope="col"
                className={`lbl px-3 pt-1 pb-3 font-semibold ${ALLINEA[c.allinea ?? "sinistra"]} ${i === 0 ? "pl-6" : ""} ${
                  i === colonne.length - 1 ? "pr-6" : ""
                }`}
              >
                {c.intestazione}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {righe.map((riga) => {
            const chiave = chiaveRiga(riga);
            return (
              <tr
                key={chiave}
                onClick={cliccabile ? (e) => apri(riga, e) : undefined}
                // Aria-selected non è ammesso sulle righe di una tabella semplice (solo grid).
                aria-current={selezionata === chiave ? "true" : undefined}
                className={`group ${cliccabile ? "cursor-pointer" : ""} ${
                  selezionata === chiave
                    ? "bg-brand-wash [&_.text-ink-faint]:text-ink-soft" // Testo tenue più scuro sul fondo rosato
                    : evidenziaRiga?.(riga) ? "bg-brand-wash/50" : ""
                }`}
              >
                {colonne.map((c, i) => (
                  <td
                    key={c.chiave}
                    className={`h-[60px] border-t border-rule-soft px-3 py-3.5 align-middle group-hover:bg-surface-2/80 ${
                      ALLINEA[c.allinea ?? "sinistra"]
                    } ${i === 0 ? "pl-6" : ""} ${i === colonne.length - 1 ? "pr-6" : ""} ${c.className ?? ""}`}
                  >
                    {c.principale ? principale(c, riga) : c.cella(riga)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Scorrevole>
  );

  if (suSmartphone === "scorri") return tabella;

  const colonnaTitolo = colonne.find((c) => c.principale) ?? colonne[0];
  const altre = colonne.filter((c) => c !== colonnaTitolo && !c.nascostaSuSmartphone);

  return (
    <>
      {tabella}
      <ul className="flex flex-col md:hidden" aria-label={etichetta}>
        {righe.map((riga) => {
          const chiave = chiaveRiga(riga);
          return (
            <li
              key={chiave}
              onClick={cliccabile ? (e) => apri(riga, e) : undefined}
              className={`flex flex-col gap-2.5 border-t border-rule-soft px-5 py-4 ${cliccabile ? "cursor-pointer active:bg-surface-2" : ""} ${
                selezionata === chiave ? "bg-brand-wash [&_.text-ink-faint]:text-ink-soft" : ""
              }`}
            >
              <div className="text-base">
                {colonnaTitolo.principale ? principale(colonnaTitolo, riga) : colonnaTitolo.cella(riga)}
              </div>
              {altre.length > 0 && (
                <dl className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1.5 text-[13px]">
                  {altre.map((c) => (
                    <div key={c.chiave} className="contents">
                      <dt className="lbl">{c.intestazione}</dt>
                      <dd className="min-w-0">{c.cella(riga)}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}

/**
 * Contenitore che scorre in orizzontale (axe "scrollable-region-focusable"): solo quando
 * il contenuto è più largo diventa una regione con nome raggiungibile col Tab, così le frecce lo
 * fanno scorrere anche senza link nelle righe (es. il report da tablet). Come la griglia del carico.
 */
function Scorrevole({ etichetta, className, children }: { etichetta: string; className: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scorre, setScorre] = useState(false);
  useEffect(() => {
    const nodo = ref.current;
    if (!nodo) return;
    const misura = () => setScorre(nodo.scrollWidth > nodo.clientWidth + 1);
    misura();
    if (typeof ResizeObserver === "undefined") return;
    const osservatore = new ResizeObserver(misura);
    osservatore.observe(nodo);
    if (nodo.firstElementChild) osservatore.observe(nodo.firstElementChild);
    return () => osservatore.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      {...(scorre ? { role: "region", "aria-label": `${etichetta} (scorre in orizzontale)`, tabIndex: 0 } : {})}
    >
      {children}
    </div>
  );
}
