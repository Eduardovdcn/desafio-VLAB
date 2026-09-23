import { SolicitacaoForm } from "./features/solicitacoes/components/SolicitacaoForm";
import { SolicitacaoList } from "./features/solicitacoes/components/SolicitacaoList";

export function App() {
  return (
    <main>
      <SolicitacaoForm />
      <SolicitacaoList />
    </main>
  );
}
