<?php

namespace App\Http\Controllers\Api;

use App\Actions\Solicitacao\AtualizarStatusSolicitacaoAction;
use App\Actions\Solicitacao\CriarSolicitacaoAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\AtualizarStatusRequest;
use App\Http\Requests\CriarSolicitacaoRequest;
use App\Models\Solicitacao;
use Illuminate\Http\JsonResponse;

class SolicitacaoController extends Controller
{
    public function __construct(
        private readonly CriarSolicitacaoAction $criarSolicitacaoAction,
        private readonly AtualizarStatusSolicitacaoAction $atualizarStatusSolicitacaoAction,
    ) {}

    public function store(CriarSolicitacaoRequest $request): JsonResponse
    {
        $solicitacao = $this->criarSolicitacaoAction->execute($request->validated());

        return response()->json($solicitacao, 201);
    }

    public function updateStatus(Solicitacao $solicitacao, AtualizarStatusRequest $request): JsonResponse
    {
        try {
            $solicitacaoAtualizada = $this->atualizarStatusSolicitacaoAction->execute(
                $solicitacao,
                $request->validated('status')
            );

            return response()->json($solicitacaoAtualizada, 200);
        } catch (\RuntimeException $e) {
            return response()->json([
                'error' => [
                    'code' => 'STATUS_TRANSITION_INVALID',
                    'message' => 'Transição de status inválida.',
                ],
            ], 409);
        }
    }
}
