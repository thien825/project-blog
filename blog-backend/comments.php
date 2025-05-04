<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

try {
    $conn = new mysqli('localhost', 'root', '', 'blog_db');

    if ($conn->connect_error) {
        throw new Exception('Kết nối database thất bại: ' . $conn->connect_error);
    }

    // Xử lý GET (lấy bình luận)
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $post_id = $_GET['post_id'] ?? '';
        if (empty($post_id) || !is_numeric($post_id)) {
            throw new Exception('post_id không hợp lệ');
        }

        $stmt = $conn->prepare('SELECT * FROM comments WHERE post_id = ? ORDER BY created_at DESC');
        $stmt->bind_param('i', $post_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $comments = $result->fetch_all(MYSQLI_ASSOC);

        echo json_encode(['success' => true, 'data' => $comments]);
        $stmt->close();
        $conn->close();
        exit;
    }

    // Xử lý POST (thêm bình luận)
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) {
            throw new Exception('Dữ liệu gửi lên không hợp lệ');
        }

        $post_id = $data['post_id'] ?? '';
        $user_id = $data['user_id'] ?? '';
        $username = $data['username'] ?? '';
        $content = $data['content'] ?? '';

        if (empty($post_id) || !is_numeric($post_id)) {
            throw new Exception('post_id không hợp lệ');
        }
        if (empty($user_id) || !is_numeric($user_id)) {
            throw new Exception('user_id không hợp lệ');
        }
        if (empty($username)) {
            throw new Exception('username không được để trống');
        }
        if (empty($content)) {
            throw new Exception('Nội dung bình luận không được để trống');
        }

        $stmt = $conn->prepare('INSERT INTO comments (post_id, user_id, username, content, created_at) VALUES (?, ?, ?, ?, NOW())');
        $stmt->bind_param('iiss', $post_id, $user_id, $username, $content);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Bình luận thành công']);
        } else {
            throw new Exception('Lỗi khi thêm bình luận: ' . $conn->error);
        }

        $stmt->close();
        $conn->close();
        exit;
    }

    throw new Exception('Phương thức không được hỗ trợ');
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    exit;
}
?>