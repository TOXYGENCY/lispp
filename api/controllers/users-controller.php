<?php
require_once 'headers.php';

class UsersController
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

    private function _GetByCode($code, $table)
    {
        $statement = $this->database->Execute("SELECT * FROM $table WHERE code = ?", [$code]);
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result;
    }

    public function Authenticate($credentials)
    {
        // Получаем пользователя по email и типу пользователя
        $user = $this->database->Execute(
            "SELECT * FROM users WHERE email = ? AND user_type = ?",
            [$credentials['email'], $credentials['user_type']]
        )->fetch(PDO::FETCH_ASSOC);
        // Проверяем, существует ли пользователь
        if (!$user) {
            $this->_json(['success' => false, 'message' => 'Пользователь не найден.']);
            return;
        }
        // Проверяем код администратора, если это администратор
        if ($credentials['user_type'] === 3 && !$this->_GetByCode($credentials['adminCode'], 'admin_codes')) {
            $this->_json(['success' => false, 'message' => 'Неверный код администратора.']);
            return;
        }
        // Проверяем пароль
        // if (!password_verify($credentials['passwordString'], $user['password'])) {
        if ($credentials['passwordString'] !== $user['password']) {
            $this->_json(['success' => false, 'message' => 'Неверный пароль.']);
            return;
        }
        // Если аутентификация успешна, возвращаем данные пользователя
        $this->_json(['success' => true, 'user' => $user]);
    }

    public function CreateUser($User)
    {
        // Можно хешировать пароль, если нужно, но в данном случае не будем
        // $passwordHash = password_hash($User['password'], PASSWORD_DEFAULT);
        $passwordHash = $User['password'];

        // Проверяем код организации
        $specifiedOrg = $this->_GetByCode($User['organization_code'], 'organizations');
        if (!$specifiedOrg) {
            $this->_json(['success' => false, 'message' => 'Несуществующий код организации.']);
            return;
        }

        // Проверяем, существует ли пользователь с таким email
        $query = "SELECT * FROM users WHERE email = ?";
        $existingUser = $this->database->Execute($query, [$User['email']])->fetch(PDO::FETCH_ASSOC);
        if ($existingUser) {
            $this->_json(['success' => false, 'message' => 'Пользователь с таким email уже существует.']);
            return;
        }

        // Подготовка SQL-запроса для вставки нового пользователя
        $insertQuery = "INSERT INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)";

        // Выполняем запрос на вставку
        if ($this->database->Execute($insertQuery, [$User['name'], $User['email'], $passwordHash, $User['user_type']])) {
            // Если пользователь успешно создан, получаем его данные
            $userData = $this->database->Execute("SELECT * FROM users WHERE email = ?", [$User['email']])->fetch(PDO::FETCH_ASSOC);

            // Связываем юзера и организацию
            $this->database->Execute(
                "INSERT INTO users_organizations (user_id, organization_id) VALUES (?, ?)",
                [$userData['id'], $specifiedOrg['id']]
            );
            // Возвращаем данные нового юзера
            $this->_json(['success' => true, 'user' => $userData]);
        } else {
            // Если произошла ошибка при вставке, возвращаем ошибку
            $this->_json(['success' => false, 'message' => 'Ошибка при создании пользователя.']);
        }
    }

    public function GetAllUsers()
    {
        $users = $this->database->Execute("SELECT * FROM users")->fetchAll(PDO::FETCH_ASSOC);
        $this->_json($users);
    }

    public function GetUserById($id)
    {
        $user = $this->database->Execute("SELECT * FROM users WHERE id = ?", [$id])->fetch(PDO::FETCH_ASSOC);
        $this->_json($user);
    }

    public function GetUserByEmail($email)
    {
        $email = urldecode($email);
        $user = $this->database->Execute("SELECT * FROM users WHERE email = ?", [$email])->fetch(PDO::FETCH_ASSOC);
        $this->_json($user);
    }

    public function UpdateUser($User)
    {
        $id = $User['id'];
        $this->database->Execute("UPDATE users SET name = ?, password = ?, email = ?, user_type = ?, updated_at = NOW() WHERE id = ?", [$User['name'], $User['password'], $User['email'], $User['user_type'], $id]);
        $this->_json(['message' => "Обновление пользователя с ID: $id"]);
    }

    public function DeleteUser($id)
    {
        $this->database->Execute("DELETE FROM users WHERE id = ?", [$id]);
        $this->_json(['message' => "Удаление пользователя с ID: $id"]);
    }
}
