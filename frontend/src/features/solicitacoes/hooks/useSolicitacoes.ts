import { useQuery } from "@tanstack/react-query";
import { listarSolicitacoes } from "../../../api/solicitacoesClient";
import type { SolicitacoesFilters } from "../../../api/types";

export function useSolicitacoes(filters: SolicitacoesFilters = {}) {
  return useQuery({
    queryKey: ["solicitacoes", filters],
    queryFn: () => listarSolicitacoes(filters),
    retry: false,
  });
}
