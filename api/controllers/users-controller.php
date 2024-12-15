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
        $statement = $this->database->Execute("SELECT * FROM $table WHERE code = '$code'");
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result;
    }

    public function Authenticate($credentials)
    {
        $user = $this->database->Execute("SELECT * FROM users WHERE users.email = '{$credentials['email']}' AND user_type = '{$credentials['userType']}'")->fetch(PDO::FETCH_ASSOC);
        if (!$user) {
            $this->json($user);
            return;
        } else {
            if ($credentials['userType'] === '3' and !$this->CheckCode($credentials['adminCode'], 'admin_codes')) {
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
        $passwordHash = password_hash($User['password'], PASSWORD_DEFAULT);
        $specifiedOrg = $this->CheckCode($User['orgCode'], 'organizations');
        if (!$specifiedOrg) {
            $this->json($specifiedOrg);
            return;
        } else {
            $statement = $this->database->Execute("INSERT INTO users 
            (name, email, password, user_type, organization_id) VALUES 
            ('{$User['name']}', '{$User['email']}', '$passwordHash', '{$User['userType']}', '{$specifiedOrg['id']}')");
            $user = $this->database->Execute("SELECT * FROM users WHERE email = '{$User['email']}'")->fetch(PDO::FETCH_ASSOC);
            $this->json($user);
        }
    }

    public function GetAllUsers()
    {
        $users = $this->database->Execute("SELECT * FROM users")->fetchAll(PDO::FETCH_ASSOC);
        $this->json($users);
    }

    public function GetUser($id)
    {
        $user = $this->database->Execute("SELECT * FROM users WHERE id = '$id'")->fetch(PDO::FETCH_ASSOC);
        $this->json($user);
    }

    public function UpdateUser($User)
    {
        $id = $User['id'];
        $statement = $this->database->Execute("UPDATE users SET name = '{$User['name']}', password = '{$User['password']}', email = '{$User['email']}', user_type = '{$User['userType']}', updated_at = NOW() WHERE id = '$id'");
        $this->json(['message' => "Обновление пользователя с ID: $id"]);
    }

    public function DeleteUser($id)
    {
        $statement = $this->database->Execute("DELETE FROM users WHERE id = '$id'");
        $this->json(['message' => "Удаление пользователя с ID: $id"]);
    }
}
