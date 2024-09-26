import React, { useState } from 'react';
import { Box, Grid, Typography, Card, CardContent, TextField, Button } from '@mui/material';
import { styled, useTheme } from '@mui/system';
import AOS from 'aos';
import 'aos/dist/aos.css';

const blogs = [
  {
    id: 1,
    title: 'Understanding React',
    content: '<p>React is a JavaScript library for building user interfaces...</p>',
  },
  {
    id: 2,
    title: 'Getting Started with MUI',
    content: '<p>MUI is a popular React UI framework...</p>',
  },
  // Add more sample blogs here
];

const BlogCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: '10px',
  backgroundColor: theme.palette.background.paper,
  position: 'relative',
  overflow: 'hidden',
  '&:before, &:after': {
    content: '""',
    position: 'absolute',
    left: 0,
    right: 0,
    height: '20px',
    background: `linear-gradient(to bottom, ${theme.palette.background.paper} 0%, transparent 100%)`,
    zIndex: 1,
  },
  '&:before': {
    top: 0,
  },
  '&:after': {
    bottom: 0,
    transform: 'rotate(180deg)',
  },
}));

const BlogPage = () => {
  const theme = useTheme();
  AOS.init();

  const truncateText = (htmlContent, maxLength) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    return tempDiv.textContent.slice(0, maxLength) + '...';
  };

  const handleLikeDislike = (blogId, action) => {
    console.log(`Blog ID: ${blogId} | Action: ${action}`);
    // Implement like/dislike functionality
  };

  return (
    <Box sx={{ p: 3, my:12 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
          {blogs.map((blog) => (
            <Grid item xs={12} md={6}>
            <BlogCard key={blog.id} data-aos="fade-up">
              <CardContent>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  {blog.title}
                </Typography>
                <Typography variant="body2" dangerouslySetInnerHTML={{ __html: truncateText(blog.content, 150) }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button onClick={() => handleLikeDislike(blog.id, 'like')}>Like</Button>
                  <Button onClick={() => handleLikeDislike(blog.id, 'dislike')}>Dislike</Button>
                </Box>
              </CardContent>
            </BlogCard>
            </Grid>
          ))}
            </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ mb: 3 }}>
            <TextField fullWidth label="Search Blog" variant="outlined" />
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recent Blogs
            </Typography>
            {blogs.slice(0, 3).map((blog) => (
              <Typography key={blog.id} variant="body2" sx={{ mb: 1 }}>
                {blog.title}
              </Typography>
            ))}
          </Box>
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Tags
            </Typography>
            <Button variant="outlined" sx={{ mr: 1, mb: 1 }}>
              React
            </Button>
            <Button variant="outlined" sx={{ mr: 1, mb: 1 }}>
              MUI
            </Button>
            {/* Add more tags as needed */}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BlogPage;
