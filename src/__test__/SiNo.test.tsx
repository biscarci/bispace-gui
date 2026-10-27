import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SiNo } from "../componenti/SiNo";

describe("SiNo", () => {
  it("è un gruppo con nome; Sì risponde subito", async () => {
    const onRispondi = vi.fn();
    render(<SiNo titolo="Check TL sulla fattibilità" valore={null} onRispondi={onRispondi} />);
    const gruppo = screen.getByRole("group", { name: "Check TL sulla fattibilità" });
    expect(gruppo).toBeInTheDocument();
    const si = screen.getByRole("button", { name: "Sì" });
    expect(si).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(si);
    expect(onRispondi).toHaveBeenCalledWith(true);
  });

  it("mostra la risposta registrata con aria-pressed e colore", () => {
    render(<SiNo titolo="Moodboard" valore={false} onRispondi={() => {}} />);
    const no = screen.getByRole("button", { name: "No" });
    expect(no).toHaveAttribute("aria-pressed", "true");
    expect(no.className).toContain("bg-brand");
    expect(screen.getByRole("button", { name: "Sì" })).toHaveAttribute("aria-pressed", "false");
  });

  it("ritoccare la risposta già data non fa nulla", async () => {
    const onRispondi = vi.fn();
    render(<SiNo titolo="Moodboard" valore={true} onRispondi={onRispondi} />);
    await userEvent.click(screen.getByRole("button", { name: "Sì" }));
    expect(onRispondi).not.toHaveBeenCalled();
  });

  it("il No con effetto chiede conferma e dice cosa succederà", async () => {
    const onRispondi = vi.fn();
    render(
      <SiNo
        titolo="Check ARK* sulle bozze render"
        valore={null}
        onRispondi={onRispondi}
        effettoNo="Il progetto torna alla modellazione. Revisioni: 2 su 2."
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "No" }));
    expect(onRispondi).not.toHaveBeenCalled();
    expect(screen.getByRole("alertdialog")).toHaveTextContent("Revisioni: 2 su 2.");
    await userEvent.click(screen.getByRole("button", { name: "Conferma il No" }));
    expect(onRispondi).toHaveBeenCalledWith(false);
  });

  it("annullando la conferma del No non risponde", async () => {
    const onRispondi = vi.fn();
    render(<SiNo titolo="Check" valore={null} onRispondi={onRispondi} effettoNo="Torna indietro." />);
    await userEvent.click(screen.getByRole("button", { name: "No" }));
    await userEvent.click(screen.getByRole("button", { name: "Annulla" }));
    expect(onRispondi).not.toHaveBeenCalled();
  });

  it("le risposte registrate da altri sono in sola lettura", async () => {
    const onRispondi = vi.fn();
    render(<SiNo titolo="Check TL" valore={true} onRispondi={onRispondi} solaLettura />);
    expect(screen.getByRole("button", { name: "No" })).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "No" }));
    expect(onRispondi).not.toHaveBeenCalled();
  });
});
