import { describe, expect, it } from "vitest";

import { formattaTelefono, linkChatWhatsApp } from "../lib/telefoni";

describe("numeri in E.164", () => {
  it("mostra cellulari e fissi italiani a gruppi", () => {
    expect(formattaTelefono("+393331234567")).toBe("+39 333 123 4567");
    expect(formattaTelefono("+390811234567")).toBe("+39 081 1234567");
    expect(formattaTelefono("+39061234567")).toBe("+39 06 1234567");
  });

  it("lascia leggibili i numeri esteri", () => {
    expect(formattaTelefono("+41791234567")).toBe("+41 791234567");
  });

  it("apre la chat WhatsApp senza testo", () => {
    expect(linkChatWhatsApp("+393331234567")).toBe("https://wa.me/393331234567");
  });
});
