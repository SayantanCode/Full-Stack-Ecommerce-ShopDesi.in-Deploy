import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseLine from "@mui/material/CssBaseline";
import { useMediaQuery } from "@mui/material";
import { GlobalStyles } from "@mui/system";
import { BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Pages/Layouts/header";
// import Footer from "./Pages/Layouts/footer";
import Home from "./Pages/CMS/Home";
// import About from "./Pages/About";
// import Contact from "./Pages/Contact";
import ProductPage from "./Pages/CMS/Products";
import ProductDetailPage from "./Pages/CMS/ProductDetails";
import Footer from "./Pages/Layouts/footer";
import CartPage from "./Pages/CMS/Cart";
// import Dashboard from "./Pages/CMS/ProfileDashboard";
import Loader from "./Pages/CMS/Loader";
import ProductReviewPage from "./Pages/CMS/ProductReview&Rating";
import OrderPage from "./Pages/CMS/OrdersPage";
import ContactPage from "./Pages/CMS/ContactPage";
import HomePage from "./Pages/CMS/Home";
import BlogPage from "./Pages/CMS/Blogs";
import SignupForm from "./Pages/CMS/SignUpForm";
import OTPVerification from "./Pages/CMS/OtpVerification";
import LoginForm from "./Pages/CMS/LoginForm";
import ForgotPasswordForm from "./Pages/CMS/ForgotPassword";
import Profile from "./Pages/CMS/Profile";
import CheckoutPage from "./Pages/CMS/CheckoutPage";
import NotFoundPage from "./Pages/CMS/NotFound";
export const lightTheme = createTheme({
  palette: {
    primary: {
      main: "#0077B6",
      contrastText: "#fff",
    },
    secondary: {
      main: "#FFC400",
      contrastText: "#000",
    },
    background: {
      default: "#F5F5F5",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#333333",
      secondary: "#666666",
    },
    action: {
      active: "rgba(0, 0, 0, 0.54)",
      disabled: "rgba(0, 0, 0, 0.26)",
      hover: "rgba(0, 0, 0, 0.08)",
    },
    input: {
      main: "#FFFFFF",
      border: "#CCCCCC",
      placeholder: "#AAAAAA",
    },
    button: {
      primary: {
        main: "#0077B6",
        contrastText: "#fff",
      },
      secondary: {
        main: "#FFC400",
        contrastText: "#000",
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#66d9ef", // Brighter primary color
    },
    secondary: {
      main: "#ffc107", // Lighter secondary color
    },
    background: {
      default: "#2f3436", // Darker background color
      paper: "#3f4547", // Darker paper color
    },
    text: {
      primary: "#f8f9fa", // Lighter primary text color
      secondary: "#b1b3b5", // Lighter secondary text color
    },
    action: {
      active: "#f8f9fa", // Lighter active color
      disabled: "#6c757d", // Darker disabled color
      hover: "#b1b3b5", // Lighter hover color
    },
    input: {
      main: "#3f4547", // Darker input background color
      border: "#6c757d", // Darker input border color
      placeholder: "#b1b3b5", // Lighter input placeholder color
    },
    button: {
      primary: {
        main: "#66d9ef", // Brighter primary button color
        contrastText: "#000", // Darker contrast text color
      },
      secondary: {
        main: "#f8f9fa", // Lighter secondary button color
        contrastText: "#000", // Darker contrast text color
      },
    },
  },
});
const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token"); // Retrieve token from session storage
  if (!token) {
    // If there's no token, redirect to login
    return <Navigate to="/user/login" />;
  }

  return children; // If authenticated, return the children components
};
const App = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [theme, setTheme] = useState(prefersDarkMode ? darkTheme : lightTheme);
  const [fade, setFade] = useState(false);
  const [loading, setLoading] = useState(false); // Add a loading state
  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 5000); // Simulate a 2-second loading time
  // }, []);

  const toggleTheme = () => {
    setFade(true);
    setTimeout(() => {
      if (theme === lightTheme) {
        setTheme(darkTheme);
      } else {
        setTheme(lightTheme);
      }
      setTimeout(() => {
        setFade(false);
      }, 500);
    }, 500);
  };
  return (
    <>
      <ThemeProvider theme={theme}>
      <GlobalStyles
          styles={{
            '::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '::-webkit-scrollbar-track': {
              background: '#ADD8E6',
              borderRadius: '10px',
            },
            '::-webkit-scrollbar-thumb': {
              backgroundColor: theme.palette.primary.main,
              borderRadius: '10px',
              border: `2px solid ${theme.palette.background.default}`,
            },
            '::-webkit-scrollbar-thumb:hover': {
              backgroundColor: theme.palette.primary.dark,
              cursor: 'pointer',
            },
          }}
        />
        <div
          style={{
            opacity: fade ? 0.2 : 1,
            transition: "opacity 500ms ease-in-out",
          }}
        >
          <CssBaseLine />
          {loading ? (
            <Loader />
          ) : (
            <BrowserRouter>
              <Header theme={theme} toggleTheme={toggleTheme} />
              <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/products" element={<ProductPage />} />
                {/* <Route path="/products/search" element={<SearchPage/>} /> */}
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="/order" element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />
                <Route path='/order/:id/review' element={<ProtectedRoute><ProductReviewPage /></ProtectedRoute>} />
                <Route path="/contact" element={<ContactPage theme={theme}/>} />
                {/* <Route path="/blogs" element={<BlogPage/>} /> */}
                <Route path="/user/signup" element={<SignupForm />} />
                <Route path="/user/email-verification-otp" element={<OTPVerification />} />
                <Route path="/user/login" element={<LoginForm />} />
                <Route path="/user/forgot-password" element={<ForgotPasswordForm />} />
                <Route path="/user/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="*" element={<NotFoundPage />} />   
              </Routes>
              <Footer />
            </BrowserRouter>
          )}
        </div>
      </ThemeProvider>
    </>
  );
};

export default App;
