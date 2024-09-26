import React, { useRef } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getProductDetails, getRelatedProducts } from '../../Redux/Slice/viewSlice';
const RelatedProducts = ({ products }) => {
    const scrollRef = useRef(null);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    return (
        <Box>
            <Typography variant="h6" mb={2}>Related Products</Typography>
            <Box sx={{ position: 'relative' }}>
                {/* Left Arrow */}
                <IconButton
                    onClick={scrollLeft}
                    sx={{
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 1,
                        backgroundColor: 'background.paper',
                        '&:hover': { backgroundColor: 'primary.main' }
                    }}
                >
                    <ArrowBackIosNewIcon />
                </IconButton>

                {/* Scrollable Products Container */}
                <Box
                    ref={scrollRef}
                    sx={{
                        display: 'flex',
                        overflowX: 'auto',
                        scrollBehavior: 'smooth',
                        gap: 2,
                        paddingBottom: 2,
                    }}
                >
                    {products.map((product, index) => (
                        <Box
                            key={index}
                            sx={{
                                flex: '0 0 auto',
                                width: '200px',
                                border: '1px solid #ccc',
                                padding: 2,
                                borderRadius: 2,
                                cursor: 'pointer',
                                '&:hover': { boxShadow: 3 },
                            }}
                            onClick={() => {navigate(`/products/${product._id}`)}}
                        >
                            <Box sx={{width: '100%', height: '110px', objectFit: 'cover', backgroundColor: 'background.paper'}}>
                            <img 
                                src={product.image[0]} 
                                alt={product.name} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                            </Box>
                            <Typography variant="body1" mt={1}>
                                {product.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                            ₹{product.sellingPrice}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                {/* Right Arrow */}
                <IconButton
                    onClick={scrollRight}
                    sx={{
                        position: 'absolute',
                        right: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 1,
                        backgroundColor: 'background.paper',
                        '&:hover': { backgroundColor: 'primary.main' }
                    }}
                >
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default RelatedProducts;
