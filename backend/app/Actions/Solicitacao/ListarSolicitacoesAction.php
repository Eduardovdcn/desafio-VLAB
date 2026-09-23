<?php

namespace App\Actions\Solicitacao;

use App\Models\Solicitacao;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ListarSolicitacoesAction
{
    public function execute(array $filtros = []): LengthAwarePaginator
    {
        $query = Solicitacao::query();

        foreach ($filtros as $campo => $valor) {
            if ($valor === null || $valor === '') {
                continue;
            }

            $query->where($campo, $valor);
        }

        return $query->orderByDesc('data_criacao')->paginate(15);
    }
}
