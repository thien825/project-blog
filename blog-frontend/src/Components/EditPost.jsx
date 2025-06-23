import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: '',
    content: '',
    author: '',
    category: '',
    rating: '',
    director: '',
    book_author: '',
    release_year: '',
    genre: '',
    image: null,
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost/PROJECT_BLOG/blog-backend/index.php?id=${id}`)
      .then((response) => {
        if (response.data) {
          setPost({
            title: response.data.title || '',
            content: response.data.content || '',
            author: response.data.author || '',
            category: response.data.category || '',
            rating: response.data.rating || '',
            director: response.data.director || '',
            book_author: response.data.book_author || '',
            release_year: response.data.release_year || '',
            genre: response.data.genre || '',
            image: null,
          });
        } else {
          setMessage('Không tìm thấy bài viết.');
        }
      })
      .catch((error) => {
        setMessage('Lỗi khi lấy dữ liệu: ' + error.message);
        console.error('Error fetching post:', error);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setPost((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!post.title.trim() || !post.content.trim()) {
      setMessage('Tiêu đề và nội dung không được để trống.');
      return;
    }

    const formData = new FormData();
    formData.append('title', post.title);
    formData.append('content', post.content);
    formData.append('author', post.author);
    formData.append('category', post.category);
    formData.append('rating', post.rating || '0');
    formData.append('director', post.director);
    formData.append('book_author', post.book_author);
    formData.append('release_year', post.release_year || '');
    formData.append('genre', post.genre);
    if (post.image) {
      formData.append('image', post.image);
    }

    axios
      .post(
        `http://localhost/PROJECT_BLOG/blog-backend/index.php?id=${id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      .then((response) => {
        if (response.data.message) {
          setMessage(`Cập nhật thành công! Title: ${response.data.title}`);
          setTimeout(() => navigate('/manage-posts'), 1500);
        } else {
          setMessage('Không nhận được phản hồi hợp lệ từ server.');
        }
      })
      .catch((error) => {
        const errMsg =
          error.response?.data?.error || error.message || 'Lỗi không xác định';
        setMessage('Lỗi: ' + errMsg);
        console.error('Error updating post:', error);
      });
  };

  if (loading) return <main><p>Đang tải...</p></main>;

  return (
    <main>
      <section className="post-section">
        <h1 className="post-header">Cập nhật bài viết</h1>
        {message && (
          <p className={message.includes('thành công') ? 'success' : 'error'}>
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div>
            <label>Tiêu đề</label>
            <input
              type="text"
              name="title"
              value={post.title}
              onChange={handleChange}
              required
              placeholder="Nhập tiêu đề"
            />
          </div>
          <div>
            <label>Nội dung</label>
            <textarea
              name="content"
              value={post.content}
              onChange={handleChange}
              required
              placeholder="Nhập nội dung"
            />
          </div>
          <div>
            <label>Tác giả</label>
            <input
              type="text"
              name="author"
              value={post.author}
              onChange={handleChange}
              placeholder="Nhập tên tác giả"
            />
          </div>
          <div>
            <label>Danh mục</label>
            <select
              name="category"
              value={post.category}
              onChange={handleChange}
              required
            >
              <option value="">Chọn danh mục</option>
              <option value="phim">Phim</option>
              <option value="sách">Sách</option>
              <option value="tin tức">Tin tức</option>
            </select>
          </div>
          <div>
            <label>Đánh giá (0-10)</label>
            <input
              type="number"
              name="rating"
              value={post.rating}
              onChange={handleChange}
              min="0"
              max="10"
              step="0.1"
              placeholder="Nhập đánh giá"
            />
          </div>
          <div>
            <label>Đạo diễn</label>
            <input
              type="text"
              name="director"
              value={post.director}
              onChange={handleChange}
              placeholder="Nhập tên đạo diễn"
            />
          </div>
          <div>
            <label>Tác giả sách</label>
            <input
              type="text"
              name="book_author"
              value={post.book_author}
              onChange={handleChange}
              placeholder="Nhập tên tác giả sách"
            />
          </div>
          <div>
            <label>Năm phát hành</label>
            <input
              type="number"
              name="release_year"
              value={post.release_year}
              onChange={handleChange}
              placeholder="Nhập năm phát hành"
            />
          </div>
          <div>
            <label>Thể loại</label>
            <input
              type="text"
              name="genre"
              value={post.genre}
              onChange={handleChange}
              placeholder="Nhập thể loại"
            />
          </div>
          <div>
            <label>Hình ảnh</label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>
          <button type="submit">Lưu thay đổi</button>
        </form>
      </section>
    </main>
  );
}

export default EditPost;