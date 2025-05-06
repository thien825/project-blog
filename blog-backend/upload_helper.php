<?php
// File: upload_helper.php

/**
 * Xử lý upload ảnh từ $_FILES['image'], trả về đường dẫn lưu file (relative)
 * hoặc null nếu thất bại.
 */
function uploadImage() {
    $upload_dir = __DIR__ . '/uploads/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }

    $file = $_FILES['image'];
    $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
    $file_type = mime_content_type($file['tmp_name']);
    if (!in_array($file_type, $allowed_types)) {
        error_log("Invalid file type: $file_type");
        return null;
    }

    if ($file['size'] > 5 * 1024 * 1024) {
        error_log("File too large: " . $file['size']);
        return null;
    }

    // Tên mới đảm bảo không trùng
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $new_name = uniqid('img_') . '.' . $ext;
    $destination = $upload_dir . $new_name;

    if (move_uploaded_file($file['tmp_name'], $destination)) {
        // Trả về đường dẫn relative để lưu vào DB
        return 'uploads/' . $new_name;
    } else {
        error_log("Failed to move uploaded file.");
        return null;
    }
}
