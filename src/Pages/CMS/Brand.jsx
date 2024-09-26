import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Grid,
  Skeleton,
  useTheme,
  Paper,
} from '@mui/material';
import Marquee from 'react-fast-marquee';
import { useDispatch, useSelector } from 'react-redux';
import { getBrands } from '../../Redux/Slice/viewSlice'; // Assuming the API call is in this slice.

const BrandSection = () => {
  const dispatch = useDispatch();
  const { brands, loading } = useSelector((state) => state.View);
  const theme = useTheme();

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(getBrands());
  }, [dispatch]);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        setIsLoaded(true);
      }, 1000); // Delaying loading to simulate skeleton for at least 1 second
    }
  }, [loading]);

  return (
    <Box
      sx={{
        py: 4,
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Our Trusted Brands
      </Typography>

      {/* Skeleton loader */}
      {!isLoaded ? (
        <Grid container spacing={2} justifyContent="center">
          {[...Array(6)].map((_, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Skeleton variant="rectangular" width="100%" height={100} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Marquee gradient={false} speed={50} style={{ width: '100%' }} pauseOnHover>
          {brands.length > 0 ? (
            brands.map((brand) => (
              <Box
                key={brand._id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 2,
                  mx: 2,
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 2,
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                  width: { xs: 120, sm: 150, md: 200 },
                  height: 140, // Increased height to accommodate both logo and name
                  overflow: 'hidden',
                }}
                component={Paper}
              >
                {brand.logo ? (
                  <>
                    <Avatar
                      src={brand.logo}
                      alt={brand.name}
                      variant="square"
                      sx={{
                        width: "auto",
                        height: 80, // Reduced height to make space for the brand name
                        objectFit: 'contain',
                        mb: 1, // Adds margin between logo and name
                        borderRadius: 2,
                      }}
                    />
                    <Typography
                      variant="subtitle1"
                      align="center"
                      sx={{
                        fontWeight: 'bold',
                        color: theme.palette.text.primary,
                      }}
                    >
                      {brand.name}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="h6">{brand.name}</Typography>
                )}
              </Box>
            ))
          ) : (
            <Typography variant="h6">No brands available</Typography>
          )}
        </Marquee>
      )}
    </Box>
  );
};

export default BrandSection;
