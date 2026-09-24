import type { Categoria, Prioridade, Status } from "../../../api/types";
import { useSolicitacao } from "../hooks/useSolicitacao";

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

interface SolicitacaoDetailProps {
  id: number;
  onBack: () => void;
}

export function SolicitacaoDetail({ id, onBack }: SolicitacaoDetailProps) {
  const solicitacaoQuery = useSolicitacao(id);

  return (
    <section className="solicitacao-detail" aria-labelledby="detalhe-titulo">
      <div className="detail-heading">
        <div>
          <p className="eyebrow">Visualização</p>
          <h2 id="detalhe-titulo">Detalhes da solicitação</h2>
        </div>
        <button type="button" className="button-secondary" onClick={onBack}>
          Voltar para a lista
        </button>
      </div>

      {solicitacaoQuery.isPending && (
        <p className="detail-state" role="status">
          Carregando detalhes...
        </p>
      )}

      {solicitacaoQuery.isError && (
        <p className="detail-state detail-state-error" role="alert">
          {solicitacaoQuery.error instanceof Error
            ? solicitacaoQuery.error.message
            : "Não foi possível carregar os detalhes."}
        </p>
      )}

      {solicitacaoQuery.data && (
        <div className="detail-content">
          <div className="detail-protocol">
            <span className="detail-label">Protocolo</span>
            <strong>{solicitacaoQuery.data.protocolo}</strong>
          </div>

          <dl className="detail-grid">
            <div>
              <dt>Solicitante</dt>
              <dd>{solicitacaoQuery.data.nome_solicitante}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{statusLabels[solicitacaoQuery.data.status]}</dd>
            </div>
            <div>
              <dt>Categoria</dt>
              <dd>{categoriaLabels[solicitacaoQuery.data.categoria]}</dd>
            </div>
            <div>
              <dt>Prioridade</dt>
              <dd>{prioridadeLabels[solicitacaoQuery.data.prioridade]}</dd>
            </div>
            <div className="detail-field-wide">
              <dt>Descrição</dt>
              <dd>{solicitacaoQuery.data.descricao}</dd>
            </div>
            {solicitacaoQuery.data.justificativa_prioridade && (
              <div className="detail-field-wide">
                <dt>Justificativa da prioridade</dt>
                <dd>{solicitacaoQuery.data.justificativa_prioridade}</dd>
              </div>
            )}
            <div>
              <dt>Data de criação</dt>
              <dd>{formatDate(solicitacaoQuery.data.data_criacao)}</dd>
            </div>
            <div>
              <dt>Última atualização</dt>
              <dd>{formatDate(solicitacaoQuery.data.data_atualizacao)}</dd>
            </div>
          </dl>
        </div>
      )}
    </section>
  );
}
