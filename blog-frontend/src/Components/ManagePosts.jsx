import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ManagePosts() {
  const [posts, setPosts] = useState([]);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 16;

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

  // Lọc bài viết theo danh mục và năm phát hành
  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      filterCategory === 'all' ||
      (post.category && post.category.toLowerCase() === filterCategory.toLowerCase());
    const year = post.release_year ? parseInt(post.release_year, 10) : 0;
    const matchesYear =
      filterYear === 'all' ||
      (filterYear === 'before-2000' ? year < 2000 : year === parseInt(filterYear, 10));
    return matchesCategory && matchesYear;
  });

  // Phân trang
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  // Reset về trang 1 khi filter thay đổi
  useEffect(() => { setCurrentPage(1); }, [filterCategory, filterYear]);

  // Lấy các năm phát hành duy nhất
  const yearOptions = Array.from(new Set(posts.map(p => p.release_year).filter(Boolean)))
    .sort((a, b) => b - a);

  return (
    <main>
      <h1>Quản lý bài viết</h1>
      <div className="add-post-link">
        <Link to="/add-post">
          <button>Thêm bài viết mới</button>
        </Link>
      </div>
      <section className="post-section">
        <div className="post-header" style={{flexDirection: 'column', alignItems: 'flex-start', gap: '1rem'}}>
          <h2>Danh sách bài viết</h2>
          <div className="filter-section">
            <div className="filter-group">
              <label htmlFor="category-filter">Danh mục:</label>
              <select
                id="category-filter"
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
              >
                <option value="all">Tất cả</option>
                <option value="phim">Phim</option>
                <option value="sách">Sách</option>
                <option value="tin tức">Tin tức</option>
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="year-filter">Năm phát hành:</label>
              <select
                id="year-filter"
                value={filterYear}
                onChange={e => setFilterYear(e.target.value)}
              >
                <option value="all">Tất cả</option>
                <option value="before-2000">Trước 2000</option>
                {yearOptions.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {filteredPosts.length > 0 ? (
          <div className="post-grid post-grid-4">
            {currentPosts.map(post => (
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
                  <div className="post-actions">
                    <Link to={`/edit-post/${post.id}`}>
                      <button className="update-btn">Cập nhật</button>
                    </Link>
                    <button onClick={() => handleDelete(post.id)} className="delete-btn">Xóa</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Chưa có bài viết nào.</p>
        )}
        {/* Phân trang */}
        {filteredPosts.length > postsPerPage && (
          <div className="pagination">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              Trang trước
            </button>
            <span>
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              Trang sau
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default ManagePosts;