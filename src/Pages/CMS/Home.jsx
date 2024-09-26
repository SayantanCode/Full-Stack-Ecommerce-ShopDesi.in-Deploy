import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import Carousel from './CarousalTopHome';
import FeaturedProducts from './FeaturedProducts';
import LimitedTimeDeals from './LimitedTimeDeals';
import FeaturedCategories from './FeaturedCategories';
import BrandSection from './Brand';
import { getCart } from '../../Redux/Slice/viewSlice';
import { useDispatch } from 'react-redux';

const HomePage = () => {
  const dipatch = useDispatch();
  useEffect(() => {
    dipatch(getCart());
    window.scrollTo(0,0)
  },[])
  return (
    <Box sx={{ backgroundColor: 'background.default', my:6 }}>
      <Carousel />
      <FeaturedProducts />
      <LimitedTimeDeals />
      <FeaturedCategories />
      <BrandSection />
    </Box>
  );
};

export default HomePage;
