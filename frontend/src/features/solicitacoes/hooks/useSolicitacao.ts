import { useQuery } from "@tanstack/react-query";
import { buscarSolicitacao } from "../../../api/solicitacoesClient";

export function useSolicitacao(id: number | null) {
  return useQuery({
    queryKey: ["solicitacao", id],
    queryFn: () => buscarSolicitacao(id as number),
    enabled: id !== null,
    retry: false,
  });
}
