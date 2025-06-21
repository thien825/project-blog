import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '../App';
import LikeButton from './LikeButton';

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { user } = useUser();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy thông tin bài viết
    const fetchPost = async () => {
      try {
        const response = await axios.get('http://localhost/PROJECT_BLOG/blog-backend/index.php');
        const foundPost = response.data.find(p => p.id === parseInt(id));
        if (foundPost) {
          setPost(foundPost);
        } else {
          setError('Không tìm thấy bài viết');
        }
      } catch (error) {
        setError('Lỗi khi tải bài viết: ' + (error.message.includes('timeout') ? 'Không thể kết nối đến server' : error.message));
      }
    };

    // Lấy danh sách bình luận
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost/PROJECT_BLOG/blog-backend/comments.php?post_id=${id}`);
        if (response.data.success) {
          setComments(response.data.data || []);
        } else {
          setError('Lỗi khi tải bình luận: ' + (response.data.message || 'Phản hồi từ server không hợp lệ'));
        }
      } catch (error) {
        setError('Lỗi khi tải bình luận: ' + (error.message.includes('timeout') ? 'Không thể kết nối đến server' : error.message));
      }
    };

    fetchPost();
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!newComment.trim()) {
      setError('Vui lòng nhập nội dung bình luận');
      return;
    }

    if (!user) {
      setError('Vui lòng đăng nhập để bình luận');
      navigate('/login');
      return;
    }

    const commentData = {
      post_id: parseInt(id),
      user_id: user.id,
      username: user.username,
      content: newComment
    };

    try {
      const response = await axios.post('http://localhost/PROJECT_BLOG/blog-backend/comments.php', commentData);
      if (response.data.success) {
        setNewComment('');
        setError('');
        // Cập nhật lại danh sách bình luận
        const commentResponse = await axios.get(`http://localhost/PROJECT_BLOG/blog-backend/comments.php?post_id=${id}`);
        if (commentResponse.data.success) {
          setComments(commentResponse.data.data || []);
        } else {
          setError('Lỗi khi tải lại bình luận: ' + (commentResponse.data.message || 'Phản hồi từ server không hợp lệ'));
        }
      } else {
        setError('Lỗi khi thêm bình luận: ' + (response.data.message || 'Phản hồi từ server không hợp lệ'));
      }
    } catch (error) {
      setError('Lỗi khi thêm bình luận: ' + (error.message.includes('timeout') ? 'Không thể kết nối đến server' : error.message));
    }
  };

  if (error && !post) return <p className="error">{error}</p>;
  if (!post) return <p>Đang tải...</p>;

  return (
    <main>
      <h1>{post.title}</h1>
      <div className="post-detail">
        {post.image_url && <img src={post.image_url} alt={post.title} className="post-image" />}
        <p>{post.content}</p>
        <p><strong>Tác giả:</strong> {post.author}</p>
        <p><strong>Danh mục:</strong> {post.category}</p>
        {post.rating > 0 && <p><strong>Đánh giá:</strong> {post.rating}/10</p>}
        {post.director && <p><strong>Đạo diễn:</strong> {post.director}</p>}
        {post.book_author && <p><strong>Tác giả sách:</strong> {post.book_author}</p>}
        {post.release_year && <p><strong>Năm phát hành:</strong> {post.release_year}</p>}
        {post.genre && <p><strong>Thể loại:</strong> {post.genre}</p>}
        <p><strong>Ngày đăng:</strong> {new Date(post.created_at).toLocaleDateString()}</p>
        
        {/* Like Button */}
        <LikeButton 
          postId={post.id} 
          initialLikeCount={post.like_count || 0}
          userId={user?.id}
        />
        
        <Link to="/" className="back-link">Quay lại trang chủ</Link>
      </div>

      {/* Phần bình luận */}
      <div className="comments-section">
        <h2>Bình luận</h2>
        {error && <p className="error">{error}</p>}
        {comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment.id} className="comment">
              <p><strong>{comment.username}</strong> ({new Date(comment.created_at).toLocaleDateString()}):</p>
              <p>{comment.content}</p>
            </div>
          ))
        ) : (
          <p>Chưa có bình luận nào.</p>
        )}

        {/* Form thêm bình luận */}
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <h3>Thêm bình luận</h3>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Viết bình luận của bạn..."
            required
          />
          <button type="submit">Gửi bình luận</button>
        </form>
      </div>
    </main>
  );
}

export default PostDetail;