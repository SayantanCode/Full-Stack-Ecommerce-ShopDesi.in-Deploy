import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDeals } from '../../Redux/Slice/viewSlice';

const DealCard = styled(Paper)(({ theme }) => ({
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


const LimitedTimeDeals = () => {
  const dispatch = useDispatch();
  const { loading, deals } = useSelector((state) => state.View);
  useEffect(() => {
    dispatch(getDeals());
  }, []);
  const [timeLeft, setTimeLeft] = useState({});
  useEffect(() => {
    const updateTimer = () => {
      if(Object.keys(deals).length>0){
        deals.products.forEach((deal) => {
          const timeLeft = new Date(deal.dealEnd) - new Date();
          const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor(timeLeft % (1000 * 60 * 60) / (1000 * 60));
          const seconds = Math.floor(timeLeft % (1000 * 60) / 1000);
          setTimeLeft((prevTimeLeft) => ({
            ...prevTimeLeft,
            [deal._id]: `${days}d ${hours}h ${minutes}m ${seconds}s`,
          }));
        })
      }
    }

    const interval = setInterval(updateTimer, 1000);
    updateTimer();
    return () => clearInterval(interval);
  }, [deals]);
  useEffect(() => {
    for(const id in timeLeft){
      if(timeLeft[id] === '0d 0h 0m 0s'){
        setTimeLeft((prevTimeLeft) => ({
          ...prevTimeLeft,
          [id]: 'Deal Ended',
        }));
        dispatch(getDeals());
      }
    }
  },[timeLeft])
  return (
    <Box sx={{px:{xs:2, md:8}, py: 5, backgroundImage: 'radial-gradient(circle 248px at center, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0.1) 100%)',
  backdropFilter: 'blur(20px)'
      }}>
      <Typography variant="h4" fontSize={{xs: 30, md: 35}} pb={2} align="center" gutterBottom>
        Best Limited Time Deals
      </Typography>
      {/* <Box sx={{ py: 2, backdropFilter: 'blur(4px)', background: 'linear-gradient(rgba(255, 255, 0, 0.5), rgba(255, 255, 180, 0.5))' }}> */}
      <Grid container spacing={4} justifyContent="center">
        {Object.keys(deals).length>0 && deals.products.length>0? deals.products.map((deal, index) => (
          <Grid item xs={6} sm={6} md={4} lg={3} key={index}>
            <DealCard component={Link} to={`/products/${deal._id}`}>
              <Box
                component="img"
                loading='lazy'
                src={deal.image[0]}
                alt={deal.name}
                sx={{ width: '100%', borderRadius: 1, height: 300, objectFit: 'contain', objectPosition: 'center', backgroundColor: 'grey.200' }}
              />
              <Typography variant="h6" mt={2}>
                {deal.name}
              </Typography>
              <Typography variant="body1" mt={1}>
                {deal.discount}% OFF
              </Typography>
              <Typography variant="body1" mt={1} color={'red'}>
                Deal ends in: {timeLeft[deal._id]}
              </Typography>
            </DealCard>
          </Grid>
        )): <><Typography variant="h6" mt={2} align="center">No Deals Available Right Now... </Typography></>}
      </Grid>
      {/* </Box> */}
    </Box>
  );
};

export default LimitedTimeDeals;
