import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, resetPassword } from '../../Redux/Slice/authSlice';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.Auth);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP, Step 3: Password Reset

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword({ email }))
      .unwrap()
      .then((response) => {
        if (response.success) {
          toast.success('OTP sent to your email.');
          setStep(2);
        } else {
          toast.error(response.message);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      })
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Password and confirm password do not match!");
      return;
    }

    dispatch(resetPassword({ email, otp, password }))
      .unwrap()
      .then((response) => {
        if (response.success) {
          toast.success('Password reset successful! Redirecting to login in 3sec...');
          localStorage.clear();
          sessionStorage.clear();
          setTimeout(() => {
              navigate('/user/login');
          }, 3000);
          // Optionally: Navigate to login page
        } else {
          toast.error(response.message);
          setStep(2); // Go back to OTP step in case of error
        }
      })
      .catch((error) => {
        toast.error(error.message);
      })
  };

  return (
    <>
      <ToastContainer />
      <Grid
        container
        component="main"
        sx={{ mt: 8, py: 5, px: 3 }}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {step === 1 && (
              <>
                <Typography component="h1" variant="h5">
                  Forgot Password
                </Typography>
                <Box component="form" onSubmit={handleEmailSubmit} sx={{ mt: 3 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Email Address"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Submit'}
                  </Button>
                </Box>
              </>
            )}

            {step === 2 && (
              <>
                <Typography component="h1" variant="h5">
                  Enter OTP
                </Typography>
                <Box component="form" onSubmit={(e) => { e.preventDefault(); setStep(3); }} sx={{ mt: 3 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={loading}
                  />
                  <Typography variant="body2" color="text.secondary" align="center">
                    Complete this step and next one within 5 minutes to reset your password.
                  </Typography>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Submit OTP'}
                  </Button>
                </Box>
              </>
            )}

            {step === 3 && (
              <>
                <Typography component="h1" variant="h5">
                  Reset Password
                </Typography>
                <Box component="form" onSubmit={handleOtpSubmit} sx={{ mt: 3 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="New Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Reset Password'}
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default ForgotPasswordForm;
