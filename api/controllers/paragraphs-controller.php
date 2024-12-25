<?php
require_once 'headers.php';

class ParagraphsController
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


    public function CreateParagraph($Paragraph, $block_id)
    {
        $this->database->Execute("INSERT INTO paragraphs (title, description_text, description_special) VALUES (?, ?, ?)", [$Paragraph['title'], $Paragraph['description_text'], $Paragraph['description_special']]);
        // Узнаем ID добавленного параграфа
        $paragraph = $this->database->Execute("SELECT * FROM paragraphs WHERE title = ?", [$Paragraph['title']])->fetch(PDO::FETCH_ASSOC);
        // Добавляем связь между блоком и параграфом
        $this->database->Execute("INSERT INTO paragraph_blocks (paragraph_id, block_id) VALUES (?, ?)", [$paragraph['id'], $block_id]);
        $this->_json(['message' => "Добавлен параграф: {$Paragraph['title']}"]);
    }

    public function GetAllParagraphs()
    {
        $paragraphs = $this->database->Execute("SELECT * FROM paragraphs ORDER BY created_at ASC;")->fetchAll(PDO::FETCH_ASSOC);
        $this->_json($paragraphs);
    }

    public function GetLinkedBlock($paragraph_id)
    {
        $paragraph_blocks = $this->database->Execute("SELECT * FROM paragraph_blocks WHERE paragraph_id = ?", [$paragraph_id])->fetch(PDO::FETCH_ASSOC);
        $block = $this->database->Execute("SELECT * FROM blocks WHERE id = ?", [$paragraph_blocks['block_id']])->fetch(PDO::FETCH_ASSOC);
        $this->_json($block);
    }

    public function GetParagraphById($id)
    {
        $paragraph = $this->database->Execute("SELECT * FROM paragraphs WHERE id = ?", [$id])->fetch(PDO::FETCH_ASSOC);
        $this->_json($paragraph);
    }

    public function GetParagraphByTitle($title)
    {
        $title = urldecode($title);
        $paragraph = $this->database->Execute("SELECT * FROM paragraphs WHERE title = ?", [$title])->fetch(PDO::FETCH_ASSOC);
        $this->_json($paragraph);
    }

    public function UpdateParagraph($Paragraph, $block_id)
    {
        $this->database->Execute("UPDATE paragraphs SET title = ?, description_text = ?, description_special = ? WHERE id = ?", [$Paragraph['title'], $Paragraph['description_text'], $Paragraph['description_special'], $Paragraph['id']]);
        // Обновляем связь
        $this->database->Execute("DELETE FROM paragraph_blocks WHERE paragraph_id = ?", [$Paragraph['id']]);
        $this->database->Execute("INSERT INTO paragraph_blocks (paragraph_id, block_id) VALUES (?, ?)", [$Paragraph['id'], $block_id]);

        $this->_json(['message' => "Обновление параграфа с ID: {$Paragraph['id']}"]);
    }

    public function DeleteParagraph($id)
    {
        $this->database->Execute("DELETE FROM paragraph_blocks WHERE paragraph_id = ?", [$id]);
        $this->database->Execute("DELETE FROM paragraphs WHERE id = ?", [$id]);
        $this->_json(['message' => "Удаление параграфа с ID: $id"]);
    }
}
