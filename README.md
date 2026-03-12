# WebHomework 📸 Социальная сет

**Простая, но полноценная социальная сеть на чистом PHP** с лентой постов, созданием публикаций, слайдерами фото, модальными окнами и базой данных.

Проект создан как учебный

---

## ✨ Основные возможности

### Лента (home.php)
- Посты с аватаркой и именем пользователя
- Поддержка **одного или нескольких фото** с автоматическим слайдером
- Лайки (❤ + количество)
- Текст поста с умным сворачиванием («ещё» / «свернуть») — высчитывается по реальной высоте
- Время публикации в формате «только что», «5 минут назад», «2 часа назад» и т.д.
- Клик по фото → полноэкранное модальное окно со слайдером и навигацией

### Создание поста (create_post.php)
- Перетаскивание фото (drag & drop) или кнопка «Добавить фото»
- Поддержка нескольких изображений с предпросмотром и слайдером
- Поле для подписи
- Кнопка «Поделиться» активна только когда есть хотя бы одно фото **и** текст
- AJAX-запрос на `save_post.php` (с валидацией)
- Красивое сообщение об успехе + кнопка «Создать новый пост»

### Профиль (profile.html + profile.css)
- Аватарка, имя, статус
- Галерея в сетке (grid)

### Авторизация (login.html)
- Красивая страница входа (готовый дизайн)

### Общие фичи
- Адаптивный дизайн (Golos UI шрифт)
- Плавные анимации и переходы
- Защита от XSS (`htmlspecialchars`)
- Валидация данных (`validation.php`)

---

Создайте базу social_network и выполните SQL:
SQLCREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    avatar VARCHAR(255) NOT NULL
);

CREATE TABLE post (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    text TEXT,
    likes INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE post_image (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    order_index INT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES post(id)
);
Важно: в текущей версии save_post.php не сохраняет реальные файлы (только возвращает успех). Для полной версии нужно доработать сохранение в папку uploads/ и запись путей в post_image.
3. Настройка подключения
Отредактируйте data/database.php (там уже есть класс Database).
4. Запуск
Запустите локальный сервер (XAMPP, MAMP, Laragon, php -S localhost:8000)
Откройте: http://localhost/home.php

Готово!
