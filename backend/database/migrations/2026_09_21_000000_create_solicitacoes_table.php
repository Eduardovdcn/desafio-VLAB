<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('solicitacoes', function (Blueprint $table) {
            $table->id();
            $table->uuid('protocolo')->unique();
            $table->string('nome_solicitante');
            $table->string('categoria');
            $table->string('prioridade');
            $table->string('status')->default('RECEBIDA');
            $table->text('descricao');
            $table->text('justificativa_prioridade')->nullable();
            $table->timestamp('data_criacao')->useCurrent();
            $table->timestamp('data_atualizacao')->useCurrent();

            $table->index('status');
            $table->index('categoria');
            $table->index('prioridade');
        });

        DB::statement("ALTER TABLE solicitacoes ADD CONSTRAINT solicitacoes_categoria_check CHECK (categoria IN ('CONSULTA', 'EXAME', 'VACINACAO', 'OUTRO'))");
        DB::statement("ALTER TABLE solicitacoes ADD CONSTRAINT solicitacoes_prioridade_check CHECK (prioridade IN ('BAIXA', 'MEDIA', 'ALTA', 'URGENTE'))");
        DB::statement("ALTER TABLE solicitacoes ADD CONSTRAINT solicitacoes_status_check CHECK (status IN ('RECEBIDA', 'EM_ANALISE', 'AGENDADA', 'CONCLUIDA', 'CANCELADA'))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solicitacoes');
    }
};