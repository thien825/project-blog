import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/FeaturedNews.css'; // Giả sử CSS nằm trong FeaturedNews.css

function FeaturedNews() {
  const [featuredNews, setFeaturedNews] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost/PROJECT_BLOG/blog-backend/index.php?type=featured')
      .then((response) => setFeaturedNews(response.data))
      .catch((error) => console.error('Error fetching featured news:', error.message));
  }, []);

  return (
    <div className="featured-news-section">
      <h2>Tin tức nổi bật</h2>
      {featuredNews.length > 0 ? (
        <div className="featured-news-grid">
          {featuredNews.map((news) => (
            <div key={news.id} className="featured-news-card">
              {news.image_url && (
                <img src={news.image_url} alt={news.title} className="featured-news-image" />
              )}
              <div className="featured-news-content">
                <h3>
                  <Link to={`/news/${news.id}`} className="featured-news-title">
                    {news.title}
                  </Link>
                </h3>
                <p className="featured-news-date">
                  {new Date(news.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Không có tin tức nổi bật nào.</p>
      )}
    </div>
  );
}

export default FeaturedNews;