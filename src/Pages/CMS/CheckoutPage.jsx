import React, { useEffect, useState } from "react";
import { Box, Typography, Button, TextField, Paper, Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { createOrderWithRazorpay, getCart, verifyPayment } from "../../Redux/Slice/viewSlice";
import { getUserProfile } from "../../Redux/Slice/authSlice";

const CheckoutPage = () => {
  const { user } = useSelector((state) => state.Auth);
  const { cart } = useSelector((state) => state.View);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
      dispatch(getCart())
      dispatch(getUserProfile())
  },[])
  const [alternateAddress, setAlternateAddress] = useState({
    address: "",
    phone: "",
  });

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAlternateAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleProceedToPayment = async () => {
    const selectedAddress = alternateAddress.address ? alternateAddress : { address: user?.address, phone: user?.phone };

    try {
      // Step 1: Create order on the backend
      const orderData = {
        user: user?._id,
        orderItems: Object.keys(cart).length>0 && cart.cart.map((item) => ({ product: item._id, quantity: item.quantity, price: item.sellingPrice })),
        totalAmount: Object.keys(cart).length>0 && cart.totalPrice, // Total amount
        address: selectedAddress.address,
        phone: selectedAddress.phone,
      };

      // Replace axios with dispatch if needed in your app's architecture
        dispatch(createOrderWithRazorpay(orderData))
        .unwrap()
        .then((response) => {
            if(!response.success){
                toast.error(`${response.message}`);
            }
            else {
                // Step 2: Create the Razorpay options object
                const options = {
                    key: "rzp_test_xDtorWB2iU4yEf", // Replace with your Razorpay key
                    amount: response.data.amount, // Amount in paise
                    currency: "INR", // Currency code
                    name: "Shop Desi.in", // Replace with your business name
                    description: "Test Transaction",
                    order_id: response.data.orderId, // Order ID from the backend
                    handler: async (response) => {
                      try {
                        // Step 3: Verify payment on the backend
                        console.log(response);
                        const verificationData = {
                          orderId: response.razorpay_order_id,
                          paymentId: response.razorpay_payment_id,
                          signature: response.razorpay_signature,
                        };
            
                        // Replace axios with dispatch if needed in your app's architecture
                        dispatch(verifyPayment(verificationData))
                        .unwrap()
                        .then((response) => {
                            if(!response.success){
                                toast.error(`${response.message}.Please try again.`);
                            }
                            else {
                                toast.success("Payment successful! Order placed.");
                                navigate("/order"); // Redirect to orders page
                            }
                        })
                        
                      } catch (err) {
                        console.log(err);
                      }
                    },
                    prefill: {
                      name: user.name,
                      email: user.email,
                      contact: selectedAddress.phone,
                    },
                    theme: {
                      color: "#3399cc",
                    },
                  };
                  const paymentObject = new window.Razorpay(options);
      paymentObject.open();
            }
        })
        .catch((error) => {
            toast.error(error.message)
        });
    } catch (error) {
      toast.error("Error in proceeding to payment");
    }
  };

  return (
    <>
    <ToastContainer/>
    <Box p={2} mt={10}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h5" mb={2}>
          Checkout
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography variant="h6">Default Address:</Typography>
        <Typography>{user?.address}</Typography>
        <Typography>{user?.phone}</Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6">Deliver to Someone Else | Your Present Address Is Different?</Typography>
        <TextField
          label="New Address"
          name="address"
          fullWidth
          margin="normal"
          onChange={handleAddressChange}
        />
        <TextField
          label="Phone Number"
          name="phone"
          fullWidth
          margin="normal"
          onChange={handleAddressChange}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleProceedToPayment}
        >
          Proceed to Payment
        </Button>
      </Paper>
    </Box>
    </>
  );
};

export default CheckoutPage;
