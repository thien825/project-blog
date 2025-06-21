<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'db.php';

$post_id = isset($_GET['post_id']) ? (int)$_GET['post_id'] : null;

if ($post_id === null) {
    echo json_encode(['success' => false, 'message' => 'Thiếu post_id']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT COUNT(*) as like_count FROM likes WHERE post_id = ?");
    $stmt->execute([$post_id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'like_count' => $row['like_count']]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>