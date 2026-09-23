<?php

namespace Database\Factories;

use App\Models\Solicitacao;
use Illuminate\Database\Eloquent\Factories\Factory;

class SolicitacaoFactory extends Factory
{
    protected $model = Solicitacao::class;

    public function definition(): array
    {
        return [
            'nome_solicitante' => fake()->name(),
            'categoria' => fake()->randomElement(['CONSULTA', 'EXAME', 'VACINACAO', 'OUTRO']),
            'prioridade' => fake()->randomElement(['BAIXA', 'MEDIA', 'ALTA', 'URGENTE']),
            'status' => fake()->randomElement(['RECEBIDA', 'EM_ANALISE', 'AGENDADA', 'CONCLUIDA', 'CANCELADA']),
            'descricao' => fake()->sentence(),
            'justificativa_prioridade' => null,
        ];
    }
}
