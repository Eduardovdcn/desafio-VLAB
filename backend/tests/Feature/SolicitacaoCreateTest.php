<?php

namespace Tests\Feature;

use App\Models\Solicitacao;
use Illuminate\Database\UniqueConstraintViolationException;
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

        $response->assertStatus(400)
            ->assertJsonPath(
                'error.details.justificativa_prioridade.0',
                'A justificativa da prioridade é obrigatória quando a prioridade for URGENTE.'
            );
    }

    public function test_nome_e_descricao_exigem_tamanho_minimo(): void
    {
        $response = $this->postJson('/api/v1/solicitacoes', [
            'nome_solicitante' => '.',
            'categoria' => 'CONSULTA',
            'prioridade' => 'MEDIA',
            'descricao' => '.',
        ]);

        $response->assertStatus(400)
            ->assertJsonStructure([
                'error' => [
                    'details' => [
                        'nome_solicitante',
                        'descricao',
                    ],
                ],
            ]);
    }

    public function test_protocolo_e_unico(): void
    {
        $payload = [
            'nome_solicitante' => 'Ana Souza',
            'categoria' => 'CONSULTA',
            'prioridade' => 'MEDIA',
            'descricao' => 'Solicitação para validar protocolo único.',
        ];

        $primeira = Solicitacao::create($payload + ['protocolo' => '550e8400-e29b-41d4-a716-446655440000']);

        $this->expectException(UniqueConstraintViolationException::class);

        Solicitacao::create($payload + ['protocolo' => $primeira->protocolo]);
    }
}
