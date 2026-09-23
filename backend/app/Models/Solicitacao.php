<?php

namespace App\Models;

use App\Enums\Categoria;
use App\Enums\Prioridade;
use App\Enums\Status;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Solicitacao extends Model
{
    use HasFactory;
    protected $table = 'solicitacoes';

    public const CREATED_AT = 'data_criacao';

    public const UPDATED_AT = 'data_atualizacao';

    protected $fillable = [
        'nome_solicitante',
        'categoria',
        'prioridade',
        'status',
        'descricao',
        'justificativa_prioridade',
    ];

    protected function casts(): array
    {
        return [
            'categoria' => Categoria::class,
            'prioridade' => Prioridade::class,
            'status' => Status::class,
            'data_criacao' => 'datetime',
            'data_atualizacao' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Solicitacao $solicitacao): void {
            $solicitacao->protocolo ??= (string) Str::uuid();
        });
    }
}