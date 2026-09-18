<?php

header('Content-Type: application/json');

echo json_encode([
    'service' => 'backend',
    'status' => 'ready',
]);