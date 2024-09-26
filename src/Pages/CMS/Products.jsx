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
  Chip,
  useTheme,
  Pagination
} from "@mui/material";
import {
  ViewModule,
  ViewList,
  KeyboardArrowDown,
  AddShoppingCartOutlined,
} from "@mui/icons-material";
import FilterDrawer from "./FiltersSmallerDevice";
import FiltersDesktop from "./FiltersDesktop";
import { useSelector, useDispatch } from "react-redux";
import { createCart, getCart, getProducts } from "../../Redux/Slice/viewSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import {useMediaQuery} from "@mui/material"

const ProductPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { productLoading, productsData, cartLoading } = useSelector(
    (state) => state.View
  );
  const { isAuthenticated } = useSelector((state) => state.Auth);
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery('(max-width:900px)'); // adjust breakpoint
  const theme = useTheme();
  const [viewStyle, setViewStyle] = useState("grid");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [filters, setFilters] = useState();
  useEffect(()=>{
    dispatch(getCart())
  },[])
  // useEffect(() => {
  //   const searchParams = new URLSearchParams(location.search);
  //   const search = searchParams.get("search");
  //   if (search) {
  //     dispatch(getProducts({ search }));
  //   }
  // }, [location.search, dispatch]);
  // useEffect(() => {
  //   const categoryParams = new URLSearchParams(location.search);
  //   const category = categoryParams.get("category");
  //   if (category) {
  //     dispatch(getProducts({ category }));
  //   }
  // }, [location.search, dispatch]);
  // useEffect(() => {
  //   dispatch(getProducts({ page, limit }));
  // },[page, limit])
  useEffect(() => {
    toast.info("Note: Click on product image to view details.", {
      position: "top-center",
      autoClose: 6000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "light",
    });
    window.scrollTo(0, 0);
  }, [page]);

  const [cartLoadIndex, setCartLoadIndex] = useState();
  const handleAddToCart = (productId, index) => {
    if (!isAuthenticated) {
      toast.error(
        "Please login to add product to cart. Redirecting to login page..."
      );
      setTimeout(() => {
        navigate("/user/login");
      }, 2000);
      return;
    }
    setCartLoadIndex(index);
    dispatch(createCart(productId))
      .unwrap()
      .then((response) => {
        if (!response.success) {
          toast.error(`${response.message}. Please try again.`);
        } else {
          toast.success(response.message);
          navigate("/cart");
          dispatch(getCart());
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("An error occurred. Please try again.");
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
  const handlePageChange = (event, page) => {
    setPage(page);
    // dispatch(getProducts({ page: page, limit: limit }));
  };
  return (
    <>
      <ToastContainer />
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
          <Typography sx={{ color: "text.primary" }}>
            {Object.keys(productsData).length > 0 &&
              `Showing ${productsData.showing} of ${productsData.totalProducts} products found`}
          </Typography>
          <Typography  sx={{ ml: 2 }}>
                <Button onClick={()=> {setFilters(false);}}>
                  Show All
                </Button>
              </Typography>
          <Button
            sx={{
              backgroundColor: "secondary.main",
              color: "text.primary",
              borderRadius: "5px",
              textTransform: "none",
            }}
            onClick={handleFilterDrawerToggle}
            endIcon={
              <KeyboardArrowDown
                sx={{
                  transform: filterDrawerOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "all 0.3s",
                }}
              />
            }
          >
            Filter
          </Button>
        </Box>

        {isSmallScreen && <FilterDrawer
          filterDrawerOpen={filterDrawerOpen}
          handleFilterDrawerClose={handleFilterDrawerClose}
          handleFilterDrawerToggle={handleFilterDrawerToggle}
          page={page}
          setPage={setPage} 
          filters={filters} 
          setFilters={setFilters}
          limit={limit}
        />}

        {/* Product Grid */}
        <Grid container spacing={0} sx={{ width: "100%" }}>
          <Grid
            item
            pl={2}
            xs={3}
            sx={{ display: { xs: "none", md: "block" }, width: "100%" }}
          >
            {!isSmallScreen && <FiltersDesktop page={page} limit={limit} setPage={setPage} filters={filters} setFilters={setFilters} />}
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
              <Typography>
                {Object.keys(productsData).length > 0 &&
                  `Showing ${productsData.showing} of ${productsData.totalProducts} products found`}
              </Typography>
              
              <Box display="flex">
              <Typography  sx={{ ml: 2 }}>
                <Button onClick={()=> {setFilters(false)}}>
                  Show All
                </Button>
              </Typography>
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
                      <Card
                        sx={{
                          maxWidth: "100%",
                          boxShadow: 3,
                          borderRadius: 2,
                          transition: "transform 0.3s, box-shadow 0.3s",
                          "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: 6,
                          },
                        }}
                      >
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
                  Object.keys(productsData).length > 0 &&
                  productsData.products.map((product, index) => (
                    <Grid
                      item
                      lg={viewStyle === "grid" ? 3 : 12}
                      md={viewStyle === "grid" ? 4 : 12}
                      sm={4}
                      xs={6}
                      key={product._id}
                    >
                      {viewStyle === "list" ? (
                        <Card
                          sx={{
                            display: "flex",
                            position: "relative",
                            boxShadow: 3,
                            borderRadius: 2,
                            transition: "transform 0.3s, box-shadow 0.3s",
                            "&:hover": {
                              transform: "translateY(-5px)",
                              boxShadow: 6,
                            },
                          }}
                        >
                          <Box
                            sx={{
                              position: "relative",
                              width: 200,
                              flexShrink: 0,
                              backgroundColor:
                                theme.palette.mode === "light"
                                  ? theme.palette.grey[100]
                                  : theme.palette.grey[900],
                            }}
                          >
                            <CardMedia
                              component="img"
                              image={product.image[0]}
                              alt={product.name}
                              sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                                cursor: "pointer",
                                p: 1,
                              }}
                              loading="lazy"
                              onClick={() => navigate(`/products/${product._id}`)}
                            />
                            {/* Discount Badge */}
                            {product.discount > 0 && (
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: 8,
                                  right: 8,
                                  backgroundColor: "secondary.main",
                                  color: "white",
                                  p: 0.5,
                                  borderRadius: 1,
                                  fontSize: "0.75rem",
                                }}
                              >
                                {product.discount}% OFF
                              </Box>
                            )}
                          </Box>
                          <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
                            <CardContent>
                              <Typography variant="h6" sx={{ mb: 1 }}>
                                {product.name}
                                {product.dealEnd && (
                                  <Chip
                                    label="ON SALE"
                                    color="error"
                                    size="small"
                                    sx={{
                                      ml: 1,
                                      verticalAlign: "middle",
                                    }}
                                  />
                                )}
                              </Typography>
                              <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                                <Typography variant="h6" color="secondary">
                                  ₹{product.sellingPrice}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                  component="span"
                                  sx={{
                                    textDecoration: "line-through",
                                    marginLeft: 1,
                                  }}
                                >
                                  ₹{product.mrp}
                                </Typography>
                              </Box>
                              <Rating
                                name="read-only"
                                value={product.rating}
                                readOnly
                                size="small"
                                sx={{ mb: 1 }}
                              />
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                component="p"
                                sx={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }}
                              >
                                {product.description}
                              </Typography>
                            </CardContent>
                            <CardActions>
                              {product.stock ? (
                                <Button
                                  variant="contained"
                                  color="primary"
                                  startIcon={<AddShoppingCartOutlined />}
                                  onClick={() => handleAddToCart(product._id, index)}
                                  disabled={cartLoadIndex === index && cartLoading}
                                  sx={{ mt: "auto", width: "100%" }}
                                >
                                  {cartLoadIndex === index && cartLoading
                                    ? "Adding..."
                                    : "Add to Cart"}
                                </Button>
                              ) : (
                                <Button
                                  variant="contained"
                                  color="primary"
                                  disabled
                                  sx={{ mt: "auto", width: "100%" }}
                                >
                                  Out of Stock
                                </Button>
                              )}
                            </CardActions>
                          </Box>
                        </Card>
                      ) : (
                        <Card
                          sx={{
                            maxWidth: "100%",
                            position: "relative",
                            boxShadow: 3,
                            borderRadius: 2,
                            transition: "transform 0.3s, box-shadow 0.3s",
                            "&:hover": {
                              transform: "translateY(-5px)",
                              boxShadow: 6,
                            },
                          }}
                        >
                          <Box
                            sx={{
                              position: "relative",
                              height: 200,
                              backgroundColor:
                                theme.palette.mode === "light"
                                  ? theme.palette.grey[100]
                                  : theme.palette.grey[900],
                            }}
                          >
                            <CardMedia
                              component="img"
                              image={product.image[0]}
                              alt={product.name}
                              sx={{
                                height: "100%",
                                width: "100%",
                                objectFit: "contain",
                                cursor: "pointer",
                                p: 1,
                              }}
                              loading="lazy"
                              onClick={() => navigate(`/products/${product._id}`)}
                            />
                            {/* Discount Badge */}
                            {product.discount > 0 && (
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: 8,
                                  right: 8,
                                  backgroundColor: "secondary.main",
                                  color: "white",
                                  p: 0.5,
                                  borderRadius: 1,
                                  fontSize: "0.75rem",
                                }}
                              >
                                {product.discount}% OFF
                              </Box>
                            )}
                          </Box>

                          <CardContent>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                              {product.name}
                              {product.dealEnd && (
                                <Chip
                                  label="ON SALE"
                                  color="error"
                                  size="small"
                                  sx={{
                                    ml: 1,
                                    verticalAlign: "middle",
                                  }}
                                />
                              )}
                            </Typography>
                            <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                              <Typography variant="h6" color="secondary">
                                ₹{product.sellingPrice}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                component="span"
                                sx={{
                                  textDecoration: "line-through",
                                  marginLeft: 1,
                                }}
                              >
                                ₹{product.mrp}
                              </Typography>
                            </Box>
                            <Rating
                              name="read-only"
                              value={product.rating}
                              readOnly
                              size="small"
                              sx={{ mb: 1 }}
                            />
                          </CardContent>
                          <CardActions>
                            {product.stock ? (
                              <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddShoppingCartOutlined />}
                                sx={{ width: "100%" }}
                                onClick={() => handleAddToCart(product._id, index)}
                                disabled={cartLoadIndex === index && cartLoading}
                              >
                                {cartLoadIndex === index && cartLoading
                                  ? "Adding..."
                                  : "Add to Cart"}
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                color="primary"
                                disabled
                                sx={{ width: "100%" }}
                              >
                                Out of Stock
                              </Button>
                            )}
                          </CardActions>
                        </Card>
                      )}
                    </Grid>
                  ))}
                  {/* pagination component */}
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Pagination
              count={productsData?.totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              sx={{ mt: 2 }}
            />
          </Grid>
            </Grid>
          </Grid>
          
        </Grid>
      </Box>
    </>
  );
};

export default ProductPage;
