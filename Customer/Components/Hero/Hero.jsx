import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import './Hero.css'; // Importing the CSS file

// Import images correctly
import fruitsImage from "../Assets/fruits.png";
import mangoImage from "../Assets/grains.jpg";
import vegetableImage from "../Assets/vegitables.jpg"; // Fixed spelling

export const Hero = () => {
  const slides = [
    {
      title: "WOOOOOOOOOW!",
      subtitle: "Fruits",
      description: "100% organic",
      buttonText: "Order now",
      image: fruitsImage,
    },
    {
      title: "SAVER DEAL!",
      subtitle: "100% REAL",
      description: "Alphonso Mangoes",
      buttonText: "Order now",
      image: mangoImage,
    },
    {
      title: "FRESH MANIA",
      subtitle: "VEGGIES",
      description: "IMPORTED VEGGIES",
      buttonText: "Order now",
      image: vegetableImage,
    },
  ];

  return (
    <div className="hero-container">
      <Swiper
        modules={[Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        effect="fade"
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        speed={1000}
        loop={true}
        className="hero-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="slide">
              <img src={slide.image} alt={slide.title} className="slide-image" />
              <div className="slide-overlay">
                <div className="slide-content">
                  <h2 className="slide-title">{slide.title}</h2>
                  <h3 className="slide-subtitle">{slide.subtitle}</h3>
                  <p className="slide-description">{slide.description}</p>
                  <button className="slide-button">
                    {slide.buttonText}
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
