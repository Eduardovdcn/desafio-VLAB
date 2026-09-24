<?php

namespace Tests\Unit;

use App\Enums\Status;
use App\Support\StatusTransicao;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class StatusTransicaoTest extends TestCase
{
    public static function matrizDeTransicoes(): array
    {
        return [
            'RECEBIDA_para_EM_ANALISE' => [Status::RECEBIDA, Status::EM_ANALISE, true],
            'RECEBIDA_para_CANCELADA' => [Status::RECEBIDA, Status::CANCELADA, true],
            'RECEBIDA_para_RECEBIDA' => [Status::RECEBIDA, Status::RECEBIDA, false],
            'RECEBIDA_para_AGENDADA' => [Status::RECEBIDA, Status::AGENDADA, false],
            'RECEBIDA_para_CONCLUIDA' => [Status::RECEBIDA, Status::CONCLUIDA, false],

            'EM_ANALISE_para_AGENDADA' => [Status::EM_ANALISE, Status::AGENDADA, true],
            'EM_ANALISE_para_CANCELADA' => [Status::EM_ANALISE, Status::CANCELADA, true],
            'EM_ANALISE_para_RECEBIDA' => [Status::EM_ANALISE, Status::RECEBIDA, false],
            'EM_ANALISE_para_EM_ANALISE' => [Status::EM_ANALISE, Status::EM_ANALISE, false],
            'EM_ANALISE_para_CONCLUIDA' => [Status::EM_ANALISE, Status::CONCLUIDA, false],

            'AGENDADA_para_CONCLUIDA' => [Status::AGENDADA, Status::CONCLUIDA, true],
            'AGENDADA_para_CANCELADA' => [Status::AGENDADA, Status::CANCELADA, true],
            'AGENDADA_para_RECEBIDA' => [Status::AGENDADA, Status::RECEBIDA, false],
            'AGENDADA_para_EM_ANALISE' => [Status::AGENDADA, Status::EM_ANALISE, false],
            'AGENDADA_para_AGENDADA' => [Status::AGENDADA, Status::AGENDADA, false],

            'CONCLUIDA_para_CANCELADA' => [Status::CONCLUIDA, Status::CANCELADA, false],
            'CONCLUIDA_para_CONCLUIDA' => [Status::CONCLUIDA, Status::CONCLUIDA, false],
            'CONCLUIDA_para_EM_ANALISE' => [Status::CONCLUIDA, Status::EM_ANALISE, false],
            'CONCLUIDA_para_AGENDADA' => [Status::CONCLUIDA, Status::AGENDADA, false],

            'CANCELADA_para_CONCLUIDA' => [Status::CANCELADA, Status::CONCLUIDA, false],
            'CANCELADA_para_CANCELADA' => [Status::CANCELADA, Status::CANCELADA, false],
            'CANCELADA_para_EM_ANALISE' => [Status::CANCELADA, Status::EM_ANALISE, false],
            'CANCELADA_para_AGENDADA' => [Status::CANCELADA, Status::AGENDADA, false],
        ];
    }

    #[DataProvider('matrizDeTransicoes')]
    public function test_matriz_de_transicao_de_status(Status $atual, Status $novo, bool $esperado): void
    {
        $this->assertSame($esperado, StatusTransicao::podeTransicionar($atual, $novo));
    }

    public function test_transicoes_com_valores_invalidos_retorna_falso(): void
    {
        $this->assertFalse(StatusTransicao::podeTransicionar(null, Status::RECEBIDA));
        $this->assertFalse(StatusTransicao::podeTransicionar(Status::RECEBIDA, null));
        $this->assertFalse(StatusTransicao::podeTransicionar('DESCONHECIDO', Status::EM_ANALISE));
        $this->assertFalse(StatusTransicao::podeTransicionar(Status::RECEBIDA, 'DESCONHECIDO'));
    }
}
