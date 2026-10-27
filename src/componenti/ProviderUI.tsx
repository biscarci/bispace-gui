import type { ReactNode } from "react";

import { ContestoUI, type ConfigurazioneUI } from "../lib/configurazione";

/** Collega la libreria al progetto: router, navigazione e testo degli errori (vedi lib/configurazione.ts). */
export function ProviderUI({ configurazione, children }: { configurazione: ConfigurazioneUI; children: ReactNode }) {
  return <ContestoUI.Provider value={configurazione}>{children}</ContestoUI.Provider>;
}
