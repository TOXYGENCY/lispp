<?php
// Get the current request URI from the server variables
// This will include the path and any query string parameters
// e.g. /users?name=John+Doe
$requestUri = $_SERVER['REQUEST_URI'];
echo $requestUri;

// if ($_SERVER['REQUEST_METHOD'] === 'GET' && strpos($requestUri, '?') == false) {
//     // Get All
//     echo json_encode(['status' => 'success at get all']);
// } elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && strpos($requestUri, '?') == true) {
//     // Get by id
//     echo json_encode(['status' => 'success']);
// } elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && strpos($requestUri, '?') == true) {
//     // Add user
//     echo json_encode(['status' => 'success']);
// }
// else {
//     echo json_encode(['status' => 'fail']);
// }
