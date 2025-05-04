import { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Cảm ơn bạn đã gửi thông tin liên hệ! Chúng tôi sẽ phản hồi sớm nhất.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <main>
      <h1>Liên hệ với chúng tôi</h1>
      <div className="contact-container">
        <div className="contact-info">
          <h2>Thông tin liên hệ</h2>
          <p><strong>Email:</strong> support@moviebookblog.com</p>
          <p><strong>Hotline:</strong> 0123 456 789</p>
          <p><strong>Địa chỉ:</strong> 123 Đường Sách Phim, TP. Hà Nội</p>
        </div>
        <form onSubmit={handleSubmit} className="contact-form">
          <h2>Gửi tin nhắn cho chúng tôi</h2>
          <div>
            <label htmlFor="name">Họ và tên</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="phone">Số điện thoại</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="message">Nội dung</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Gửi tin nhắn</button>
        </form>
      </div>
    </main>
  );
}

export default Contact;