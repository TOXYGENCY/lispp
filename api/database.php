<?php
class Database
{
    private $host = 'localhost'; // Хост базы данных
    private $db_name = 'lispp'; // Имя базы данных
    private $username = 'postgres'; // Имя пользователя
    private $password = ''; // Пароль
    private $password_alt = '1234'; // Альтернативный пароль
    public $conn;

    // Метод для подключения к базе данных
    public function GetConnection()
    {
        $this->conn = null;

        try {
            $this->conn = new PDO("pgsql:host={$this->host};port=5432;dbname={$this->db_name};options='--client_encoding=UTF8'", $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $exception) {
            try {
                $this->conn = new PDO("pgsql:host={$this->host};port=5432;dbname={$this->db_name};options='--client_encoding=UTF8'", $this->username, $this->password_alt);
                $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $exception_alt) {
                echo "Ошибка подключения к базе данных: " . $exception_alt->getMessage();
            }

        return $this->conn;
    }
}
}