import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ManagePosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    axios.get('http://localhost/PROJECT_BLOG/blog-backend/index.php')
      .then(response => setPosts(response.data))
      .catch(error => console.error('Error fetching posts:', error.message));
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa bài viết này?')) {
      axios.delete('http://localhost/PROJECT_BLOG/blog-backend/index.php', { data: { id } })
        .then(response => {
          alert(response.data.message);
          fetchPosts();
        })
        .catch(error => console.error('Error deleting post:', error));
    }
  };

  return (
    <main>
      <h1>Quản lý bài viết</h1>
      <div className="add-post-link">
        <Link to="/add-post">
          <button>Thêm bài viết mới</button>
        </Link>
      </div>
      <h2>Danh sách bài viết</h2>
      {posts.length > 0 ? (
        posts.map(post => (
          <div key={post.id} className="post-card">
            {post.image_url && <img src={post.image_url} alt={post.title} className="post-image" />}
            <div className="post-content">
              <h3>
                <Link to={`/post/${post.id}`} className="post-title-link">{post.title}</Link>
              </h3>
              <p>{post.content.substring(0, 100)}... <Link to={`/post/${post.id}`}>Xem thêm</Link></p>
              <p><strong>Tác giả:</strong> {post.author}</p>
              <p><strong>Danh mục:</strong> {post.category}</p>
              {post.rating > 0 && <p><strong>Đánh giá:</strong> {post.rating}/10</p>}
              {post.director && <p><strong>Đạo diễn:</strong> {post.director}</p>}
              {post.book_author && <p><strong>Tác giả sách:</strong> {post.book_author}</p>}
              {post.release_year && <p><strong>Năm phát hành:</strong> {post.release_year}</p>}
              {post.genre && <p><strong>Thể loại:</strong> {post.genre}</p>}
              <p><strong>Ngày đăng:</strong> {new Date(post.created_at).toLocaleDateString()}</p>
              <button onClick={() => handleDelete(post.id)} className="delete-btn">Xóa</button>
            </div>
          </div>
        ))
      ) : (
        <p>Chưa có bài viết nào.</p>
      )}
    </main>
  );
}

export default ManagePosts;