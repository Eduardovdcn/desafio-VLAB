<?php

namespace Database\Seeders;

use App\Models\Solicitacao;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SolicitacaoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $solicitacoes = [
            [
                'nome_solicitante' => 'Ana Souza',
                'categoria' => 'CONSULTA',
                'prioridade' => 'MEDIA',
                'status' => 'RECEBIDA',
                'descricao' => 'Solicitação para revisão cadastral e atualização de dados pessoais.',
            ],
            [
                'nome_solicitante' => 'Bruno Costa',
                'categoria' => 'EXAME',
                'prioridade' => 'ALTA',
                'status' => 'EM_ANALISE',
                'descricao' => 'Necessário agendar exame complementar após avaliação inicial.',
            ],
            [
                'nome_solicitante' => 'Carla Lima',
                'categoria' => 'VACINACAO',
                'prioridade' => 'URGENTE',
                'status' => 'AGENDADA',
                'descricao' => 'Pedido de vacinação prioritária para grupo de risco.',
                'justificativa_prioridade' => 'Vacinação urgente para paciente com risco elevado e acompanhamento médico contínuo.',
            ],
            [
                'nome_solicitante' => 'Diego Martins',
                'categoria' => 'OUTRO',
                'prioridade' => 'BAIXA',
                'status' => 'CONCLUIDA',
                'descricao' => 'Retificação de informações de contato e confirmação de atendimento.',
            ],
            [
                'nome_solicitante' => 'Eduarda Nunes',
                'categoria' => 'CONSULTA',
                'prioridade' => 'ALTA',
                'status' => 'RECEBIDA',
                'descricao' => 'Solicitação de consulta de acompanhamento terapêutico.',
            ],
            [
                'nome_solicitante' => 'Felipe Araujo',
                'categoria' => 'EXAME',
                'prioridade' => 'MEDIA',
                'status' => 'EM_ANALISE',
                'descricao' => 'Pedido de solicitação de laudo para avaliação complementar.',
            ],
            [
                'nome_solicitante' => 'Giovanna Rocha',
                'categoria' => 'VACINACAO',
                'prioridade' => 'URGENTE',
                'status' => 'CANCELADA',
                'descricao' => 'Cancelamento por ausência de disponibilidade de agenda ao final do mês.',
                'justificativa_prioridade' => 'Reagendamento necessário em razão da indisponibilidade do paciente no cronograma atual.',
            ],
            [
                'nome_solicitante' => 'Henrique Dias',
                'categoria' => 'CONSULTA',
                'prioridade' => 'MEDIA',
                'status' => 'AGENDADA',
                'descricao' => 'Consulta para orientação de rotina e revisão de tratamento.',
            ],
        ];

        foreach ($solicitacoes as $solicitacao) {
            Solicitacao::query()->firstOrCreate(
                ['nome_solicitante' => $solicitacao['nome_solicitante'], 'descricao' => $solicitacao['descricao']],
                [
                    'protocolo' => Str::uuid()->toString(),
                    'categoria' => $solicitacao['categoria'],
                    'prioridade' => $solicitacao['prioridade'],
                    'status' => $solicitacao['status'],
                    'justificativa_prioridade' => $solicitacao['justificativa_prioridade'] ?? null,
                ]
            );
        }
    }
}
