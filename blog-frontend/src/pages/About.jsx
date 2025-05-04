function About() {
    return (
      <main>
        <h1>Giới thiệu về Movie & Book Blog</h1>
        <div className="about-container">
          <div className="about-content">
            <h2>Chào mừng bạn đến với Movie & Book Blog!</h2>
            <p>
              Movie & Book Blog là không gian dành cho những người yêu thích phim ảnh và sách. Chúng tôi cung cấp các bài viết đánh giá, giới thiệu phim và sách, cùng với những thông tin thú vị về đạo diễn, tác giả, và các thể loại nổi bật.
            </p>
            <p>
              Mục tiêu của chúng tôi là tạo ra một cộng đồng nơi bạn có thể chia sẻ cảm nhận, khám phá những tác phẩm mới, và tìm kiếm cảm hứng từ thế giới nghệ thuật.
            </p>
            <h3>Liên hệ với chúng tôi</h3>
            <p><strong>Email:</strong> support@moviebookblog.com</p>
            <p><strong>Hotline:</strong> 0123 456 789</p>
          </div>
          <div className="about-image">
            <img
              src="https://via.placeholder.com/400x300?text=Movie+%26+Book+Blog"
              alt="Movie & Book Blog"
            />
          </div>
        </div>
      </main>
    );
  }
  
  export default About;