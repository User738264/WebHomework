<!DOCTYPE html>
<html lang="ru">
<head>
    <title>Создать пост</title>
    <link rel="stylesheet" href="home.css">
    <link rel="stylesheet" href="create_post.css">
</head>
<body class="page">
    <div class="page__sidebar sidebar">
        <div class="sidebar__menu-item" onclick="location.href='home.php'">
            🏠
        </div>
        <div class="sidebar__menu-item">
            🙍‍♂️
        </div>
        <div class="sidebar__menu-item sidebar__menu-item--active">
            ➕
        </div>
    </div>

    <div class="page__content">
        <div class="create-post">
            <div class="create-post__header">
                <h1>Новый пост</h1>
            </div>

            <div class="create-post__content">
                <div class="create-post__photo-section">
                    <div class="photo-upload-area" id="photoUploadArea">
                        <div class="photo-upload-area__placeholder" id="uploadPlaceholder">
                            <div class="photo-upload-area__icon">🖼️</div>
                            <div class="photo-upload-area__text">Добавить фото</div>
                        </div>
                        <div class="photo-upload-area__preview" id="photoPreview" style="display: none;">
                            <div class="photo-slider" id="photoSlider">
                            </div>
                            <div class="photo-slider__navigation" id="photoNavigation" style="display: none;">
                                <button class="slider-button slider-prev" id="sliderPrev">◀</button>
                                <div class="photo-slider__indicator" id="sliderIndicator">1/1</div>
                                <button class="slider-button slider-next" id="sliderNext">▶</button>
                            </div>
                        </div>
                        <input type="file" id="photoInput" multiple accept="image/*" style="display: none;">
                    </div>

                    <button class="text-button" id="addPhotoButton">⊞ Добавить фото</button>
                </div>

                <div class="create-post__text-section">
                    <textarea 
                        class="create-post__textarea" 
                        placeholder="Добавьте подпись..." 
                        id="postText"
                    ></textarea>
                </div>
            </div>

            <div class="create-post__footer">
                <button class="share-button" id="shareButton" disabled>Поделиться</button>
            </div>
        </div>
    </div>

    <script src="create_post.js"></script>
</body>
</html>