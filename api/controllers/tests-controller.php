<?php
class TestsController
{
    private $database;

    public function __construct($database)
    {
        $this->database = $database;
        // $this->conn = $this->database->GetConnection(); 
    }

    private function _json($content)
    {
        echo json_encode($content, JSON_UNESCAPED_UNICODE, JSON_UNESCAPED_SLASHES);
    }

    public function CreateTest($testData)
    {
        $this->_CreateTest($testData);
        $this->_json(content: ['message' => "Тест '{$testData['title']}' добавлен."]);
    }

    private function _CreateTest($testData)
    {
        // Создаем сам тест и получаем его ID через RETURNING
        $stmt = $this->database->Execute("INSERT INTO tests (title) VALUES (?) RETURNING id", [$testData['title']]);
        $testId = $stmt->fetchColumn(); // Получаем ID
        // Связываем тест с блоком
        $this->database->Execute("INSERT INTO test_blocks (test_id, block_id) VALUES (?, ?)", [$testId, $testData['blockId']]);


        // Если у теста есть вопросы
        if (isset($testData['questions']) && !empty($testData['questions'])) {
            foreach ($testData['questions'] as $question) {
                // Создаем вопрос и получаем его ID через RETURNING
                $stmt = $this->database->Execute("INSERT INTO questions (text) VALUES (?) RETURNING id", [$question['text']]);
                $questionId = $stmt->fetchColumn(); // Получаем ID

                // Связываем вопрос с тестом через таблицу questions_tests
                $this->database->Execute("INSERT INTO questions_tests (question_id, test_id) VALUES (?, ?)", [
                    $questionId,
                    $testId
                ]);

                // Добавляем ответы и связываем с вопросом
                foreach ($question['answers'] as $answer) {
                    // Приводим значение isCorrect к булевому типу в любом случае (потому что PHP читает его как строку почему-то)
                    $isCorrect = filter_var($answer['isCorrect'], FILTER_VALIDATE_BOOLEAN);
                    // Создаем ответ и получаем его ID через RETURNING
                    $stmt = $this->database->Execute("INSERT INTO answers (text) VALUES (?) RETURNING id", [$answer['text']]);
                    $answerId = $stmt->fetchColumn(); // Получаем ID

                    // Добавляем связь вопрос-ответ
                    $this->database->Execute("INSERT INTO questions_answers (question_id, answer_id, is_correct) VALUES (?, ?, ?)", [
                        $questionId,
                        $answerId,
                        $isCorrect ? 1 : 0
                    ]);
                }
            }
        }
    }

    public function GetTestById($id)
    {
        $test = $this->database->Execute("SELECT * FROM tests WHERE id = ?", [$id])->fetch(PDO::FETCH_ASSOC);
        $this->_json($test);
    }


    public function GetQuestionsByTestId($id)
    {
        $query = "SELECT questions.* FROM questions INNER JOIN questions_tests ON questions_tests.question_id = questions.id WHERE questions_tests.test_id = ?";
        $questions = $this->database->Execute($query, [$id])->fetchAll(PDO::FETCH_ASSOC);
        $this->_json($questions);
    }

    public function SubmitTestAnswers($test_id, $answers)
    {
        // Массив для хранения результатов
        $results = [];

        // Пройдемся по всем ответам, которые прислал пользователь
        foreach ($answers as $answer) {
            $questionId = $answer['questionId'];
            $chosenAnswerId = $answer['answerId'];

            // Получаем правильный ответ для этого вопроса
            $query = "
            SELECT answers.id AS correct_answer_id
            FROM questions_answers 
            INNER JOIN answers ON questions_answers.answer_id = answers.id
            WHERE questions_answers.question_id = ? AND questions_answers.is_correct = TRUE";
            $correctAnswer = $this->database->Execute($query, [$questionId])->fetch(PDO::FETCH_ASSOC);

            if ($correctAnswer) {
                // Если правильный ответ найден, проверим, совпадает ли выбранный ответ с правильным
                $isCorrect = ($chosenAnswerId === $correctAnswer['correct_answer_id']);
                $results[] = [
                    'questionId' => $questionId,
                    'correctAnswerId' => $correctAnswer['correct_answer_id'],
                    'userAnswerId' => $chosenAnswerId,
                    'isCorrect' => $isCorrect
                ];
            } else {
                // Если правильный ответ не найден, считаем ответ неверным
                $results[] = [
                    'questionId' => $questionId,
                    'correctAnswerId' => null,
                    'userAnswerId' => $chosenAnswerId,
                    'isCorrect' => false
                ];
            }
        }
        $this->_json($results);
    }

    public function GetBlocksByTestId($test_id)
    {
        $block = $this->database->Execute('SELECT * FROM blocks WHERE id IN (SELECT block_id FROM test_blocks WHERE test_id = ?)', [$test_id])->fetch(PDO::FETCH_ASSOC);
        $this->_json($block);
    }

    
    
    public function GetAllTests()
    {
        $tests = $this->database->Execute("SELECT * FROM tests")->fetchAll(PDO::FETCH_ASSOC);
        $this->_json($tests);
    }

    public function UpdateTest($test_id, $testData)
    {
        $this->_DeleteTest($test_id);
        $this->_CreateTest($testData);
        $this->_json(['message' => "Тест '{$testData['title']}' заменен."]);

    }

    public function _DeleteTest($id)
    {
        // Удаляем связи между вопросами и тестом
        $this->database->Execute("DELETE FROM questions_tests WHERE test_id = ?", [$id]);

        // Удаляем связи с блоками
        $this->database->Execute("DELETE FROM test_blocks WHERE test_id = ?", [$id]);

        // Удаляем все вопросы и ответы, связанные с тестом
        $this->database->Execute("DELETE FROM questions_answers WHERE question_id IN (SELECT question_id FROM questions_tests WHERE test_id = ?)", [$id]);
        $this->database->Execute("DELETE FROM answers WHERE id IN (SELECT answer_id FROM questions_answers WHERE question_id IN (SELECT question_id FROM questions_tests WHERE test_id = ?))", [$id]);
        $this->database->Execute("DELETE FROM questions WHERE id IN (SELECT question_id FROM questions_tests WHERE test_id = ?)", [$id]);

        // Удаляем сам тест
        $this->database->Execute("DELETE FROM tests WHERE id = ?", [$id]);
        
    }
    public function DeleteTestById($id)
    {
        $this->_DeleteTest($id);
        $this->_json(['message' => "Тест с ID: $id удален."]);
    }

}
