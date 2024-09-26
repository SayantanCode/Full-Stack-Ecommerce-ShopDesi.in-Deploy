import React, { useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories, getProducts } from '../../Redux/Slice/viewSlice';
const CategoryCard = styled(Box)(({ theme }) => ({
//   padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  textAlign: 'center',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const FeaturedCategories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, categories } = useSelector((state) => state.View);
  useEffect(() => {
    dispatch(getCategories());
  }, []);
  return (
    <Box sx={{px:{xs:2, md:8}, py: 5, backgroundColor: 'background.default' }}>
      <Typography variant="h4" fontSize={{xs: 30, md: 35}} pb={2} align="center" gutterBottom>
        Featured Categories
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {categories?.map((category, index) => (
          <Grid item xs={6} sm={6} md={4} lg={3} key={index}>
            <CategoryCard onClick={() => {navigate(`/products?category=${encodeURIComponent(category.name)}`) }} sx={{ cursor: 'pointer' }}>
              <Box
                component="img"
                src={category.image}
                alt={category.name}
                sx={{ width: '100%', borderRadius: 1, height: 300, objectFit: 'contain', objectPosition: 'center', backgroundColor: 'grey.200' }}
              />
              <Typography variant="h6" mt={2}>
                {category.name}
              </Typography>
            </CategoryCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FeaturedCategories;
