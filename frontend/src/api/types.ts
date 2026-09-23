export const CATEGORIAS = ["CONSULTA", "EXAME", "VACINACAO", "OUTRO"] as const;
export type Categoria = (typeof CATEGORIAS)[number];

export const PRIORIDADES = ["BAIXA", "MEDIA", "ALTA", "URGENTE"] as const;
export type Prioridade = (typeof PRIORIDADES)[number];

export const STATUS = [
  "RECEBIDA",
  "EM_ANALISE",
  "AGENDADA",
  "CONCLUIDA",
  "CANCELADA",
] as const;
export type Status = (typeof STATUS)[number];

export interface Solicitacao {
  id: number;
  protocolo: string;
  nome_solicitante: string;
  categoria: Categoria;
  prioridade: Prioridade;
  status: Status;
  descricao: string;
  justificativa_prioridade: string | null;
  data_criacao: string;
  data_atualizacao: string;
}

export interface CriarSolicitacaoPayload {
  nome_solicitante: string;
  categoria: Categoria;
  prioridade: Prioridade;
  descricao: string;
  justificativa_prioridade?: string;
}

export interface AtualizarStatusPayload {
  status: Exclude<Status, "RECEBIDA">;
}

export interface PaginacaoMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginacaoMeta;
  links?: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

export interface SolicitacoesFilters {
  status?: Status;
  categoria?: Categoria;
  prioridade?: Prioridade;
  page?: number;
}
