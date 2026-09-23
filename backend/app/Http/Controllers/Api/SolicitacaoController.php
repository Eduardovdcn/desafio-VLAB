<?php

namespace App\Http\Controllers\Api;

use App\Actions\Solicitacao\CriarSolicitacaoAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\CriarSolicitacaoRequest;

class SolicitacaoController extends Controller
{
    public function __construct(
        private readonly CriarSolicitacaoAction $criarSolicitacaoAction,
    ) {}

    public function store(CriarSolicitacaoRequest $request)
    {
        $solicitacao = $this->criarSolicitacaoAction->execute($request->validated());

        return response()->json($solicitacao, 201);
    }
}
