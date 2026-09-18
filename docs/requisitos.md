# Requisitos — Solicitações de Atendimento (Desafio Técnico V-Lab / CIn-UFPE)

## 1. Visão

Aplicação full stack para registrar, consultar, filtrar e atualizar **solicitações de atendimento** encaminhadas a unidades públicas de saúde, com frontend e backend desacoplados por uma API REST. A solução deve usar exclusivamente dados fictícios (sem informações médicas ou pessoais reais).

Stack obrigatória: **React + TypeScript** (frontend), **PHP + Laravel** (backend, API REST), **PostgreSQL** (banco de dados), **Docker + Docker Compose** (execução integrada).

## 2. Perfil-alvo (usuários do sistema)

> Assunção: o edital não descreve o usuário final em detalhe — é um domínio fictício para o desafio. Modelei um único perfil operacional, coerente com o fato de que autenticação/diferenciação de perfis é bônus (opcional) e não faz parte do MVP.

**Atendente de unidade de saúde pública** — pessoa que registra solicitações recebidas de munícipes (presencialmente, por telefone, etc.) e acompanha o andamento de cada uma até a conclusão ou cancelamento. É o único perfil que interage com o sistema nesta entrega; não há distinção de papéis/permissões enquanto autenticação não for implementada.

## 3. User Stories

Derivadas dos requisitos funcionais de frontend do edital (seção 2.3.D):

- Como atendente, quero ver um resumo das solicitações por status/prioridade na tela inicial, para ter uma visão geral rápida do volume de trabalho.
- Como atendente, quero listar solicitações com paginação e filtrar por status, categoria e prioridade, para localizar rapidamente as solicitações relevantes.
- Como atendente, quero criar uma nova solicitação preenchendo os dados do munícipe, para registrar um pedido de atendimento assim que ele chega.
- Como atendente, quero que solicitações com prioridade URGENTE exijam uma justificativa preenchida, para garantir que toda urgência seja documentada.
- Como atendente, quero visualizar os detalhes completos de uma solicitação, para conferir todas as informações antes de tomar uma decisão.
- Como atendente, quero atualizar o status de uma solicitação respeitando o fluxo permitido, para refletir o andamento real do atendimento sem risco de pular etapas.
- Como atendente, quero ver estados claros de carregamento, sucesso, vazio e erro, para saber se minha ação foi bem-sucedida ou se algo deu errado.

## 4. Requisitos não funcionais (NFRs)

- **Portabilidade/reprodutibilidade:** ambiente completo (frontend, API, banco) sobe via `docker-compose up`, sem passos manuais; configuração via variáveis de ambiente com `.env.example` versionado (sem segredos reais).
- **Segurança:** nenhuma senha/token/credencial real versionada; validação rigorosa de entradas; respostas de erro não expõem detalhes internos (stack trace, query SQL, etc.).
- **Confiabilidade/testabilidade:** lógica de transição de status centralizada (não duplicada em controllers) e testável isoladamente; testes determinísticos, independentes de dados reais.
- **Usabilidade/acessibilidade:** semântica HTML básica, layout minimamente responsivo, navegação compreensível para o atendente.
- **Manutenibilidade:** separação de responsabilidades (controllers enxutos, regra de negócio em services/actions), organização por domínio/funcionalidade tanto no backend quanto no frontend.

## 5. Escopo do MVP

O MVP desta entrega cobre integralmente os **requisitos eliminatórios** (seção 6) e os **requisitos pontuáveis centrais** descritos no edital (seção 2.3, itens A–E: modelo de dados, regras de negócio, API REST, frontend, integração/infraestrutura) — ou seja, o CRUD completo de solicitações com a máquina de estados, API REST documentada, frontend funcional cobrindo as telas do edital, e testes mínimos por camada.

Os **diferenciais bônus** (seção 2.5 do edital) ficam fora do MVP por definição — ver seção 8 ("Fora de escopo") para o recorte específico de quais diferenciais serão perseguidos se sobrar tempo e quais ficam deliberadamente de fora.

## 6. Requisitos eliminatórios (não-negociáveis)

A entrega só é pontuada se atender **todos** os itens abaixo (reproduzidos fielmente do edital, seção 2.2):

- Utilizar React com TypeScript no frontend, PHP com Laravel no backend e PostgreSQL como banco de dados.
- Apresentar integração real entre o frontend React, a API Laravel e o PostgreSQL; dados estáticos não podem substituir a integração principal.
- Implementar ao menos um fluxo ponta a ponta que inclua criação, consulta ou listagem e atualização de status.
- Persistir os dados no PostgreSQL por meio do backend Laravel.
- Respeitar as regras obrigatórias de protocolo, prioridade urgente e transição de status descritas no edital.
- Fornecer instruções suficientes para executar e avaliar a solução, incluindo configurações e migrations necessárias.
- Entregar Docker Compose para a execução integrada do frontend, da API e do banco de dados.
- Utilizar somente dados fictícios e não versionar senhas, tokens, credenciais ou outros segredos reais.

> Observação do edital: uma falha pontual e facilmente corrigível na inicialização do ambiente não invalida a entrega automaticamente, desde que haja instruções claras. Já a ausência de execução reproduzível, da stack obrigatória ou de integração real **invalida** a entrega.

## 7. Requisitos pontuáveis (por categoria, com peso na matriz de avaliação)

> Nota: o edital menciona "banco de dados" como categoria funcional (seção 2.3), mas a matriz de pontos (seção 5) não tem uma linha própria pra isso — persistência entra dentro de "Backend" e de "Documentação e execução". Mantive essa distinção abaixo para não gerar expectativa de nota que não existe.

### Backend — 15 pts
- Regras de negócio corretas (transição de status, protocolo único, justificativa obrigatória para prioridade URGENTE) — 4 pts
- API REST consistente com os endpoints sugeridos — 3 pts
- Uso coerente do Laravel (Eloquent, DI, services/actions quando fizer sentido) — 3 pts
- PostgreSQL e persistência via Eloquent/migrations — 3 pts
- Validação de entrada e tratamento de erros — 2 pts

### Frontend — 15 pts
- React + TypeScript bem tipado (evitar `any` indiscriminado) — 4 pts
- Componentização coesa — 3 pts
- Formulários com validação e mensagens claras — 3 pts
- Estados assíncronos (carregamento, sucesso, vazio, erro) e UX — 3 pts
- Responsividade e acessibilidade básica — 2 pts

### Organização e arquitetura — 15 pts
- Separação de responsabilidades (controllers enxutos, regra de negócio fora do controller) — 5 pts
- Legibilidade — 3 pts
- Organização por domínio/funcionalidade — 3 pts
- Decisões justificadas (no README/docs) — 2 pts
- Proporcionalidade das abstrações (não criar camada sem benefício demonstrável) — 2 pts

### Testes e confiabilidade — 15 pts
- Testes de backend (PHPUnit/Pest) cobrindo pelo menos uma regra de negócio relevante — 6 pts
- Teste de frontend ou E2E — 4 pts
- Relevância dos cenários testados (não só cobertura de linha) — 3 pts
- Execução determinística e isolada — 2 pts

### Validação, segurança e privacidade — 10 pts
- Validação de entradas — 4 pts
- Respostas de erro seguras (sem vazar detalhes internos) — 2 pts
- Proteção de credenciais (sem versionar segredos, uso de `.env`) — 2 pts
- Uso exclusivo de dados fictícios — 2 pts

### Documentação e execução — 5 pts
- README completo e execução reproduzível — 2 pts
- Docker Compose funcional — 1 pt
- Especificação OpenAPI — 1 pt
- Migrations e reprodutibilidade do schema — 1 pt

### Bônus — até 20 pts adicionais (não substitui os itens acima)
Ver seção 8 abaixo para a decisão sobre quais diferenciais serão perseguidos nesta entrega.

## 8. Fora de escopo nesta primeira entrega

Diferenciais técnicos (seção 2.5 do edital) que ficam **deliberadamente fora** da primeira entrega, dado o prazo de 7 dias e a falta de experiência prévia com Laravel:

- Autenticação e autorização (perfis, policies)
- Logs estruturados e correlação de requisições
- Pipeline de integração contínua (CI)
- Processamento assíncrono / filas / eventos do Laravel
- Melhorias de acessibilidade além do mínimo já exigido nos requisitos pontuáveis de frontend

Diferenciais de baixo custo que **serão perseguidos se sobrar tempo** (após níveis 1 e 2 estarem sólidos):

- Health check da API + verificação de conexão com PostgreSQL
- Seeders com dados fictícios realistas
- Migrations automáticas na inicialização do container
- Diagrama arquitetural simples (subproduto natural do `arquitetura.md`)

## Anexo — Interpretação por perfil de vaga

O edital e a matriz de pontos são idênticos para os dois perfis de candidatura (bolsa de desenvolvimento full stack e analista júnior); o que muda é a régua de expectativa da banca avaliadora, não os requisitos do sistema em si:

- **Bolsista:** avaliação foca em fundamentos, integração entre camadas, organização, compreensão do próprio código, qualidade das validações, ao menos um teste relevante e capacidade de reconhecer limitações.
- **Analista júnior:** além dos fundamentos, espera-se mais autonomia, tratamento consistente de erros, separação clara de responsabilidades, modelagem mais cuidadosa, contratos claros entre frontend/backend, testes com cenários relevantes e decisões técnicas justificadas.
