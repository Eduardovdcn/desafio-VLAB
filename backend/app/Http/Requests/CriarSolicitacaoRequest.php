<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CriarSolicitacaoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nome_solicitante' => ['required', 'string', 'min:3', 'max:255'],
            'categoria' => ['required', 'string', 'in:CONSULTA,EXAME,VACINACAO,OUTRO'],
            'prioridade' => ['required', 'string', 'in:BAIXA,MEDIA,ALTA,URGENTE'],
            'descricao' => ['required', 'string', 'min:10'],
            'justificativa_prioridade' => ['nullable', 'string', 'required_if:prioridade,URGENTE'],
        ];
    }

    public function messages(): array
    {
        return [
            'justificativa_prioridade.required_if' => 'A justificativa da prioridade é obrigatória quando a prioridade for URGENTE.',
        ];
    }
}
