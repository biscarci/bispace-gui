import { useConfigurazioneUI, type PropsLink } from "../lib/configurazione";

export type { Destinazione } from "../lib/configurazione";

/** Link interno con destinazione "libera": lo disegna il router del progetto (vedi ProviderUI). */
export function Collegamento(props: PropsLink) {
  const { Link } = useConfigurazioneUI();
  return <Link {...props} />;
}
