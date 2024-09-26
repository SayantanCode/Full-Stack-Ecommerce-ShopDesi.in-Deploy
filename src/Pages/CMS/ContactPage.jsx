import React, { useEffect } from 'react';
import { Container, Grid, TextField, Button, Typography, Paper, Box } from '@mui/material';
import { styled } from '@mui/system';
import { darkTheme } from '../../App';
import { useDispatch } from 'react-redux';
import { getCart } from '../../Redux/Slice/viewSlice';
const ContactPage = ({theme}) => {
  const dispatch = useDispatch()
  useEffect(()=>{
    dispatch(getCart())
    window.scrollTo(0,0)
  },[])
  return (
    <Container maxWidth="xl" sx={{ mt: { lg: 12, md: 10, sm: 10, xs: 8 }, pb: 4 }}>
      <Grid container spacing={4}>
        {/* Contact Information */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body1" paragraph>
              We'd love to hear from you! Whether you have a question about our products, need assistance, or just want to give feedback, we're here to help.
            </Typography>
            <Box mt={4}>
              <Typography variant="h6">Our Address:</Typography>
              <Typography variant="body1">123 E-commerce St, Web City, Internet 12345</Typography>
            </Box>
            <Box mt={2}>
              <Typography variant="h6">Email Us:</Typography>
              <Typography variant="body1">support@yourecommerce.com</Typography>
            </Box>
            <Box mt={2}>
              <Typography variant="h6">Call Us:</Typography>
              <Typography variant="body1">+1 800 123 4567</Typography>
            </Box>
            {/* <Box mt={2}>
              <Typography variant="h6">Business Hours:</Typography>
              <Typography variant="body1">Mon - Fri: 9am - 5pm</Typography>
            </Box> */}
            <Box mt={2}>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.6365045419166!2d88.37053317476632!3d22.889882421267973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f89164c89f40ef%3A0x3a800689f0e778e5!2zUmFtbWFuZGlyIER1cmdhIFRlbXBsZSDgprDgpr7gpq7gpq7gpqjgp43gpqbgpr_gprAg4Kam4KeC4Kaw4KeN4KaX4Ka-IOCmruCmqOCnjeCmpuCmv-CmsA!5e0!3m2!1sen!2sin!4v1723898034790!5m2!1sen!2sin" width="100%" height="100%" frameborder="0" style={{ border: 0, filter: theme === darkTheme ? 'invert(1) hue-rotate(180deg)' : 'none' }} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"/>
            </Box>
          </Paper>
      
          
        
        </Grid>

        {/* Contact Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom>
              Get in Touch
            </Typography>
            <form noValidate autoComplete="off">
              <TextField
                fullWidth
                label="Your Name"
                variant="outlined"
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Your Email"
                variant="outlined"
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Subject"
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Message"
                variant="outlined"
                margin="normal"
                multiline
                rows={4}
                required
              />
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 3 }}
                fullWidth
              >
                Send Message
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ContactPage;
