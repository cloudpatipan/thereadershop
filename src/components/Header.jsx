import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { RiRadioButtonFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';

export default function Header() {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get('/api/adsbanners');
      setBanners(response.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? banners.length - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === banners.length - 1 ? 0 : prevIndex + 1));
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <header className="my-4">
      <div className="relative">
        {banners.length > 0 ? (
          <>
            <div className="overflow-hidden h-[24rem] rounded-lg">
              {banners.map((banner, index) => (
                <div key={index} className={`absolute w-full h-full ${index === currentIndex ? 'block' : 'hidden'}`}>
                  <Link to={`/product/detail/${banner.product.slug}`}>
                    <img
                      src={` https://c45c-2405-9800-b540-dc40-d538-9787-5ce1-fc75.ngrok-free.app/images/adsbanner/${banner.image}`}
                      className="w-full h-full object-cover bg-center"
                      alt="banner"
                    />
                  </Link>
                </div>
              ))}
            </div>

            <div className="absolute top-[50%] transform -translate-y-1/2 left-5 text-2xl rounded-full p-2 bg-black/40 text-white cursor-pointer">
              <IoIosArrowBack onClick={prevSlide} />
            </div>
            <div className="absolute top-[50%] transform -translate-y-1/2 right-5 text-2xl rounded-full p-2 bg-black/40 text-white cursor-pointer">
              <IoIosArrowForward onClick={nextSlide} />
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {banners.map((banner, slideIndex) => (
                <div
                  key={slideIndex}
                  onClick={() => goToSlide(slideIndex)}
                  className={`cursor-pointer ${currentIndex === slideIndex ? 'text-black' : 'text-white'}`}
                >
                  <RiRadioButtonFill size={30} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-[24rem]">
            <span className="text-3xl font-semibold">ไม่มีแบนเนอร์สินค้า</span>
          </div>
        )}
      </div>
    </header>
  );
}
