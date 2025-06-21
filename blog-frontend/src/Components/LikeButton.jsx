import { useState, useEffect } from 'react';
import axios from 'axios';
import './LikeButton.css';

const LikeButton = ({ postId, initialLikeCount = 0, userId }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLoading, setIsLoading] = useState(false);

  // Kiểm tra xem user đã like bài viết này chưa khi component mount
  useEffect(() => {
    if (userId && postId) {
      checkUserLikeStatus();
    }
  }, [userId, postId]);

  const checkUserLikeStatus = async () => {
    try {
      const response = await axios.get(
        `http://localhost/PROJECT_BLOG/blog-backend/user_like.php?post_id=${postId}&user_id=${userId}`
      );
      setIsLiked(response.data.liked);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const handleLikeToggle = async () => {
    if (!userId) {
      alert('Vui lòng đăng nhập để thích bài viết!');
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        'http://localhost/PROJECT_BLOG/blog-backend/toggle_like.php',
        {
          post_id: postId,
          user_id: userId
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        if (response.data.action === 'liked') {
          setIsLiked(true);
          setLikeCount(prev => prev + 1);
        } else {
          setIsLiked(false);
          setLikeCount(prev => Math.max(0, prev - 1));
        }
      } else {
        alert('Có lỗi xảy ra: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Có lỗi xảy ra khi thích bài viết!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="like-button-container">
      <button
        className={`like-button ${isLiked ? 'liked' : ''} ${isLoading ? 'loading' : ''}`}
        onClick={handleLikeToggle}
        disabled={isLoading}
      >
        <span className="like-icon">
          {isLiked ? '❤️' : '🤍'}
        </span>
        <span className="like-text">
          {isLiked ? 'Đã thích' : 'Thích'}
        </span>
        {isLoading && <span className="loading-spinner">⏳</span>}
      </button>
      <span className="like-count">{likeCount} lượt thích</span>
    </div>
  );
};

export default LikeButton; 