-- Создаем базу данных
CREATE DATABASE IF NOT EXISTS blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE blog;

-- Удаляем существующие таблицы (если нужно пересоздать)
DROP TABLE IF EXISTS post_image;
DROP TABLE IF EXISTS post;
DROP TABLE IF EXISTS user;

-- Создаем таблицу пользователей
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Создаем таблицу постов
CREATE TABLE post (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    text TEXT,
    likes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Создаем таблицу изображений постов
CREATE TABLE post_image (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Добавляем пользователей
INSERT INTO user (name, avatar) VALUES
('Иван Петров', '3.jpg'),
('Мария Сидорова', '4.jpg'),
('Алексей Козлов', '5.jpg');

-- Добавляем посты
INSERT INTO post (user_id, text, likes) VALUES
(1, 'Прекрасный день в горах! Виды просто завораживающие. Хочется остаться здесь навсегда и наслаждаться природой.', 15),
(2, 'Новый рецепт пирога с яблоками. Получился очень вкусным и ароматным! Делюсь фотографиями процесса приготовления.', 23),
(3, 'Завершил важный проект на работе. Теперь можно немного отдохнуть и заняться любимыми хобби.', 8),
(1, 'Путешествие по Европе продолжается! Сегодня посетили несколько удивительных мест с богатой историей.', 31);

-- Добавляем изображения для постов
INSERT INTO post_image (post_id, image_url, order_index) VALUES
(1, '1.jpg', 0),
(1, '2.jpg', 1),
(1, '3.jpg', 2),
(2, '1.jpg', 0),
(2, '2.jpg', 1),
(3, '1.jpg', 0),
(4, '1.jpg', 0),
(4, '2.jpg', 1),
(4, '3.jpg', 2),
(4, '4.jpg', 3);

-- Проверяем, что все добавилось правильно
SELECT * FROM user;
SELECT * FROM post;
SELECT * FROM post_image;