import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddPost() {
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    user_id: 1,
    category_id: 1,
    rating: 0,
    director: '',
    book_author: '',
    release_year: '',
    genre: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Tạo FormData để gửi dữ liệu và file
    const formData = new FormData();
    formData.append('title', newPost.title);
    formData.append('content', newPost.content);
    formData.append('user_id', newPost.user_id.toString());
    formData.append('category_id', newPost.category_id.toString());
    formData.append('rating', newPost.rating.toString());
    formData.append('director', newPost.director);
    formData.append('book_author', newPost.book_author);
    formData.append('release_year', newPost.release_year.toString());
    formData.append('genre', newPost.genre);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    axios.post('http://localhost/PROJECT_BLOG/blog-backend/index.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        if (response.data.message) {
          alert(response.data.message);
          navigate('/');
        } else {
          alert('Có lỗi xảy ra, không nhận được phản hồi từ server.');
        }
      })
      .catch(error => {
        const errorMessage = error.response?.data?.error || error.message || 'Lỗi không xác định';
        console.error('Error creating post:', errorMessage);
        alert('Có lỗi khi thêm bài viết: ' + errorMessage);
      });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  return (
    <main>
      <h1>Thêm bài viết mới</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tiêu đề:</label>
          <input
            type="text"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Nội dung:</label>
          <textarea
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Hình ảnh minh họa:</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleImageChange}
          />
        </div>
        <div>
          <label>Đánh giá (0-10):</label>
          <input
            type="number"
            value={newPost.rating}
            onChange={(e) => setNewPost({ ...newPost, rating: parseFloat(e.target.value) })}
            min="0"
            max="10"
            step="0.1"
          />
        </div>
        <div>
          <label>Đạo diễn (nếu là phim):</label>
          <input
            type="text"
            value={newPost.director}
            onChange={(e) => setNewPost({ ...newPost, director: e.target.value })}
          />
        </div>
        <div>
          <label>Tác giả (nếu là sách):</label>
          <input
            type="text"
            value={newPost.book_author}
            onChange={(e) => setNewPost({ ...newPost, book_author: e.target.value })}
          />
        </div>
        <div>
          <label>Năm phát hành:</label>
          <input
            type="number"
            value={newPost.release_year}
            onChange={(e) => setNewPost({ ...newPost, release_year: e.target.value })}
            min="1800"
            max="2100"
          />
        </div>
        <div>
          <label>Thể loại:</label>
          <input
            type="text"
            value={newPost.genre}
            onChange={(e) => setNewPost({ ...newPost, genre: e.target.value })}
          />
        </div>
        <button type="submit">Thêm bài viết</button>
      </form>
    </main>
  );
}

export default AddPost;