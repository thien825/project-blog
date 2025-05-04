import { Link } from 'react-router-dom';

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
              <svg viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 2.04c-5.5 0-10 4.5-10 10 0 4.41 3.58 8 8 8s8-3.59 8-8c0-5.5-4.5-10-10-10zm0 14.96c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm7.5-12.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5z"
                />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              className="social-icon instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 2.04c-5.5 0-10 4.5-10 10 0 4.41 3.58 8 8 8s8-3.59 8-8c0-5.5-4.5-10-10-10zm0 14.96c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm7.5-12.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5z"
                />
              </svg>
            </a>
            <a
              href="https://tiktok.com"
              className="social-icon tiktok"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.53 2.12c-.88 0-1.75.27-2.47.77-1.97 1.35-2.77 3.84-2.07 6.18-.62.06-1.24.19-1.84.39-2.2.74-3.83 2.67-4.24 4.96-.62 3.46 1.77 6.76 5.18 7.54 1.03.24 2.09.24 3.12 0 2.84-.66 4.96-3.22 4.96-6.12v-6.93c.84.58 1.81.92 2.84.92.62 0 1.24-.12 1.84-.36v-1.78c-.62.24-1.24.36-1.84.36-.84 0-1.66-.24-2.36-.67v6.45c0 2.32-1.66 4.32-3.96 4.68-.62.12-1.24.12-1.84 0-2.2-.48-3.83-2.37-3.83-4.68s1.63-4.2 3.83-4.68c.62-.12 1.24-.12 1.84 0v-1.78c-.62-.24-1.24-.36-1.84-.36-1.81 0-3.46 1.02-4.24 2.67-.48 1.02-.48 2.16 0 3.18.62 1.38 1.97 2.37 3.46 2.37 2.2 0 3.96-1.78 3.96-3.96v-6.93c.84.58 1.81.92 2.84.92v-1.78c-.62.24-1.24.36-1.84.36-.84 0-1.66-.24-2.36-.67z"
                />
              </svg>
            </a>
            <a
              href="mailto:contact@moviebookblog.com"
              className="social-icon email"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 12.72L2.34 4h19.32L12 12.72zm-9.66 1.2V5.28L12 13.92l9.66-8.64v8.64c0 1.1-.9 2-2 2H4.34c-1.1 0-2-.9-2-2z"
                />
              </svg>
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