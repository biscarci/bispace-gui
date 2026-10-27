import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ElementoBloccato } from "../componenti/RigaAttivita";

describe("ElementoBloccato", () => {
  it("resta visibile con lucchetto, titolo attenuato e motivo in accento", () => {
    render(
      <ul>
        <ElementoBloccato
          titolo="Invio materiali nel gruppo WhatsApp"
          motivo="Bloccato: attende la contabile della 2ª tranche"
          meta="—"
        />
      </ul>,
    );
    expect(screen.getByRole("img", { name: "Bloccata: Invio materiali nel gruppo WhatsApp" })).toBeInTheDocument();
    expect(screen.getByText("Invio materiali nel gruppo WhatsApp")).toHaveClass("text-ink-faint");
    expect(screen.getByText("Bloccato: attende la contabile della 2ª tranche")).toHaveClass("text-brand-bright");
  });

  it("non offre nessun controllo da toccare (AC-04)", () => {
    render(
      <ul>
        <ElementoBloccato titolo="Rilievo" motivo="Bloccato: attende la contabile della 1ª tranche" />
      </ul>,
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });
});
