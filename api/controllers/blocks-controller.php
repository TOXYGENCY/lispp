<?php
require_once 'headers.php';

class BlocksController
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


    public function CreateBlock($Block, $chapter_id)
    {
        $this->database->Execute("INSERT INTO blocks (title) VALUES (?)", [$Block['title']]);
        // Узнаем ID добавленного блока
        $block = $this->database->Execute("SELECT * FROM blocks WHERE title = ?", [$Block['title']])->fetch(PDO::FETCH_ASSOC);
        $block_id = $block['id'];
        // Добавляем связь между блоком и главой
        $this->database->Execute("INSERT INTO chapter_blocks (block_id, chapter_id) VALUES (?, ?)", [$block_id, $chapter_id]);
        $this->_json(['message' => "Добавлен блок: {$Block['title']}"]);
    }

    public function GetAllBlocks($return = false)
    {
        if ($return) {
            return $this->database->Execute("SELECT * FROM blocks")->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $blocks = $this->database->Execute("SELECT * FROM blocks")->fetchAll(PDO::FETCH_ASSOC);
            $this->_json($blocks);
        }
    }

    public function GetChapterByBlockId($block_id)
    {
        $chapter_blocks = $this->database->Execute("SELECT * FROM chapter_blocks WHERE block_id = ?", [$block_id])->fetch(PDO::FETCH_ASSOC);
        $chapter = $this->database->Execute("SELECT * FROM chapters WHERE id = ?", [$chapter_blocks['chapter_id']])->fetch(PDO::FETCH_ASSOC);
        $this->_json($chapter);
    }

    public function GetParagraphsByBlockId($block_id)
    {
        $q = "SELECT paragraphs.* FROM paragraphs INNER JOIN paragraph_blocks ON paragraph_blocks.paragraph_id = paragraphs.id WHERE paragraph_blocks.block_id = ?";
        $paragraph_blocks = $this->database->Execute($q, [$block_id])->fetchAll(PDO::FETCH_ASSOC);
        $this->_json($paragraph_blocks);
    }

    public function GetTestsByBlockId($block_id)
    {
        $q = "SELECT tests.* FROM tests INNER JOIN test_blocks ON test_blocks.test_id = tests.id WHERE test_blocks.block_id = ?";
        $test_blocks = $this->database->Execute($q, [$block_id])->fetchAll(PDO::FETCH_ASSOC);
        $this->_json($test_blocks);
    }

    public function GetBlockById($id)
    {
        $block = $this->database->Execute("SELECT * FROM blocks WHERE id = ?", [$id])->fetch(PDO::FETCH_ASSOC);
        $this->_json($block);
    }

    public function GetBlockByTitle($title)
    {
        $title = urldecode($title);
        $block = $this->database->Execute("SELECT * FROM blocks WHERE title = ?", [$title])->fetch(PDO::FETCH_ASSOC);
        $this->_json($block);
    }

    public function UpdateBlock($Block, $chapter_id)
    {
        $this->database->Execute("UPDATE blocks SET title = ? WHERE id = ?", [$Block['title'], $Block['id']]);
        // Обновляем связь
        $this->database->Execute("DELETE FROM chapter_blocks WHERE block_id = ?", [$Block['id']]);
        $this->database->Execute("INSERT INTO chapter_blocks (block_id, chapter_id) VALUES (?, ?)", [$Block['id'], $chapter_id]);

        // $this->database->Execute("UPDATE chapter_blocks SET chapter_id = ? WHERE block_id = ?", [$chapter_id, $Block['id']]);

        $this->_json(['message' => "Обновление блока с ID: {$Block['id']}"]);
    }

    public function DeleteBlock($id)
    {
        $this->database->Execute("DELETE FROM chapter_blocks WHERE block_id = ?", [$id]);
        $this->database->Execute("DELETE FROM blocks WHERE id = ?", [$id]);
        $this->_json(['message' => "Удаление блока с ID: $id"]);
    }
}

