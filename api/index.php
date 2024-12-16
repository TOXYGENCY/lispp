<?php
// Это главный контроллер, который распределяет запросы в специализированные контроллеры

// Разрешаем CORS
header("Access-Control-Allow-Origin: http://localhost:4200"); // Укажите ваш фронтенд
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');
  

// Обработка preflight-запроса
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  http_response_code(200);
  exit();
}

require_once 'database.php';

// Создаем экземпляр класса Database
$database = new Database();
// $db_conn = $database->GetConnection(); // Получаем соединение

// Подключаем необходимые файлы контроллеров
require_once 'controllers/users-controller.php';
$users_controller = new UsersController($database);


// Получаем текущий URL
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Убираем начальный / и разбиваем URL на части
$requestUri = trim($requestUri, '/');
$uriParts = explode('/', $requestUri);

// Маршрутизация
if ($uriParts[0] === 'api' && $uriParts[1] === 'users') {
  $controller = $users_controller;
  // Определяем метод в зависимости от запроса
  switch ($requestMethod) {
    case 'GET':
      if (isset($uriParts[2]) && $uriParts[2] == "email" && isset($uriParts[3])) {
        $controller->GetUserByEmail($uriParts[3]); // api/users/email/{email}
        return;
      }
      if (isset($uriParts[2])) {
        // Если есть что-то после api/users. Например, api/users/{id}
        $controller->GetUserById($uriParts[2]);
      } else {
        // api/users
        $controller->GetAllUsers();
      }
      break;
    case 'POST':
      $credentials = json_decode(file_get_contents('php://input'));
      if ($uriParts[2] === 'auth') {
        $controller->Authenticate((array)$credentials);
      } elseif ($uriParts[2] === 'register') {
        $controller->CreateUser((array)$credentials);
      }
      // api/users
      break;
    case 'PUT':
      // api/users/{id}
      if (isset($uriParts[2])) {
        $controller->UpdateUser($uriParts[2]);
      }
      break;
    case 'DELETE':
      // api/users/{id}
      if (isset($uriParts[2])) {
        $controller->DeleteUser($uriParts[2]);
      }
      break;
    default:
      http_response_code(405); // Метод не разрешен
      break;
  }
} else {
  http_response_code(404); // Не найдено
}
