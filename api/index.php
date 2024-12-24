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
require_once 'controllers/tests-controller.php';
require_once 'controllers/questions-controller.php';
require_once 'controllers/answers-controller.php';
// require_once 'controllers/questions-answers-controller.php';

$users_controller = new UsersController($database);
$chapters_controller = new ChaptersController($database);
$blocks_controller = new BlocksController($database);
$paragraphs_controller = new ParagraphsController($database);
$tests_controller = new TestsController($database);
$questions_controller = new QuestionsController($database);
$answers_controller = new AnswersController($database);
// $questions_answers_controller = new QuestionsAnswersController($database);


// Получаем текущий URL
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Убираем начальный / и разбиваем URL на части
$requestUri = trim($requestUri, '/');
$uriParts = explode('/', $requestUri);

function _json($content)
{
  echo json_encode($content, JSON_UNESCAPED_UNICODE, JSON_UNESCAPED_SLASHES);
}

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
        $controller->Authenticate((array) $credentials);
      } elseif ($uriParts[2] === 'register') {
        $controller->CreateUser((array) $credentials);
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
  $controller_blocks = $blocks_controller;
  switch ($requestMethod) {
    case 'GET':
      if (isset($uriParts[4])) {  // api/chapters/title/{title}
        $controller->GetChapterByTitle($uriParts[4]);
      } elseif (isset($uriParts[2]) && $uriParts[3] == "blocks") { // api/chapters/{id}/blocks
        $controller->GetBlocksByChapterId($uriParts[2]);
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
      } elseif (isset($uriParts[2]) && $uriParts[3] == "paragraphs") { // api/blocks/${id}/paragraphs
        $controller->GetParagraphsByBlockId($uriParts[2]);
      } elseif (isset($uriParts[2]) && $uriParts[3] == "tests") { // api/blocks/${id}/tests
        $controller->GetTestsByBlockId($uriParts[2]);
      } elseif (isset($uriParts[2])) {  // api/blocks/{id}
        if (isset($uriParts[3]) && $uriParts[3] == "chapter") {
          $controller->GetChapterByBlockId($uriParts[2]);
        } elseif (isset($uriParts[3]) && $uriParts[3] == "test") { // api/blocks/${id}/test
          $controller->GetTestsByBlockId($uriParts[2]);
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
} elseif ($uriParts[0] === 'api' && $uriParts[1] === 'tests') {
  $controller = $tests_controller;
  switch ($requestMethod) {
    case 'GET':
      if (isset($uriParts[3]) && $uriParts[3] == "questions") { // api/tests/${id}/questions 
        $controller->GetQuestionsByTestId($uriParts[2]);
      } elseif (isset($uriParts[3]) && $uriParts[3] == "blocks") { // api/tests/${id}/blocks
        $controller->GetBlocksByTestId($uriParts[2]);
      } else {
        if (isset($uriParts[2])) {  // api/tests/{id}
          $controller->GetTestById($uriParts[2]);
        } else {
          $controller->GetAllTests();
        }
      }
      break;
    case 'POST':
      if (isset($uriParts[3]) && $uriParts[3] === 'submit') { // api/tests/{id}/submit
        $testData = json_decode(file_get_contents('php://input'), true);
        $controller->SubmitTestAnswers($uriParts[2], $testData);
      } else {
        $testData = json_decode(file_get_contents('php://input'), true);
        $controller->CreateTest($testData);
      }
      break;
    case 'PUT':
      if (isset($uriParts[2])) {
        $testData = json_decode(file_get_contents('php://input'), true);
        $controller->UpdateTest($uriParts[2], $testData);
      }
      break;
    case 'DELETE':
      if (isset($uriParts[2])) {
        $controller->DeleteTestById($uriParts[2]);
      }
      break;
    default:
      http_response_code(405);
      break;
  }
} elseif ($uriParts[0] === 'api' && $uriParts[1] === 'questions') {
  $controller = $questions_controller;
  switch ($requestMethod) {
    case 'GET':
      if (isset($uriParts[2]) && $uriParts[3] == "answers") {  // api/questions/{id}/answers
        $controller->GetAnswersByQuestionId($uriParts[2]);
      } elseif (isset($uriParts[2])) { // api/questions/{id}
        $controller->GetQuestionById($uriParts[2]);
      } else {
        $controller->GetAllQuestions();
      }
      break;
    case 'POST':
      $questionData = json_decode(file_get_contents('php://input'), true);
      $controller->CreateQuestion($questionData['text']);
      break;
    case 'PUT':
      if (isset($uriParts[2])) {
        $questionData = json_decode(file_get_contents('php://input'), true);
        $controller->UpdateQuestion($uriParts[2], $questionData['text']);
      }
      break;
    case 'DELETE':
      if (isset($uriParts[2])) {
        $controller->DeleteQuestion($uriParts[2]);
      }
      break;
    default:
      http_response_code(405);
      break;
  }
} elseif ($uriParts[0] === 'api' && $uriParts[1] === 'answers') {
  $controller = $answers_controller;
  switch ($requestMethod) {
    case 'GET':
      if (isset($uriParts[2]) && $uriParts[3] == "iscorrect") { // answers/${id}/iscorrect
        $controller->GetIsCorrectByAnswerId($uriParts[2]);
      } elseif (isset($uriParts[2])) {  // api/answers/{id}
        $controller->GetAnswerById($uriParts[2]);
      } else {
        $controller->GetAllAnswers();
      }
      break;
    case 'POST':
      $answerData = json_decode(file_get_contents('php://input'), true);
      $controller->CreateAnswer($answerData['text']);
      break;
    case 'PUT':
      if (isset($uriParts[2])) {
        $answerData = json_decode(file_get_contents('php://input'), true);
        $controller->UpdateAnswer($uriParts[2], $answerData['text']);
      }
      break;
    case 'DELETE':
      if (isset($uriParts[2])) {
        $controller->DeleteAnswer($uriParts[2]);
      }
      break;
    default:
      http_response_code(405);
      break;
  }
} elseif ($uriParts[0] === 'api' && $uriParts[1] === 'questions-answers') {
  $controller = $questions_answers_controller;
  switch ($requestMethod) {
    case 'POST':
      $data = json_decode(file_get_contents('php://input'), true);
      $controller->CreateQuestionAnswer($data['question_id'], $data['answer_id'], $data['is_correct']);
      break;
    case 'DELETE':
      if (isset($uriParts[2])) {
        $controller->DeleteQuestionAnswer($uriParts[2]);
      }
      break;
    default:
      http_response_code(405);
      break;
  }
} else {
  http_response_code(404); // Не найдено
}
