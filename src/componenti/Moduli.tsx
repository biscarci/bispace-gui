import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";

/**
 * Moduli: etichetta sopra il campo, campi alti 40 px (44 su smartphone), errori sotto
 * il campo in colore di accento e in parole semplici. Le date si scelgono dal calendario del browser;
 * le durate di un'assenza con quattro opzioni.
 */

interface PropsCampo {
  etichetta: ReactNode;
  /** Errore sotto il campo. */
  errore?: string | null;
  /** Suggerimento sotto il campo (es. requisiti della password). */
  aiuto?: ReactNode;
  obbligatorio?: boolean;
  className?: string;
  /** Riceve l'id da dare al controllo e gli id di descrizione. */
  children: (attributi: { id: string; "aria-describedby"?: string; "aria-invalid"?: boolean; required?: boolean }) => ReactNode;
}

/** Contenitore generico: etichetta, controllo, aiuto ed errore collegati per lo screen reader. */
export function CampoModulo({ etichetta, errore, aiuto, obbligatorio, className = "", children }: PropsCampo) {
  const id = useId();
  const descrizioni = [aiuto ? `${id}-a` : null, errore ? `${id}-e` : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium">
        {etichetta}
        {obbligatorio && (
          <span className="text-brand-bright" aria-hidden>
            {" "}
            *
          </span>
        )}
      </label>
      {children({ id, "aria-describedby": descrizioni, "aria-invalid": errore ? true : undefined, required: obbligatorio })}
      {aiuto && (
        <span id={`${id}-a`} className="text-xs text-ink-faint">
          {aiuto}
        </span>
      )}
      {errore && (
        <span id={`${id}-e`} className="text-xs font-semibold text-brand-bright">
          {errore}
        </span>
      )}
    </div>
  );
}

type PropsBase = { etichetta: ReactNode; errore?: string | null; aiuto?: ReactNode; obbligatorio?: boolean; classeCampo?: string };

export function CampoTesto({ etichetta, errore, aiuto, obbligatorio, classeCampo = "", className, ...input }: PropsBase & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <CampoModulo etichetta={etichetta} errore={errore} aiuto={aiuto} obbligatorio={obbligatorio} className={className}>
      {(a) => <input {...a} {...input} className={`campo max-md:min-h-11 ${errore ? "border-brand" : ""} ${classeCampo}`} />}
    </CampoModulo>
  );
}

/** Data dal calendario del browser: valore `aaaa-mm-gg`. */
export function CampoData(props: PropsBase & Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  return <CampoTesto {...props} type="date" classeCampo={`font-mono ${props.classeCampo ?? ""}`} />;
}

/** Ora `hh:mm` a 24 ore. */
export function CampoOra(props: PropsBase & Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  return <CampoTesto {...props} type="time" step={300} classeCampo={`font-mono ${props.classeCampo ?? ""}`} />;
}

export function AreaTesto({ etichetta, errore, aiuto, obbligatorio, className, ...area }: PropsBase & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <CampoModulo etichetta={etichetta} errore={errore} aiuto={aiuto} obbligatorio={obbligatorio} className={className}>
      {(a) => <textarea rows={3} {...a} {...area} className={`campo py-2 leading-relaxed ${errore ? "border-brand" : ""}`} />}
    </CampoModulo>
  );
}

export interface Opzione {
  valore: string;
  etichetta: string;
  /** Testo in più (es. "68% · libera il 26/10"). */
  dettaglio?: string;
  disabilitata?: boolean;
}

export function CampoSelezione({
  etichetta,
  errore,
  aiuto,
  obbligatorio,
  opzioni,
  vuota,
  className,
  ...select
}: PropsBase & SelectHTMLAttributes<HTMLSelectElement> & { opzioni: Opzione[]; /** Prima voce vuota (es. "Scegli…"). */ vuota?: string }) {
  return (
    <CampoModulo etichetta={etichetta} errore={errore} aiuto={aiuto} obbligatorio={obbligatorio} className={className}>
      {(a) => (
        <select {...a} {...select} className={`campo max-md:min-h-11 ${errore ? "border-brand" : ""}`}>
          {vuota !== undefined && <option value="">{vuota}</option>}
          {opzioni.map((o) => (
            <option key={o.valore} value={o.valore} disabled={o.disabilitata}>
              {o.dettaglio ? `${o.etichetta} — ${o.dettaglio}` : o.etichetta}
            </option>
          ))}
        </select>
      )}
    </CampoModulo>
  );
}

/**
 * Scelta segmentata a pillola (radio accessibile): durate, provvisorio/confermato, esiti, viste
 * ("Bacheca | Elenco"). Con `etichettaNascosta` la legenda resta solo per lo screen reader.
 */
export function SceltaSegmentata<V extends string>({
  etichetta,
  opzioni,
  valore,
  onCambia,
  nome,
  etichettaNascosta = false,
}: {
  etichetta: string;
  opzioni: { valore: V; etichetta: string }[];
  valore: V | null;
  onCambia: (valore: V) => void;
  /** Nome del gruppo di radio (unico nella pagina). */
  nome?: string;
  /** Legenda solo per lo screen reader (controllo compatto nell'intestazione di una card). */
  etichettaNascosta?: boolean;
}) {
  const idGruppo = useId();
  const name = nome ?? idGruppo;
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className={etichettaNascosta ? "sr-only" : "mb-1.5 text-sm font-medium"}>{etichetta}</legend>
      <div className="flex flex-wrap gap-0.5 rounded-full bg-surface-3 p-1">
        {opzioni.map((o) => (
          <label
            key={o.valore}
            className={`flex min-h-9 flex-1 cursor-pointer items-center justify-center rounded-full px-4 text-[13px] font-semibold whitespace-nowrap has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-0 has-[:focus-visible]:outline-brand max-xl:min-h-11 ${
              valore === o.valore ? "bg-surface text-ink shadow-pulsante" : "text-ink-soft hover:text-ink"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={o.valore}
              checked={valore === o.valore}
              onChange={() => onCambia(o.valore)}
              className="sr-only"
            />
            {o.etichetta}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
