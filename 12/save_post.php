<?php
require_once 'data/database.php';
require_once 'validation.php';

header('Content-Type: application/json');

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Метод не поддерживается');
    }

    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Некорректные данные');
    }

    $text = $input['text'] ?? '';
    $images = $input['images'] ?? [];

    if (empty($text)) {
        throw new Exception('Текст поста не может быть пустым');
    }

    if (empty($images)) {
        throw new Exception('Должна быть хотя бы одна фотография');
    }

    
    $response = [
        'success' => true,
        'message' => 'Пост успешно сохранен!',
        'post_id' => uniqid() 
    ];

    echo json_encode($response);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}