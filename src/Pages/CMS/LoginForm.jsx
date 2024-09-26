import React, { useEffect, useState } from 'react';
import { Box, TextField, FormControlLabel, Checkbox, Button, Typography, CircularProgress, Grid, Paper, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, loginSuccess } from '../../Redux/Slice/authSlice';
import CryptoJS from 'crypto-js';
const LoginForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {loading, redirect, token} = useSelector((state) => state.Auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true); 
    const [showPassword, setShowPassword] = useState(false);
    useEffect(() => {
        if (token) {
            navigate('/');
        }
    },[token])
    useEffect(() => {
        const encryptedEmail = localStorage.getItem('userRememberEmail');
        const encryptedPassword = localStorage.getItem('userRememberPassword');
        if (encryptedEmail && encryptedPassword) {
          const decryptedEmail = CryptoJS.AES.decrypt(encryptedEmail, 'secretKey').toString(CryptoJS.enc.Utf8);
          const decryptedPassword = CryptoJS.AES.decrypt(encryptedPassword, 'secretKey').toString(CryptoJS.enc.Utf8);
          setEmail(decryptedEmail);
          setPassword(decryptedPassword);
          setRememberMe(true);
        }
      }, []);   
      useEffect(() => {
        if (!rememberMe) {
          if (localStorage.getItem('userRememberEmail') && localStorage.getItem('userRememberPassword')) {
            localStorage.removeItem('userRememberEmail');
            localStorage.removeItem('userRememberPassword');
          }
        }
      }, [rememberMe]);
      const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleLoginSubmit = (e) => {
        e.preventDefault();
        dispatch(login({email, password}))
        .unwrap()
        .then((payload) => {
            if(payload.success){
                toast.success(payload.message+'. Redirecting to homepage in 2sec...')
                sessionStorage.setItem('token', payload.data.token)
                sessionStorage.setItem('user', JSON.stringify(payload.data.user))
                dispatch(loginSuccess({token: payload.data.token, user: payload.data.user}))
                if (rememberMe) {
                    const encryptedEmail = CryptoJS.AES.encrypt(email, 'secretKey').toString();
                    const encryptedPassword = CryptoJS.AES.encrypt(password, 'secretKey').toString();
                    localStorage.setItem('userRememberEmail', encryptedEmail);
                    localStorage.setItem('userRememberPassword', encryptedPassword);
                }        
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            }
            else{
                toast.error(payload.message)
            }
        })
        .catch((error) => {
            toast.error(error.message)
        });
        // Reset fields
        if(!rememberMe) {
            setEmail('');
            setPassword('');
        }
    };

    return (
        <>
            <ToastContainer />
            <Grid
                container
                component="main"
                sx={{ mt:8, py: 5, px:3 }}
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
                            Login
                        </Typography>
                        <Box component="form" onSubmit={handleLoginSubmit} sx={{ mt: 3 }}>
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
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                            {/* remember me */}
                            <FormControlLabel
                                control={<Checkbox color="primary" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
                                label="Remember me"
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
                                {loading ? <CircularProgress size={24} /> : 'Login'}
                            </Button>
                            <Typography variant="body2" color="primary.main" align="center">
                            <Link to="/user/signup"> Don't have an account? Signup</Link>
                            </Typography>
                            <Typography variant="body2" mt={2} color="primary.main" align="center">
                            <Link to="/user/forgot-password">Forget Password?</Link>
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};

export default LoginForm;
