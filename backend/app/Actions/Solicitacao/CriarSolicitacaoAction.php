<?php

namespace App\Actions\Solicitacao;

use App\Enums\Status;
use App\Models\Solicitacao;

class CriarSolicitacaoAction
{
    public function execute(array $dados): Solicitacao
    {
        return Solicitacao::create([
            ...$dados,
            'status' => Status::RECEBIDA->value,
        ]);
    }
}
