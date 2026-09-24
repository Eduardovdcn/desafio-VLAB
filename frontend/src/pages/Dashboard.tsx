import { CATEGORIAS, PRIORIDADES, STATUS } from "../api/types";
import { useSolicitacoes } from "../features/solicitacoes/hooks/useSolicitacoes";

const statusLabels = {
  RECEBIDA: "Recebidas",
  EM_ANALISE: "Em análise",
  AGENDADA: "Agendadas",
  CONCLUIDA: "Concluídas",
  CANCELADA: "Canceladas",
};

const prioridadeLabels = {
  BAIXA: "Baixa",
  MEDIA: "Média",
  ALTA: "Alta",
  URGENTE: "Urgente",
};

function countBy<T extends string>(values: T[], options: readonly T[]) {
  return options.map((option) => ({
    key: option,
    count: values.filter((value) => value === option).length,
  }));
}

export function Dashboard() {
  const solicitacoesQuery = useSolicitacoes();

  if (solicitacoesQuery.isPending) {
    return (
      <section className="dashboard" aria-labelledby="dashboard-titulo">
        <div className="dashboard-heading">
          <p className="eyebrow">Visão geral</p>
          <h1 id="dashboard-titulo">Resumo das solicitações</h1>
        </div>
        <p className="dashboard-state" role="status">
          Carregando resumo...
        </p>
      </section>
    );
  }

  if (solicitacoesQuery.isError) {
    return (
      <section className="dashboard" aria-labelledby="dashboard-titulo">
        <div className="dashboard-heading">
          <p className="eyebrow">Visão geral</p>
          <h1 id="dashboard-titulo">Resumo das solicitações</h1>
        </div>
        <div className="dashboard-state dashboard-state-error" role="alert">
          <p>
            {solicitacoesQuery.error instanceof Error
              ? solicitacoesQuery.error.message
              : "Não foi possível carregar o resumo."}
          </p>
          <button
            type="button"
            className="button-secondary retry-button"
            onClick={() => solicitacoesQuery.refetch()}
          >
            Tentar novamente
          </button>
        </div>
      </section>
    );
  }

  const solicitacoes = solicitacoesQuery.data.data;
  const statusCounts = countBy(
    solicitacoes.map((solicitacao) => solicitacao.status),
    STATUS,
  );
  const prioridadeCounts = countBy(
    solicitacoes.map((solicitacao) => solicitacao.prioridade),
    PRIORIDADES,
  );
  const categoriasAtivas = CATEGORIAS.filter((categoria) =>
    solicitacoes.some((solicitacao) => solicitacao.categoria === categoria),
  ).length;

  return (
    <section className="dashboard" aria-labelledby="dashboard-titulo">
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">Visão geral</p>
          <h1 id="dashboard-titulo">Resumo das solicitações</h1>
          <p>
            Acompanhe a distribuição da página atual da listagem por status e
            prioridade.
          </p>
        </div>
        <span className="dashboard-total">
          {solicitacoesQuery.data.meta.total} no total
        </span>
      </div>

      <div className="dashboard-metrics">
        <article className="metric-card metric-card-highlight">
          <span className="metric-label">Na página atual</span>
          <strong>{solicitacoes.length}</strong>
          <span>solicitação(ões) carregada(s)</span>
        </article>
        <article className="metric-card">
          <span className="metric-label">Categorias presentes</span>
          <strong>{categoriasAtivas}</strong>
          <span>de {CATEGORIAS.length} categorias</span>
        </article>
      </div>

      <div className="dashboard-columns">
        <div className="dashboard-panel">
          <h2>Por status</h2>
          <div className="summary-list">
            {statusCounts.map(({ key, count }) => (
              <div className="summary-row" key={key}>
                <span>{statusLabels[key]}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-panel">
          <h2>Por prioridade</h2>
          <div className="summary-list">
            {prioridadeCounts.map(({ key, count }) => (
              <div className="summary-row" key={key}>
                <span>{prioridadeLabels[key]}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
