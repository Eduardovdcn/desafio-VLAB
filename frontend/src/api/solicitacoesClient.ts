import type {
  ApiError,
  AtualizarStatusPayload,
  Categoria,
  CriarSolicitacaoPayload,
  PaginatedResponse,
  Prioridade,
  Solicitacao,
  SolicitacoesFilters,
  Status,
} from "./types";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const error = (await response.json()) as ApiError;
    throw new Error(
      error.error?.message ?? "Não foi possível concluir a requisição.",
    );
  }

  return response.json() as Promise<T>;
}

export function criarSolicitacao(payload: CriarSolicitacaoPayload) {
  return request<Solicitacao>("/solicitacoes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function listarSolicitacoes(filters: SolicitacoesFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) params.set(key, String(value));
  });

  const query = params.toString();
  return request<PaginatedResponse<Solicitacao>>(
    `/solicitacoes${query ? `?${query}` : ""}`,
  );
}

export function buscarSolicitacao(id: number) {
  return request<Solicitacao>(`/solicitacoes/${id}`);
}

export function atualizarStatus(id: number, payload: AtualizarStatusPayload) {
  return request<Solicitacao>(`/solicitacoes/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export type { Categoria, Prioridade, Status };
