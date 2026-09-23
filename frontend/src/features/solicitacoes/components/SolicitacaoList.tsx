import type { Categoria, Prioridade, Status } from "../../../api/types";
import { useSolicitacoes } from "../hooks/useSolicitacoes";
import { StatusUpdateAction } from "./StatusUpdateAction";

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

export function SolicitacaoList() {
  const solicitacoesQuery = useSolicitacoes();

  if (solicitacoesQuery.isPending) {
    return (
      <section className="solicitacoes-list" aria-labelledby="lista-titulo">
        <div className="list-heading">
          <div>
            <p className="eyebrow">Acompanhamento</p>
            <h2 id="lista-titulo">Solicitações registradas</h2>
          </div>
        </div>
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
                    <StatusUpdateAction solicitacao={solicitacao} />
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
