<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Throwable;

class HealthCheckController extends Controller
{
    public function __invoke(): JsonResponse
    {
        try {
            DB::connection()->getPdo();

            return response()->json([
                'status' => 'ok',
                'database' => 'connected',
                'timestamp' => now()->toIso8601String(),
            ], 200);
        } catch (Throwable $exception) {
            return response()->json([
                'status' => 'error',
                'database' => 'disconnected',
                'message' => 'Database connection failed.',
                'error' => $exception->getMessage(),
            ], 503);
        }
    }
}
