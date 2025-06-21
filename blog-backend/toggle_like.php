<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require 'db.php';

// Xử lý preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Chỉ hỗ trợ phương thức POST']);
    exit;
}

// Lấy dữ liệu từ request body
$input = json_decode(file_get_contents('php://input'), true);
$post_id = isset($input['post_id']) ? (int)$input['post_id'] : null;
$user_id = isset($input['user_id']) ? (int)$input['user_id'] : null;

if ($post_id === null || $user_id === null) {
    echo json_encode(['success' => false, 'message' => 'Thiếu post_id hoặc user_id']);
    exit;
}

try {
    // Kiểm tra xem user đã like bài viết này chưa
    $check_stmt = $pdo->prepare("SELECT id FROM likes WHERE post_id = ? AND user_id = ?");
    $check_stmt->execute([$post_id, $user_id]);
    
    if ($check_stmt->rowCount() > 0) {
        // User đã like, xóa like
        $delete_stmt = $pdo->prepare("DELETE FROM likes WHERE post_id = ? AND user_id = ?");
        $delete_stmt->execute([$post_id, $user_id]);
        
        echo json_encode(['success' => true, 'action' => 'unliked', 'message' => 'Đã bỏ thích bài viết']);
    } else {
        // User chưa like, thêm like
        $insert_stmt = $pdo->prepare("INSERT INTO likes (post_id, user_id, created_at) VALUES (?, ?, NOW())");
        $insert_stmt->execute([$post_id, $user_id]);
        
        echo json_encode(['success' => true, 'action' => 'liked', 'message' => 'Đã thích bài viết']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Lỗi database: ' . $e->getMessage()]);
}
?> 