import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddNews() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('is_featured', isFeatured ? 1 : 0);
    if (image) formData.append('image', image);

    axios.post('http://localhost/PROJECT_BLOG/blog-backend/index.php?type=news', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(response => {
        alert(response.data.message);
        navigate('/manage-posts');
      })
      .catch(error => console.error('Error creating news:', error));
  };

  return (
    <main>
      <h1>Thêm Tin Tức Mới</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tiêu đề:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Nội dung:</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
        <div>
          <label>Ảnh:</label>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div>
          <label>Nổi bật:</label>
          <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
        </div>
        <button type="submit">Thêm Tin Tức</button>
      </form>
    </main>
  );
}

export default AddNews;