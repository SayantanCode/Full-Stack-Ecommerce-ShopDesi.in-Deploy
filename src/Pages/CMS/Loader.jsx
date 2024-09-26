import React from 'react';
import { CircularProgress, Grid, Typography } from '@mui/material';

const Loader = () => {
    return (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh' }}
      >
        <Grid item>
          <CircularProgress
            size={50}
            thickness={5}
            sx={{
              color: (theme) => theme.palette.primary.main,
            }}
          />
        </Grid>
        <Grid item>
          <Typography variant="h6" sx={{ color: (theme) => theme.palette.text.primary }}>
            Shop Desi.in
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body2" sx={{ color: (theme) => theme.palette.text.secondary }}>
            Loading...
          </Typography>
        </Grid>
      </Grid>
    );
  };
  
  export default Loader;
  