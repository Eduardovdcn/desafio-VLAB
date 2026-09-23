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
}
