<?php
class QuestionsController
{
    private $database;

    public function __construct($database)
    {
        $this->database = $database;
    }

    private function _json($content)
    {
        echo json_encode($content, JSON_UNESCAPED_UNICODE, JSON_UNESCAPED_SLASHES);
    }

    public function GetAllQuestions()
    {
        $questions = $this->database->Execute("SELECT * FROM questions")->fetchAll(PDO::FETCH_ASSOC);
        $this->_json($questions);
    }

    public function GetQuestionById($id)
    {
        $question = $this->database->Execute("SELECT * FROM questions WHERE id = ?", [$id])->fetch(PDO::FETCH_ASSOC);
        $this->_json($question);
    }

    public function GetAnswersByQuestionId($id)
    {
        $query = "SELECT answers.* FROM answers INNER JOIN questions_answers ON questions_answers.answer_id = answers.id WHERE questions_answers.question_id = ?";
        $answers = $this->database->Execute($query, [$id])->fetchAll(PDO::FETCH_ASSOC);
        $this->_json($answers);
    }

    public function UpdateQuestion($id, $question)
    {
        $this->database->Execute("UPDATE questions SET text = ? WHERE id = ?", [$question['text'], $id]);
        $this->_json(['message' => "Вопрос с ID: $id обновлен."]);
    }

    public function CreateQuestion($question)
    {
        // Создаем вопрос
        $this->database->Execute("INSERT INTO questions (text) VALUES (?)", [$question['text']]);

        // Получаем ID только что добавленного вопроса
        $questionId = $this->database->GetLastInsertId();

        // Добавляем ответы и связываем с вопросом
        foreach ($question['answers'] as $answer) {
            // Создаем ответ
            $this->database->Execute("INSERT INTO answers (text) VALUES (?)", [$answer['text']]);

            // Получаем ID только что добавленного ответа
            $answerId = $this->database->GetLastInsertId();

            // Добавляем связь вопрос-ответ в таблицу questions_answers
            $this->database->Execute("INSERT INTO questions_answers (question_id, answer_id, is_correct) VALUES (?, ?, ?)", [
                $questionId,
                $answerId,
                $answer['isCorrect']
            ]);
        }

        $this->_json(['message' => "Вопрос '{$question['text']}' добавлен."]);
    }

    public function DeleteQuestion($id)
    {
        // Удаляем все связи с ответами
        $this->database->Execute("DELETE FROM questions_answers WHERE question_id = ?", [$id]);

        // Удаляем сам вопрос
        $this->database->Execute("DELETE FROM questions WHERE id = ?", [$id]);

        $this->_json(['message' => "Вопрос с ID: $id удален."]);
    }
}
