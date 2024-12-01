<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

$requestUri = $_SERVER['REQUEST_URI'];

// Подключение к базе данных (пример с MySQL)
// $mysqli = new mysqli("localhost", "username", "password", "database");

// if ($mysqli->connect_error) {
//   die("Connection failed: " . $mysqli->connect_error);
// }

// Обработка запросов
if ($_SERVER['REQUEST_METHOD'] === 'POST') { // && strpos($requestUri, '/your-endpoint.php') !== false) {
  $inputData = json_decode(file_get_contents('php://input'), true);
  // Здесь обработайте данные, например, сохраните в базу данных
  // Пример:
  // $query = "INSERT INTO your_table (column1, column2) VALUES (?, ?)";
  // $stmt = $mysqli->prepare($query);
  // $stmt->bind_param('ss', $inputData['field1'], $inputData['field2']);
  // $stmt->execute();

  // Возвращаем ответ
  echo json_encode(['status' => 'success']);
} else {
  echo json_encode(['status' => 'error', 'message' => 'Invalid request at index.php']);
}

// $mysqli->close();
