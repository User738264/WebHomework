<?php

function validateUserId($id, $users) {
    if (!is_numeric($id)) {
        return false;
    }
    
    $id = (int)$id;
    foreach ($users as $user) {
        if ($user['id'] === $id) {
            return true;
        }
    }
    return false;
}

function validatePostData($post) {
    if (!isset($post['id'], $post['user_id'], $post['image'], $post['likes'], $post['created_at'])) {
        return false;
    }
    
    if (!is_int($post['id']) || $post['id'] <= 0) {
        return false;
    }
    
    if (!is_int($post['user_id']) || $post['user_id'] <= 0) {
        return false;
    }
    
    if (!is_string($post['image']) || empty($post['image'])) {
        return false;
    }
    
    //if (!is_int($post['likes']) {
    //    return false;
    //}
    
    if (!is_int($post['created_at']) || $post['created_at'] <= 0) {
        return false;
    }
    
    return true;
}

function validateUserData($user) {
    if (!isset($user['id'], $user['name'], $user['avatar'])) {
        return false;
    }
    
    if (!is_int($user['id']) || $user['id'] <= 0) {
        return false;
    }
    
    if (!is_string($user['name']) || empty($user['name'])) {
        return false;
    }
    
    if (!is_string($user['avatar']) || empty($user['avatar'])) {
        return false;
    }
    
    return true;
}