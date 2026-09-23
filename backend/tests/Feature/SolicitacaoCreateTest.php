<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SolicitacaoCreateTest extends TestCase
{
    use RefreshDatabase;

    public function test_pode_criar_solicitacao_valida(): void
    {
        $payload = [
            'nome_solicitante' => 'Maria Silva',
            'categoria' => 'CONSULTA',
            'prioridade' => 'MEDIA',
            'descricao' => 'Solicitação de atendimento para revisão cadastral.',
        ];

        $response = $this->postJson('/api/v1/solicitacoes', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('status', 'RECEBIDA')
            ->assertJsonPath('nome_solicitante', 'Maria Silva')
            ->assertJsonStructure([
                'id',
                'protocolo',
                'status',
                'data_criacao',
                'data_atualizacao',
            ]);
    }

    public function test_prioridade_urgente_exige_justificativa(): void
    {
        $payload = [
            'nome_solicitante' => 'João Costa',
            'categoria' => 'EXAME',
            'prioridade' => 'URGENTE',
            'descricao' => 'Solicitação urgente.',
        ];

        $response = $this->postJson('/api/v1/solicitacoes', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['justificativa_prioridade']);
    }
}
