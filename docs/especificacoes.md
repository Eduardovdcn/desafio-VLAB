# Especificações — Solicitações de Atendimento

## 1. Estrutura concreta do projeto Laravel

Padrão: **Controllers finos + Form Requests (validação) + Actions (regra de negócio)**. Ver justificativa detalhada na conversa/arquitetura — resumo: controllers só orquestram, validação e regra de negócio ficam em classes isoladas e testáveis sem precisar de uma requisição HTTP real.

```
app/
  Http/
    Controllers/
      Api/
        SolicitacaoController.php        # store, index, show, updateStatus — cada método com poucas linhas
    Requests/
      CriarSolicitacaoRequest.php        # valida payload de POST /solicitacoes
      AtualizarStatusRequest.php         # valida payload de PATCH .../status
  Actions/
    Solicitacao/
      CriarSolicitacaoAction.php         # cria com status inicial RECEBIDA e protocolo (UUID)
      ListarSolicitacoesAction.php       # listagem paginada + filtros (status, categoria, prioridade)
      AtualizarStatusSolicitacaoAction.php  # valida transição via máquina de estados e persiste
  Models/
    Solicitacao.php                      # Eloquent model, sem regra de negócio além de casts/enums
  Support/
    StatusTransicao.php                  # mapa de transições válidas + podeTransicionar()
database/
  migrations/
    xxxx_create_solicitacoes_table.php
  seeders/
    SolicitacaoSeeder.php                # dados fictícios (item de baixo custo do bônus, seção 8 do requisitos.md)
```

Justificativa curta de cada peça:
- **Controller** — só traduz HTTP ↔ Action. Não importa Eloquent diretamente para regra de negócio.
- **Form Request** — validação declarativa, reutilizável, testável isolada.
- **Action** — uma classe por operação de negócio; sem dependência de HTTP, fácil de testar via PHPUnit chamando diretamente.
- **`StatusTransicao`** — fonte única de verdade da máquina de estados (seção 2 do `arquitetura.md`); é o que `AtualizarStatusSolicitacaoAction` consulta antes de persistir.
- **Model** — fino, só mapeamento de tabela/enum/casts (ex: `protocolo` como UUID, `data_criacao`/`data_atualizacao` geridos pelos timestamps do Eloquent).

## 2. Schema do banco de dados

### Tabela `solicitacoes`

| Coluna | Tipo | Constraints |
|---|---|---|
| id | bigint | PK, auto-increment |
| protocolo | uuid | UNIQUE, NOT NULL |
| nome_solicitante | varchar(255) | NOT NULL |
| categoria | varchar / enum | NOT NULL, CHECK IN ('CONSULTA','EXAME','VACINACAO','OUTRO') |
| prioridade | varchar / enum | NOT NULL, CHECK IN ('BAIXA','MEDIA','ALTA','URGENTE') |
| status | varchar / enum | NOT NULL, CHECK IN ('RECEBIDA','EM_ANALISE','AGENDADA','CONCLUIDA','CANCELADA'), DEFAULT 'RECEBIDA' |
| descricao | text | NOT NULL |
| justificativa_prioridade | text | NULLABLE — obrigatoriedade condicional (prioridade = URGENTE) aplicada na camada de validação (Form Request), não como constraint de banco |
| data_criacao | timestamp | NOT NULL, gerado automaticamente (`created_at` do Eloquent) |
| data_atualizacao | timestamp | NOT NULL, atualizado automaticamente (`updated_at` do Eloquent) |

**Índices:** `status`, `categoria`, `prioridade` — colunas usadas nos filtros de listagem (`GET /solicitacoes`). Índice composto opcional se os filtros forem tipicamente combinados (ex: `status + prioridade`), a confirmar durante implementação conforme necessidade real de performance.

**Por que a obrigatoriedade de `justificativa_prioridade` não vira constraint de banco:** seria uma CHECK condicional (`prioridade != 'URGENTE' OR justificativa_prioridade IS NOT NULL`), o que é possível no Postgres — mas duplicaria uma regra que já está sendo validada e testada na camada de aplicação (Form Request), sem ganho real de segurança de dados nesse contexto de desafio. Mantemos a regra em um único lugar (validação), consistente com o princípio de não duplicar lógica que já usamos na máquina de estados.

## 3. Contrato de API completo

### POST /api/v1/solicitacoes
**Request:**
```json
{
  "nome_solicitante": "string, obrigatório",
  "categoria": "CONSULTA | EXAME | VACINACAO | OUTRO",
  "prioridade": "BAIXA | MEDIA | ALTA | URGENTE",
  "descricao": "string, obrigatório",
  "justificativa_prioridade": "string, obrigatório se prioridade = URGENTE"
}
```
**Resposta (201):** objeto `Solicitacao` completo, incluindo `id`, `protocolo` (UUID gerado), `status: "RECEBIDA"`, `data_criacao`, `data_atualizacao`.
**Erros:** 400 (validação — envelope de erro definido no `arquitetura.md`).

### GET /api/v1/solicitacoes
**Query params:** `status`, `categoria`, `prioridade` (todos opcionais, combináveis), `page`.
**Resposta (200):** lista paginada (`data`, `meta.current_page`, `meta.total`, etc. — padrão de paginação do Laravel).

### GET /api/v1/solicitacoes/{id}
**Resposta (200):** objeto `Solicitacao` completo.
**Erros:** 404 se não existir.

### PATCH /api/v1/solicitacoes/{id}/status
**Request:**
```json
{ "status": "EM_ANALISE | AGENDADA | CONCLUIDA | CANCELADA" }
```
**Resposta (200):** objeto `Solicitacao` atualizado.
**Erros:** 404 (não existe), 409 (transição inválida segundo a máquina de estados).

> Esta seção é a base direta da especificação OpenAPI exigida pelo edital (item pontuável em "Documentação e execução") — na implementação, o arquivo OpenAPI só formaliza o que já está descrito aqui.

## 4. Estrutura do frontend

```
src/
  api/
    solicitacoesClient.ts       # funções de chamada HTTP (create, list, getById, updateStatus)
    types.ts                    # tipos TS espelhando o contrato de API (Solicitacao, Categoria, Prioridade, Status)
  features/
    solicitacoes/
      components/
        SolicitacaoForm.tsx     # formulário de criação, com validação
        SolicitacaoList.tsx     # listagem paginada + filtros
        SolicitacaoDetail.tsx   # visualização de detalhes
        StatusUpdateAction.tsx  # ação de atualizar status (respeitando transições válidas)
      hooks/
        useSolicitacoes.ts      # estado assíncrono: carregamento, sucesso, vazio, erro
  pages/
    Dashboard.tsx                # tela inicial — resumo por status/prioridade
    SolicitacoesPage.tsx         # listagem + filtros
```

Organização por funcionalidade (`features/solicitacoes`), não por tipo de arquivo genérico — mantém junto tudo que muda junto quando essa parte do domínio evolui. Os tipos em `api/types.ts` são o ponto único de contrato entre frontend e backend: qualquer mudança na API se reflete primeiro ali, evitando `any` espalhado pelos componentes.

## 5. Dependências externas

Além da stack obrigatória (React, TypeScript, Laravel, PostgreSQL, Docker):

| Camada | Biblioteca | Status |
|---|---|---|
| Backend — testes | **PHPUnit** (bundled com Laravel) | Decidido — já vem configurado e tem mais material de apoio pra quem está começando com Laravel agora. |
| Backend — UUID | `Illuminate\Support\Str::uuid()` (nativo do Laravel) | Decidido — nenhum pacote externo necessário. |
| Frontend — data fetching / cache | **TanStack Query (React Query)** | Decidido — resolve de forma pronta os estados de carregamento/sucesso/vazio/erro exigidos pelo edital (seção D do requisitos), reduzindo boilerplate manual. |
| Frontend — formulários | Componentes controlados manuais (`useState`) | Decidido — só há 1-2 formulários no projeto; uma lib como `react-hook-form` adicionaria uma dependência nova pra um ganho pequeno nesse volume de formulários. |

Toda biblioteca aqui listada precisa ser justificada no README final, conforme exigido pelo edital (seção 2.1).

## 6. Fluxo de execução (principais operações)

**Criar solicitação:**
`SolicitacaoForm` (React) → `POST /api/v1/solicitacoes` → `CriarSolicitacaoRequest` valida → `SolicitacaoController::store()` → `CriarSolicitacaoAction` gera UUID do protocolo, define `status = RECEBIDA`, persiste via Eloquent → resposta 201 → frontend atualiza a listagem local (via cache do TanStack Query, se adotado, ou refetch manual).

**Atualizar status:**
`StatusUpdateAction` (componente) → `PATCH /api/v1/solicitacoes/{id}/status` → `AtualizarStatusRequest` valida formato → `SolicitacaoController::updateStatus()` → `AtualizarStatusSolicitacaoAction` consulta `StatusTransicao::podeTransicionar()` → se inválido, retorna 409 antes de tocar no banco; se válido, persiste e atualiza `data_atualizacao` → resposta 200 → frontend reflete o novo status.

## 7. Estratégia de testes (detalhamento)

**Backend:**
- Banco de teste: SQLite em memória (rápido, isolado) ou um Postgres de teste dedicado via Docker Compose — a definir na implementação conforme o que for mais estável no ambiente; ambos usam a trait `RefreshDatabase` do Laravel, sem necessidade de mockar o Eloquent.
- Não mockamos o Model/Eloquent nos testes de Action — testar a persistência real (contra um banco de teste) é mais barato que montar mocks e valida a regra de negócio de ponta a ponta dentro da Action.
- Arquivos: `tests/Unit/Actions/AtualizarStatusSolicitacaoActionTest.php` (matriz de transição completa), `tests/Unit/Actions/CriarSolicitacaoActionTest.php` (URGENTE exige justificativa; protocolo único).

**Frontend:**
- Testes de componente (Vitest + React Testing Library) mockam a camada `api/solicitacoesClient.ts` (via `vi.mock` ou MSW) — isso isola o componente da rede real.
- Se optar por E2E (Cypress/Playwright) em vez de teste de componente, ele roda contra o backend real (sem mock) subido via Docker Compose.
- Escolha entre as duas abordagens fica para o `tarefas.md`, junto com o tamanho da tarefa.

## 8. Fallbacks e tratamento de falha de comunicação

- Se a API não responder ou retornar erro de rede, o frontend exibe o estado de erro já previsto (seção D dos requisitos) com uma ação de "tentar novamente" — sem retry automático silencioso, para deixar claro ao atendente que algo falhou.
- Não há suporte offline nem fila local de ações pendentes — fora do escopo do MVP (edital não exige, e adicionaria complexidade desproporcional ao tempo disponível).
- Timeout de requisição: usar o padrão do `fetch`/cliente HTTP escolhido, sem configuração customizada nesta entrega.

## 9. Lint e formatação

- Backend: **Laravel Pint** (já integrado ao ecossistema Laravel, zero configuração extra).
- Frontend: **ESLint + Prettier** com as regras padrão do template Vite + React + TypeScript.

Não é item eliminatório nem pontuável na matriz principal, mas é citado como recomendação no edital (seção 2.4) — baixo custo de configurar, então incluímos.
