import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { StatoVisivoFase } from "../lib/fasi";
import { BarraFasi } from "../componenti/BarraFasi";
import { QuadratiniFasi } from "../componenti/QuadratiniFasi";

const NOMI = ["Avvio", "Planimetria", "Render", "Social", "Elaborati", "Showroom", "Cantiere", "Complementi", "Montaggi", "Riprese"];

/** Concluse prima della fase corrente, da fare dopo. */
function stati(corrente: number, ritardo = false): StatoVisivoFase[] {
  return NOMI.map((_, i) => (i + 1 < corrente ? "conclusa" : i + 1 > corrente ? "da_fare" : ritardo ? "ritardo" : "in_corso"));
}

describe("BarraFasi", () => {
  it("dieci segmenti con numero e nome; la fase in corso è evidenziata", () => {
    render(<BarraFasi fasi={stati(3)} nomi={NOMI} />);
    const elenco = screen.getByRole("list");
    const voci = within(elenco).getAllByRole("listitem");
    expect(voci).toHaveLength(10);
    expect(voci[0]).toHaveTextContent("1 · Avvio");
    expect(voci[9]).toHaveTextContent("10 · Riprese");
    expect(voci[2]).toHaveAttribute("aria-current", "step");
    expect(voci[2]).toHaveAttribute("data-stato", "in_corso");
    expect(voci[0]).not.toHaveAttribute("aria-current");
    // Lo stato si legge anche a parole.
    expect(voci[0]).toHaveTextContent("conclusa");
  });

  it("con onSeleziona le fasi si aprono da pulsanti", async () => {
    const onSeleziona = vi.fn();
    render(<BarraFasi fasi={stati(3)} nomi={NOMI} selezionata={1} onSeleziona={onSeleziona} />);
    const prima = screen.getByRole("button", { name: "1 · Avvio: fase conclusa" });
    expect(prima).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(screen.getByRole("button", { name: "2 · Planimetria: fase conclusa" }));
    expect(onSeleziona).toHaveBeenCalledWith(2);
  });
});

describe("QuadratiniFasi", () => {
  it("riassume lo stato per lo screen reader e mostra il dettaglio al passaggio", () => {
    render(<QuadratiniFasi fasi={stati(2, true)} nomi={NOMI} />);
    const gruppo = screen.getByRole("img");
    expect(gruppo).toHaveAccessibleName("Fasi concluse 1 su 10 · 2ª Planimetria in ritardo");
    expect(screen.getByTitle("Fase 2 · Planimetria: in ritardo")).toHaveClass("bg-brand");
    expect(screen.getByTitle("Fase 1 · Avvio: conclusa")).toHaveClass("bg-ok");
    expect(screen.getByTitle("Fase 3 · Render: da fare")).toHaveClass("bg-rule-soft");
  });
});
