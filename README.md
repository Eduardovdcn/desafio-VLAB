# Solicitações de Atendimento

Aplicação full stack para registrar, listar e atualizar solicitações de atendimento. O frontend React consome a API Laravel, que persiste os dados no PostgreSQL.

## Execução local

Pré-requisito: Docker Desktop com Docker Compose habilitado.

1. Copie `.env.example` para `.env`:

   ```powershell
   Copy-Item .env.example .env
   ```

2. Defina `POSTGRES_PASSWORD` no arquivo `.env`. A senha é obrigatória para iniciar o banco e não deve ser versionada.
3. Suba os três serviços:

   ```powershell
   docker compose up --build
   ```

Serviços disponíveis:

- Frontend React: http://localhost:5173
- API Laravel: http://localhost:8000
- PostgreSQL: apenas na rede interna do Compose, no host `db` e porta `5432`

Para encerrar os serviços:

```powershell
docker compose down
```

O banco usa o volume nomeado `postgres_data`. Para remover também os dados persistidos, execute `docker compose down -v`.

## Funcionalidades atuais

- Criação de solicitação com validação client-side.
- Listagem paginada com estados de carregamento, vazio, erro e sucesso.
- Atualização de status respeitando as transições válidas.
- Atualização automática da listagem após criação ou alteração de status.

## API principal

- `POST /api/v1/solicitacoes`
- `GET /api/v1/solicitacoes`
- `GET /api/v1/solicitacoes/{id}`
- `PATCH /api/v1/solicitacoes/{id}/status`

## Tecnologias e versões

- React 19 + TypeScript 5.8 + Vite 7
- TanStack Query 5
- PHP 8.5 + Laravel 13
- PostgreSQL 18
- Node.js 22
- Docker Compose

O arquivo `.env.example` contém apenas configurações de exemplo. O arquivo `.env` é local, está ignorado pelo Git e não deve ser commitado.
