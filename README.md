# Solicitações de Atendimento

## Execução local

Pré-requisitos: Docker Desktop com Docker Compose habilitado.

1. Copie `.env.example` para `.env`:

   ```powershell
   Copy-Item .env.example .env
   ```

2. Edite `.env` e defina `POSTGRES_PASSWORD` com uma senha local. O Compose não possui senha padrão e falha explicitamente se essa variável não for definida.
3. Suba os serviços:

   ```bash
   docker compose up --build
   ```

Os serviços ficam disponíveis em:

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- PostgreSQL: somente na rede interna do Compose, no host `db` e porta `5432`

O PostgreSQL usa o volume nomeado `postgres_data`. A API Laravel e a aplicação React serão adicionadas nas próximas tarefas, mantendo esta orquestração como ponto único de execução.

## Versões fixadas

- PHP 8.5 (`php:8.5-cli-alpine`), em suporte ativo conforme a política oficial do PHP.
- PostgreSQL 18 (`postgres:18-alpine`), versão major atual suportada pela comunidade PostgreSQL.
- Node.js 22 (`node:22-alpine`) para o runtime temporário do frontend.
- Docker Compose para orquestração dos três serviços.

O arquivo `.env.example` é apenas um modelo e não contém uma senha. O arquivo `.env` é local, está ignorado pelo Git e não deve ser versionado. Para PostgreSQL 18, o volume usa `/var/lib/postgresql`, conforme a imagem oficial; 
