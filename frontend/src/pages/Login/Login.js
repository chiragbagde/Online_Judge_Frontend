import React, { useRef, useState } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  CircularProgress,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../features/auth/authSlice";
import axios from "axios";
import { urlConstants } from "../../apis";
import { toast } from "react-toastify";
import logoImage from "../../images/logo.png";
import bgImg from "../../images/onboarding.png";
import { useNavigate, useLocation } from "react-router-dom";
import useGoogleSignIn from "./hooks/use-google-signin.hook";
import GoogleButton from "./components/google-button";
import MicrosoftButton from "./components/microsoft-button";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#3F51B5" },
    secondary: { main: "#9c27b0" },
  },
  shape: { borderRadius: 8 },
  typography: {
    h5: { fontWeight: 600 },
  },
});

export default function SignIn() {

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const code = React.useMemo(() => {
    if (location.hash && location.hash.includes('code=')) {
      const hash = location.hash.substring(1);
      const params = new URLSearchParams(hash);
      return params.get('code');
    }
    return null;
  }, [location.hash]);

  const { handleGoogleSignIn } = useGoogleSignIn(setLoading);
  const [microsoftLoading, setMicrosoftLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const data = new FormData(formRef.current);

    try {
      const response = await axios.post(urlConstants.loginUser, {
        email: data.get("email"),
        password: data.get("password"),
      });

      const { user, token } = response.data;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      dispatch(loginSuccess({ user, token }));
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Incorrect email or password!");
    } finally {
      setLoading(false);
    }
  };

  // Handle Microsoft OAuth code exchange
  // React.useEffect(() => {
  //   const handleMicrosoftLogin = async () => {
  //     if (!code) return;
      
  //     setLoading(true);
  //     try {
  //       const response = await axios.post(urlConstants.loginMicrosoft, { code });
  //       const { user, token } = response.data;
        
  //       if (user && token) {
  //         localStorage.setItem('auth', JSON.stringify({ user, token }));
  //         dispatch(loginSuccess({ user, token }));
  //         toast.success('Logged in with Microsoft!');
  //         navigate('/');
  //       } else {
  //         throw new Error('Invalid response from server');
  //       }
  //     } catch (error) {
  //       console.error('Microsoft login failed:', error);
  //       toast.error('Microsoft login failed. Please try again.');
  //     } finally {
  //       setLoading(false);
  //       // Clean up the URL
  //       window.history.replaceState(null, '', window.location.pathname);
  //     }
  //   };

  //   handleMicrosoftLogin();
  // }, [code, dispatch, navigate]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `url(${bgImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          p: 2,
        }}
      >
        <Container
          maxWidth="xs"
          sx={{
            bgcolor: "rgba(0,0,0,0.7)",
            py: 1,
            px: 3,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Avatar
              src={logoImage}
              sx={{
                width: 80,
                height: 80,
                bgcolor: "transparent",
              }}
              variant="rounded"
            />
          </Box>

          <Typography variant="h5" align="center" gutterBottom>
            Sign In
          </Typography>

          <Box
            component="form"
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              InputLabelProps={{ style: { fontSize: "1.5rem" } }}
              defaultValue="test@gmail.com"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              InputLabelProps={{ style: { fontSize: "1.5rem" } }}
              defaultValue="Test@123"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                mt: 2,
                py: 1,
                fontWeight: "bold",
                borderRadius: 2,
                boxShadow: "none",
                transition: "box-shadow 0.3s ease-in-out",
                "&:hover": {
                  boxShadow: "0 0 10px 2px #39ff14",
                },
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <Typography variant="h6">Sign In</Typography>
              )}
            </Button>
            <Box
              sx={{
                mt: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                flexDirection: "column",
              }}
            >
              <Typography variant="h6" color="text.secondary">
                or
              </Typography>

              <GoogleButton handleGoogleSignIn={handleGoogleSignIn} />
              <MicrosoftButton loading={microsoftLoading} setLoading={setMicrosoftLoading} />
            </Box>

            <Box
              sx={{
                mt: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Don't have an account?
                <Button
                  onClick={() => navigate("/signup")}
                  variant="text"
                  size="small"
                  sx={{ textTransform: "none", ml: 1 }}
                >
                  <Typography sx={{ color: "primary.main" }} variant="h6">
                    Sign Up
                  </Typography>
                </Button>
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Forgot your password?
                <Button
                  onClick={() => navigate("/forgot-password")}
                  variant="text"
                  size="small"
                  sx={{ textTransform: "none", ml: 1 }}
                >
                  <Typography sx={{ color: "primary.main" }} variant="h6">
                    Reset Password
                  </Typography>
                </Button>
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ textAlign: "center", py: 2 }}>
        <Typography variant="body2" color="textSecondary">
          © {new Date().getFullYear()} Coding Platform. All rights reserved.
        </Typography>
      </Box>
    </ThemeProvider>
  );
}
