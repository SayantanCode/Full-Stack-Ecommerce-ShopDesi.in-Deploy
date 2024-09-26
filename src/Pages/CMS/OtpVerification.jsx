import React, { useState, useRef, useCallback, useEffect } from "react";
import { Box, TextField, Button, Typography, Grid, Paper } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { verifyEmail } from "../../Redux/Slice/authSlice";
const OTPVerification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {loading} = useSelector((state) => state.Auth)
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const email = sessionStorage.getItem('userEmail')
  const inputRefs = useRef([]);

  const inputRefCallback = useCallback(
    (index) => (ref) => {
      if (ref) {
        inputRefs.current[index] = ref;
      }
    },
    []
  );
  useEffect(() => {
    inputRefs.current[0].focus();
  }, []);
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Move to next field
    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "") {
        if (index > 0) {
          inputRefs.current[index - 1].focus();
        }
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    dispatch(verifyEmail({email, otp: enteredOtp}))
    .unwrap()
    .then((payload) => {
        if(payload.success){
            toast.success(payload.message+'. Redirecting to login page in 3sec...')
            setTimeout(() => {
                navigate('/user/login');
            }, 3000);
        }
        else{
            toast.error(payload.message)
        }
    })
    .catch((error) => {
        toast.error(error.message)
    });
  };

  return (
    <>
      <ToastContainer/>
      <Grid
        container
        component="main"
        sx={{ height: "100vh" }}
        justifyContent="center"
        alignItems="center"
        style={{ background: "background.paper" }}
      >
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Verify OTP
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Box display="flex" justifyContent="space-between">
                {otp.map((data, index) => {
                  return (
                    <TextField
                      key={index}
                      inputProps={{
                        maxLength: 1,
                        style: { textAlign: "center", fontSize: "24px" },
                      }}
                      onChange={(e) => handleChange(e.target, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onMouseDown={(e) => e.preventDefault()}
                      onBlur={(e) => {
                        setTimeout(() => {
                          if (document.activeElement.tagName !== "INPUT") {
                            e.target.focus();
                          }
                        }, 0);
                      }}
                      autoComplete="off"                    
                      value={data}
                      sx={{
                        width: "50px",
                        marginRight: index !== 5 ? "10px" : "0",
                        "& input": {
                          caretColor: "transparent",
                          transition: "all 0.3s ease-in-out",
                          fontSize: "24px",
                          textAlign: "center",
                        },
                        "& input:focus": {
                            transform: "scale(2)",
                        }
                      }}
                      inputRef={inputRefCallback(index)}
                    />
                  );
                })}
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
              >
                Verify OTP
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default OTPVerification;
