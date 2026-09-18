# Arquitetura — Solicitações de Atendimento

## 1. Modelo de dados

Uma única entidade central, sem necessidade de entidades de apoio adicionais (os conjuntos de categoria/prioridade/status são pequenos e fixos, sem atributos próprios — modelados como enum/check constraint, não como tabelas normalizadas).

### Entidade `Solicitacao`

| Campo | Tipo (conceitual) | Regra |
|---|---|---|
| id | identificador único | chave primária |
| protocolo | UUID | gerado automaticamente pela aplicação na criação |
| nome_solicitante | string | nome fictício |
| categoria | enum | CONSULTA, EXAME, VACINACAO, OUTRO |
| prioridade | enum | BAIXA, MEDIA, ALTA, URGENTE |
| status | enum | RECEBIDA, EM_ANALISE, AGENDADA, CONCLUIDA, CANCELADA |
| descricao | texto | resumo da solicitação |
| justificativa_prioridade | texto, opcional | obrigatório quando `prioridade = URGENTE` |
| data_criacao | timestamp | gerado automaticamente na criação |
| data_atualizacao | timestamp | atualizado a cada modificação |

> **Decisão:** protocolo = UUID. Descartamos o formato sequencial legível (`SOL-2026-000123`) porque exigiria lidar com concorrência de geração (lock/sequence no banco) — complexidade extra que não agrega ao objetivo do desafio, já que o aprendizado de Laravel/PHP não passa por resolver esse tipo de corrida. UUID elimina o problema de colisão por construção, ao custo de não ser um identificador amigável para leitura humana.

## 2. Máquina de estados de status

Reproduzida exatamente como no edital (seção 2.3.B):

| Status atual | Próximos status permitidos |
|---|---|
| RECEBIDA | EM_ANALISE, CANCELADA |
| EM_ANALISE | AGENDADA, CANCELADA |
| AGENDADA | CONCLUIDA, CANCELADA |
| CONCLUIDA | *(nenhum — estado terminal)* |
| CANCELADA | *(nenhum — estado terminal)* |

**Por que centralizar:** a transição de status é a regra de negócio mais sensível do sistema — é literalmente o critério de "Organização e arquitetura" do edital ("transições de status devem possuir implementação central, consistente e testável"). A tabela acima vira uma única fonte de verdade (ex: um array/const mapeando status → status permitidos), consultada por uma função única (`podeTransicionar(atual, novo): bool`). O endpoint `PATCH .../status` chama essa função antes de persistir qualquer mudança; nenhum outro lugar do código reimplementa essa lógica. Isso também simplifica os testes: testar a função isoladamente cobre todas as combinações válidas/inválidas sem precisar simular requisições HTTP para cada caso.

## 3. Contrato da API (REST)

Seguindo as rotas sugeridas pelo edital sem desvio — são rotas RESTful já bem formadas, não há justificativa técnica para propor algo diferente.

| Método | Rota | Comportamento |
|---|---|---|
| POST | `/api/v1/solicitacoes` | Cria uma nova solicitação (status inicial sempre `RECEBIDA`) |
| GET | `/api/v1/solicitacoes` | Lista com paginação; filtros via query params (`status`, `categoria`, `prioridade`) |
| GET | `/api/v1/solicitacoes/{id}` | Detalhe de uma solicitação |
| PATCH | `/api/v1/solicitacoes/{id}/status` | Atualiza o status, validando contra a máquina de estados (seção 2) |

Detalhamento de corpo de requisição/resposta e validação por campo fica para o `especificacoes.md` — aqui o objetivo é fixar o contrato de alto nível.

## 4. Limites dos componentes

- **Cliente React:** SPA que consome exclusivamente a API Laravel via HTTP; não acessa o PostgreSQL diretamente, nem em nenhum momento.
- **API Laravel:** única porta de entrada para regra de negócio e persistência; concentra toda a lógica de validação, transição de status e geração de protocolo.
- **PostgreSQL:** acessível apenas pela API Laravel, dentro da rede interna do Docker Compose — não fica exposto diretamente para o cliente React nem para fora do ambiente Docker (exceto porta de debug local, se necessário).
- **Docker Compose:** orquestra os três serviços (frontend, backend, banco) numa rede interna compartilhada; expõe para o host apenas as portas do frontend e da API.

## 5. Estratégia de tratamento de erros

O edital exige "mensagens de erro claras e códigos HTTP adequados" sem especificar formato — decisão nossa.

> **Envelope de erro (JSON):**
> ```json
> {
>   "error": {
>     "code": "VALIDATION_ERROR",
>     "message": "Descrição legível do erro para quem consome a API.",
>     "details": { "campo": ["mensagem de validação"] }
>   }
> }
> ```

Códigos HTTP:
- **400** — payload malformado ou faltando campo obrigatório
- **404** — solicitação não encontrada
- **409** — transição de status inválida (conflito com a máquina de estados)
- **500** — erro inesperado (nunca expõe stack trace, query SQL ou detalhe interno na resposta)

## 6. Abordagem de testes

**Backend (PHPUnit/Pest)** — prioridade nas regras de negócio mais sensíveis, conforme pedido do edital:
1. Matriz de transição de status: todas as transições válidas passam, todas as inválidas retornam 409.
2. Prioridade URGENTE sem `justificativa_prioridade` é rejeitada (400).
3. Protocolo (UUID) é gerado automaticamente na criação e a constraint de unicidade no banco está em vigor.

**Frontend/E2E** — pelo menos um teste relevante, com liberdade de escolha entre Vitest/RTL (componente isolado, ex: validação do formulário de criação) ou Cypress/Playwright (fluxo ponta a ponta, ex: criar solicitação → ver na listagem → mudar status). A escolha específica fica para o `tarefas.md`, quando dermos o tamanho de cada tarefa.
