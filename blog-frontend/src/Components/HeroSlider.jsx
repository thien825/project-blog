// src/components/HeroSlider.jsx
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/HeroSlider.css"; // Adjust the path as necessary
import poter1 from "../assets/poter1.jpg";
import poter2 from "../assets/poter2.jpg";
import poter3 from "../assets/poter3.jpg";


const HeroSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: true
  };

  const slides = [
    { src: poter1, alt: "Harry Potter 1" },
    { src: poter2, alt: "Harry Potter 2" },
    { src: poter3, alt: "Harry Potter 3" }
  ];

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {slides.map((item, idx) => (
          <div key={idx} className="slide-wrapper">
            <img src={item.src} alt={item.alt} className="slide-image" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSlider;
// src/components/HeroSlider.css


