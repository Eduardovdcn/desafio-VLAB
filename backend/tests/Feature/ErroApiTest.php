<?php

namespace Tests\Feature;

use App\Models\Solicitacao;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ErroApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_retorna_envelope_padronizado_para_validacao(): void
    {
        $response = $this->postJson('/api/v1/solicitacoes', [
            'nome_solicitante' => '',
            'categoria' => 'CONSULTA',
            'prioridade' => 'URGENTE',
            'descricao' => 'Teste de erro',
        ]);

        $response->assertStatus(400)
            ->assertJsonStructure([
                'error' => [
                    'code',
                    'message',
                    'details',
                ],
            ])
            ->assertJsonPath('error.code', 'VALIDATION_ERROR');
    }

    public function test_retorna_envelope_padronizado_para_transicao_invalida(): void
    {
        $solicitacao = Solicitacao::create([
            'nome_solicitante' => 'Teste',
            'categoria' => 'CONSULTA',
            'prioridade' => 'MEDIA',
            'descricao' => 'Solicitação para teste de transição.',
            'status' => 'RECEBIDA',
        ]);

        $response = $this->patchJson('/api/v1/solicitacoes/' . $solicitacao->id . '/status', [
            'status' => 'CONCLUIDA',
        ]);

        $response->assertStatus(409)
            ->assertJsonStructure([
                'error' => [
                    'code',
                    'message',
                ],
            ])
            ->assertJsonPath('error.code', 'STATUS_TRANSITION_INVALID');
    }
}
