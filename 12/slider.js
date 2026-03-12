document.addEventListener('DOMContentLoaded', function() {
    // Элементы модального окна
    const modal = document.getElementById('imageModal');
    const modalClose = document.getElementById('modalClose');
    const modalSlider = document.getElementById('modalSlider');
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');
    const modalIndicator = document.getElementById('modalIndicator');

    let currentModalImages = [];
    let currentModalIndex = 0;
    let currentPostId = null;

    // Функционал слайдера для постов
    document.querySelectorAll('.photo-container').forEach(container => {
        const images = container.querySelectorAll('.photo-container__image');
        const prevBtn = container.querySelector('.slider-prev');
        const nextBtn = container.querySelector('.slider-next');
        const indicator = container.querySelector('.photo-container__indicator');
        
        if (images.length <= 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            if (indicator) indicator.style.display = 'none';
        } else {
            let currentIndex = 0;
            
            function updateSlider() {
                images.forEach((img, index) => {
                    img.classList.toggle('active', index === currentIndex);
                });
                
                if (indicator) {
                    indicator.textContent = `${currentIndex + 1}/${images.length}`;
                }
            }
            
            if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    currentIndex = (currentIndex - 1 + images.length) % images.length;
                    updateSlider();
                });
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    currentIndex = (currentIndex + 1) % images.length;
                    updateSlider();
                });
            }
            
            updateSlider();
        }
        
        // Открытие модального окна при клике на изображение или кнопки слайдера
        container.addEventListener('click', (e) => {
            // Не открываем модальное окно при клике на кнопки навигации
            if (e.target.closest('.slider-prev') || e.target.closest('.slider-next')) {
                return;
            }
            
            const postId = container.closest('.post').dataset.postId;
            const images = container.querySelectorAll('.photo-container__image');
            let imageIndex = 0;
            
            // Находим индекс активного изображения
            images.forEach((img, index) => {
                if (img.classList.contains('active')) {
                    imageIndex = index;
                }
            });
            
            openModal(postId, imageIndex);
        });
    });

    // Функция для открытия модального окна
    function openModal(postId, imageIndex) {
        const post = document.querySelector(`.post[data-post-id="${postId}"]`);
        if (!post) return;
        
        const images = post.querySelectorAll('.photo-container__image');
        currentModalImages = Array.from(images).map(img => img.src);
        currentModalIndex = imageIndex;
        currentPostId = postId;
        
        // Заполняем модальное окно изображениями
        modalSlider.innerHTML = '';
        currentModalImages.forEach((src, index) => {
            const img = document.createElement('img');
            img.src = src;
            img.className = 'modal__image';
            if (index === currentModalIndex) {
                img.classList.add('modal__image--active');
            }
            modalSlider.appendChild(img);
        });
        
        updateModalIndicator();
        modal.classList.add('modal--open');
        document.body.style.overflow = 'hidden';
    }

    function updateModalIndicator() {
        modalIndicator.textContent = `${currentModalIndex + 1}/${currentModalImages.length}`;
    }

    function updateModalSlider() {
        modalSlider.querySelectorAll('.modal__image').forEach((img, index) => {
            img.classList.toggle('modal__image--active', index === currentModalIndex);
        });
        updateModalIndicator();
    }

    // Навигация в модальном окне
    modalPrev.addEventListener('click', () => {
        currentModalIndex = (currentModalIndex - 1 + currentModalImages.length) % currentModalImages.length;
        updateModalSlider();
    });

    modalNext.addEventListener('click', () => {
        currentModalIndex = (currentModalIndex + 1) % currentModalImages.length;
        updateModalSlider();
    });

    // Закрытие модального окна
    modalClose.addEventListener('click', () => {
        modal.classList.remove('modal--open');
        document.body.style.overflow = '';
    });

    // Закрытие по клику вне контента модального окна
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('modal--open');
            document.body.style.overflow = '';
        }
    });

    // Закрытие по клавише Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('modal--open')) {
            modal.classList.remove('modal--open');
            document.body.style.overflow = '';
        }
    });

    // Функция для проверки необходимости кнопки "ещё"
    function checkTextOverflow() {
        document.querySelectorAll('.post__text').forEach(textElement => {
            const container = textElement.closest('.post__text-container');
            if (!container) return;
            
            const readMoreBtn = container.querySelector('.post__read-more');
            if (!readMoreBtn) return;
            
            // Сбрасываем стили для проверки
            textElement.classList.remove('post__text--collapsed');
            
            // Проверяем, превышает ли текст 2 строки
            const lineHeight = parseInt(getComputedStyle(textElement).lineHeight);
            const maxHeight = lineHeight * 2;
            
            if (textElement.scrollHeight > maxHeight + 2) { // +2 для погрешности
                readMoreBtn.style.display = 'block';
                textElement.classList.add('post__text--collapsed');
            } else {
                readMoreBtn.style.display = 'none';
                textElement.classList.remove('post__text--collapsed');
            }
        });
    }

    // Функция для обработки клика по кнопке "ещё"
    function setupReadMoreButtons() {
        document.querySelectorAll('.post__read-more').forEach(btn => {
            // Удаляем старые обработчики чтобы избежать дублирования
            btn.onclick = null;
            
            btn.addEventListener('click', function() {
                const postId = this.id.replace('read-more-', '');
                const textElement = document.getElementById(`text-${postId}`);
                
                if (!textElement) return;
                
                if (textElement.classList.contains('post__text--collapsed')) {
                    // Раскрываем текст
                    textElement.classList.remove('post__text--collapsed');
                    this.textContent = 'свернуть';
                } else {
                    // Скрываем текст
                    textElement.classList.add('post__text--collapsed');
                    this.textContent = 'ещё';
                }
            });
        });
    }

    // Инициализируем кнопки "ещё"
    setTimeout(() => {
        checkTextOverflow();
        setupReadMoreButtons();
    }, 100);
    
    // Обновляем при изменении размера окна
    window.addEventListener('resize', checkTextOverflow);
});

// Добавляем функции в глобальную область видимости для повторного использования
// Функция для проверки необходимости кнопки "ещё"
function checkTextOverflow() {
    document.querySelectorAll('.post__text').forEach(textElement => {
        const container = textElement.closest('.post__text-container');
        const readMoreBtn = container.querySelector('.post__read-more');
        
        // Временно убираем класс collapsed для проверки реальной высоты
        const wasCollapsed = textElement.classList.contains('post__text--collapsed');
        textElement.classList.remove('post__text--collapsed');
        
        // Получаем реальную высоту текста
        const actualHeight = textElement.scrollHeight;
        
        // Возвращаем исходное состояние
        if (wasCollapsed) {
            textElement.classList.add('post__text--collapsed');
        }
        
        // Высота двух строк (2 * line-height)
        const twoLinesHeight = 36;
        
        // Если текст превышает 2 строки, показываем кнопку
        if (actualHeight > twoLinesHeight) {
            readMoreBtn.style.display = 'block';
            readMoreBtn.setAttribute('data-state', 'collapsed');
        } else {
            readMoreBtn.style.display = 'none';
        }
    });
}

// Функция для обработки клика по кнопке "ещё"
function setupReadMoreButtons() {
    document.querySelectorAll('.post__read-more').forEach(btn => {
        // Удаляем старые обработчики, если есть
        btn.onclick = null;
        
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const postId = this.id.replace('read-more-', '');
            const textElement = document.getElementById(`text-${postId}`);
            const state = this.getAttribute('data-state');
            
            if (state === 'collapsed') {
                // Раскрываем текст
                textElement.classList.remove('post__text--collapsed');
                this.textContent = 'свернуть';
                this.setAttribute('data-state', 'expanded');
            } else {
                // Скрываем текст
                textElement.classList.add('post__text--collapsed');
                this.textContent = 'ещё';
                this.setAttribute('data-state', 'collapsed');
            }
        });
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Даем время браузеру отрисовать контент
    setTimeout(() => {
        checkTextOverflow();
        setupReadMoreButtons();
    }, 500); // Увеличиваем задержку
    
    // Отключаем автоматическую проверку при ресайзе, чтобы избежать мигания
    // window.addEventListener('resize', checkTextOverflow);
});

// Функция для ручного обновления (если нужно)
window.updateReadMoreButtons = function() {
    checkTextOverflow();
    setupReadMoreButtons();
};

// Функция для открытия модального окна (глобальная)
window.openModal = function(postId, imageIndex) {
    const modal = document.getElementById('imageModal');
    const modalSlider = document.getElementById('modalSlider');
    const modalIndicator = document.getElementById('modalIndicator');
    
    const post = document.querySelector(`.post[data-post-id="${postId}"]`);
    if (!post) return;
    
    const images = post.querySelectorAll('.photo-container__image');
    const currentModalImages = Array.from(images).map(img => img.src);
    let currentModalIndex = imageIndex || 0;
    
    // Заполняем модальное окно изображениями
    modalSlider.innerHTML = '';
    currentModalImages.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'modal__image';
        if (index === currentModalIndex) {
            img.classList.add('modal__image--active');
        }
        modalSlider.appendChild(img);
    });
    
    modalIndicator.textContent = `${currentModalIndex + 1}/${currentModalImages.length}`;
    modal.classList.add('modal--open');
    document.body.style.overflow = 'hidden';
    
    // Добавляем обработчики для навигации
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');
    
    const updateModal = function() {
        modalSlider.querySelectorAll('.modal__image').forEach((img, index) => {
            img.classList.toggle('modal__image--active', index === currentModalIndex);
        });
        modalIndicator.textContent = `${currentModalIndex + 1}/${currentModalImages.length}`;
    };
    
    modalPrev.onclick = function() {
        currentModalIndex = (currentModalIndex - 1 + currentModalImages.length) % currentModalImages.length;
        updateModal();
    };
    
    modalNext.onclick = function() {
        currentModalIndex = (currentModalIndex + 1) % currentModalImages.length;
        updateModal();
    };
};