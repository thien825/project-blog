// File: EditPost.jsx

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

  useEffect(() => {
    axios.get(`http://localhost/PROJECT_BLOG/blog-backend/index.php?id=${id}`)
      .then(response => {
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
      .catch(error => {
        setMessage('Lỗi khi lấy dữ liệu: ' + error.message);
        console.error('Error fetching post:', error);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setPost(prev => ({ ...prev, image: e.target.files[0] }));
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

    // Dùng POST và truyền id qua query-string để PHP nhận diện update
    axios.post(
      `http://localhost/PROJECT_BLOG/blog-backend/index.php?id=${id}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    .then(response => {
      if (response.data.message) {
        setMessage(`Cập nhật thành công! Title: ${response.data.title}`);
        setTimeout(() => navigate('/manage-posts'), 1500);
      } else {
        setMessage('Không nhận được phản hồi hợp lệ từ server.');
      }
    })
    .catch(error => {
      const errMsg = error.response?.data?.error || error.message || 'Lỗi không xác định';
      setMessage('Lỗi: ' + errMsg);
      console.error('Error updating post:', error);
    });
  };

  return (
    <main>
      <h1>Cập nhật bài viết</h1>
      {message && <p className={message.includes('thành công') ? 'success' : 'error'}>{message}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="title" value={post.title} onChange={handleChange} required />
        <textarea name="content" value={post.content} onChange={handleChange} required />
        <input type="text" name="author" value={post.author} onChange={handleChange} />
        <select name="category" value={post.category} onChange={handleChange}>
          <option value="">Chọn danh mục</option>
          <option value="phim">Phim</option>
          <option value="sách">Sách</option>
          <option value="tin tức">Tin tức</option>
        </select>
        <input type="number" name="rating" value={post.rating} onChange={handleChange} min="0" max="10" step="0.1" />
        <input type="text" name="director" value={post.director} onChange={handleChange} />
        <input type="text" name="book_author" value={post.book_author} onChange={handleChange} />
        <input type="number" name="release_year" value={post.release_year} onChange={handleChange} />
        <input type="text" name="genre" value={post.genre} onChange={handleChange} />
        <input type="file" name="image" onChange={handleImageChange} accept="image/*" />
        <button type="submit">Lưu thay đổi</button>
      </form>
    </main>
  );
}

export default EditPost;
