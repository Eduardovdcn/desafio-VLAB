import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SolicitacaoList } from "./SolicitacaoList";

describe("SolicitacaoList", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("exibe um botão de tentar novamente quando a listagem falha", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    vi.spyOn(globalThis, "fetch")
      .mockRejectedValueOnce(new Error("Falha de rede"))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [],
          meta: {
            current_page: 1,
            from: null,
            last_page: 1,
            per_page: 15,
            to: null,
            total: 0,
          },
        }),
      } as Response);

    render(
      <QueryClientProvider client={queryClient}>
        <SolicitacaoList onSelect={() => {}} />
      </QueryClientProvider>,
    );

    expect(await screen.findByRole("alert")).toHaveTextContent("Falha de rede");
    expect(
      screen.getByRole("button", { name: /tentar novamente/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /tentar novamente/i }));

    expect(
      await screen.findByText(/nenhuma solicitação registrada ainda/i),
    ).toBeInTheDocument();
  });
});
