import type { LucideIcon } from "lucide-react";

/** Voce di menu. Le voci da mostrare (es. secondo il profilo) le sceglie il progetto. */
export interface VoceShell {
  etichetta: string;
  to: string;
  icona: LucideIcon;
  /** Percorsi che rendono attiva la voce (es. Clienti anche su /direttori). */
  prefissi?: string[];
  /** Numero sul badge della voce (0 o assente = nessun badge). */
  badge?: number;
}

export interface UtenteShell {
  nome: string;
  iniziali: string;
  /** Ruolo sotto il nome (es. "Team leader"). */
  ruolo?: string;
  /** Pagina "Il mio profilo" aperta dall'avatar. */
  linkProfilo: string;
}

export function voceAttiva(voce: Pick<VoceShell, "to" | "prefissi">, percorso: string): boolean {
  if (voce.to === "/") return percorso === "/";
  return (voce.prefissi ?? [voce.to]).some((p) => percorso === p || percorso.startsWith(`${p}/`));
}
