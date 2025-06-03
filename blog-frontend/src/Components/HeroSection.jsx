import { Link } from 'react-router-dom';

function HeroSection() {
return (
    <section className="hero-section">
        <div className="hero-content">
            <h1 className="hero-title">Khám phá thế giới phim & sách</h1>
            <p className="hero-subtitle">
                Cập nhật những góc nhìn sắc, review chân thực và thông tin mới nhất về phim ảnh và sách.
            </p>
            <Link to="/register" className="hero-cta">
                Đăng ký ngay
            </Link>
        </div>
    </section>
);
}

export default HeroSection;