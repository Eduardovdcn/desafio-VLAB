# Solicitações de Atendimento

Aplicação full stack para registrar, listar e atualizar solicitações de atendimento.

O projeto foi montado com:
- Frontend em React + TypeScript + Vite
- Backend em Laravel + PHP
- PostgreSQL como banco principal
- Docker Compose para orquestração local

## 1. Visão geral

O sistema permite:
- criar uma solicitação com categoria, prioridade, descrição e justificativa quando necessário;
- listar solicitações com paginação e filtros por status, categoria e prioridade;
- atualizar o status seguindo a máquina de estados; e
- visualizar detalhes da solicitação em uma tela específica.

A arquitetura segue o padrão solicitado no desafio:
- Form Request para validar entrada
- Controller fino
- Action por operação de negócio
- StatusTransicao como fonte única de verdade das regras de transição

## 2. Stack e versões

- React 19
- TypeScript 5.8
- Vite 7
- TanStack Query 5
- PHP 8.5
- Laravel 13
- PostgreSQL 18
- Docker Compose

## 3. Decisões arquiteturais

### 3.1 A máquina de estados

A regra de transição de status está centralizada em `App\Support\StatusTransicao` e não duplicada em controllers ou frontend.

Fluxo definido:
- RECEBIDA -> EM_ANALISE ou CANCELADA
- EM_ANALISE -> AGENDADA ou CANCELADA
- AGENDADA -> CONCLUIDA ou CANCELADA
- CONCLUIDA e CANCELADA são estados finais

Isso garante que qualquer atualização de status passe pela mesma regra e fique fácil de testar.

### 3.2 UUID para protocolo

O campo `protocolo` usa UUID gerado pela aplicação (`Str::uuid()`) e é único no banco.

A escolha foi feita para evitar problemas de concorrência e manter um identificador estável e globalmente exclusivo.

### 3.3 Contrato API

O backend expõe as rotas REST em `/api/v1`:
- `POST /api/v1/solicitacoes`
- `GET /api/v1/solicitacoes`
- `GET /api/v1/solicitacoes/{id}`
- `PATCH /api/v1/solicitacoes/{id}/status`

As respostas de erro seguem o envelope definido no projeto:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Descrição legível do erro para quem consome a API.",
    "details": {
      "campo": ["mensagem de validação"]
    }
  }
}
```

## 4. Setup do ambiente local

Pré-requisito:
- Docker Desktop ou Docker Engine com Docker Compose habilitado

### 4.1 Configuração do ambiente

Crie o arquivo `.env` a partir do exemplo:

```powershell
Copy-Item .env.example .env
```

No arquivo `.env`, defina uma senha para PostgreSQL:

```env
POSTGRES_PASSWORD=sua_senha_local
```

### 4.2 Subir o projeto

No diretório raiz do projeto:

```powershell
docker compose up --build
```

O Compose sobe:
- frontend em http://localhost:5173
- backend em http://localhost:8000
- PostgreSQL na rede interna do Compose

Para encerrar:

```powershell
docker compose down
```

Para remover também os dados persistidos do banco:

```powershell
docker compose down -v
```

## 5. Estrutura principal do repositório

```text
.
├── backend/
│   ├── app/
│   │   ├── Actions/
│   │   ├── Enums/
│   │   ├── Http/
│   │   ├── Models/
│   │   └── Support/
│   ├── database/
│   ├── tests/
│   └── ...
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
├── docs/
│   ├── arquitetura.md
│   ├── especificacoes.md
│   ├── requisitos.md
│   └── tarefas.md
├── docker-compose.yml
├── .env.example
├── README.md
└── ...
```

## 6. Funcionalidades implementadas

### Backend
- criação de solicitação com validação de payload
- status inicial sempre `RECEBIDA`
- validação de `justificativa_prioridade` quando prioridade é `URGENTE`
- atualização de status com validação da máquina de estados
- listagem paginada
- endpoints de detalhe, listagem e atualização
- envelope de erro consistente para 400, 404, 409 e 500
- unicidade do protocolo UUID

### Frontend
- formulário de criação da solicitação
- listagem com carregamento, vazio, erro e filtros básicos
- atualização de status diretamente na tabela
- dashboard resumindo status e prioridade
- tela de detalhes da solicitação
- fallback de erro com botão “Tentar novamente”
- ajustes de responsividade e acessibilidade básica

## 7. Funcionalidades não implementadas / fora do escopo atual

Alguns itens do backlog permanecem pendentes, conforme a sequência do nível 2 e nível 3:
- filtros completos por query params no backend e frontend (já parcialmente cobertos na base atual)
- testes E2E ou de UI mais amplos
- seeders de dados
- health check da API
- OpenAPI/Swagger
- CI/CD
- autenticação

A ideia do projeto é entregar o fluxo principal estável antes de avançar para itens pontuáveis e bônus.

## 8. Como rodar testes

### Backend

```powershell
docker compose run --rm backend php artisan test
```

Ou um arquivo específico:

```powershell
docker compose run --rm backend php artisan test tests/Feature/SolicitacaoCreateTest.php
```

### Frontend

```powershell
cd frontend
npm test
```

Também é possível verificar lint e build:

```powershell
cd frontend
npm run lint
npm run build
```

## 9. Uso de IA no projeto

Este repositório foi usado como base para a implementação orientada por documentação e arquitetura, com foco em:
- manter a regra de negócio centralizada em `StatusTransicao`;
- usar `Form Request` para validação;
- evitar duplicação de regras em controllers;
- seguir o contrato estabelecido pela documentação do desafio.

A IA foi usada como ferramenta de apoio para organização, implementação e validação, mas a regra de negócio foi mantida na camada correta do backend e validada com testes e execução real do projeto.

## 10. Observações finais

- O arquivo `.env` é local e não deve ser versionado.
- O projeto foi desenhado para funcionar com o ambiente Docker do repositório, mantendo o setup simples e reproduzível.
- O fluxo principal ponta a ponta já está funcional e serve como base para evoluções futuras.
