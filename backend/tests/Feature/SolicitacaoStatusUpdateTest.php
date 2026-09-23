<?php

namespace Tests\Feature;

use App\Models\Solicitacao;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SolicitacaoStatusUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_pode_atualizar_status_valido(): void
    {
        $solicitacao = Solicitacao::create([
            'nome_solicitante' => 'Maria Silva',
            'categoria' => 'CONSULTA',
            'prioridade' => 'MEDIA',
            'descricao' => 'Descrição da solicitação.',
        ]);

        $response = $this->patchJson('/api/v1/solicitacoes/' . $solicitacao->id . '/status', [
            'status' => 'EM_ANALISE',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('status', 'EM_ANALISE')
            ->assertJsonPath('id', $solicitacao->id);
    }

    public function test_nao_permite_transicao_invalida(): void
    {
        $solicitacao = Solicitacao::create([
            'nome_solicitante' => 'João Costa',
            'categoria' => 'EXAME',
            'prioridade' => 'ALTA',
            'descricao' => 'Solicitação para teste de transição inválida.',
        ]);

        $response = $this->patchJson('/api/v1/solicitacoes/' . $solicitacao->id . '/status', [
            'status' => 'AGENDADA',
        ]);

        $response->assertStatus(409)
            ->assertJsonPath('error.code', 'STATUS_TRANSITION_INVALID');
    }

    public function test_retorna_404_quando_solicitacao_nao_existe(): void
    {
        $response = $this->patchJson('/api/v1/solicitacoes/999999/status', [
            'status' => 'EM_ANALISE',
        ]);

        $response->assertStatus(404);
    }
}
