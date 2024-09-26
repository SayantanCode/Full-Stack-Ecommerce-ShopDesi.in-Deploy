import React, { useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../Redux/Slice/viewSlice';
const FeaturedProductCard = styled(Box)(({ theme }) => ({
//   padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

// const products = [
//   { name: 'Product 1', image: 'https://picsum.photos/200', link: '/product/1' },
//   { name: 'Product 2', image: 'https://picsum.photos/300', link: '/product/2' },
//   { name: 'Product 3', image: 'https://picsum.photos/400', link: '/product/3' },
//   { name: 'Product 4', image: 'https://picsum.photos/500', link: '/product/4' },
// ];

const FeaturedProducts = () => {
  const dispatch = useDispatch();
  const { loading, productsData } = useSelector((state) => state.View);
  useEffect(() => {
    dispatch(getProducts());
  }, []);
  return (
    <Box sx={{px:{xs:2, md:8}, py: 8, backgroundColor: 'background.default' }}>
      <Typography variant="h4" fontSize={{xs: 30, md: 35}} pb={2} align="center" gutterBottom>
        Featured Products
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {Object.keys(productsData).length>0 && productsData.products.slice(0, 4).map((product, index) => (
          <Grid item xs={6} sm={6} md={4} lg={3} key={index}>
            <FeaturedProductCard component={Link } to={`/products/${product._id}`}>
              <Box
                component="img"
                src={product.image[0]}
                alt={product.name}
                sx={{ width: '100%', borderRadius: 1 , height: 300, objectFit: 'contain', backgroundColor: 'grey.200',}}
              />
              <Typography variant="h6" mt={2} align="center">
                {product.name}
              </Typography>
            </FeaturedProductCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FeaturedProducts;
