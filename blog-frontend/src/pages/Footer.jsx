import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-info">
          <div className="footer-logo">
            <span role="img" aria-label="movie-book">
              🎬📚
            </span>{' '}
            Movie & Book Blog
          </div>
          <p>
            <strong>Email:</strong> contact@moviebookblog.com
          </p>
          <p>
            <strong>Hotline:</strong> 0123 456 789
          </p>
          <p>
            <strong>Địa chỉ:</strong> 123 Đường Sách, Quận 1, TP. Hồ Chí Minh
          </p>
          <div className="footer-social">
            <a
              href="https://facebook.com"
              className="social-icon facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF size={26} />
            </a>
            <a
              href="https://instagram.com"
              className="social-icon instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram size={26} />
            </a>
            <a
              href="https://tiktok.com"
              className="social-icon tiktok"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTiktok size={26} />
            </a>
            <a
              href="mailto:contact@moviebookblog.com"
              className="social-icon email"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MdEmail size={26} />
            </a>
          </div>
        </div>
        <div className="footer-links">
          <h3>Liên kết nhanh</h3>
          <ul>
            <li>
              <Link to="/">Trang chủ</Link>
            </li>
            <li>
              <Link to="/contact">Liên hệ</Link>
            </li>
            <li>
              <Link to="/about">Giới thiệu</Link>
            </li>
          </ul>
        </div>
        <div className="footer-widget">
          <h3>Sự kiện nổi bật</h3>
          <div className="event-card">
            <img
              src="https://picsum.photos/300/150?random=1"
              alt="Sự kiện ra mắt sách mới"
              className="event-image"
            />
            <p>Sự kiện ra mắt sách mới</p>
            <Link to="/event" className="event-link">
              Xem chi tiết
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;