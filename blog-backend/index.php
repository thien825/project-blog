<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Xử lý yêu cầu OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Lấy danh sách bài viết cùng thông tin chi tiết
        $stmt = $pdo->query('
            SELECT p.id, p.title, p.content, p.image_filename, p.created_at, p.updated_at, 
                   u.username AS author, c.name AS category,
                   pd.rating, pd.director, pd.author AS book_author, pd.release_year, pd.genre
            FROM posts p
            JOIN users u ON p.user_id = u.id
            JOIN categories c ON p.category_id = c.id
            LEFT JOIN post_details pd ON p.id = pd.post_id
            ORDER BY p.created_at DESC
        ');
        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Thêm URL đầy đủ cho hình ảnh
        foreach ($posts as &$post) {
            if ($post['image_filename']) {
                $post['image_url'] = 'http://localhost/PROJECT_BLOG/blog-backend/' . $post['image_filename'];
            }
        }
        echo json_encode($posts);
        break;

    case 'POST':
        // Thêm bài viết mới
        if (isset($_POST['title'], $_POST['content'], $_POST['user_id'], $_POST['category_id'])) {
            $image_filename = null;

            // Xử lý upload hình ảnh nếu có
            if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                $upload_dir = 'uploads/';
                $file_name = uniqid() . '_' . basename($_FILES['image']['name']);
                $upload_path = $upload_dir . $file_name;

                // Kiểm tra loại file (chỉ cho phép hình ảnh)
                $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
                $file_type = mime_content_type($_FILES['image']['tmp_name']);
                if (!in_array($file_type, $allowed_types)) {
                    echo json_encode(['error' => 'Chỉ cho phép upload file hình ảnh (JPEG, PNG, GIF)']);
                    exit;
                }

                // Kiểm tra kích thước file (giới hạn 5MB)
                if ($_FILES['image']['size'] > 5 * 1024 * 1024) {
                    echo json_encode(['error' => 'Kích thước file quá lớn, tối đa 5MB']);
                    exit;
                }

                // Di chuyển file vào thư mục uploads
                if (move_uploaded_file($_FILES['image']['tmp_name'], $upload_path)) {
                    $image_filename = $upload_path;
                } else {
                    echo json_encode(['error' => 'Lỗi khi upload hình ảnh']);
                    exit;
                }
            }

            // Thêm bài viết vào bảng posts
            $stmt = $pdo->prepare('
                INSERT INTO posts (title, content, image_filename, user_id, category_id) 
                VALUES (?, ?, ?, ?, ?)
            ');
            $stmt->execute([
                $_POST['title'],
                $_POST['content'],
                $image_filename,
                $_POST['user_id'],
                $_POST['category_id']
            ]);

            // Lấy ID bài viết vừa tạo
            $post_id = $pdo->lastInsertId();

            // Thêm thông tin chi tiết bài viết
            $stmt = $pdo->prepare('
                INSERT INTO post_details (post_id, rating, director, author, release_year, genre)
                VALUES (?, ?, ?, ?, ?, ?)
            ');
            $stmt->execute([
                $post_id,
                $_POST['rating'] ?? 0,
                $_POST['director'] ?? '',
                $_POST['book_author'] ?? '',
                $_POST['release_year'] ?? '',
                $_POST['genre'] ?? ''
            ]);

            echo json_encode(['message' => 'Post created successfully']);
        } else {
            echo json_encode(['error' => 'Missing required fields']);
        }
        break;

    case 'DELETE':
        // Xóa bài viết
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($data['id'])) {
            // Lấy image_filename trước khi xóa để xóa file
            $stmt = $pdo->prepare('SELECT image_filename FROM posts WHERE id = ?');
            $stmt->execute([$data['id']]);
            $post = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($post && $post['image_filename'] && file_exists($post['image_filename'])) {
                unlink($post['image_filename']); // Xóa file hình ảnh
            }

            // Xóa bài viết
            $stmt = $pdo->prepare('DELETE FROM posts WHERE id = ?');
            $stmt->execute([$data['id']]);
            echo json_encode(['message' => 'Post deleted successfully']);
        } else {
            echo json_encode(['error' => 'Missing post ID']);
        }
        break;

    default:
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>