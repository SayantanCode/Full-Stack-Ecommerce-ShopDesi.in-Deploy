import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Button, TextField, Avatar, Paper, Rating, Skeleton } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetails, getReviews, createReview } from '../../Redux/Slice/viewSlice';
import moment from 'moment/moment';
const ProductReviewPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {id}= useParams()
    const { productSingle, reviews, loading } = useSelector((state) => state.View);
    useEffect(() => {
        window.scrollTo(0, 0);
      },[])
    useEffect(() => {
        dispatch(getProductDetails(id))
        dispatch(getReviews(id))
    },[id])
    // const [loading, setLoading] = useState(true);
    const [stars, setStars] = useState(0);
    const [title, setTitle] = useState('');
    const [reviewText, setReviewText] = useState('');

    const handleRating = (value) => {
        setStars(value);
    };

    const handleSubmit = () => {
        if (stars === 0) {
            toast.error('Please provide a rating.');
            return;
        }
        if (title.trim() === '') {
            toast.error('Please provide a review title.');
            return;
        }
        if (reviewText.trim() === '') {
            toast.error('Please provide a review text.');
            return;
        }
        // Proceed with the form submission logic
        dispatch(createReview({productId:id, rating: stars, title: title, comment:reviewText }))
        .unwrap()
        .then((response) => {
            if(!response.success){
                toast.error(`${response.message}`);
            }
            else {
                dispatch(getReviews(id))
                dispatch(getProductDetails(id))
                toast.success(response.message);
                setStars(0);
                setTitle('');
                setReviewText('');
            }
        })
    };

    // useEffect(() => {
    //     // Simulate a delay in loading data
    //     const timer = setTimeout(() => {
    //         setLoading(false);
    //     }, 2000);

    //     return () => clearTimeout(timer);
    // }, []);

    return (
        <Box sx={{ p: 3, mt: 10 }}>
            <ToastContainer />
            {/* Product Header */}
            {
                productSingle.map((product) => (
                    <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                    {loading ? (
                        <Skeleton variant="rectangular" width="100%" height={200} />
                    ) : (
                        <Box sx={{ width: '100%', borderColor: 'grey.500', border: '1px solid', minHeight: 200, minWidth: 200 }}>
                            <img src={product.image[0]} alt="Product" loading='lazy' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Box>
                    )}
                </Grid>
                <Grid item xs={12} sm={9}>
                    {loading ? (
                        <>
                            <Skeleton variant="text" width="60%" height={40} />
                            <Skeleton variant="text" width="40%" height={30} />
                            <Skeleton variant="text" width="30%" height={30} />
                        </>
                    ) : (
                        <>
                            <Typography variant="h4">{product.name}</Typography>
                            <Rating value={product.rating} readOnly />
                            <Typography variant="body1">{product.rating} out of 5 stars ({product.totalRating})</Typography>
                        </>
                    )}
                </Grid>
            </Grid>
                ))
            }

            {/* Write a Review */}
            <Box mt={4}>
                <Typography variant="h6">Write a Review</Typography>
                <Paper sx={{ p: 2, mt: 2 }}>
                    <Grid container spacing={2}>
                        {loading ? (
                            <>
                                <Skeleton variant="rectangular" width="100%" height={40} />
                                <Skeleton variant="rectangular" width="100%" height={100} sx={{ mt: 2 }} />
                                <Skeleton variant="rectangular" width="30%" height={40} sx={{ mt: 2 }} />
                            </>
                        ) : (
                            <>
                                <Grid item xs={12}>
                                    <Rating
                                        name="rating"
                                        value={stars}
                                        onChange={(event, value) => handleRating(value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Review Title"
                                        fullWidth
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Review Text"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button variant="contained" onClick={handleSubmit}>
                                        Submit Review
                                    </Button>
                                </Grid>
                            </>
                        )}
                    </Grid>
                </Paper>
            </Box>

            {/* User Reviews */}
            <Box mt={4}>
                <Typography variant="h6">User Reviews</Typography>
                <Grid container spacing={2} px={0} mt={1}>
                    {loading ? (
                        Array.from(new Array(3)).map((_, index) => (
                            <Grid item xs={12} sm={6} lg={4} sx={{ p: { xs: 0, sm: 2 } }} key={index}>
                                <Paper sx={{ p: 2 }}>
                                    <Skeleton variant="circular" width={40} height={40} />
                                    <Skeleton variant="text" width="90%" height={30} sx={{ mt: 1 }} />
                                    <Skeleton variant="text" width="60%" height={30} sx={{ mt: 1 }} />
                                    <Skeleton variant="rectangular" width="100%" height={60} sx={{ mt: 1 }} />
                                    <Skeleton variant="rectangular" width="30%" height={30} sx={{ mt: 1 }} />
                                </Paper>
                            </Grid>
                        ))
                    ) : (
                        <>
                            {reviews.map((review) => (
                                <Grid item xs={12} sm={6} lg={4} sx={{ p: { xs: 0, sm: 2 } }}>
                                <Paper sx={{ p: 2 }}>
                                    <Grid container spacing={2} p={0}>
                                        <Grid item xs={2} md={2}>
                                            <Avatar alt="User Name" src={review.user.image} />
                                        </Grid>
                                        <Grid item xs={10}>
                                            <Typography variant="body1">
                                                {review.user.name}
                                                <Typography variant="caption" component="span" sx={{ ml: { xs: 3, sm: 2 } }}>
                                                    Reviewed on {moment(review.createdAt).format('MMM Do, YYYY')}
                                                </Typography>
                                            </Typography>
                                            <Rating value={review.rating} readOnly />
                                            <Typography variant="body2">"{review.title}"</Typography>
                                            <Typography variant="body2">
                                                {review.comment}
                                            </Typography>
                                            <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-end', sm: 'flex-start' }, mt: 1 }}>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{ color: 'text.primary', borderColor: 'text.primary' }}
                                                >
                                                    Upvote
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{ color: 'text.primary', borderColor: 'text.primary', ml: 1 }}
                                                >
                                                    Report
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                            ))}

                            {/* Repeat for other reviews */}
                        </>
                    )}
                </Grid>
            </Box>
        </Box>
    );
};

export default ProductReviewPage;
