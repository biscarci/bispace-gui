import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { FlagCompletamento } from "../componenti/FlagCompletamento";

function disegna(props: Partial<Parameters<typeof FlagCompletamento>[0]> = {}) {
  const onCompleta = vi.fn();
  const onRiapri = vi.fn();
  render(<FlagCompletamento titolo="Render definitivi" fatta={false} onCompleta={onCompleta} onRiapri={onRiapri} {...props} />);
  return { onCompleta, onRiapri };
}

describe("FlagCompletamento", () => {
  afterEach(() => vi.restoreAllMocks());

  it("un tocco chiude l'attività da fare, senza conferma", async () => {
    const { onCompleta, onRiapri } = disegna();
    const flag = screen.getByRole("button", { name: "Segna come completata: Render definitivi" });
    expect(flag).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(flag);
    expect(onCompleta).toHaveBeenCalledOnce();
    expect(onRiapri).not.toHaveBeenCalled();
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("si usa da tastiera (Invio e Spazio)", async () => {
    const { onCompleta } = disegna();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: /Segna come completata/ })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    expect(onCompleta).toHaveBeenCalledTimes(2);
  });

  it("il secondo tocco chiede conferma e riapre", async () => {
    const { onCompleta, onRiapri } = disegna({ fatta: true, effettoRiapertura: "Il prossimo passo torna indietro." });
    const flag = screen.getByRole("button", { name: "Riapri: Render definitivi" });
    expect(flag).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(flag);
    const finestra = screen.getByRole("alertdialog", { name: "Riaprire «Render definitivi»?" });
    expect(finestra).toHaveTextContent("Il prossimo passo torna indietro.");
    expect(onRiapri).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Riapri" }));
    expect(onRiapri).toHaveBeenCalledOnce();
    expect(onCompleta).not.toHaveBeenCalled();
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("annullando la conferma non riapre e restituisce il focus al flag", async () => {
    const { onRiapri } = disegna({ fatta: true });
    const flag = screen.getByRole("button", { name: "Riapri: Render definitivi" });
    await userEvent.click(flag);
    expect(screen.getByRole("button", { name: "Annulla" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(onRiapri).not.toHaveBeenCalled();
    expect(flag).toHaveFocus();
  });

  it("bloccata: lucchetto, motivo per lo screen reader e nessuna azione", async () => {
    const { onCompleta } = disegna({ bloccata: true, motivoBlocco: "Bloccato: attende la contabile della 2ª tranche" });
    const flag = screen.getByRole("button", { name: "Bloccata: Render definitivi" });
    expect(flag).toHaveAttribute("aria-disabled", "true");
    expect(flag).toHaveAccessibleDescription("Bloccato: attende la contabile della 2ª tranche");
    expect(flag).toHaveAttribute("data-stato", "bloccata");
    await userEvent.click(flag);
    expect(onCompleta).not.toHaveBeenCalled();
  });

  it("in sola lettura non si può toccare", async () => {
    const { onCompleta, onRiapri } = disegna({ solaLettura: true });
    await userEvent.click(screen.getByRole("button"));
    expect(onCompleta).not.toHaveBeenCalled();
    expect(onRiapri).not.toHaveBeenCalled();
  });

  it("senza connessione si disattiva", async () => {
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
    const { onCompleta } = disegna();
    const flag = screen.getByRole("button");
    expect(flag).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(flag);
    expect(onCompleta).not.toHaveBeenCalled();
  });
});
