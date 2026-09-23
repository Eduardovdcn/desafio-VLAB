<?php

use App\Http\Controllers\Api\SolicitacaoController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('/solicitacoes', [SolicitacaoController::class, 'store']);
    Route::patch('/solicitacoes/{solicitacao}/status', [SolicitacaoController::class, 'updateStatus']);
});
