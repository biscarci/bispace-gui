import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { Tabella, type Colonna } from "../componenti/Tabella";

interface Riga {
  id: number;
  nome: string;
  zona: string;
}

const COLONNE: Colonna<Riga>[] = [
  { chiave: "nome", intestazione: "Progetto", principale: true, cella: (r) => r.nome },
  { chiave: "zona", intestazione: "Zona", cella: (r) => r.zona },
];
const RIGHE = [
  { id: 1, nome: "Residenza B.", zona: "Posillipo" },
  { id: 2, nome: "Residenza R.", zona: "Vomero" },
];

/** Senza ProviderUI i link della tabella sono semplici <a href>. */
async function mostra(contenuto: ReactNode) {
  render(<>{contenuto}</>);
}

describe("Tabella", () => {
  it("tabella da computer e schede da smartphone con le stesse righe", async () => {
    await mostra(<Tabella etichetta="Progetti" colonne={COLONNE} righe={RIGHE} chiaveRiga={(r) => r.id} />);
    const tabella = screen.getByRole("table", { name: "Progetti" });
    expect(within(tabella).getAllByRole("columnheader").map((c) => c.textContent)).toEqual(["Progetto", "Zona"]);
    expect(within(tabella).getAllByRole("row")).toHaveLength(3);
    const schede = screen.getByRole("list", { name: "Progetti" });
    expect(within(schede).getAllByRole("listitem")).toHaveLength(2);
    expect(within(schede).getAllByText("Zona")).toHaveLength(2);
  });

  it("l'intera riga apre l'elemento; da tastiera c'è un pulsante vero", async () => {
    const onApriRiga = vi.fn();
    await mostra(
      <Tabella etichetta="Progetti" colonne={COLONNE} righe={RIGHE} chiaveRiga={(r) => r.id} onApriRiga={onApriRiga} />,
    );
    const tabella = screen.getByRole("table");
    await userEvent.click(within(tabella).getByText("Vomero"));
    expect(onApriRiga).toHaveBeenLastCalledWith(RIGHE[1]);
    within(tabella).getByRole("button", { name: "Residenza B." }).focus();
    await userEvent.keyboard("{Enter}");
    expect(onApriRiga).toHaveBeenLastCalledWith(RIGHE[0]);
  });

  it("il link della riga ha come nome il testo visibile, senza aria-label (WCAG 2.5.3)", async () => {
    const colonne: Colonna<Riga>[] = [{ ...COLONNE[0], testoLink: (r) => `Apri la scheda di ${r.nome}` }, COLONNE[1]];
    await mostra(
      <Tabella
        etichetta="Progetti"
        colonne={colonne}
        righe={RIGHE}
        chiaveRiga={(r) => r.id}
        linkRiga={(r) => ({ to: "/progetti/$id", params: { id: r.id } })}
      />,
    );
    const link = within(screen.getByRole("table")).getByRole("link", { name: "Residenza B." });
    expect(link).not.toHaveAttribute("aria-label");
    expect(link).toHaveAttribute("href", "/progetti/1");
  });

  it("senza righe mostra lo stato vuoto", async () => {
    await mostra(
      <Tabella
        etichetta="Progetti"
        colonne={COLONNE}
        righe={[]}
        chiaveRiga={(r) => r.id}
        vuoto={<p>Nessun progetto in ritardo.</p>}
      />,
    );
    expect(await screen.findByText("Nessun progetto in ritardo.")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});
