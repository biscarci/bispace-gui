/** @bispace/ui · componenti e tema "Tavola". Il CSS si importa a parte: `@import "@bispace/ui/tema.css";`. */

// Collegamento al progetto (router, navigazione, errori)
export { ProviderUI } from "./componenti/ProviderUI";
export {
  href,
  useConfigurazioneUI,
  type ConfigurazioneUI,
  type Destinazione,
  type PropsLink,
} from "./lib/configurazione";

// Componenti
export { Avatar, GruppoAvatar } from "./componenti/Avatar";
export { BarraAvanzamento } from "./componenti/BarraAvanzamento";
export { BarraFasi } from "./componenti/BarraFasi";
export { CardStato } from "./componenti/CardStato";
export { Collegamento } from "./componenti/Collegamento";
export { ContatoreLimite } from "./componenti/ContatoreLimite";
export { EtichettaStato } from "./componenti/EtichettaStato";
export { CampoRicerca, FiltriPulsante, PulsanteEsporta, SelettoreFiltro, type OpzioneFiltro } from "./componenti/Filtri";
export { FinestraConferma } from "./componenti/FinestraConferma";
export { FlagCompletamento } from "./componenti/FlagCompletamento";
export { PulsanteEmail, PulsanteWhatsApp } from "./componenti/Messaggi";
export {
  AreaTesto,
  CampoData,
  CampoModulo,
  CampoOra,
  CampoSelezione,
  CampoTesto,
  SceltaSegmentata,
  type Opzione,
} from "./componenti/Moduli";
export { IndicatoreTestata, IntestazionePagina, Percorso, Riquadro, type VocePercorso } from "./componenti/Pagina";
export { PannelloLaterale } from "./componenti/PannelloLaterale";
export { ProssimoPasso } from "./componenti/ProssimoPasso";
export { Pulsante } from "./componenti/Pulsante";
export { PulsanteTondo } from "./componenti/PulsanteTondo";
export { QuadratiniFasi } from "./componenti/QuadratiniFasi";
export { ChatWhatsApp, IndirizzoEmail, NumeroTelefono, RecapitiInLinea } from "./componenti/Recapiti";
export { ElementoBloccato, RigaAttivita } from "./componenti/RigaAttivita";
export { RiquadroNumerico } from "./componenti/RiquadroNumerico";
export { Segnaposto } from "./componenti/Segnaposto";
export { SiNo } from "./componenti/SiNo";
export { Sovrapposizione, type PosizioneSovrapposizione } from "./componenti/Sovrapposizione";
export {
  AvvisoSolaLettura,
  BarraOffline,
  IndicatoreLento,
  MessaggioErrore,
  SagomaRighe,
  SagomaRiquadri,
  StatoErrore,
  StatoVuoto,
} from "./componenti/Stati";
export { Tabella, type Colonna } from "./componenti/Tabella";
export { ToastProvider } from "./componenti/Toast";
export { Data, Importo, Numero, Ora } from "./componenti/Valori";
export { RicercaGlobale, type OpzioniRicerca } from "./componenti/shell/RicercaGlobale";
export { Shell } from "./componenti/shell/Shell";
export { voceAttiva, type UtenteShell, type VoceShell } from "./lib/shell";

// Utilità
export * from "./lib/dispositivo";
export * from "./lib/fasi";
export * from "./lib/formato";
export * from "./lib/messaggi";
export * from "./lib/online";
export * from "./lib/telefoni";
export * from "./lib/toast";
export * from "./lib/toni";
