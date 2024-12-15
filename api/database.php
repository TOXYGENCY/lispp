<?php
class Database
{
    private $host = 'localhost'; // Хост базы данных
    private $db_name = 'lispp'; // Имя базы данных
    private $username = 'postgres'; // Имя пользователя
    private $password = '1234'; // Пароль
    private $password_alt = ''; // Альтернативный пароль
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
                echo "Первое подключение не удалось: " . $exception->getMessage() . "\n";
                // Попробуем подключиться с альтернативным паролем 
                echo "Пробуем альтернативный пароль...\n";
                $this->conn = new PDO(
                    "pgsql:host={$this->host};port=5432;dbname={$this->db_name};options='--client_encoding=UTF8'",
                    $this->username,
                    $this->password_alt
                );
                if ($this->conn) {
                    echo "Подключение успешно установлено с альтернативным паролем.\n";
                }
            } catch (PDOException) {
                echo "Ошибка подключения по альтернативному паролю: " . end($exception)->getMessage();
            }
        }

        return $this->conn;
    }

    public function Execute($query){
        if ($this->conn == null){
            $this->conn = $this->GetConnection();
        }
        $statement = $this->conn->prepare($query);
        $statement->execute();
        return $statement;
    }
}
