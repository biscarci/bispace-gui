import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Pulsante } from "../componenti/Pulsante";

describe("Pulsante senza connessione", () => {
  afterEach(() => vi.restoreAllMocks());

  it("disattiva i pulsanti che salvano, non quelli che chiudono o annullano", () => {
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
    render(
      <>
        <Pulsante variante="principale">Salva</Pulsante>
        <Pulsante inCorso={false}>Registra</Pulsante>
        <Pulsante>Annulla</Pulsante>
        <Pulsante richiedeRete>Segna ricevute</Pulsante>
      </>,
    );
    expect(screen.getByRole("button", { name: "Salva" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Salva" })).toHaveAttribute("title", "Sei offline: non si può salvare");
    expect(screen.getByRole("button", { name: "Registra" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Segna ricevute" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Annulla" })).toBeEnabled();
  });

  it("online restano attivi", () => {
    render(<Pulsante variante="principale">Salva</Pulsante>);
    expect(screen.getByRole("button", { name: "Salva" })).toBeEnabled();
  });
});
