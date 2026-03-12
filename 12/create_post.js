document.addEventListener('DOMContentLoaded', function() {
    const photoInput = document.getElementById('photoInput');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const photoPreview = document.getElementById('photoPreview');
    const photoSlider = document.getElementById('photoSlider');
    const photoNavigation = document.getElementById('photoNavigation');
    const sliderPrev = document.getElementById('sliderPrev');
    const sliderNext = document.getElementById('sliderNext');
    const sliderIndicator = document.getElementById('sliderIndicator');
    const addPhotoButton = document.getElementById('addPhotoButton');
    const postText = document.getElementById('postText');
    const shareButton = document.getElementById('shareButton');
    const photoUploadArea = document.getElementById('photoUploadArea');
    const createPostContent = document.querySelector('.create-post__content');
    const createPostFooter = document.querySelector('.create-post__footer');

    let uploadedImages = [];
    let currentSlideIndex = 0;

    // Обработчики для загрузки фото
    uploadPlaceholder.addEventListener('click', handlePhotoUpload);
    addPhotoButton.addEventListener('click', handlePhotoUpload);
    photoUploadArea.addEventListener('click', handlePhotoUpload);

    function handlePhotoUpload(e) {
        if (e.target.closest('.slider-button')) {
            return;
        }
        photoInput.click();
    }

    photoInput.addEventListener('change', function(e) {
        const files = e.target.files;
        if (files.length > 0) {
            processFiles(files);
        }
    });

    function processFiles(files) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    uploadedImages.push({
                        url: e.target.result,
                        file: file,
                        name: file.name,
                        type: file.type,
                        size: file.size
                    });
                    updatePhotoPreview();
                    updateShareButtonState();
                };
                reader.readAsDataURL(file);
            }
        }
    }

    function updatePhotoPreview() {
        if (uploadedImages.length > 0) {
            uploadPlaceholder.style.display = 'none';
            photoPreview.style.display = 'block';
            
            photoSlider.innerHTML = '';
            uploadedImages.forEach((image, index) => {
                const img = document.createElement('img');
                img.src = image.url;
                img.className = 'photo-slider__image';
                img.alt = 'Uploaded image';
                if (index === currentSlideIndex) {
                    img.classList.add('active');
                }
                photoSlider.appendChild(img);
            });

            if (uploadedImages.length > 1) {
                photoNavigation.style.display = 'flex';
                updateSliderNavigation();
            } else {
                photoNavigation.style.display = 'none';
            }
        } else {
            uploadPlaceholder.style.display = 'flex';
            photoPreview.style.display = 'none';
            photoNavigation.style.display = 'none';
        }
    }

    function updateSliderNavigation() {
        sliderIndicator.textContent = `${currentSlideIndex + 1}/${uploadedImages.length}`;
        
        sliderPrev.style.display = uploadedImages.length > 1 ? 'flex' : 'none';
        sliderNext.style.display = uploadedImages.length > 1 ? 'flex' : 'none';
    }

    // Навигация слайдера
    sliderPrev.addEventListener('click', function(e) {
        e.stopPropagation();
        if (uploadedImages.length > 1) {
            currentSlideIndex = (currentSlideIndex - 1 + uploadedImages.length) % uploadedImages.length;
            updateSlider();
        }
    });

    sliderNext.addEventListener('click', function(e) {
        e.stopPropagation();
        if (uploadedImages.length > 1) {
            currentSlideIndex = (currentSlideIndex + 1) % uploadedImages.length;
            updateSlider();
        }
    });

    function updateSlider() {
        const images = photoSlider.querySelectorAll('.photo-slider__image');
        images.forEach((img, index) => {
            img.classList.toggle('active', index === currentSlideIndex);
        });
        updateSliderNavigation();
    }

    // Проверка состояния кнопки "Поделиться"
    function updateShareButtonState() {
        const hasImages = uploadedImages.length > 0;
        const hasText = postText.value.trim().length > 0;
        shareButton.disabled = !(hasImages && hasText);
    }

    postText.addEventListener('input', updateShareButtonState);

    // Обработчик кнопки "Поделиться"
    shareButton.addEventListener('click', async function() {
        if (shareButton.disabled) return;

        // Показываем состояние загрузки
        const originalText = shareButton.textContent;
        shareButton.textContent = 'Сохранение...';
        shareButton.disabled = true;

        try {
            // Подготавливаем данные для отправки
            const postData = {
                text: postText.value.trim(),
                images: uploadedImages.map(img => ({
                    name: img.name,
                    type: img.type,
                    size: img.size,
                    // В реальном приложении здесь бы отправлялся файл
                    // Для демонстрации отправляем только метаданные
                    data_url: img.url // В реальном приложении так делать не стоит
                }))
            };

            // Отправляем запрос на сервер
            const response = await fetch('save_post.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData)
            });

            const result = await response.json();

            if (result.success) {
                // Успешное сохранение - скрываем форму и показываем сообщение
                showSuccessMessage(result.message);
            } else {
                // Ошибка - показываем сообщение об ошибке
                showErrorMessage(result.message);
                // Восстанавливаем кнопку
                shareButton.textContent = originalText;
                shareButton.disabled = false;
            }

        } catch (error) {
            // Ошибка сети или другая ошибка
            showErrorMessage('Ошибка сети: ' + error.message);
            // Восстанавливаем кнопку
            shareButton.textContent = originalText;
            shareButton.disabled = false;
        }
    });

    function showSuccessMessage(message) {
        // Скрываем форму
        createPostContent.style.display = 'none';
        createPostFooter.style.display = 'none';
        
        // Показываем сообщение об успехе
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div class="success-icon">✓</div>
            <h2>${message}</h2>
            <button class="new-post-button" id="newPostButton">Создать новый пост</button>
        `;
        
        document.querySelector('.create-post').appendChild(successDiv);
        
        // Обработчик для создания нового поста
        document.getElementById('newPostButton').addEventListener('click', function() {
            location.reload();
        });
    }

    function showErrorMessage(message) {
        // Удаляем старые сообщения об ошибках
        const oldError = document.querySelector('.error-message');
        if (oldError) {
            oldError.remove();
        }
        
        // Показываем новое сообщение об ошибке
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        createPostContent.insertBefore(errorDiv, createPostContent.firstChild);
        
        // Автоматически скрываем ошибку через 5 секунд
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    // Drag and drop для загрузки фото
    photoUploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        photoUploadArea.style.borderColor = '#007bff';
        photoUploadArea.style.background = '#e3f2fd';
    });

    photoUploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        photoUploadArea.style.borderColor = '#dee2e6';
        photoUploadArea.style.background = '#f8f9fa';
    });

    photoUploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        photoUploadArea.style.borderColor = '#dee2e6';
        photoUploadArea.style.background = '#f8f9fa';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processFiles(files);
        }
    });

    // Инициализация
    updateShareButtonState();
});