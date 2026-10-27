import { useSyncExternalStore } from "react";

function iscrivi(avvisa: () => void) {
  window.addEventListener("online", avvisa);
  window.addEventListener("offline", avvisa);
  return () => {
    window.removeEventListener("online", avvisa);
    window.removeEventListener("offline", avvisa);
  };
}

/** Falso quando il browser è senza connessione (flag e pulsanti si disattivano). */
export function useOnline(): boolean {
  return useSyncExternalStore(
    iscrivi,
    () => navigator.onLine,
    () => true,
  );
}
