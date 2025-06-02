import { Link } from 'react-router-dom';

function HeroSection() {
return (
    <section className="hero-section">
        <div className="hero-content">
            <h1 className="hero-title">Khám phá thế giới phim & sách</h1>
            <p className="hero-subtitle">
                Cập nhật những bài viết, đánh giá và tin tức mới nhất về phim ảnh và sách tại đây!
            </p>
            <Link to="/register" className="hero-cta">
                Đăng ký ngay
            </Link>
        </div>
    </section>
);
}

export default HeroSection;