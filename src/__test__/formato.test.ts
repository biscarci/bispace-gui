import { describe, expect, it } from "vitest";

import {
  aData,
  formattaData,
  formattaDataLunga,
  formattaGiorno,
  formattaImporto,
  formattaOra,
  giorniLavorativiSettimana,
  iniziali,
  isoGiorno,
  scaduta,
  settimanaIso,
} from "../lib/formato";
import { linkEmail, linkWhatsApp, numeroWhatsApp } from "../lib/messaggi";

describe("date", () => {
  it("la data ISO senza ora è il giorno locale", () => {
    const d = aData("2026-10-19");
    expect([d.getFullYear(), d.getMonth(), d.getDate()]).toEqual([2026, 9, 19]);
  });

  it("gg/mm, gg/mm/aaaa, ore a 24 ore, giorni abbreviati", () => {
    expect(formattaData("2026-10-09")).toBe("09/10");
    expect(formattaData("2026-10-09", true)).toBe("09/10/2026");
    expect(formattaOra(new Date(2026, 9, 19, 14, 5))).toBe("14:05");
    expect(formattaGiorno("2026-10-19")).toBe("lun 19/10");
    expect(formattaDataLunga("2026-10-19")).toBe("Lunedì 19 ottobre");
  });

  it("settimana ISO 8601", () => {
    expect(settimanaIso("2026-10-19")).toBe(43);
    expect(settimanaIso("2027-01-01")).toBe(53); // Venerdì: ultima settimana del 2026
    expect(settimanaIso("2026-01-01")).toBe(1); // Giovedì
    expect(settimanaIso("2024-12-30")).toBe(1);
  });

  it("giorni lun–ven della settimana e confronti", () => {
    expect(giorniLavorativiSettimana("2026-10-22").map((d) => isoGiorno(d))).toEqual([
      "2026-10-19",
      "2026-10-20",
      "2026-10-21",
      "2026-10-22",
      "2026-10-23",
    ]);
    expect(scaduta("2026-10-16", "2026-10-19")).toBe(true);
    expect(scaduta("2026-10-19", "2026-10-19")).toBe(false);
  });
});

describe("importi", () => {
  it("€ 3.600, decimali solo se servono", () => {
    expect(formattaImporto(3600)).toBe("€ 3.600");
    expect(formattaImporto("3600.00")).toBe("€ 3.600");
    expect(formattaImporto(1250.5)).toBe("€ 1.250,50");
    expect(formattaImporto(980)).toBe("€ 980");
    expect(formattaImporto(null)).toBe("—");
  });
});

describe("altre utilità", () => {
  it("iniziali", () => {
    expect(iniziali("Pina", "Esposito")).toBe("PE");
    expect(iniziali("Luca")).toBe("LU");
  });

  it("link WhatsApp ed email", () => {
    expect(numeroWhatsApp("333 123 4567")).toBe("393331234567");
    expect(numeroWhatsApp("+39 333 1234567")).toBe("393331234567");
    expect(numeroWhatsApp("0039 333 1234567")).toBe("393331234567");
    expect(linkWhatsApp("Ciao Sig.ra B.", "3331234567")).toBe("https://wa.me/393331234567?text=Ciao%20Sig.ra%20B.");
    expect(linkWhatsApp("Ciao")).toBe("https://wa.me/?text=Ciao");
    expect(linkEmail("dl@studio.it", "Elaborati", "In allegato")).toBe(
      "mailto:dl@studio.it?subject=Elaborati&body=In%20allegato",
    );
  });
});
