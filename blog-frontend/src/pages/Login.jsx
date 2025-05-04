import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Login({ setIsLoggedIn, setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', { email, password });
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('http://localhost/PROJECT_BLOG/blog-backend/login.php', {
        email,
        password,
      });
      console.log('Response from backend:', response.data);
      if (response.data.success) {
        const userData = response.data.user;
        localStorage.setItem('user', JSON.stringify(userData));
        setIsLoggedIn(true);
        setUser(userData);
        setSuccess('Đăng nhập thành công! Chuyển hướng về trang chủ...');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError(response.data.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      console.error('Error during login:', err);
      if (err.response) {
        setError(`Đăng nhập thất bại: ${err.response.data.message || err.response.statusText}`);
      } else if (err.request) {
        setError('Không thể kết nối đến server. Vui lòng kiểm tra backend.');
      } else {
        setError(`Đăng nhập thất bại: ${err.message}`);
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>Đăng nhập</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Đăng nhập</button>
      </form>
      <p>
        Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
      </p>
    </div>
  );
}

export default Login;