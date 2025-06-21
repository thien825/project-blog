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
    // Xử lý bảng tintuc
    if (isset($_GET['type']) && $_GET['type'] === 'news') {
        if (isset($_GET['id'])) {
            // Lấy chi tiết một tin tức
            $stmt = $pdo->prepare('SELECT id, title, content, image_url, created_at FROM tintuc WHERE id = ?');
            $stmt->execute([$_GET['id']]);
            $newsItem = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($newsItem ?: []);
        } else {
            // Lấy danh sách tất cả tin tức
            $stmt = $pdo->query('SELECT id, title, content, image_url, created_at FROM tintuc ORDER BY created_at DESC');
            $news = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($news);
        }
        break;
    }

    // Xử lý tin tức nổi bật
    if (isset($_GET['type']) && $_GET['type'] === 'featured') {
        $stmt = $pdo->query('SELECT id, title, content, image_url, created_at FROM tintuc WHERE is_featured = 1 OR created_at IS NOT NULL ORDER BY created_at DESC LIMIT 5');
        $featuredNews = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($featuredNews);
        break;
    }

    // Xử lý bảng posts
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare('
            SELECT p.id, p.title, p.content, p.image_filename, p.created_at, p.updated_at,
                   u.username AS author, c.name AS category,
                   pd.rating, pd.director, pd.author AS book_author, pd.release_year, pd.genre,
                   COUNT(l.id) as like_count
            FROM posts p
            LEFT JOIN users u ON p.user_id = u.id
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN post_details pd ON p.id = pd.post_id
            LEFT JOIN likes l ON p.id = l.post_id
            WHERE p.id = ?
            GROUP BY p.id
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
                   pd.rating, pd.director, pd.author AS book_author, pd.release_year, pd.genre,
                   COUNT(l.id) as like_count
            FROM posts p
            LEFT JOIN users u ON p.user_id = u.id
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN post_details pd ON p.id = pd.post_id
            LEFT JOIN likes l ON p.id = l.post_id
            GROUP BY p.id
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
        // Xử lý bảng tintuc
        if (isset($_GET['type']) && $_GET['type'] === 'news') {
            // Nếu có id trên query-string => cập nhật
            if (isset($_GET['id'])) {
                $id = $_GET['id'];
                file_put_contents('debug.log', "UPDATE News Request at " . date('Y-m-d H:i:s') .
                    "\nPOST: " . print_r($_POST, true) .
                    "\nFILES: " . print_r($_FILES, true) . "\n", FILE_APPEND);

                // Lấy ảnh cũ
                $stmt = $pdo->prepare('SELECT image_url FROM tintuc WHERE id = ?');
                $stmt->execute([$id]);
                $current = $stmt->fetch(PDO::FETCH_ASSOC);
                if (!$current) {
                    echo json_encode(['error' => 'Không tìm thấy tin tức ID: ' . $id]);
                    exit;
                }
                $image_url = $current['image_url'];

                // Upload ảnh mới nếu có
                if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                    require_once 'upload_helper.php';
                    $new_name = uploadImage();
                    if ($new_name) {
                        if ($image_url && file_exists($image_url)) {
                            unlink($image_url);
                        }
                        $image_url = $new_name;
                    }
                }

                // Update tintuc
                $stmt = $pdo->prepare('
                    UPDATE tintuc
                    SET title = ?, content = ?, image_url = ?
                    WHERE id = ?
                ');
                $stmt->execute([
                    $_POST['title'] ?? '',
                    $_POST['content'] ?? '',
                    $image_url,
                    $id
                ]);

                echo json_encode(['message' => 'News updated successfully', 'title' => $_POST['title']]);
                exit;
            }

            // Không có id => tạo mới
            if (isset($_POST['title'])) {
                file_put_contents('debug.log', "CREATE News Request at " . date('Y-m-d H:i:s') .
                    "\nPOST: " . print_r($_POST, true) .
                    "\nFILES: " . print_r($_FILES, true) . "\n", FILE_APPEND);

                require_once 'upload_helper.php';
                $image_url = null;
                if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                    $image_url = uploadImage();
                }

                $stmt = $pdo->prepare('
                    INSERT INTO tintuc (title, content, image_url, created_at)
                    VALUES (?, ?, ?, NOW())
                ');
                $stmt->execute([
                    $_POST['title'],
                    $_POST['content'] ?? '',
                    $image_url
                ]);

                echo json_encode(['message' => 'News created successfully']);
            } else {
                echo json_encode(['error' => 'Thiếu tiêu đề tin tức']);
            }
            break;
        }

        // Xử lý bảng posts (giữ nguyên logic cũ)
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

        // Thêm vào phần POST (cập nhật tin tức với is_featured)
if (isset($_GET['id'])) {
    $id = $_GET['id'];
    file_put_contents('debug.log', "UPDATE News Request at " . date('Y-m-d H:i:s') .
        "\nPOST: " . print_r($_POST, true) .
        "\nFILES: " . print_r($_FILES, true) . "\n", FILE_APPEND);

    $stmt = $pdo->prepare('SELECT image_url FROM tintuc WHERE id = ?');
    $stmt->execute([$id]);
    $current = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$current) {
        echo json_encode(['error' => 'Không tìm thấy tin tức ID: ' . $id]);
        exit;
    }
    $image_url = $current['image_url'];

    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        require_once 'upload_helper.php';
        $new_name = uploadImage();
        if ($new_name) {
            if ($image_url && file_exists($image_url)) {
                unlink($image_url);
            }
            $image_url = $new_name;
        }
    }

    $stmt = $pdo->prepare('
        UPDATE tintuc
        SET title = ?, content = ?, image_url = ?, is_featured = ?
        WHERE id = ?
    ');
    $stmt->execute([
        $_POST['title'] ?? '',
        $_POST['content'] ?? '',
        $image_url,
        $_POST['is_featured'] ?? 0, // Thêm trường is_featured
        $id
    ]);

    echo json_encode(['message' => 'News updated successfully', 'title' => $_POST['title']]);
    exit;
}

if (isset($_POST['title'])) {
    file_put_contents('debug.log', "CREATE News Request at " . date('Y-m-d H:i:s') .
        "\nPOST: " . print_r($_POST, true) .
        "\nFILES: " . print_r($_FILES, true) . "\n", FILE_APPEND);

    require_once 'upload_helper.php';
    $image_url = null;
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $image_url = uploadImage();
    }

    $stmt = $pdo->prepare('
        INSERT INTO tintuc (title, content, image_url, created_at, is_featured)
        VALUES (?, ?, ?, NOW(), ?)
    ');
    $stmt->execute([
        $_POST['title'],
        $_POST['content'] ?? '',
        $image_url,
        $_POST['is_featured'] ?? 0 // Thêm trường is_featured
    ]);

    echo json_encode(['message' => 'News created successfully']);
}

    case 'DELETE':
        // Xử lý bảng tintuc
        if (isset($_GET['type']) && $_GET['type'] === 'news') {
            $data = json_decode(file_get_contents('php://input'), true);
            if (isset($data['id'])) {
                $stmt = $pdo->prepare('SELECT image_url FROM tintuc WHERE id = ?');
                $stmt->execute([$data['id']]);
                $newsItem = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($newsItem && $newsItem['image_url'] && file_exists($newsItem['image_url'])) {
                    unlink($newsItem['image_url']);
                }
                $stmt = $pdo->prepare('DELETE FROM tintuc WHERE id = ?');
                $stmt->execute([$data['id']]);
                echo json_encode(['message' => 'News deleted successfully']);
            } else {
                echo json_encode(['error' => 'Thiếu ID tin tức']);
            }
            break;
        }

        // Xử lý bảng posts (giữ nguyên logic cũ)
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
?>