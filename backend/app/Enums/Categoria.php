<?php

namespace App\Enums;

enum Categoria: string
{
    case CONSULTA = 'CONSULTA';
    case EXAME = 'EXAME';
    case VACINACAO = 'VACINACAO';
    case OUTRO = 'OUTRO';
}