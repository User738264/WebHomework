<?php
require_once 'data/database.php';
require_once 'functions.php';
require_once 'validation.php';

try {
    $database = new Database();
    $db = $database->connect();

    // Получаем посты с информацией о пользователе
    $query = "SELECT p.*, u.name as user_name, u.avatar as user_avatar 
              FROM post p 
              JOIN user u ON p.user_id = u.id";
    
    $filterUserId = $_GET['user_id'] ?? null;
    if ($filterUserId && is_numeric($filterUserId)) {
        $filterUserId = (int)$filterUserId;
        $query .= " WHERE p.user_id = :user_id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':user_id', $filterUserId, PDO::PARAM_INT);
    } else {
        $stmt = $db->prepare($query);
    }
    
    $stmt->execute();
    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Получаем изображения для всех постов
    $postImages = [];
    if (!empty($posts)) {
        $postIds = array_column($posts, 'id');
        $placeholders = implode(',', array_fill(0, count($postIds), '?'));
        
        $imagesQuery = "SELECT post_id, image_url, order_index 
                       FROM post_image 
                       WHERE post_id IN ($placeholders)
                       ORDER BY post_id, order_index";
        $imagesStmt = $db->prepare($imagesQuery);
        $imagesStmt->execute($postIds);
        $imagesData = $imagesStmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Группируем изображения по post_id
        foreach ($imagesData as $image) {
            $postImages[$image['post_id']][] = $image;
        }
    }
    
    $filteredPosts = [];
    foreach ($posts as $post) {
        $images = isset($postImages[$post['id']]) ? $postImages[$post['id']] : [];
        $imageUrls = array_column($images, 'image_url');
        
        $filteredPosts[] = [
            'id' => $post['id'],
            'user_id' => $post['user_id'],
            'user_name' => $post['user_name'],
            'user_avatar' => $post['user_avatar'],
            'images' => $imageUrls,
            'text' => $post['text'] ?? '',
            'likes' => $post['likes'],
            'created_at' => strtotime($post['created_at']),
            'images_count' => count($imageUrls)
        ];
    }
    
} catch(PDOException $e) {
    die("Database error: " . $e->getMessage());
} catch(Exception $e) {
    die('Error: ' . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <title>Социальная сеть</title>
    <link rel="stylesheet" href="home.css">
</head>
<body class="page">
    <div class="page__sidebar sidebar">
        <div class="sidebar__menu-item sidebar__menu-item--home sidebar__menu-item--active">
            🏠
        </div>
        <div class="sidebar__menu-item">
            🙍‍♂️
        </div>
        <div class="sidebar__menu-item">
            ➕
        </div>
    </div>

    <div class="page__content">
        <div class="feed">
            <?php foreach ($filteredPosts as $post): ?>
                <?php include 'post_template.php'; ?>
            <?php endforeach; ?>
        </div>
    </div>

    <div class="modal" id="imageModal">
        <div class="modal__content">
            <button class="modal__close" id="modalClose">×</button>
        
           <div class="modal__slider" id="modalSlider">
           </div>
        
            <div class="modal__navigation">
                <button class="modal__nav-button modal__nav-button--prev" id="modalPrev">◀</button>
                <div class="modal__indicator" id="modalIndicator">1/1</div>
                <button class="modal__nav-button modal__nav-button--next" id="modalNext">▶</button>
            </div>
        </div>
    </div>
    <script src="slider.js"></script>
</body>
</html>