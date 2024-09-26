import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Grid, Paper, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signUp } from '../../Redux/Slice/authSlice';

const SignupForm = () => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.Auth);
    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    // Password visibility state
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const handleMouseDownPassword = (event) => event.preventDefault();

    const handleSignupSubmit = (e) => {
        e.preventDefault();
        dispatch(signUp(user))
            .unwrap()
            .then((payload) => {
                if (payload.success) {
                    toast.success(payload.message + '. Redirecting to email verification in 3sec...');
                    sessionStorage.setItem("userEmail", user.email)
                    setTimeout(() => {
                        navigate('/user/email-verification-otp');
                    }, 3000);
                } else {
                    toast.error(payload.message);
                }
            })
            .catch((error) => {
                toast.error(error.message);
            });

        // Reset fields
        setUser({
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
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
                style={{ background: 'background.paper' }}
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
                        <Typography component="h1" variant="h5">
                            Signup
                        </Typography>
                        <Box component="form" onSubmit={handleSignupSubmit} sx={{ mt: 3 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Name"
                                autoComplete="name"
                                autoFocus
                                value={user.name}
                                onChange={(e) => setUser({ ...user, name: e.target.value })}
                                disabled={loading}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Email Address"
                                autoComplete="email"
                                value={user.email}
                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                                disabled={loading}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                value={user.password}
                                onChange={(e) => setUser({ ...user, password: e.target.value })}
                                disabled={loading}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Confirm Password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                value={user.confirmPassword}
                                onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                                disabled={loading}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleClickShowConfirmPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Signup'}
                            </Button>
                            <Typography variant="body2" color="primary.main" align="center">
                                <Link to="/user/login">Already have an account? Login</Link>
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};

export default SignupForm;
