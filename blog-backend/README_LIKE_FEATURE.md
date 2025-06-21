# Hướng dẫn sử dụng chức năng Like bài viết

## Cài đặt

### 1. Tạo bảng likes trong database
Chạy file `setup_likes_table.php` trong trình duyệt hoặc command line để tạo bảng likes:
```
http://localhost/PROJECT_BLOG/blog-backend/setup_likes_table.php
```

### 2. Các file đã được tạo/cập nhật

#### Backend:
- `toggle_like.php` - API để thêm/xóa like
- `user_like.php` - API để kiểm tra trạng thái like của user
- `like.php` - API để lấy số lượng like của bài viết
- `index.php` - Đã cập nhật để trả về like_count cho mỗi bài viết

#### Frontend:
- `LikeButton.jsx` - Component nút like
- `LikeButton.css` - CSS cho component like
- `Home.jsx` - Đã thêm LikeButton vào danh sách bài viết
- `PostDetail.jsx` - Đã thêm LikeButton vào trang chi tiết
- `App.jsx` - Đã thêm UserContext để chia sẻ thông tin user

## Cách sử dụng

### 1. Đăng nhập
Người dùng cần đăng nhập để có thể like bài viết.

### 2. Like bài viết
- Trên trang chủ: Mỗi bài viết có nút "Thích" 
- Trên trang chi tiết: Có nút "Thích" ở cuối bài viết
- Click vào nút để like/unlike bài viết

### 3. Hiển thị
- Nút hiển thị trạng thái like (🤍 = chưa like, ❤️ = đã like)
- Hiển thị số lượng like của bài viết
- Animation khi like/unlike

## API Endpoints

### POST /toggle_like.php
Thêm hoặc xóa like cho bài viết
```json
{
  "post_id": 1,
  "user_id": 1
}
```

### GET /user_like.php?post_id=1&user_id=1
Kiểm tra user đã like bài viết chưa
```json
{
  "liked": true
}
```

### GET /like.php?post_id=1
Lấy số lượng like của bài viết
```json
{
  "success": true,
  "like_count": 5
}
```

## Tính năng

- ✅ Like/Unlike bài viết
- ✅ Hiển thị số lượng like
- ✅ Kiểm tra trạng thái like của user
- ✅ Animation đẹp mắt
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Loading state
- ✅ Error handling
- ✅ Yêu cầu đăng nhập để like

## Lưu ý

- Mỗi user chỉ có thể like một bài viết một lần
- Khi unlike, số lượng like sẽ giảm
- Cần đăng nhập để sử dụng chức năng like
- Bảng likes có foreign key constraints để đảm bảo tính toàn vẹn dữ liệu 