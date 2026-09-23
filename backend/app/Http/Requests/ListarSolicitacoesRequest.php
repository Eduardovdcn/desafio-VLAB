<?php

namespace App\Http\Requests;

use App\Enums\Categoria;
use App\Enums\Prioridade;
use App\Enums\Status;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ListarSolicitacoesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['sometimes', 'nullable', Rule::enum(Status::class)],
            'categoria' => ['sometimes', 'nullable', Rule::enum(Categoria::class)],
            'prioridade' => ['sometimes', 'nullable', Rule::enum(Prioridade::class)],
        ];
    }
}