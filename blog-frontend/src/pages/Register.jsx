import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Register({ setIsLoggedIn, setUser }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', { username, email, password });
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('http://localhost/PROJECT_BLOG/blog-backend/register.php', {
        username,
        email,
        password,
      });
      console.log('Response from backend:', response.data);
      if (response.data.success) {
        const userData = response.data.user;
        localStorage.setItem('user', JSON.stringify(userData)); // Lưu thông tin user
        setSuccess('Đăng ký thành công! Chuyển hướng đến trang đăng nhập...');
        setTimeout(() => {
          navigate('/login'); // Chuyển đến trang đăng nhập
        }, 2000);
      } else {
        setError(response.data.message || 'Đăng ký thất bại');
      }
    } catch (err) {
      console.error('Error during registration:', err);
      if (err.response) {
        setError(`Đăng ký thất bại: ${err.response.data.message || err.response.statusText}`);
      } else if (err.request) {
        setError('Không thể kết nối đến server. Vui lòng kiểm tra backend.');
      } else {
        setError(`Đăng ký thất bại: ${err.message}`);
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>Đăng ký</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Đăng ký</button>
      </form>
      <p>
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </p>
    </div>
  );
}

export default Register;