import React, { useEffect } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import './carousel.css';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import {IconButton, Box} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getCarousel } from '../../Redux/Slice/viewSlice';
const Carousel = () => {
  const dispatch = useDispatch();
  const {loading, carousel } = useSelector((state) => state.View);
  useEffect(() => {
    dispatch(getCarousel());
  },[])
  const settings = {
    dots: true,
    // arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
  };

  // const carouselImages = [
  //   'https://picsum.photos/id/1/1980/1080',
  //   'https://picsum.photos/id/2/1980/1080',
  //   'https://picsum.photos/id/3/1980/1080',
  //   'https://picsum.photos/id/4/1980/1080',
  //   'https://picsum.photos/id/5/1980/1080',
  //   'https://picsum.photos/id/6/1980/1080',
  // ]
  return (
    <Box className="carousel-container" sx={{mt:{xs:7, md:8}}}>
      <Slider {...settings}>
        {carousel?.map((image, index) => (
          <div key={index} className="carousel-slide">
            <img loading='lazy' src={image.image} alt={`carousel-image-${index}`} />
          </div>
        ))}
      </Slider>
    </Box>
  );
};

const CustomNextArrow = (props) => {
  return (
    <div className="custom-arrow next-arrow">
      <IconButton sx={{p:{xs:1, md:2}, backgroundColor: 'background.default', color: 'text.primary', borderRadius: '50%', '&:hover':{backgroundColor: 'text.primary', color: 'background.default'}}} onClick={props.onClick}>
      <ArrowForwardIos fontSize='small' />
      </IconButton>
      {/* <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg> */}
    </div>
  );
};

const CustomPrevArrow = (props) => {
  return (
    <div className="custom-arrow prev-arrow">
      <IconButton sx={{p:{xs:1, md:2}, backgroundColor: 'background.default', color: 'text.primary', borderRadius: '50%', '&:hover':{backgroundColor: 'text.primary', color: 'background.default'}}} onClick={props.onClick}>
      <ArrowBackIos fontSize='small'/>
      </IconButton>
      {/* <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 12H5m7 5l7 7-7-7" />
      </svg> */}
    </div>
  );
};
export default Carousel;