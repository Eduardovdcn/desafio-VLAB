import { SolicitacaoForm } from "./features/solicitacoes/components/SolicitacaoForm";
import { SolicitacaoList } from "./features/solicitacoes/components/SolicitacaoList";
import { Dashboard } from "./pages/Dashboard";

export function App() {
  return (
    <main>
      <Dashboard />
      <SolicitacaoForm />
      <SolicitacaoList />
    </main>
  );
}
