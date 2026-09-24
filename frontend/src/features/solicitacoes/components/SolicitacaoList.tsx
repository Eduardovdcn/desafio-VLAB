import { useState, type FormEvent } from "react";
import {
  CATEGORIAS,
  PRIORIDADES,
  STATUS,
  type Categoria,
  type Prioridade,
  type SolicitacoesFilters,
  type Status,
} from "../../../api/types";
import { useSolicitacoes } from "../hooks/useSolicitacoes";
import { StatusUpdateAction } from "./StatusUpdateAction";

interface SolicitacaoListProps {
  onSelect: (id: number) => void;
}

const categoriaLabels: Record<Categoria, string> = {
  CONSULTA: "Consulta",
  EXAME: "Exame",
  VACINACAO: "Vacinação",
  OUTRO: "Outro",
};

const prioridadeLabels: Record<Prioridade, string> = {
  BAIXA: "Baixa",
  MEDIA: "Média",
  ALTA: "Alta",
  URGENTE: "Urgente",
};

const statusLabels: Record<Status, string> = {
  RECEBIDA: "Recebida",
  EM_ANALISE: "Em análise",
  AGENDADA: "Agendada",
  CONCLUIDA: "Concluída",
  CANCELADA: "Cancelada",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

export function SolicitacaoList({ onSelect }: SolicitacaoListProps) {
  const [draftFilters, setDraftFilters] = useState<SolicitacoesFilters>({});
  const [appliedFilters, setAppliedFilters] = useState<SolicitacoesFilters>({});
  const solicitacoesQuery = useSolicitacoes(appliedFilters);

  function updateFilter(field: keyof SolicitacoesFilters, value: string) {
    setDraftFilters((current) => ({
      ...current,
      [field]: value || undefined,
    }));
  }

  function handleFilterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAppliedFilters(draftFilters);
  }

  function clearFilters() {
    setDraftFilters({});
    setAppliedFilters({});
  }

  const filtrosAtivos = Object.values(appliedFilters).some(
    (value) => value !== undefined,
  );

  function renderFilters() {
    return (
      <form className="solicitacao-filtros" onSubmit={handleFilterSubmit}>
        <div className="filtros-grid">
          <div className="form-field">
            <label htmlFor="filtro-status">Status</label>
            <select
              id="filtro-status"
              value={draftFilters.status ?? ""}
              onChange={(event) => updateFilter("status", event.target.value)}
            >
              <option value="">Todos os status</option>
              {STATUS.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="filtro-categoria">Categoria</label>
            <select
              id="filtro-categoria"
              value={draftFilters.categoria ?? ""}
              onChange={(event) =>
                updateFilter("categoria", event.target.value)
              }
            >
              <option value="">Todas as categorias</option>
              {CATEGORIAS.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoriaLabels[categoria]}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="filtro-prioridade">Prioridade</label>
            <select
              id="filtro-prioridade"
              value={draftFilters.prioridade ?? ""}
              onChange={(event) =>
                updateFilter("prioridade", event.target.value)
              }
            >
              <option value="">Todas as prioridades</option>
              {PRIORIDADES.map((prioridade) => (
                <option key={prioridade} value={prioridade}>
                  {prioridadeLabels[prioridade]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="filtros-actions">
          <button type="submit">Aplicar filtros</button>
          {filtrosAtivos && (
            <button
              type="button"
              className="button-secondary"
              onClick={clearFilters}
            >
              Limpar filtros
            </button>
          )}
        </div>
      </form>
    );
  }

  if (solicitacoesQuery.isPending) {
    return (
      <section className="solicitacoes-list" aria-labelledby="lista-titulo">
        <div className="list-heading">
          <div>
            <p className="eyebrow">Acompanhamento</p>
            <h2 id="lista-titulo">Solicitações registradas</h2>
          </div>
        </div>
        {renderFilters()}
        <p className="list-state" role="status">
          Carregando solicitações...
        </p>
      </section>
    );
  }

  if (solicitacoesQuery.isError) {
    return (
      <section className="solicitacoes-list" aria-labelledby="lista-titulo">
        <div className="list-heading">
          <div>
            <p className="eyebrow">Acompanhamento</p>
            <h2 id="lista-titulo">Solicitações registradas</h2>
          </div>
        </div>
        {renderFilters()}
        <div className="list-state list-state-error" role="alert">
          <p>
            {solicitacoesQuery.error instanceof Error
              ? solicitacoesQuery.error.message
              : "Não foi possível carregar as solicitações."}
          </p>
        </div>
      </section>
    );
  }

  const solicitacoes = solicitacoesQuery.data.data;

  return (
    <section className="solicitacoes-list" aria-labelledby="lista-titulo">
      <div className="list-heading">
        <div>
          <p className="eyebrow">Acompanhamento</p>
          <h2 id="lista-titulo">Solicitações registradas</h2>
        </div>
        <span className="list-count">
          {solicitacoesQuery.data.meta.total} registrada(s)
        </span>
      </div>

      {renderFilters()}

      {solicitacoes.length === 0 ? (
        <p className="list-state">Nenhuma solicitação registrada ainda.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <caption className="visually-hidden">
              Lista de solicitações registradas
            </caption>
            <thead>
              <tr>
                <th scope="col">Protocolo</th>
                <th scope="col">Solicitante</th>
                <th scope="col">Categoria</th>
                <th scope="col">Prioridade</th>
                <th scope="col">Status</th>
                <th scope="col">Criada em</th>
                <th scope="col">Ação</th>
              </tr>
            </thead>
            <tbody>
              {solicitacoes.map((solicitacao) => (
                <tr key={solicitacao.id}>
                  <td data-label="Protocolo">{solicitacao.protocolo}</td>
                  <td data-label="Solicitante">
                    {solicitacao.nome_solicitante}
                  </td>
                  <td data-label="Categoria">
                    {categoriaLabels[solicitacao.categoria]}
                  </td>
                  <td data-label="Prioridade">
                    {prioridadeLabels[solicitacao.prioridade]}
                  </td>
                  <td data-label="Status">
                    <span
                      className={`status status-${solicitacao.status.toLowerCase()}`}
                    >
                      {statusLabels[solicitacao.status]}
                    </span>
                  </td>
                  <td data-label="Criada em">
                    {formatDate(solicitacao.data_criacao)}
                  </td>
                  <td data-label="Ação">
                    <div className="list-actions">
                      <button
                        type="button"
                        className="button-secondary detail-button"
                        onClick={() => onSelect(solicitacao.id)}
                      >
                        Ver detalhes
                      </button>
                      <StatusUpdateAction solicitacao={solicitacao} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
