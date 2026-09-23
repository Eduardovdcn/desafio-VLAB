<?php

namespace Tests\Feature;

use App\Models\Solicitacao;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SolicitacaoShowTest extends TestCase
{
    use RefreshDatabase;

    public function test_retorna_detalhes_da_solicitacao(): void
    {
        $solicitacao = Solicitacao::create([
            'nome_solicitante' => 'Ana Paula',
            'categoria' => 'VACINACAO',
            'prioridade' => 'ALTA',
            'descricao' => 'Solicitação para cadastro de vacinação.',
            'status' => 'EM_ANALISE',
        ]);

        $response = $this->getJson('/api/v1/solicitacoes/' . $solicitacao->id);

        $response->assertStatus(200)
            ->assertJsonPath('id', $solicitacao->id)
            ->assertJsonPath('nome_solicitante', 'Ana Paula')
            ->assertJsonPath('status', 'EM_ANALISE');
    }

    public function test_retorna_404_quando_solicitacao_nao_existe(): void
    {
        $response = $this->getJson('/api/v1/solicitacoes/999999');

        $response->assertStatus(404);
    }
}
