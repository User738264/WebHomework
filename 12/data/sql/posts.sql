INSERT INTO user (name, avatar) VALUES
('Ваня Денисов', 'vanya.png');

INSERT INTO post (user_id, text, likes) VALUES
(1, 'Прекрасный день в горах! Виды просто завораживают. Хочется остаться здесь навсегда и наслаждаться природой.', 15),

INSERT INTO post_image (post_id, image_url, order_index) VALUES
(1, '1.jpg', 0),
(1, '1.jpg', 1),
(1, '1.jpg', 2);