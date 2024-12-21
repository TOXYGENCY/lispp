<?php
require_once 'headers.php';

class ChaptersController
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

    
    public function CreateChapter($title)
    {
        $this->database->Execute("INSERT INTO chapters (title) VALUES (?)", [$title]);
        $this->_json(['message' => "Добавлена глава: $title"]);
    }

    public function GetAllChapters()
    {
        $chapters = $this->database->Execute("SELECT * FROM chapters")->fetchAll(PDO::FETCH_ASSOC);
        $this->_json($chapters);
    }

    public function GetChapterById($id)
    {
        $chapter = $this->database->Execute("SELECT * FROM chapters WHERE id = ?", [$id])->fetch(PDO::FETCH_ASSOC);
        $this->_json($chapter);
    }

    public function GetChapterByTitle($title)
    {
        $title = urldecode($title);
        $chapter = $this->database->Execute("SELECT * FROM chapters WHERE title = ?", [$title])->fetch(PDO::FETCH_ASSOC);
        $this->_json($chapter);
    }

    public function UpdateChapter($title, $id)
    {
        $this->database->Execute("UPDATE chapters SET title = ? WHERE id = ?", [$title, $id]);
        $this->_json(['message' => "Обновление главы с ID: $id"]);
    }

    public function DeleteChapter($id)
    {
        $this->database->Execute("DELETE FROM chapters WHERE id = ?", [$id]);
        $this->_json(['message' => "Удаление главы с ID: $id"]);
    }
}