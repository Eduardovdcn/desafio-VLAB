import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { criarSolicitacao } from "../../../api/solicitacoesClient";
import { SolicitacaoForm } from "./SolicitacaoForm";

vi.mock("../../../api/solicitacoesClient", () => ({
  criarSolicitacao: vi.fn(),
}));

describe("SolicitacaoForm", () => {
  beforeEach(() => {
    vi.mocked(criarSolicitacao).mockReset();
  });

  it("exibe a validação obrigatória quando a prioridade é urgente sem justificativa", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <SolicitacaoForm />
      </QueryClientProvider>,
    );

    await user.type(screen.getByLabelText(/nome do solicitante/i), "Maria Silva");
    await user.selectOptions(screen.getByLabelText(/categoria/i), "CONSULTA");
    await user.selectOptions(screen.getByLabelText(/prioridade/i), "URGENTE");
    await user.type(
      screen.getByLabelText(/descrição/i),
      "Solicitação urgente para atendimento rápido.",
    );

    await user.click(screen.getByRole("button", { name: /criar solicitação/i }));

    expect(
      await screen.findByText(
        /a justificativa é obrigatória para prioridade urgente\./i,
      ),
    ).toBeInTheDocument();
    expect(criarSolicitacao).not.toHaveBeenCalled();
  });
});
