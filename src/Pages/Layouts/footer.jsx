import React from 'react';
import { Box, Container, Grid, Typography, TextField, InputAdornment, useTheme } from '@mui/material';
import {IconButton} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Link} from "react-router-dom";

const Footer = () => {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        padding: theme.spacing(4, 2),
        borderTop: `1px solid ${theme.palette.divider}`,
        marginBottom: { xs: theme.spacing(8), sm: theme.spacing(8), md: theme.spacing(0) },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2">
              We are a modern e-commerce platform offering a wide range of products. Our mission is to provide quality products with excellent customer service.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Link href="#">
              <Typography variant="body2">Home</Typography>
            </Link>
            <Link href="#">
              <Typography variant="body2" >Shop</Typography>
            </Link>
            <Link href="#" color="inherit" underline="none">
              <Typography variant="body2">About</Typography>
            </Link>
            <Link href="#" color="inherit" underline="none">
              <Typography variant="body2">Contact</Typography>
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Customer Service
            </Typography>
            <Link href="#" color="inherit" underline="none">
              <Typography variant="body2">FAQ</Typography>
            </Link>
            <Link href="#" color="inherit" underline="none">
              <Typography variant="body2">Shipping & Returns</Typography>
            </Link>
            <Link href="#" color="inherit" underline="none">
              <Typography variant="body2">Order Tracking</Typography>
            </Link>
            <Link href="#" color="inherit" underline="none">
              <Typography variant="body2">Privacy Policy</Typography>
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2">Email: support@example.com</Typography>
            <Typography variant="body2">Phone: +123 456 7890</Typography>
            <Typography variant="body2">Address: 123 Main Street, City, Country</Typography>
            {/* here news letter option */}
            {/* <Typography variant="body2" >Subscribe to our newsletter:</Typography>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            /> */}
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
