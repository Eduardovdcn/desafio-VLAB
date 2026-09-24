import { useState } from "react";
import { SolicitacaoDetail } from "./features/solicitacoes/components/SolicitacaoDetail";
import { SolicitacaoForm } from "./features/solicitacoes/components/SolicitacaoForm";
import { SolicitacaoList } from "./features/solicitacoes/components/SolicitacaoList";
import { Dashboard } from "./pages/Dashboard";

export function App() {
  const [selectedSolicitacaoId, setSelectedSolicitacaoId] = useState<
    number | null
  >(null);

  return (
    <main aria-label="Painel de solicitações">
      <Dashboard />
      <SolicitacaoForm />
      <SolicitacaoList onSelect={setSelectedSolicitacaoId} />
      {selectedSolicitacaoId !== null && (
        <SolicitacaoDetail
          id={selectedSolicitacaoId}
          onBack={() => setSelectedSolicitacaoId(null)}
        />
      )}
    </main>
  );
}
