<?php

namespace Tests\Feature;

use App\Models\Solicitacao;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SolicitacaoIndexTest extends TestCase
{
    use RefreshDatabase;

    public function test_lista_solicitacoes_paginadas(): void
    {
        Solicitacao::factory()->count(3)->create();

        $response = $this->getJson('/api/v1/solicitacoes?page=1');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'protocolo',
                        'nome_solicitante',
                        'status',
                    ],
                ],
                'current_page',
                'last_page',
                'per_page',
                'total',
            ])
            ->assertJsonPath('current_page', 1);
    }

    public function test_filtra_por_status_categoria_e_prioridade_combinados(): void
    {
        Solicitacao::factory()->create([
            'status' => 'EM_ANALISE',
            'categoria' => 'EXAME',
            'prioridade' => 'URGENTE',
        ]);
        Solicitacao::factory()->create([
            'status' => 'EM_ANALISE',
            'categoria' => 'EXAME',
            'prioridade' => 'ALTA',
        ]);
        Solicitacao::factory()->create([
            'status' => 'RECEBIDA',
            'categoria' => 'EXAME',
            'prioridade' => 'URGENTE',
        ]);

        $response = $this->getJson('/api/v1/solicitacoes?' . http_build_query([
            'status' => 'EM_ANALISE',
            'categoria' => 'EXAME',
            'prioridade' => 'URGENTE',
        ]));

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.status', 'EM_ANALISE')
            ->assertJsonPath('data.0.categoria', 'EXAME')
            ->assertJsonPath('data.0.prioridade', 'URGENTE');
    }

    public function test_rejeita_filtro_invalido(): void
    {
        $response = $this->getJson('/api/v1/solicitacoes?status=INVALIDO');

        $response->assertStatus(400)
            ->assertJsonPath('error.code', 'VALIDATION_ERROR')
            ->assertJsonPath('error.details.status.0', 'The selected status is invalid.');
    }
}
