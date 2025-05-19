import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { UserIcon, SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import Home from './pages/Home';
import AddPost from './pages/AddPost';
import PostDetail from './pages/PostDetail';
import ManagePosts from './pages/ManagePosts';
import Contact from './pages/Contact';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Footer from './pages/Footer';
import EditPost from './pages/EditPost';
import './App.css';

// Tạo SearchContext để chia sẻ searchQuery
const SearchContext = createContext();

// Component con để chứa logic của App
function AppContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [iconTransition, setIconTransition] = useState('fade-in'); // Thêm trạng thái cho hiệu ứng icon
  const accountRef = useRef(null);
  const navigate = useNavigate();

  // Cập nhật trạng thái từ localStorage khi khởi động
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser === 'object') {
          setIsLoggedIn(true);
          setUser(parsedUser);
        } else {
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('user');
      }
    }

    const savedMode = localStorage.getItem('theme');
    if (savedMode === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  // Cập nhật localStorage và class khi thay đổi chế độ
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Xử lý sự kiện nhấn Enter trong thanh tìm kiếm
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setSearchQuery(e.target.value);
      console.log('Tìm kiếm với:', e.target.value);
    }
  };

  // Xử lý đóng hộp thoại tài khoản khi nhấn ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setIsAccountOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setIsAccountOpen(false);
    navigate('/');
  };

  // Hàm chuyển đổi chế độ sáng/tối với hiệu ứng
  const toggleTheme = () => {
    console.log('Đang chuyển đổi chế độ sáng/tối:', isDarkMode);
    setIconTransition('fade-out'); // Kích hoạt hiệu ứng mờ dần
    setTimeout(() => {
      setIsDarkMode(!isDarkMode);
      setIconTransition('fade-in'); // Kích hoạt hiệu ứng hiện lại
    }, 300); // Thời gian chờ khớp với transition
  };

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      <div className="app-wrapper">
        {/* Header */}
        <header className="header">
          <div className="logo">
            <span role="img" aria-label="movie-book">
              🎬📚
            </span>{' '}
            Movie & Book Blog
          </div>
          <nav className="menu">
            <Link to="/">Trang chủ</Link>
            {isLoggedIn && user?.role === 'admin' && (
              <Link to="/manage-posts">Quản lý bài viết</Link>
            )}
            <Link to="/contact">Liên hệ</Link>
            <Link to="/about">Giới thiệu</Link>
          </nav>
          <div className="header-right">
            <div className="search-container">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onKeyPress={handleSearch}
                className="search-bar"
                placeholder="Tìm kiếm..."
              />
              <span className={`search-icon ${isSearchFocused ? 'active' : ''}`}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
            </div>
            <span className="hotline">Hotline: 0123 456 789</span>
            {/* Nút chuyển đổi sáng/tối với hiệu ứng */}
          <button className="theme-toggle" onClick={toggleTheme}>
          {isDarkMode ? (
             <SunIcon className={`theme-icon ${iconTransition}`} />
          ) : (
              <MoonIcon className={`theme-icon ${iconTransition}`} />
        )}
          </button>
            <div className="account-container" ref={accountRef}>
              <button
                className="account-btn"
                onClick={() => setIsAccountOpen(!isAccountOpen)}
              >
                <UserIcon className="account-icon" />
              </button>
              {isAccountOpen && (
                <div className="account-dropdown">
                  {isLoggedIn ? (
                    <>
                      <div className="user-info">
                        <p><strong>Tên:</strong> {user?.username || 'N/A'}</p>
                        <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
                      </div>
                      <button onClick={handleLogout}>Đăng xuất</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setIsAccountOpen(false)}>
                        Đăng nhập
                      </Link>
                      <Link to="/register" onClick={() => setIsAccountOpen(false)}>
                        Đăng ký
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/edit-post/:id" element={<EditPost />} />
          <Route
            path="/manage-posts"
            element={
              isLoggedIn && user?.role === 'admin' ? (
                <ManagePosts />
              ) : (
                <div className="access-denied">
                  <h2>Truy cập bị từ chối</h2>
                  <p>Bạn cần quyền admin để truy cập trang này.</p>
                  <Link to="/">Quay lại trang chủ</Link>
                </div>
              )
            }
          />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
          <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
        </Routes>

        {/* Footer */}
        <Footer />
      </div>
    </SearchContext.Provider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

export const useSearch = () => useContext(SearchContext);