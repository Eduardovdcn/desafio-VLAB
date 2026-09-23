import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { atualizarStatus } from "../../../api/solicitacoesClient";
import type {
  Solicitacao,
  Status,
  AtualizarStatusPayload,
} from "../../../api/types";

type StatusAtualizavel = AtualizarStatusPayload["status"];

const proximoStatus: Record<Status, readonly StatusAtualizavel[]> = {
  RECEBIDA: ["EM_ANALISE", "CANCELADA"],
  EM_ANALISE: ["AGENDADA", "CANCELADA"],
  AGENDADA: ["CONCLUIDA", "CANCELADA"],
  CONCLUIDA: [],
  CANCELADA: [],
};

const statusLabels: Record<Status, string> = {
  RECEBIDA: "Recebida",
  EM_ANALISE: "Em análise",
  AGENDADA: "Agendada",
  CONCLUIDA: "Concluída",
  CANCELADA: "Cancelada",
};

interface StatusUpdateActionProps {
  solicitacao: Solicitacao;
}

export function StatusUpdateAction({ solicitacao }: StatusUpdateActionProps) {
  const queryClient = useQueryClient();
  const opcoesStatus = proximoStatus[solicitacao.status];
  const [novoStatus, setNovoStatus] = useState<StatusAtualizavel>(
    opcoesStatus[0] ?? "CANCELADA",
  );
  const mutation = useMutation({
    mutationFn: () => atualizarStatus(solicitacao.id, { status: novoStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["solicitacoes"] });
    },
  });

  if (opcoesStatus.length === 0) {
    return <span className="terminal-status">Estado final</span>;
  }

  return (
    <div className="status-update-action">
      <label className="visually-hidden" htmlFor={`status-${solicitacao.id}`}>
        Novo status da solicitação {solicitacao.protocolo}
      </label>
      <select
        id={`status-${solicitacao.id}`}
        value={novoStatus}
        onChange={(event) =>
          setNovoStatus(event.target.value as StatusAtualizavel)
        }
        disabled={mutation.isPending}
      >
        {opcoesStatus.map((status) => (
          <option key={status} value={status}>
            {statusLabels[status]}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Salvando..." : "Atualizar"}
      </button>
      {mutation.isError && (
        <span className="status-update-error" role="alert">
          {mutation.error instanceof Error
            ? mutation.error.message
            : "Não foi possível atualizar o status."}
        </span>
      )}
    </div>
  );
}
