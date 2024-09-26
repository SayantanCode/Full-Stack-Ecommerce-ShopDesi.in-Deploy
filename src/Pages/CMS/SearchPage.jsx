import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Typography,
  Button,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Rating,
  Tooltip,
  Skeleton,
  Chip
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import { ViewModule, ViewList, KeyboardArrowDown, AddShoppingCartOutlined } from "@mui/icons-material";
import FilterDrawer from "./FiltersSmallerDevice";
import FiltersDesktop from "./FiltersDesktop";
import {useSelector, useDispatch } from "react-redux";
import { createCart, getCart } from "../../Redux/Slice/viewSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductSearchPage = () => {
  const dispatch = useDispatch();
  const { productLoading, productsData, cartLoading } = useSelector((state) => state.View);
  const {isAuthenticated} = useSelector((state) => state.Auth);
  const navigate = useNavigate();
  const theme = useTheme();
  const [viewStyle, setViewStyle] = useState("grid");
  
 const [cartLoadIndex, setCartLoadIndex] = useState();
  const handleAddToCart = (product, index) => {
    if(!isAuthenticated){
      toast.error("Please login to add product to cart. Redirecting to login page... ");
      setTimeout(() => {
        navigate("/user/login");
      }, 2000);
      return
    }
    setCartLoadIndex(index);
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
  const handleViewChange = (style) => {
    setViewStyle(style);
  };

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const handleFilterDrawerToggle = () => {
    setFilterDrawerOpen(!filterDrawerOpen);
  };

  const handleFilterDrawerClose = () => {
    setFilterDrawerOpen(false);
  };

  // Simulate loading delay
  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoading(false); // Set loading to false after 2 seconds
  //   }, 2000); 
  // }, []);

  return (
    <>
    <ToastContainer/>
    <Box
      sx={{
        mt: 16,
        mb: 12,
        pr: 10,
        [theme.breakpoints.down("lg")]: { pr: 2 },
        [theme.breakpoints.down("md")]: { pr: 0 },
        width: "100%",
      }}
    >
      {/* Mobile Filters */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          justifyContent: "space-between",
          px: 4,
          py: 1,
          width: "100%",
          position: "fixed",
          top: { xs: "56px", sm: "64px" },
          zIndex: 100,
          backgroundColor: "background.paper",
          boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography variant="h6" sx={{ color: "text.primary" }}>
          {Object.keys(productsData).length>0 && `Showing ${productsData.showing} of ${productsData.totalProducts} products available in our store`}
        </Typography>
        <Button
          sx={{
            backgroundColor: filterDrawerOpen
              ? "secondary.main"
              : "secondary.main",
            color: "text.primary",
            borderRadius: "5px",
            textTransform: "none",
          }}
          onClick={handleFilterDrawerToggle}
          endIcon={
            filterDrawerOpen ? (
              <KeyboardArrowDown
                sx={{ transform: "rotate(180deg)", transition: "all 0.5s" }}
              />
            ) : (
              <KeyboardArrowDown sx={{ transition: "all 0.5s" }} />
            )
          }
        >
          Filter
        </Button>
      </Box>

      <FilterDrawer
        filterDrawerOpen={filterDrawerOpen}
        handleFilterDrawerClose={handleFilterDrawerClose}
        handleFilterDrawerToggle={handleFilterDrawerToggle}
      />

      {/* Product Grid */}
      <Grid container spacing={0} sx={{ width: "100%" }}>
        <Grid
          item
          pl={2}
          xs={3}
          sx={{ display: { xs: "none", md: "block" }, width: "100%" }}
        >
          <FiltersDesktop />
        </Grid>
        <Grid item md={9} sm={12} xs={12} sx={{ width: "100%" }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
            sx={{ display: { xs: "none", md: "flex" }, px: 5 }}
          >
            <Typography variant="h5">All Products</Typography>
            <Typography>{Object.keys(productsData).length>0 && `Showing ${productsData.showing} of ${productsData.totalProducts} products available in our store`}</Typography>
            <Box>
              <Tooltip title="Grid View">
                <IconButton onClick={() => handleViewChange("grid")}>
                  <ViewModule
                    color={viewStyle === "grid" ? "primary" : "inherit"}
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title="List View">
                <IconButton onClick={() => handleViewChange("list")}>
                  <ViewList
                    color={viewStyle === "list" ? "primary" : "inherit"}
                  />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Grid
            container
            spacing={{ xs: 1.5, sm: 2, md: 3 }}
            sx={{ px: { xs: 1, sm: 5, md: 5, lg: 5, xl: 5 } }}
          >
            {productLoading
              ? // Render Skeletons while loading
                Array.from(new Array(8)).map((_, index) => (
                  <Grid
                    item
                    lg={viewStyle === "grid" ? 3 : 12}
                    md={viewStyle === "grid" ? 4 : 12}
                    sm={4}
                    xs={6}
                    key={index}
                  >
                    <Card sx={{ maxWidth: "100%" }}>
                      <Skeleton variant="rectangular" height={150} />
                      <CardContent>
                        <Skeleton variant="text" height={30} />
                        <Skeleton variant="text" height={20} />
                        <Skeleton variant="text" height={20} width="80%" />
                      </CardContent>
                      <CardActions>
                        <Skeleton variant="rectangular" width="100%" height={36} />
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              : // Render products when not loading
                Object.keys(productsData).length>0 && productsData.products.map((product, index) => (
                  <Grid
                    item
                    lg={viewStyle === "grid" ? 3 : 12}
                    md={viewStyle === "grid" ? 4 : 12}
                    sm={4}
                    xs={6}
                    key={product._id}
                  >
                    {viewStyle === "list" ? (
                      <Card sx={{ display: "flex", position: "relative" }}>
                        <CardMedia
                          component="img"
                          image={product.image[0]}
                          alt={product.name}
                          sx={{ maxWidth: 200, "&:hover": { cursor: "pointer" }, }}
                          loading="lazy"
                          style={{ objectFit: "cover" }}
                          
                          onClick={() => navigate(`/products/${product.id}`)}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            backgroundColor: "secondary.main",
                            color: "white",
                            p: 1,
                            borderRadius: 1,
                          }}
                        >
                          {product.discount}% off
                        </Box>
                        <Box>
                        <CardContent> 
                          <Typography variant="h6">{product.name} {product.dealEnd && <Chip label="ON SALE" color="error" size="small" sx={{position: 'absolute', left: "0%", top: "0%", borderRadius:1}} />}</Typography>
                          <Box display="flex" alignItems="center">
                            <Typography variant="h6" color="secondary">
                            ₹{product.sellingPrice}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              component="span"
                              style={{
                                textDecoration: "line-through",
                                marginLeft: 8,
                              }}
                            >
                              ₹{product.mrp}
                            </Typography>
                          </Box>
                          <Rating
                            name="read-only"
                            value={product.rating}
                            readOnly
                          />
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                          >
                            {product.description}
                          </Typography>
                        </CardContent>
                        <CardActions>
                        {product.stock?<Button variant="contained" color="primary" startIcon={<AddShoppingCartOutlined />} onClick={()=>handleAddToCart(product._id, index)}>
                            {(cartLoadIndex === index && cartLoading ? "Adding..." : "Add to Cart")}
                          </Button>:<Button variant="contained" color="primary" disabled>Out of Stock</Button>}
                        </CardActions>
                        </Box>
                      </Card>
                    ) : (
                      <Card sx={{ maxWidth: "100%", position: "relative" }}>
                        <CardMedia
                          component="img"
                          image={product.image[0]}
                          alt={product.name}
                          sx={{
                            height: { xs: 150, sm: 150, md: 200 },
                            "&:hover": { cursor: "pointer" },
                          }}
                          loading="lazy"
                          style={{ objectFit: "cover" }}
                          onClick={() => navigate(`/products/${product._id}`)}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            backgroundColor: "secondary.main",
                            color: "white",
                            p: 1,
                            borderRadius: 1,
                          }}
                        >
                          {product.discount}% off
                        </Box>
                        
                        <CardContent>
                          <Typography variant="h6">{product.name}{product.dealEnd && <Chip label="ON SALE" color="error" sx={{position: 'absolute', top:0, left: 0, borderRadius: 1}} />}</Typography>
                          <Box display="flex" alignItems="center">
                            <Typography variant="h6" color="secondary">
                            ₹{product.sellingPrice}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              component="span"
                              style={{
                                textDecoration: "line-through",
                                marginLeft: 8,
                              }}
                            >
                              ₹{product.mrp}
                            </Typography>
                          </Box>
                          <Rating
                            name="read-only"
                            value={product.rating}
                            readOnly
                          />
                        </CardContent>
                        <CardActions>
                          {product.stock?<Button variant="contained" color="primary" startIcon={<AddShoppingCartOutlined />} sx={{ width: "100%" }} onClick={()=>handleAddToCart(product._id, index)}>
                          {cartLoadIndex === index && cartLoading ? "Adding..." : "Add to Cart"}
                          </Button>:<Button variant="contained" color="primary" disabled sx={{ width: "100%" }}>Out of Stock</Button>}
                        </CardActions>
                      </Card>
                    )}
                  </Grid>
                ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
    </>
  );
};

export default ProductSearchPage;
