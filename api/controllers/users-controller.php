<?php
class UsersController
{
    // private $db;
    private $database;
    public function __construct($database)
    {
        $this->database = $database;
    }

    private function json($content)
    {
        echo json_encode($content, JSON_UNESCAPED_UNICODE, JSON_UNESCAPED_SLASHES);
    }

    private function CheckCode($code, $table)
    {
        $statement = $this->database->Execute("SELECT * FROM $table WHERE code = ?", [$code]);
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result;
    }

    public function Authenticate($credentials)
    {
        $user = $this->database->Execute("SELECT * FROM users WHERE email = ? AND user_type = ?", 
                                        [$credentials['email'], $credentials['user_type']])->fetch(PDO::FETCH_ASSOC);        
        if (!$user) {
            $this->json($user);
            return;
        } else {
            if ($credentials['user_type'] === '3' and !$this->CheckCode($credentials['adminCode'], 'admin_codes')) {
                return;
            }
            if (!password_verify($credentials['passwordString'], $user['password'])) {
                $this->json(false);
                return;
            } else {
                $this->json(true);
                return;
            }
        }
    }

    public function CreateUser($User)
    {
        // Хешируем пароль
        $passwordHash = password_hash($User['password'], PASSWORD_DEFAULT);

        // Проверяем код организации
        $specifiedOrg = $this->CheckCode($User['organization_code'], 'organizations');
        if (!$specifiedOrg) {
            $this->json(['success' => false, 'message' => 'Несуществующий код организации.']);
            return;
        }

        // Проверяем, существует ли пользователь с таким email
        $query = "SELECT * FROM users WHERE email = ?";
        $existingUser = $this->database->Execute($query, [$User['email']])->fetch(PDO::FETCH_ASSOC);
        if ($existingUser) {
            $this->json(['success' => false, 'message' => 'Пользователь с таким email уже существует.']);
            return;
        }

        // Подготовка SQL-запроса для вставки нового пользователя
        $insertQuery = "INSERT INTO users (name, email, password, user_type, organization_id) VALUES (?, ?, ?, ?, ?)";

        // Выполняем запрос на вставку
        if ($this->database->Execute($insertQuery, [$User['name'], $User['email'], $passwordHash, $User['user_type'], $specifiedOrg['id']])) {
            // Если пользователь успешно создан, получаем его данные
            $userData = $this->database->Execute("SELECT * FROM users WHERE email = ?", [$User['email']])->fetch(PDO::FETCH_ASSOC);

            // Возвращаем данные пользователя
            $this->json(['success' => true, 'user' => $userData]);
        } else {
            // Если произошла ошибка при вставке, возвращаем ошибку
            $this->json(['success' => false, 'message' => 'Ошибка при создании пользователя.']);
        }
    }

    public function GetAllUsers()
    {
        $users = $this->database->Execute("SELECT * FROM users")->fetchAll(PDO::FETCH_ASSOC);
        $this->json($users);
    }

    public function GetUserById($id)
    {
        $user = $this->database->Execute("SELECT * FROM users WHERE id = '$id'")->fetch(PDO::FETCH_ASSOC);
        $this->json($user);
    }

    public function GetUserByEmail($email)
    {
        $user = $this->database->Execute("SELECT * FROM users WHERE email = '$email'")->fetch(PDO::FETCH_ASSOC);
        $this->json($user);
    }

    public function UpdateUser($User)
    {
        $id = $User['id'];
        $statement = $this->database->Execute("UPDATE users SET name = '{$User['name']}', password = '{$User['password']}', email = '{$User['email']}', user_type = '{$User['user_type']}', updated_at = NOW() WHERE id = '$id'");
        $this->json(['message' => "Обновление пользователя с ID: $id"]);
    }

    public function DeleteUser($id)
    {
        $statement = $this->database->Execute("DELETE FROM users WHERE id = '$id'");
        $this->json(['message' => "Удаление пользователя с ID: $id"]);
    }
}
