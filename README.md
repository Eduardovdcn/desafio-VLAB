# Solicitações de Atendimento

## Execução local

Pré-requisitos: Docker Desktop com Docker Compose habilitado.

1. Copie `.env.example` para `.env` se quiser personalizar portas ou variáveis locais.
2. Suba os serviços:

	```bash
	docker compose up --build
	```

Os serviços ficam disponíveis em:

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- PostgreSQL: somente na rede interna do Compose, no host `db` e porta `5432`

O PostgreSQL usa o volume nomeado `postgres_data`. A API Laravel e a aplicação React serão adicionadas nas próximas tarefas, mantendo esta orquestração como ponto único de execução.