<?php

use App\Http\Controllers\Api\HealthCheckController;
use App\Http\Controllers\Api\SolicitacaoController;
use Illuminate\Support\Facades\Route;

Route::get('/health', HealthCheckController::class);
Route::get('/openapi.yaml', fn () => response()->file(base_path('openapi.yaml'), [
    'Content-Type' => 'application/yaml',
]));

Route::prefix('v1')->group(function () {
    Route::get('/solicitacoes', [SolicitacaoController::class, 'index']);
    Route::post('/solicitacoes', [SolicitacaoController::class, 'store']);
    Route::get('/solicitacoes/{solicitacao}', [SolicitacaoController::class, 'show']);
    Route::patch('/solicitacoes/{solicitacao}/status', [SolicitacaoController::class, 'updateStatus']);
});
