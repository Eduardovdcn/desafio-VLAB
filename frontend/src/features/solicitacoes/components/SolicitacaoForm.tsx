import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { criarSolicitacao } from "../../../api/solicitacoesClient";
import {
  CATEGORIAS,
  PRIORIDADES,
  type Categoria,
  type Prioridade,
} from "../../../api/types";

interface FormState {
  nome_solicitante: string;
  categoria: Categoria | "";
  prioridade: Prioridade | "";
  descricao: string;
  justificativa_prioridade: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialFormState: FormState = {
  nome_solicitante: "",
  categoria: "",
  prioridade: "",
  descricao: "",
  justificativa_prioridade: "",
};

const categoriaLabels: Record<Categoria, string> = {
  CONSULTA: "Consulta",
  EXAME: "Exame",
  VACINACAO: "Vacinação",
  OUTRO: "Outro",
};

const prioridadeLabels: Record<Prioridade, string> = {
  BAIXA: "Baixa",
  MEDIA: "Média",
  ALTA: "Alta",
  URGENTE: "Urgente",
};

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};

  const nomeSolicitante = form.nome_solicitante.trim();
  const descricao = form.descricao.trim();

  if (!nomeSolicitante) {
    errors.nome_solicitante = "Informe o nome do solicitante.";
  } else if (nomeSolicitante.length < 3) {
    errors.nome_solicitante = "Informe um nome com pelo menos 3 caracteres.";
  }
  if (!form.categoria) errors.categoria = "Selecione uma categoria.";
  if (!form.prioridade) errors.prioridade = "Selecione uma prioridade.";
  if (!descricao) {
    errors.descricao = "Informe a descrição.";
  } else if (descricao.length < 10) {
    errors.descricao = "Informe uma descrição com pelo menos 10 caracteres.";
  }
  if (form.prioridade === "URGENTE" && !form.justificativa_prioridade.trim()) {
    errors.justificativa_prioridade =
      "A justificativa é obrigatória para prioridade urgente.";
  }

  return errors;
}

export function SolicitacaoForm() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState("");
  const mutation = useMutation({ mutationFn: criarSolicitacao });

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSuccessMessage("");
    mutation.reset();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    setSuccessMessage("");

    if (Object.keys(nextErrors).length > 0) return;

    mutation.mutate(
      {
        nome_solicitante: form.nome_solicitante.trim(),
        categoria: form.categoria as Categoria,
        prioridade: form.prioridade as Prioridade,
        descricao: form.descricao.trim(),
        ...(form.prioridade === "URGENTE"
          ? { justificativa_prioridade: form.justificativa_prioridade.trim() }
          : {}),
      },
      {
        onSuccess: (solicitacao) => {
          queryClient.invalidateQueries({ queryKey: ["solicitacoes"] });
          setForm(initialFormState);
          setSuccessMessage(
            `Solicitação criada com o protocolo ${solicitacao.protocolo}.`,
          );
        },
      },
    );
  }

  return (
    <form className="solicitacao-form" onSubmit={handleSubmit} noValidate>
      <div className="form-heading">
        <p className="eyebrow">Novo atendimento</p>
        <h2>Registrar solicitação</h2>
        <p>Preencha os dados para registrar uma nova solicitação.</p>
      </div>

      <div className="form-grid">
        <div className="form-field form-field-wide">
          <label htmlFor="nome_solicitante">Nome do solicitante</label>
          <input
            id="nome_solicitante"
            name="nome_solicitante"
            value={form.nome_solicitante}
            onChange={(event) =>
              updateField("nome_solicitante", event.target.value)
            }
            aria-invalid={Boolean(errors.nome_solicitante)}
            aria-describedby={
              errors.nome_solicitante ? "nome_solicitante-error" : undefined
            }
          />
          {errors.nome_solicitante && (
            <span id="nome_solicitante-error" className="field-error">
              {errors.nome_solicitante}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="categoria">Categoria</label>
          <select
            id="categoria"
            name="categoria"
            value={form.categoria}
            onChange={(event) => updateField("categoria", event.target.value)}
            aria-invalid={Boolean(errors.categoria)}
            aria-describedby={errors.categoria ? "categoria-error" : undefined}
          >
            <option value="">Selecione</option>
            {CATEGORIAS.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoriaLabels[categoria]}
              </option>
            ))}
          </select>
          {errors.categoria && (
            <span id="categoria-error" className="field-error">
              {errors.categoria}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="prioridade">Prioridade</label>
          <select
            id="prioridade"
            name="prioridade"
            value={form.prioridade}
            onChange={(event) => updateField("prioridade", event.target.value)}
            aria-invalid={Boolean(errors.prioridade)}
            aria-describedby={
              errors.prioridade ? "prioridade-error" : undefined
            }
          >
            <option value="">Selecione</option>
            {PRIORIDADES.map((prioridade) => (
              <option key={prioridade} value={prioridade}>
                {prioridadeLabels[prioridade]}
              </option>
            ))}
          </select>
          {errors.prioridade && (
            <span id="prioridade-error" className="field-error">
              {errors.prioridade}
            </span>
          )}
        </div>

        <div className="form-field form-field-wide">
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            rows={5}
            value={form.descricao}
            onChange={(event) => updateField("descricao", event.target.value)}
            aria-invalid={Boolean(errors.descricao)}
            aria-describedby={errors.descricao ? "descricao-error" : undefined}
          />
          {errors.descricao && (
            <span id="descricao-error" className="field-error">
              {errors.descricao}
            </span>
          )}
        </div>

        {form.prioridade === "URGENTE" && (
          <div className="form-field form-field-wide">
            <label htmlFor="justificativa_prioridade">
              Justificativa da prioridade urgente
            </label>
            <textarea
              id="justificativa_prioridade"
              name="justificativa_prioridade"
              rows={4}
              value={form.justificativa_prioridade}
              onChange={(event) =>
                updateField("justificativa_prioridade", event.target.value)
              }
              aria-invalid={Boolean(errors.justificativa_prioridade)}
              aria-describedby={
                errors.justificativa_prioridade
                  ? "justificativa_prioridade-error"
                  : undefined
              }
            />
            {errors.justificativa_prioridade && (
              <span id="justificativa_prioridade-error" className="field-error">
                {errors.justificativa_prioridade}
              </span>
            )}
          </div>
        )}
      </div>

      {mutation.isError && (
        <p
          className="form-message form-message-error"
          role="alert"
          aria-live="assertive"
        >
          {mutation.error instanceof Error
            ? mutation.error.message
            : "Não foi possível criar a solicitação."}
        </p>
      )}
      {successMessage && (
        <p
          className="form-message form-message-success"
          role="status"
          aria-live="polite"
        >
          {successMessage}
        </p>
      )}

      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Enviando..." : "Criar solicitação"}
      </button>
    </form>
  );
}
