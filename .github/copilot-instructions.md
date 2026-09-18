# Contexto do projeto

Ver documentação completa em /docs/requisitos.md, /docs/arquitetura.md,
/docs/especificacoes.md e /docs/tarefas.md antes de qualquer implementação.

Stack: React + TypeScript, PHP + Laravel, PostgreSQL, Docker Compose.
Padrão de backend: Form Request (validação) -> Controller fino -> Action
(uma classe por operação de negócio). Sem Repository, sem DTO.
Testes: PHPUnit no backend, seguindo /docs/especificacoes.md seção 7.
Máquina de estados de status: única fonte de verdade em StatusTransicao,
conforme /docs/arquitetura.md seção 2 — nunca duplicar a regra em controllers.