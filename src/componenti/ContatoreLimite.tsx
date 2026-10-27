/**
 * Contatore di limite: "1 / 2" in Roboto Mono con barra a tacche.
 * Oltre il limite la barra diventa colore di accento e compare "Oltre il limite del contratto";
 * l'avanzamento non si blocca.
 */
interface Props {
  etichetta: string;
  usati: number;
  limite: number;
  /** Testo aggiuntivo dopo il contatore (es. "ripassi 1"). */
  extra?: string;
}

export function ContatoreLimite({ etichetta, usati, limite, extra }: Props) {
  const oltre = usati > limite;
  const tacche = Math.max(limite, usati);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-ink-faint">{etichetta}</span>
        <span className={`font-mono text-[13px] font-semibold ${oltre ? "text-brand-bright" : ""}`}>
          {usati} / {limite}
          {extra ? ` · ${extra}` : ""}
        </span>
      </div>
      <span
        role="meter"
        aria-label={etichetta}
        aria-valuenow={usati}
        aria-valuemin={0}
        // Oltre il limite aria-valuenow non può superare aria-valuemax: il massimo
        // Si allarga e l'informazione resta in aria-valuetext.
        aria-valuemax={Math.max(limite, usati)}
        aria-valuetext={`${usati} su ${limite}${oltre ? ", oltre il limite del contratto" : ""}`}
        className="flex gap-[3px]"
      >
        {Array.from({ length: tacche }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i < usati ? (oltre ? "bg-brand" : "bg-ink-soft") : "bg-surface-3"
            }`}
          />
        ))}
      </span>
      {oltre && (
        <span className="pillola self-start bg-brand-wash text-brand-bright">
          Oltre il limite del contratto
        </span>
      )}
    </div>
  );
}
