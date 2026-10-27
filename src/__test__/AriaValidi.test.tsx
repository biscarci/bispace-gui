import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ContatoreLimite } from "../componenti/ContatoreLimite";

describe("attributi ARIA validi", () => {
  it("oltre il limite aria-valuenow non supera aria-valuemax", () => {
    render(<ContatoreLimite etichetta="Revisioni planimetria" usati={3} limite={2} />);
    const meter = screen.getByRole("meter");
    expect(Number(meter.getAttribute("aria-valuenow"))).toBeLessThanOrEqual(Number(meter.getAttribute("aria-valuemax")));
    expect(meter).toHaveAttribute("aria-valuetext", "3 su 2, oltre il limite del contratto");
  });
});
