<?php
// Разрешаем CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Content-Type: application/json');

// Если это preflight запрос, сразу отправляем ответ
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Отправляем успешный ответ без тела
    http_response_code(200);
    exit();
}
