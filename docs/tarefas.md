# Tarefas — Solicitações de Atendimento

Ordem de construção: schema → model/máquina de estados → Actions/endpoints → frontend consumindo cada endpoint → testes de cada peça já implementada. Dentro de cada nível, as tarefas seguem essa ordem de dependência técnica.

## Nível 1 — Eliminatório (precisa funcionar ponta a ponta)

1. **Setup do repositório e Docker Compose** — Dockerfile do backend (PHP/Laravel), Dockerfile do frontend (React), serviço PostgreSQL, rede interna, `.env.example` sem segredos reais. Critério de pronto: `docker-compose up` sobe os três serviços sem erro.
2. **Projeto Laravel inicial + conexão com PostgreSQL** — instalar Laravel, configurar `.env` para o PostgreSQL do Docker Compose, confirmar migration de teste rodando.
3. **Migration da tabela `solicitacoes`** — conforme schema do `especificacoes.md` (seção 2), incluindo índices em `status`, `categoria`, `prioridade`.
4. **Model `Solicitacao`** — casts de enum, `protocolo` como UUID gerado automaticamente na criação (`boot()` ou observer).
5. **`StatusTransicao` (máquina de estados)** — mapa de transições válidas + `podeTransicionar(atual, novo): bool`, isolado e sem dependência de HTTP.
6. **`CriarSolicitacaoRequest` + `CriarSolicitacaoAction` + endpoint `POST /api/v1/solicitacoes`** — status inicial `RECEBIDA`, validação de `justificativa_prioridade` obrigatória quando `prioridade = URGENTE`.
7. **`AtualizarStatusRequest` + `AtualizarStatusSolicitacaoAction` + endpoint `PATCH /api/v1/solicitacoes/{id}/status`** — usa `StatusTransicao::podeTransicionar()`, retorna 409 em transição inválida.
8. **Endpoint `GET /api/v1/solicitacoes/{id}`** — 404 se não existir.
9. **Endpoint `GET /api/v1/solicitacoes`** — paginação simples (sem filtros ainda).
10. **Envelope de erro consistente** — aplicar o formato JSON definido no `arquitetura.md` em todos os endpoints acima (400/404/409/500).
11. **Setup do projeto React + TypeScript** — estrutura de pastas do `especificacoes.md`, TanStack Query configurado, `api/types.ts` espelhando o contrato.
12. **`SolicitacaoForm` consumindo `POST /solicitacoes`** — formulário de criação com validação básica no cliente.
13. **`SolicitacaoList` consumindo `GET /solicitacoes`** — listagem simples (sem filtro ainda), com estados de carregamento/vazio/erro.
14. **Ação de atualizar status no frontend consumindo `PATCH .../status`** — fluxo ponta a ponta completo: criar → ver na lista → mudar status → ver refletido.
15. **README mínimo** — instruções de execução via Docker Compose, tecnologias e versões usadas.

> Ao final do Nível 1, o fluxo ponta a ponta obrigatório já existe. É o ponto de checagem mais importante do prazo — se algo vai atrasar, é melhor um Nível 1 100% sólido do que um Nível 2 pela metade.

## Nível 2 — Pontuável (buscar completar todos)

16. **Filtros em `GET /solicitacoes`** — por `status`, `categoria`, `prioridade`, combináveis via query params.
17. **Filtros no frontend (`SolicitacaoList`)** — UI de filtro conectada aos query params do endpoint.
18. **Tela `Dashboard` (resumo por status/prioridade)** — consulta agregada simples (pode ser client-side sobre os dados já paginados, ou endpoint próprio se necessário).
19. **`SolicitacaoDetail`** — tela de visualização de detalhes de uma solicitação.
20. **Responsividade e acessibilidade básica** — revisão de semântica HTML e layout em telas menores nos componentes já criados.
21. **Testes backend — matriz de transição de status** — todas as transições válidas e inválidas de `StatusTransicao`.
22. **Testes backend — validação de URGENTE sem justificativa** — Form Request rejeita corretamente.
23. **Testes backend — protocolo único** — constraint de unicidade em vigor.
24. **Teste frontend ou E2E** — escolher entre componente isolado (Vitest/RTL, mockando `solicitacoesClient`) ou fluxo completo (Cypress/Playwright contra backend real).
25. **Fallback de erro de comunicação no frontend** — estado de erro com ação de "tentar novamente" quando a API falha.
26. **README completo** — decisões arquiteturais, contratos, funcionalidades implementadas/não implementadas, como rodar testes, uso de IA.

## Nível 3 — Bônus (só depois dos níveis 1 e 2 estarem sólidos, do maior valor/esforço mais barato)

27. **Health check da API + verificação de conexão com PostgreSQL** — endpoint simples, baixo custo.
28. **Seeders com dados fictícios realistas** — facilita avaliação, baixo custo.
29. **Migrations automáticas na inicialização do container** — ajustar `docker-compose` para rodar `migrate` no boot.
30. **Especificação OpenAPI/Swagger** — formalizar o contrato já descrito no `especificacoes.md` (seção 3).
31. **Diagrama arquitetural simples** — sintetizar visualmente o `arquitetura.md` (limites de componentes + máquina de estados).
32. **Pipeline de CI** — lint, testes e build do Laravel e do React.
33. **Autenticação simples em Laravel** — só se sobrar tempo com folga real, conforme já decidido no `requisitos.md`.

Cada item acima é pensado para ser implementável e verificável isoladamente — se algum item parecer grande demais na hora de codar, é sinal de quebrar em dois antes de começar.
