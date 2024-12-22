<?php
// Это главный контроллер, который распределяет запросы в специализированные контроллеры


require_once 'headers.php';
require_once 'database.php';

// Создаем экземпляр класса Database
$database = new Database();
// $db_conn = $database->GetConnection(); // Получаем соединение

// Подключаем необходимые файлы контроллеров
require_once 'controllers/users-controller.php';
require_once 'controllers/chapters-controller.php';
require_once 'controllers/blocks-controller.php';
require_once 'controllers/paragraphs-controller.php';
$users_controller = new UsersController($database);
$chapters_controller = new ChaptersController($database);
$blocks_controller = new BlocksController($database);
$paragraphs_controller = new ParagraphsController($database);


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
        // echo var_dump(headers_list());
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
} elseif ($uriParts[0] === 'api' && $uriParts[1] === 'chapters') {
  $controller = $chapters_controller;
  switch ($requestMethod) {
    case 'GET':
      if (isset($uriParts[4])) {  // api/chapters/title/{title}
        $controller->GetChapterByTitle($uriParts[4]);
      } elseif (isset($uriParts[2])) {  // api/chapters/{id}
        $controller->GetChapterById($uriParts[2]);
      } else {
        $controller->GetAllChapters();
      }
      break;
    case 'POST':
      $titleData = json_decode(file_get_contents('php://input'), true);
      $controller->CreateChapter($titleData['title']);
      break;
    case 'PUT':
      if (isset($uriParts[2])) {
        $titleData = json_decode(file_get_contents('php://input'), true);
        $controller->UpdateChapter($titleData['title'], $uriParts[2]);
      }
      break;
    case 'DELETE':
      if (isset($uriParts[2])) {
        $controller->DeleteChapter($uriParts[2]);
      }
      break;
    default:
      http_response_code(405); // Метод не разрешен
      break;
  }
} elseif ($uriParts[0] === 'api' && $uriParts[1] === 'blocks') {
  $controller = $blocks_controller;
  switch ($requestMethod) {
    case 'GET':
      if (isset($uriParts[4])) {  // api/blocks/title/{title}
        $controller->GetBlockByTitle($uriParts[4]);
      } elseif (isset($uriParts[2])) {  // api/blocks/{id}
        if (isset($uriParts[3]) && $uriParts[3] == "chapter") {
          $controller->GetLinkedChapter($uriParts[2]);
        } else {
          $controller->GetBlockById($uriParts[2]);
        }
      } else {
        $controller->GetAllBlocks();
      }
      break;
    case 'POST':
      $blockData = json_decode(file_get_contents('php://input'), true);
      $controller->CreateBlock($blockData['Block'], $blockData['chapter_id']);
      break;
    case 'PUT':
      if (isset($uriParts[2])) {
        $blockData = json_decode(file_get_contents('php://input'), true);
        $controller->UpdateBlock($blockData['Block'], $blockData['chapter_id']);
      }
      break;
    case 'DELETE':
      if (isset($uriParts[2])) {
        $controller->DeleteBlock($uriParts[2]);
      }
      break;
    default:
      http_response_code(405); // Метод не разрешен
      break;
  }
} elseif ($uriParts[0] === 'api' && $uriParts[1] === 'paragraphs') {
  $controller = $paragraphs_controller;
  switch ($requestMethod) {
    case 'GET':
      if (isset($uriParts[2]) && $uriParts[2] == "title") {  // api/paragraphs/title/{title}
        $controller->GetParagraphByTitle($uriParts[3]);
      } elseif (isset($uriParts[2])) {  // api/paragraphs/{id}
        if (isset($uriParts[3]) && $uriParts[3] == "block") { // api/paragraphs/{id}/block
          $controller->GetLinkedBlock($uriParts[2]);
        } else {
          $controller->GetParagraphById($uriParts[2]);
        }
      } else {
        $controller->GetAllParagraphs();
      }
      break;
    case 'POST':
      $paragraphData = json_decode(file_get_contents('php://input'), true);
      $controller->CreateParagraph($paragraphData['Paragraph'], $paragraphData['block_id']);
      break;
    case 'PUT':
      if (isset($uriParts[2])) {
        $paragraphData = json_decode(file_get_contents('php://input'), true);
        $controller->UpdateParagraph($paragraphData['Paragraph'], $paragraphData['block_id']);
      }
      break;
    case 'DELETE':
      if (isset($uriParts[2])) {
        $controller->DeleteParagraph($uriParts[2]);
      }
      break;
    default:
      http_response_code(405); // Метод не разрешен
      break;
  }
} else {
  http_response_code(404); // Не найдено
}

