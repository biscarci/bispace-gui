import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ContatoreLimite } from "../componenti/ContatoreLimite";

describe("ContatoreLimite", () => {
  it("entro il limite: contatore senza avviso", () => {
    render(<ContatoreLimite etichetta="Revisioni planimetria" usati={1} limite={2} />);
    expect(screen.getByText("1 / 2")).toBeInTheDocument();
    expect(screen.queryByText("Oltre il limite del contratto")).not.toBeInTheDocument();
  });

  it("oltre il limite: avviso colore di accento, senza bloccare", () => {
    render(<ContatoreLimite etichetta="Revisioni planimetria" usati={3} limite={2} />);
    expect(screen.getByText("Oltre il limite del contratto")).toBeInTheDocument();
    expect(screen.getByRole("meter", { name: "Revisioni planimetria" })).toHaveAttribute(
      "aria-valuetext",
      "3 su 2, oltre il limite del contratto",
    );
  });
});
