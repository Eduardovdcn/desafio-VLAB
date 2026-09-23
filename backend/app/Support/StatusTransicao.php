<?php

namespace App\Support;

use App\Enums\Status;

class StatusTransicao
{
    /**
     * Mapa de status atual -> próximos estados permitidos.
     *
     * @var array<string, array<string>>
     */
    private const TRANSICOES = [
        Status::RECEBIDA->value => [
            Status::EM_ANALISE->value,
            Status::CANCELADA->value,
        ],
        Status::EM_ANALISE->value => [
            Status::AGENDADA->value,
            Status::CANCELADA->value,
        ],
        Status::AGENDADA->value => [
            Status::CONCLUIDA->value,
            Status::CANCELADA->value,
        ],
        Status::CONCLUIDA->value => [],
        Status::CANCELADA->value => [],
    ];

    public static function podeTransicionar(Status|string|null $atual, Status|string|null $novo): bool
    {
        if ($atual === null || $novo === null) {
            return false;
        }

        $atualNormalizado = $atual instanceof Status ? $atual->value : strtoupper((string) $atual);
        $novoNormalizado = $novo instanceof Status ? $novo->value : strtoupper((string) $novo);

        if (! array_key_exists($atualNormalizado, self::TRANSICOES)) {
            return false;
        }

        return in_array($novoNormalizado, self::TRANSICOES[$atualNormalizado], true);
    }
}
