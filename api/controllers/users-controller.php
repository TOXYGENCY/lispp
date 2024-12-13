<?php
class UsersController
{
    public function Authenticate()
    {
        echo json_encode(['message' => 'Аутентификация пользователя'], JSON_UNESCAPED_UNICODE, JSON_UNESCAPED_SLASHES);
    }

    public function GetAllUsers()
    {
        echo json_encode(['message' => 'Получение всех пользователей'], JSON_UNESCAPED_UNICODE, JSON_UNESCAPED_SLASHES);
    }

    public function GetUser($id)
    {
        echo json_encode(['message' => "Получение пользователя с ID: $id"], JSON_UNESCAPED_UNICODE, JSON_UNESCAPED_SLASHES);
    }

    public function CreateUser()
    {
        echo json_encode(['message' => 'Создание нового пользователя'], JSON_UNESCAPED_UNICODE, JSON_UNESCAPED_SLASHES);
    }

    public function UpdateUser($id)
    {
        echo json_encode(['message' => "Обновление пользователя с ID: $id"], JSON_UNESCAPED_UNICODE, JSON_UNESCAPED_SLASHES);
    }

    public function DeleteUser($id)
    {
        echo json_encode(['message' => "Удаление пользователя с ID: $id"], JSON_UNESCAPED_UNICODE, JSON_UNESCAPED_SLASHES);
    }
}
