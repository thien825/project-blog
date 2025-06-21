<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'db.php';

$post_id = isset($_GET['post_id']) ? (int)$_GET['post_id'] : null;
$user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : null;

if ($post_id === null || $user_id === null) {
    echo json_encode(["success" => false, "error" => "Missing post_id or user_id"]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT COUNT(*) as liked FROM likes WHERE post_id = ? AND user_id = ?");
    $stmt->execute([$post_id, $user_id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode(["liked" => $row['liked'] > 0]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
}
?>