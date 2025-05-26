import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useSearch } from '../App';

function News() {
  const [news, setNews] = useState([]); // Thay posts bằng news
  const { searchQuery } = useSearch();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5; // Số tin tức trên mỗi trang

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = () => {
    axios
      .get('http://localhost/PROJECT_BLOG/blog-backend/index.php?type=news')
      .then((response) => setNews(response.data))
      .catch((error) => console.error('Error fetching news:', error.message));
  };

  // Lọc tin tức dựa trên searchQuery
  const filteredNews = news.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.content && item.content.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  // Tính toán chỉ số bắt đầu và kết thúc của tin tức trên trang hiện tại
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentNews = filteredNews.slice(indexOfFirstPost, indexOfLastPost);

  // Tính tổng số trang
  const totalPages = Math.ceil(filteredNews.length / postsPerPage);

  // Xử lý chuyển trang
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <main>
      <div className="post-section">
        <div className="post-header">
          <h2>Tin tức nổi bật</h2>
        </div>
        {filteredNews.length > 0 ? (
          <div className="post-grid">
            {currentNews.map((item) => (
              <div key={item.id} className="post-card">
                {item.image_url && (
                  <img src={item.image_url} alt={item.title} className="post-image" />
                )}
                <div className="post-content">
                  <h3>
                    <Link to={`/news/${item.id}`} className="post-title-link">
                      {item.title}
                    </Link>
                  </h3>
                  {item.content && (
                    <p>
                      {item.content.substring(0, 100)}...{' '}
                      <Link to={`/news/${item.id}`}>Xem thêm</Link>
                    </p>
                  )}
                  <p>
                    <strong>Ngày đăng:</strong>{' '}
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Không có tin tức nào.</p>
        )}
        {/* Phân trang */}
        {filteredNews.length > postsPerPage && (
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
      </div>
    </main>
  );
}

export default News;