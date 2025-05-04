import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useSearch } from '../App';
import spidermanPoster from '../assets/poter1.jpg'; // Hình ảnh Spider-Man
import harryPotterPoster from '../assets/poter2.jpg'; // Hình ảnh Harry Potter
import titanicPoster from '../assets/poter3.jpg'; // Hình ảnh Titanic

function Home() {
  const [posts, setPosts] = useState([]);
  const { searchQuery } = useSearch();
  const [currentPoster, setCurrentPoster] = useState(0);

  // Danh sách poster
  const posters = [
    { image: spidermanPoster, alt: 'Spider-Man: Far From Home' },
    { image: harryPotterPoster, alt: "Harry Potter and the Philosopher's Stone" },
    { image: titanicPoster, alt: 'Titanic' },
  ];

  useEffect(() => {
    fetchPosts();
    // Tự động chuyển poster mỗi 5 giây
    const interval = setInterval(() => {
      setCurrentPoster((prev) => (prev + 1) % posters.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [posters.length]);

  const fetchPosts = () => {
    axios
      .get('http://localhost/PROJECT_BLOG/blog-backend/index.php')
      .then((response) => setPosts(response.data))
      .catch((error) => console.error('Error fetching posts:', error.message));
  };

  // Lọc bài viết dựa trên searchQuery
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Lọc bài viết thuộc danh mục "Tin tức"
  const newsPosts = posts
    .filter((post) => post.category.toLowerCase() === 'tin tức')
    .slice(0, 3);

  return (
    <main>
      {/* Poster Carousel */}
      <div className="poster-carousel">
        {posters.map((poster, index) => (
          <img
            key={index}
            src={poster.image}
            alt={poster.alt}
            className={`poster-image ${index === currentPoster ? 'active' : ''}`}
          />
        ))}
        <div className="poster-dots">
          {posters.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentPoster ? 'active' : ''}`}
              onClick={() => setCurrentPoster(index)}
            ></span>
          ))}
        </div>
      </div>

      {/* Danh sách bài viết */}
      <h2>Danh sách bài viết</h2>
      {filteredPosts.length > 0 ? (
        <div className="post-grid">
          {filteredPosts.map((post) => (
            <div key={post.id} className="post-card">
              {post.image_url && (
                <img src={post.image_url} alt={post.title} className="post-image" />
              )}
              <div className="post-content">
                <h3>
                  <Link to={`/post/${post.id}`} className="post-title-link">
                    {post.title}
                  </Link>
                </h3>
                <p>
                  {post.content.substring(0, 100)}...{' '}
                  <Link to={`/post/${post.id}`}>Xem thêm</Link>
                </p>
                <p>
                  <strong>Tác giả:</strong> {post.author}
                </p>
                <p>
                  <strong>Danh mục:</strong> {post.category}
                </p>
                {post.rating > 0 && (
                  <p>
                    <strong>Đánh giá:</strong> {post.rating}/10
                  </p>
                )}
                {post.director && (
                  <p>
                    <strong>Đạo diễn:</strong> {post.director}
                  </p>
                )}
                {post.book_author && (
                  <p>
                    <strong>Tác giả sách:</strong> {post.book_author}
                  </p>
                )}
                {post.release_year && (
                  <p>
                    <strong>Năm phát hành:</strong> {post.release_year}
                  </p>
                )}
                {post.genre && (
                  <p>
                    <strong>Thể loại:</strong> {post.genre}
                  </p>
                )}
                <p>
                  <strong>Ngày đăng:</strong>{' '}
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Không tìm thấy bài viết nào.</p>
      )}

      {/* Tin tức nổi bật */}
      {newsPosts.length > 0 && (
        <div className="news-section">
          <h2>Tin tức nổi bật</h2>
          <div className="news-list">
            {newsPosts.map((post) => (
              <div key={post.id} className="news-item">
                {post.image_url && (
                  <img src={post.image_url} alt={post.title} className="news-image" />
                )}
                <div className="news-content">
                  <h3>
                    <Link to={`/post/${post.id}`} className="news-title-link">
                      {post.title}
                    </Link>
                  </h3>
                  <p>
                    {post.content.substring(0, 50)}...{' '}
                    <Link to={`/post/${post.id}`}>Xem thêm</Link>
                  </p>
                  <p>
                    <strong>Ngày đăng:</strong>{' '}
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

export default Home;