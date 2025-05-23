<?php
// File: index.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare('
                SELECT p.id, p.title, p.content, p.image_filename, p.created_at, p.updated_at,
                       u.username AS author, c.name AS category,
                       pd.rating, pd.director, pd.author AS book_author, pd.release_year, pd.genre
                FROM posts p
                LEFT JOIN users u ON p.user_id = u.id
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN post_details pd ON p.id = pd.post_id
                WHERE p.id = ?
            ');
            $stmt->execute([$_GET['id']]);
            $post = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($post && $post['image_filename']) {
                $post['image_url'] = 'http://localhost/PROJECT_BLOG/blog-backend/' . $post['image_filename'];
            }
            echo json_encode($post ?: []);
        } else {
            $stmt = $pdo->query('
                SELECT p.id, p.title, p.content, p.image_filename, p.created_at, p.updated_at,
                       u.username AS author, c.name AS category,
                       pd.rating, pd.director, pd.author AS book_author, pd.release_year, pd.genre
                FROM posts p
                LEFT JOIN users u ON p.user_id = u.id
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN post_details pd ON p.id = pd.post_id
                ORDER BY p.created_at DESC
            ');
            $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach ($posts as &$item) {
                if ($item['image_filename']) {
                    $item['image_url'] = 'http://localhost/PROJECT_BLOG/blog-backend/' . $item['image_filename'];
                }
            }
            echo json_encode($posts);
        }
        break;

    case 'POST':
        // Nếu có id trên query-string => cập nhật
        if (isset($_GET['id'])) {
            $id = $_GET['id'];
            file_put_contents('debug.log', "UPDATE Request at " . date('Y-m-d H:i:s') .
                "\nPOST: " . print_r($_POST, true) .
                "\nFILES: " . print_r($_FILES, true) . "\n", FILE_APPEND);

            // Lấy ảnh cũ
            $stmt = $pdo->prepare('SELECT image_filename FROM posts WHERE id = ?');
            $stmt->execute([$id]);
            $current = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$current) {
                echo json_encode(['error' => 'Không tìm thấy bài viết ID: ' . $id]);
                exit;
            }
            $image_filename = $current['image_filename'];

            // Upload ảnh mới nếu có
            if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                require_once 'upload_helper.php';
                $new_name = uploadImage();
                if ($new_name) {
                    if ($image_filename && file_exists($image_filename)) {
                        unlink($image_filename);
                    }
                    $image_filename = $new_name;
                }
            }

            // Update posts
            $stmt = $pdo->prepare('
                UPDATE posts
                SET title = ?, content = ?, image_filename = ?, updated_at = NOW()
                WHERE id = ?
            ');
            $stmt->execute([
                $_POST['title'] ?? '',
                $_POST['content'] ?? '',
                $image_filename,
                $id
            ]);

            // Update post_details
            $stmt = $pdo->prepare('
                INSERT INTO post_details (post_id, rating, director, author, release_year, genre)
                VALUES (?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                  rating = VALUES(rating),
                  director = VALUES(director),
                  author = VALUES(author),
                  release_year = VALUES(release_year),
                  genre = VALUES(genre)
            ');
            $stmt->execute([
                $id,
                $_POST['rating'] ?? 0,
                $_POST['director'] ?? '',
                $_POST['book_author'] ?? '',
                $_POST['release_year'] ?? '',
                $_POST['genre'] ?? ''
            ]);

            echo json_encode(['message' => 'Post updated successfully', 'title' => $_POST['title']]);
            exit;
        }

        // Không có id => tạo mới
        if (isset($_POST['title'], $_POST['content'], $_POST['user_id'], $_POST['category_id'])) {
            file_put_contents('debug.log', "CREATE Request at " . date('Y-m-d H:i:s') .
                "\nPOST: " . print_r($_POST, true) .
                "\nFILES: " . print_r($_FILES, true) . "\n", FILE_APPEND);

            require_once 'upload_helper.php';
            $image_filename = null;
            if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                $image_filename = uploadImage();
            }

            $stmt = $pdo->prepare('
                INSERT INTO posts (title, content, image_filename, user_id, category_id, created_at)
                VALUES (?, ?, ?, ?, ?, NOW())
            ');
            $stmt->execute([
                $_POST['title'],
                $_POST['content'],
                $image_filename,
                $_POST['user_id'],
                $_POST['category_id']
            ]);

            $post_id = $pdo->lastInsertId();
            $stmt = $pdo->prepare('
                INSERT INTO post_details (post_id, rating, director, author, release_year, genre)
                VALUES (?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                  rating = VALUES(rating),
                  director = VALUES(director),
                  author = VALUES(author),
                  release_year = VALUES(release_year),
                  genre = VALUES(genre)
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
            echo json_encode(['error' => 'Thiếu các trường bắt buộc']);
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($data['id'])) {
            $stmt = $pdo->prepare('SELECT image_filename FROM posts WHERE id = ?');
            $stmt->execute([$data['id']]);
            $post = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($post && $post['image_filename'] && file_exists($post['image_filename'])) {
                unlink($post['image_filename']);
            }
            $stmt = $pdo->prepare('DELETE FROM posts WHERE id = ?');
            $stmt->execute([$data['id']]);
            echo json_encode(['message' => 'Post deleted successfully']);
        } else {
            echo json_encode(['error' => 'Thiếu ID bài viết']);
        }
        break;

    default:
        echo json_encode(['error' => 'Phương thức không được hỗ trợ']);
        break;
}
