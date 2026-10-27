import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { useToast } from "../lib/toast";
import { ToastProvider } from "../componenti/Toast";

function Prova({ annulla }: { annulla?: () => void }) {
  const toast = useToast();
  return (
    <button type="button" onClick={() => toast.mostra({ messaggio: "Chiusa alle 10:42", annulla })}>
      mostra
    </button>
  );
}

describe("Toast", () => {
  it("compare come regione di stato e sparisce dopo 4 secondi", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    render(
      <ToastProvider>
        <Prova />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByRole("button", { name: "mostra" }));
    expect(screen.getByRole("status")).toHaveTextContent("Chiusa alle 10:42");
    act(() => vi.advanceTimersByTime(4100));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it("'Annulla' esegue il ritorno indietro e chiude", async () => {
    const annulla = vi.fn();
    render(
      <ToastProvider>
        <Prova annulla={annulla} />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByRole("button", { name: "mostra" }));
    await userEvent.click(screen.getByRole("button", { name: "Annulla" }));
    expect(annulla).toHaveBeenCalledOnce();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
