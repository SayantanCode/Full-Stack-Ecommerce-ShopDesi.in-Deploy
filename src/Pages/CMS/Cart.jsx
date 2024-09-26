import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  Grid,
  Paper,
  Skeleton,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCart, increaseCart, removeCart, substractCart } from "../../Redux/Slice/viewSlice";
import {getUserProfile} from "../../Redux/Slice/authSlice";
const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, cartChange} = useSelector((state) => state.View);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    dispatch(getCart())
    .unwrap()
    .then((response) => {
      setLoading(false);
    })
    .catch((error) => {
      toast.error(error.message)
    });
    window.scrollTo(0, 0);
  },[])

  const handleAddItem = (id) => {
    dispatch(increaseCart(id))
    .unwrap()
    .then((response) => {
      if(!response.success){
        toast.error(`${response.message}.Please try again.`);
      }
      else {
        toast.success(response.message);
        dispatch(getCart());
      }
    })
  };

  const handleSubstractItem = (id) => {
    dispatch(substractCart(id))
    .unwrap()
    .then((response) => {
      if(!response.success){
        toast.error(`${response.message}.Please try again.`);
      }
      else {
        toast.success(response.message);
        dispatch(getCart());
      }
    })
  };
  const handleRemoveItem = (id) => {
    dispatch(removeCart(id))
    .unwrap()
    .then((response) => {
      if(!response.success){
        toast.error(`${response.message}.Please try again.`);
      }
      else {
        toast.success(response.message);
        dispatch(getCart());
      }
    })
  }
  
  const handlePlaceOrder = () => {
    dispatch(getUserProfile()) // Dispatch getUser to check user details
      .unwrap()
      .then((response) => {
        if(response.success){
          if (response.data.address && response.data.phone) {
            navigate("/checkout"); // Navigate to CheckoutPage if user has address
          } else {
            navigate("/user/profile"); // Navigate to Profile if no address
            toast.info("Please complete your profile by adding an address and phone number before placing an order.");
          }
        }
        else {
          toast.error(response.message);
        }
      })
      .catch((error) => toast.error(error.message));
  };

  

  return (
    <Box p={2} mt={10}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h5" mb={2}>
              Your Shopping Cart
            </Typography>
            <Divider sx={{ mb: 2, borderColor: "grey.500" }} />

            {loading
              ? Array.from(new Array(2)).map((_, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", mb: 2 }}>
                      <Skeleton variant="rectangular" width={100} height={100} />
                      <Box sx={{ flexGrow: 1, ml: 2 }}>
                        <Skeleton variant="text" width="80%" />
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" width="40%" />
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        justifyContent: "flex-end",
                        mt: 1,
                        mb: 2,
                        pr: 3,
                      }}
                    >
                      <Skeleton variant="rectangular" width={30} height={30} />
                      <Skeleton variant="rectangular" width={40} height={40} />
                      <Skeleton variant="rectangular" width={30} height={30} />
                    </Box>
                    <Divider sx={{ mb: 2, borderColor: "grey.500" }} />
                  </Box>
                ))
              : Object.keys(cart).length>0 && cart.cart.length>0? cart.cart.map((item) => (
                  <>
                    <Box key={item.id} sx={{ display: "flex", mb: 2 }}>
                      <img
                        src={item.image[0]}
                        alt={item.name}
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: "cover",
                          marginRight: 16,
                        }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6">{item.name}</Typography>
                        <Typography
                          sx={{ color: "#888" }}
                          component="span"
                          // variant="body2"
                        >
                          MRP:-
                        </Typography>
                        <Typography
                          sx={{ color: "#888", textDecoration: "line-through" }}
                          component="span"
                        >
                          ₹{item.mrp}
                        </Typography>
                        <Typography variant="h6">
                          ₹{item.sellingPrice}{" "}
                          <Typography
                            component="span"
                            sx={{ color: "secondary.main", fontWeight: "bold" }}
                          >
                            {" "}
                            ({item.discount}% Off){" "}
                          </Typography>
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        justifyContent: "flex-end",
                        mt: 1,
                        mb: 2,
                        pr: 3,
                      }}
                    >
                      <Button variant="text" onClick={() => handleRemoveItem(item._id)}>
                        Remove
                      </Button>
                      <IconButton
                        onClick={() => handleSubstractItem(item._id)}
                        disabled={item.quantity === 1 || cartChange}
                        sx={{ border: 1, p: 1, borderRadius: "50%" }}
                      >
                        <Remove />
                      </IconButton>
                      <Box
                        sx={{
                          width: "40px",
                          height: "40px",
                          border: 1,
                          p: 1,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body1">
                          {item.quantity}
                        </Typography>
                      </Box>
                      <IconButton
                        onClick={() => handleAddItem(item._id)}
                        // disabled={item.quantity >= 5}
                        disabled={cartChange}
                        sx={{ border: 1, p: 1, borderRadius: "50%" }}
                      >
                        <Add />
                      </IconButton>
                    </Box>
                    <Divider sx={{ mb: 2, borderColor: "grey.500" }} />
                  </>
                )):
                <Typography variant="h6" sx={{ textAlign: "center" }}>
                  Your cart is empty
                </Typography>
            }
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handlePlaceOrder} // Trigger handlePlaceOrder on click
              disabled={loading || Object.keys(cart).length>0 && cart.cart.length === 0}
            >
              Place Order
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{ p: 2, position: { lg: "sticky" }, top: 0 }}
          >
            <Typography variant="h6">Price Details</Typography>
            <Divider sx={{ my: 1, borderColor: "grey.500" }} />
            {loading ? (
              <>
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="80%" />
                <Divider sx={{ my: 1, borderColor: "grey.500" }} />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="80%" />
              </>
            ) : (
              <>
                <Typography>
                  Price ({Object.keys(cart).length>0 && cart.cart.reduce((a,b)=>a+b.quantity,0)} item
                  {Object.keys(cart).length>0 && cart.cart.length > 1 ? "s" : ""}): ₹
                  {Object.keys(cart).length>0 &&
                    cart.cart.reduce((a, b) => a + b.mrp * b.quantity, 0)}
                </Typography>
                <Typography>Discount: {Object.keys(cart).length>0 && cart.cart.length>0 &&
                  Math.round((((cart.cart.reduce((a, b) => a + b.mrp * b.quantity, 0))-(cart.totalPrice))/(cart.cart.reduce((a, b) => a + b.mrp * b.quantity, 0))*100)*100)/100||0}%</Typography>
                <Typography>Delivery Charges: Free</Typography>
                <Divider sx={{ my: 1, borderColor: "grey.500" }} />
                <Typography variant="h6">
                  Total Amount: ₹{Object.keys(cart).length>0 &&
                    cart.cart.reduce((a, b) => a + b.sellingPrice * b.quantity, 0)}
                </Typography>
                <Typography
                  sx={{ color: "secondary.main", fontWeight: "bold" }}
                >
                  You will save ₹{cart.cart.reduce((a, b) => a + b.mrp * b.quantity, 0)-cart.totalPrice} on this order
                </Typography>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
      <ToastContainer />
    </Box>
  );
};

export default CartPage;
