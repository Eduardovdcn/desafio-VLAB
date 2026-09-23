<?php

namespace App\Actions\Solicitacao;

use App\Enums\Status;
use App\Models\Solicitacao;
use App\Support\StatusTransicao;

class AtualizarStatusSolicitacaoAction
{
    public function execute(Solicitacao $solicitacao, string $novoStatus): Solicitacao
    {
        $statusAtual = $solicitacao->status instanceof Status ? $solicitacao->status : Status::tryFrom($solicitacao->status ?? '');
        $statusNovo = Status::tryFrom($novoStatus);

        if ($statusAtual === null || $statusNovo === null) {
            throw new \InvalidArgumentException('Status inválido.');
        }

        if (! StatusTransicao::podeTransicionar($statusAtual, $statusNovo)) {
            throw new \RuntimeException('Transição de status inválida.');
        }

        $solicitacao->status = $statusNovo;
        $solicitacao->save();

        return $solicitacao->fresh();
    }
}
