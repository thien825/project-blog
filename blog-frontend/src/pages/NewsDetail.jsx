import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function NewsDetail() {
  const { id } = useParams(); // Lấy id từ URL
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNewsDetail();
  }, [id]);

  const fetchNewsDetail = () => {
    setLoading(true);
    console.log('Fetching news with id:', id); // Log để kiểm tra id
    axios
      .get(`http://localhost/PROJECT_BLOG/blog-backend/index.php?type=news&id=${id}`)
      .then((response) => {
        console.log('API Response:', response.data); // Log dữ liệu trả về
        if (response.data) {
          setNewsItem(response.data);
        } else {
          setError('Không tìm thấy tin tức.');
        }
      })
      .catch((error) => {
        console.error('Error fetching news detail:', error.message);
        setError('Lỗi khi tải tin tức: ' + error.message);
      })
      .finally(() => setLoading(false));
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error} <Link to="/news">Quay lại danh sách tin tức</Link></p>;
  if (!newsItem) return <p>Không có dữ liệu. <Link to="/news">Quay lại danh sách tin tức</Link></p>;

  return (
    <main className="news-detail-container">
      <div className="news-detail-content">
        <h1 className="news-title">{newsItem.title}</h1>
        <p className="news-date">
          <strong>Ngày đăng:</strong> {new Date(newsItem.created_at).toLocaleDateString()}
        </p>
        {newsItem.image_url && (
          <img
            src={newsItem.image_url}
            alt={newsItem.title}
            className="news-image"
          />
        )}
        {newsItem.content && (
          <div className="news-body">
            <p>{newsItem.content}</p>
          </div>
        )}
        <Link to="/news" className="back-button">
          Quay lại danh sách tin tức
        </Link>
      </div>
    </main>
  );
}

export default NewsDetail;