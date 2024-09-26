import React, { useState } from 'react';
import Slider from 'react-slick';
import { Box, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CustomArrow = ({ className, style, onClick, icon, direction }) => (
  <IconButton
    onClick={onClick}
    style={{
      ...style,
      display: 'block',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 2,
      left: direction === 'left' ? '10px' : 'auto',
      right: direction === 'right' ? '10px' : 'auto'
    }}
  >
    {icon}
  </IconButton>
);

const CustomThumbSlider = ({ images }) => {
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const settingsMain = {
    slidesToShow: 1,
    slidesToScroll: 1,
    // arrows: false,
    asNavFor: nav2,
    ref: (slider) => setNav1(slider),
    beforeChange: (current, next) => setActiveSlide(next),
  };

  const settingsThumbs = {
    slidesToShow: 5,
    slidesToScroll: 1,
    asNavFor: nav1,
    focusOnSelect: true,
    arrows: false,
    ref: (slider) => setNav2(slider),
    centerMode: true,
    centerPadding: '0px',
  };

  return (
    <Box position="relative">
      {images.length>1?(<>
        <Slider
        {...settingsMain}
        nextArrow={<CustomArrow icon={<ArrowForwardIosIcon />} direction="right" />}
        prevArrow={<CustomArrow icon={<ArrowBackIosIcon />} direction="left" />}
      >
        {/* {console.log(images,"images slide")} */}
        {images.map((image, index) => (
          <Box key={index} sx={{height:{xs: 250, sm: 350, lg: 400, xl: 400}, width: '100%', objectFit: 'contain', backgroundColor: 'grey.200'}}>
            <img src={image} alt={`product-${index}`} loading='lazy' style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </Box>
        ))}
      </Slider>
      <Slider {...settingsThumbs}>
        {images.map((image, index) => (
          <Box
            key={index}
            sx={{
              padding: 1,
              height: {xs: 65, sm: 100, md: 110, lg: 110, xl: 120},
              border: index === activeSlide ? '2px solid #1976d2' : 'none',
            }}
          >
            <Box sx={{width: '100%', height: '100%', backgroundColor: 'background.paper'}}>
            <img
              src={image}
              alt={`thumb-${index}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                cursor: 'pointer',
                opacity: index === activeSlide ? 1 : 0.5,            
              }}
            />
            </Box>
          </Box>
        ))}
      </Slider>
      </>):(<>
        <Box sx={{height:{xs: 250, sm: 350, lg: 400, xl: 400}, width: '100%', objectFit: 'contain', backgroundColor: 'background.paper'}}>
            <img src={images} alt={`product-${0}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Box>
      </>)}
    </Box>
  );
};

export default CustomThumbSlider;
