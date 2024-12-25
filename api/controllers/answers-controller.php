<?php
class AnswersController
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

    public function GetIsCorrectByAnswerId($answerId)
    {
        $answer = $this->database->Execute("SELECT is_correct FROM questions_answers WHERE answer_id = ?", [$answerId])->fetch(PDO::FETCH_ASSOC);
        $this->_json($answer);
    }
    
    public function GetAllAnswers()
    {
        $answers = $this->database->Execute("SELECT * FROM answers ORDER BY created_at ASC")->fetchAll(PDO::FETCH_ASSOC);
        $this->_json($answers);
    }

    public function GetAnswerById($id)
    {
        $answer = $this->database->Execute("SELECT * FROM answers WHERE id = ?", [$id])->fetch(PDO::FETCH_ASSOC);
        $this->_json($answer);
    }

    public function UpdateAnswer($id, $answer)
    {
        $this->database->Execute("UPDATE answers SET text = ? WHERE id = ?", [$answer['text'], $id]);
        $this->_json(['message' => "Ответ с ID: $id обновлен."]);
    }

    public function CreateAnswer($answer)
    {
        $this->database->Execute("INSERT INTO answers (text) VALUES (?)", [$answer['text']]);
        $this->_json(['message' => "Ответ '{$answer['text']}' добавлен."]);
    }

    public function DeleteAnswer($id)
    {
        // Удаляем записи из таблицы связей, чтобы избежать нарушения целостности данных
        $this->database->Execute("DELETE FROM questions_answers WHERE answer_id = ?", [$id]);

        // Удаляем сам ответ
        $this->database->Execute("DELETE FROM answers WHERE id = ?", [$id]);

        $this->_json(['message' => "Ответ с ID: $id удален."]);
    }
}
