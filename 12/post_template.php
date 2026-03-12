<div class="feed__post post" data-post-id="<?= $post['id'] ?>">
    <div class="post__header">
        <div class="post__user-info user-info">
            <img class="user-info__avatar" src="<?= htmlspecialchars($post['user_avatar']) ?>">
            <div class="user-info__username"><?= htmlspecialchars($post['user_name']) ?></div>
        </div>
        <div class="post__edit-icon"></div>
    </div>

    <div class="post__photo-container photo-container">
        <div class="photo-container__slider">
            <?php foreach ($post['images'] as $index => $image): ?>
                <img class="photo-container__image <?= $index === 0 ? 'active' : '' ?>" 
                     src="<?= htmlspecialchars($image) ?>" 
                     data-index="<?= $index ?>">
            <?php endforeach; ?>
        </div>
        
        <?php if ($post['images_count'] > 1): ?>
            <div class="photo-container__slider-buttons">
                <div class="slider-button slider-prev">
                    ◀
                </div>
                <div class="slider-button slider-next">
                    ▶
                </div>
            </div>
            <div class="photo-container__indicator">1/<?= $post['images_count'] ?></div>
        <?php endif; ?>
    </div>

    <div class="post__reaction reaction">
        <span>❤</span>
        <span class="reaction__count"><?= $post['likes'] ?></span>
    </div>

    <?php if (!empty($post['text'])): ?>
        <div class="post__text-container">
            <div class="post__text post__text--collapsed" id="text-<?= $post['id'] ?>">
                <?= htmlspecialchars($post['text']) ?> 
            </div>
            <button class="post__read-more" id="read-more-<?= $post['id'] ?>" data-state="collapsed">ещё</button>
        </div>
    <?php endif; ?>
    
    <div class="post__time"><?= getTimeAgo($post['created_at']) ?></div>
</div>