<?php

function getTimeAgo($timestamp) {
    $diff = time() - $timestamp;
    
    if ($diff < 60) {
        return 'только что';
    } elseif ($diff < 3600) {
        $minutes = floor($diff / 60);
        return $minutes . ' ' . getNounPluralForm($minutes, 'минуту', 'минуты', 'минут') . ' назад';
    } elseif ($diff < 86400) {
        $hours = floor($diff / 3600);
        return $hours . ' ' . getNounPluralForm($hours, 'час', 'часа', 'часов') . ' назад';
    } else {
        $days = floor($diff / 86400);
        return $days . ' ' . getNounPluralForm($days, 'день', 'дня', 'дней') . ' назад';
    }
}

function getNounPluralForm($number, $one, $two, $many) {
    $number = (int)$number;
    $mod10 = $number % 10;
    $mod100 = $number % 100;

    if ($mod100 >= 11 && $mod100 <= 19) {
        return $many;
    } elseif ($mod10 === 1) {
        return $one;
    } elseif ($mod10 >= 2 && $mod10 <= 4) {
        return $two;
    } else {
        return $many;
    }
}

function loadJsonData($filename) {
    $json = file_get_contents($filename);
    $data = json_decode($json, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Ошибка при декодировании JSON: ' . json_last_error_msg());
    }
    
    return $data;
}