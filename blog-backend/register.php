<?php
error_reporting(E_ALL);
ini_set('display_errors', 0); // Tắt hiển thị lỗi trực tiếp

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

try {
    $conn = new mysqli('localhost', 'root', '', 'blog_db');

    if ($conn->connect_error) {
        throw new Exception('Kết nối database thất bại: ' . $conn->connect_error);
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $username = $data['username'] ?? '';
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    if (empty($username) || empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Vui lòng điền đầy đủ thông tin']);
        exit;
    }

    // Kiểm tra email đã tồn tại chưa
    $stmt = $conn->prepare('SELECT * FROM users WHERE email = ?');
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Email đã tồn tại']);
        exit;
    }

    // Mã hóa mật khẩu và lưu người dùng mới
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, "user")');
    $stmt->bind_param('sss', $username, $email, $hashedPassword);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Đăng ký thành công']);
    } else {
        throw new Exception('Đăng ký thất bại: ' . $stmt->error);
    }

    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    exit;
}
?>