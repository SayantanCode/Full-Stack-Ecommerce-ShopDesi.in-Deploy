import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Rating,
  Paper,
  IconButton,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
// import Slider from 'react-slick';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import CustomThumbSlider from "./CustomThumbSlider";
import RelatedProducts from "./RelatedProducts";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductDetails, getCart, createCart, getRelatedProducts, getReviews } from "../../Redux/Slice/viewSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// const product = {
//     name: 'Sample Product',
//     images: [
//       'https://picsum.photos/id/1/600/400',
//       'https://picsum.photos/id/2/600/400',
//       'https://picsum.photos/id/3/600/400',
//       'https://picsum.photos/id/4/600/400',
//       'https://picsum.photos/id/5/600/400',
//       'https://picsum.photos/id/6/600/400',
//       'https://picsum.photos/id/7/600/400',
//       'https://picsum.photos/id/8/600/400',
//       'https://picsum.photos/id/9/600/400',
//       'https://picsum.photos/id/10/600/400',
//       'https://picsum.photos/id/11/600/400',
//       'https://picsum.photos/id/12/600/400',
//     ],
//     description: 'This is a sample product description.',
//     price: 99.99,
//     rating: 4.5,
//     deliveryTime: '3-5 business days',
//     reviews: [
//       { user: 'John Doe', rating: 4, comment: 'Great product!' },
//       { user: 'Jane Smith', rating: 5, comment: 'Excellent quality!' },
//     ],
//   };

// const relatedProducts = [
//   // Your related products array
//   {
//     id: 1,
//     name: "Related Product 1",
//     image: "https://picsum.photos/id/101/600/400",
//     price: 49.99,
//   },
//   {
//     id: 2,
//     name: "Related Product 2",
//     image: "https://picsum.photos/id/102/600/400",
//     price: 59.99,
//   },
//   {
//     id: 3,
//     name: "Related Product 3",
//     image: "https://picsum.photos/id/103/600/400",
//     price: 69.99,
//   },
//   {
//     id: 4,
//     name: "Related Product 4",
//     image: "https://picsum.photos/id/104/600/400",
//     price: 79.99,
//   },
//   {
//     id: 5,
//     name: "Related Product 5",
//     image: "https://picsum.photos/id/10/600/400",
//     price: 89.99,
//   },
//   {
//     id: 6,
//     name: "Related Product 6",
//     image: "https://picsum.photos/id/106/600/800",
//     price: 99.99,
//   },
//   {
//     id: 7,
//     name: "Related Product 7",
//     image: "https://picsum.photos/id/107/600/400",
//     price: 109.99,
//   },
//   {
//     id: 8,
//     name: "Related Product 8",
//     image: "https://picsum.photos/id/108/600/400",
//     price: 119.99,
//   },
//   {
//     id: 9,
//     name: "Related Product 9",
//     image: "https://picsum.photos/id/109/600/400",
//     price: 129.99,
//   },
//   {
//     id: 10,
//     name: "Related Product 10",
//     image: "https://picsum.photos/id/110/600/400",
//     price: 139.99,
//   },
// ];
const ProductDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { productSingle, cartLoading, relatedProducts, relatedProductsLoading, reviews  } = useSelector((state) => state.View);
  const { isAuthenticated } = useSelector((state) => state.Auth);
  const { id } = useParams();
  useEffect(() => {
    window.scrollTo(0, 0);
  },[])
  useEffect(() => {
    dispatch(getProductDetails(id));
    dispatch(getRelatedProducts(id));
    dispatch(getReviews(id));
  }, [id]);
  const handleAddToCart = (product) => {
    if(!isAuthenticated){
      toast.error("Please login to add product to cart. Redirecting to login page...");
      setTimeout(() => {
        navigate("/user/login");
      }, 2000);
      return;
    }
    dispatch(createCart(product))
    .unwrap()
    .then((response) => {
      if(!response.success){
        toast.error(`${response.message}.Please try again.`);
      }
      else {
        toast.success(response.message);
        navigate("/cart");
        dispatch(getCart());
      }
    })
    .catch((error) => {
      console.log(error);
    });
  };
  return (
    <>
    <ToastContainer/>
    <Container sx={{ py: 4, my: 10 }}>
      <Grid container spacing={4}>
        {productSingle?.map((product) => (
          <>
            <Grid item xs={12} md={6}>
              <CustomThumbSlider images={product.image} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h1" gutterBottom>
                {product.name}
              </Typography>
              <Rating value={product.rating} readOnly />

              {/* <Typography variant="h5" component="h2" color="secondary" gutterBottom>
          ₹{product.sellingPrice}
          </Typography> */}
              <Box display="flex" alignItems="center">
                <Typography
                  variant="h5"
                  component="h2"
                  color="secondary"
                  gutterBottom
                >
                  ₹{product.sellingPrice}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="span"
                  style={{
                    // textDecoration: "line-through",
                    marginLeft: 8,
                  }}
                >
                  MRP:
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="span"
                  style={{
                    textDecoration: "line-through",
                    // marginLeft: 8,
                  }}
                >
                  ₹{product.mrp}
                </Typography>
              </Box>
              <Typography variant="h5" color="textPrimary" gutterBottom>
                Details:
              </Typography>
              <Typography variant="body1" gutterBottom>
                {product.description}
              </Typography>
              <Typography variant="body2" fontStyle={"italic"} gutterBottom>
                The Product Is Listed On {product.category}
              </Typography>

              <Typography variant="body2" color="textSecondary" gutterBottom>
                Delivery time: 3-5 business days
              </Typography>
              {product.stock?<Button
                variant="contained"
                color="primary"
                startIcon={<AddShoppingCartIcon />}
                sx={{ mt: 2 }}
                onClick={()=>handleAddToCart(product._id)}
              >
                {cartLoading ? "Adding..." : "Add to Cart"}
              </Button>:<Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                disabled
              >
                Out of Stock
              </Button>}
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<ShareIcon />}
                sx={{ ml: 2, mt: 2 }}
              >
                Share
              </Button>
              <Box mt={4}>
                <Typography variant="h6" component="h3">
                  Reviews
                </Typography>
                {reviews.map((review, index) => (
              <Paper key={index} sx={{ p: 2, mt: 2 }}>
                <Typography variant="body2">{review.user.name}</Typography>
                <Rating value={review.rating} readOnly />
                <Typography variant="body1">{review.comment}</Typography>
              </Paper>
            ))}
              </Box>
            </Grid>
          </>
        ))}
      </Grid>

      <Box mt={8}>
        <RelatedProducts products={relatedProducts} />
      </Box>
    </Container>
    </>
  );
};

export default ProductDetails;
