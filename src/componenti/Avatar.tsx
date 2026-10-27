/** Avatar: cerchio con le iniziali; al passaggio mostra il nome completo. */
interface Props {
  iniziali: string;
  nome: string;
  /** "sm" 26 px · "md" 30 px · "lg" 40 px. */
  dimensione?: "sm" | "md" | "lg";
  /** Fondo accento (l'utente corrente nel menu). */
  evidenza?: boolean;
}

// Iniziali mai sotto gli 11 px del mockup approvato, anche negli avatar piccoli.
const DIMENSIONI = { sm: "size-7 text-xs", md: "size-8 text-xs", lg: "size-10 text-[13px]" };

export function Avatar({ iniziali, nome, dimensione = "md", evidenza = false }: Props) {
  return (
    <span
      title={nome}
      className={`inline-grid shrink-0 place-items-center rounded-full font-bold ring-2 ring-surface ${DIMENSIONI[dimensione]} ${
        evidenza ? "bg-gradient-to-b from-brand-wash to-brand-soft text-brand" : "bg-gradient-to-b from-surface-2 to-surface-3 text-ink"
      }`}
    >
      <span aria-hidden>{iniziali}</span>
      <span className="sr-only">{nome}</span>
    </span>
  );
}

/** Più avatar sovrapposti (partecipanti di un appuntamento o di una ripresa). */
export function GruppoAvatar({ persone, massimo = 4 }: { persone: { iniziali: string; nome: string }[]; massimo?: number }) {
  const visibili = persone.slice(0, massimo);
  const altri = persone.length - visibili.length;
  return (
    <span className="inline-flex items-center -space-x-1">
      {visibili.map((p) => (
        <Avatar key={p.nome} iniziali={p.iniziali} nome={p.nome} dimensione="sm" />
      ))}
      {altri > 0 && (
        <span
          className="inline-grid size-7 place-items-center rounded-full bg-surface-3 font-mono text-xs ring-2 ring-surface"
          title={persone.slice(massimo).map((p) => p.nome).join(", ")}
        >
          +{altri}
        </span>
      )}
    </span>
  );
}
