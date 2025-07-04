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
  Alert,
  Snackbar,
  Fade,
  Paper,
  Stack,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../features/auth/authSlice";
import { toast } from "react-toastify";
import logoImage from "../../images/logo.png";
import bgImg from "../../images/onboarding.png";
import { useNavigate, useLocation } from "react-router-dom";
import useGoogleSignIn from "./hooks/use-google-signin.hook";
import GoogleButton from "./components/google-button";
import MicrosoftButton from "./components/microsoft-button";
import { useLoginUserMutation, useGoogleLoginMutation, useMicrosoftLoginMutation } from "../../apis/authApi";

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

  // RTK Query hooks
  const [loginUser, { isLoading: loginLoading, error: loginError }] = useLoginUserMutation();
  const [googleLogin, { isLoading: googleLoading, error: googleError }] = useGoogleLoginMutation();
  const [microsoftLogin, { isLoading: microsoftLoading, error: microsoftError }] = useMicrosoftLoginMutation();

  const [microsoftLoadingState, setMicrosoftLoadingState] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(formRef.current);

    try {
      const result = await loginUser({
        email: data.get("email"),
        password: data.get("password"),
      }).unwrap();

      const { user, token } = result;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      dispatch(loginSuccess({ user, token }));
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.data?.message || "Incorrect email or password!");
    }
  };

  const { handleGoogleSignIn } = useGoogleSignIn(setMicrosoftLoadingState);

  React.useEffect(() => {
    const handleMicrosoftLogin = async () => {
      if (!code) return;
      
      try {
        setMicrosoftLoadingState(true);
        const result = await microsoftLogin({ code }).unwrap();
        const { user, token } = result;
        
        if (user && token) {
          localStorage.setItem('auth', JSON.stringify({ user, token }));
          dispatch(loginSuccess({ user, token }));
          toast.success('Logged in with Microsoft!');
          navigate('/');
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error) {
        console.error('Microsoft login failed:', error);
        toast.error('Microsoft login failed. Please try again.');
      } finally {
        setMicrosoftLoadingState(false);
        window.history.replaceState(null, '', window.location.pathname);
      }
    };

    handleMicrosoftLogin();
  }, [code, dispatch, navigate, microsoftLogin]);

  const isLoading = loginLoading || googleLoading || microsoftLoading || microsoftLoadingState;

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
          py: 6,
        }}
      >
        <Fade in timeout={800}>
          <Container disableGutters>
            <Paper
              elevation={0}
              sx={{
                width: { xs: '100%', md: '70%', lg: '50%' },
                mx: 'auto',
                bgcolor: 'rgba(0,0,0,0.8)',
                py: 2.5,
                px: 3,
                borderRadius: 3,
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Stack spacing={3}>
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

                <Typography 
                  variant="h4" 
                  align="center" 
                  sx={{ 
                    fontWeight: 700, 
                    color: 'primary.main',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  Sign In
                </Typography>

                <Box
                  component="form"
                  ref={formRef}
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <Stack spacing={2}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      InputLabelProps={{ style: { fontSize: "1.1rem" } }}
                      defaultValue="test@gmail.com"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'rgba(255,255,255,0.2)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255,255,255,0.3)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                        }
                      }}
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
                      InputLabelProps={{ style: { fontSize: "1.1rem" } }}
                      defaultValue="Test@123"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'rgba(255,255,255,0.2)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255,255,255,0.3)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                        }
                      }}
                    />

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      sx={{
                        mt: 2,
                        py: 1.5,
                        fontWeight: "bold",
                        borderRadius: 2,
                        boxShadow: "none",
                        fontSize: '1.1rem',
                        letterSpacing: 1,
                        background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                          transform: 'translateY(-2px)',
                          boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
                        },
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        <Typography variant="h6">Sign In</Typography>
                      )}
                    </Button>

                    <Box
                      sx={{
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
                      <MicrosoftButton loading={microsoftLoadingState} setLoading={setMicrosoftLoadingState} />
                    </Box>

                    <Stack spacing={1}>
                      <Typography variant="h6" color="text.secondary" align="center">
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
                      <Typography variant="h6" color="text.secondary" align="center">
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
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          </Container>
        </Fade>

        {(loginError || googleError || microsoftError) && (
          <Snackbar
            open={!!(loginError || googleError || microsoftError)}
            autoHideDuration={6000}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert 
              severity="error" 
              sx={{ width: '100%' }}
            >
              {loginError?.data?.message || googleError?.data?.message || microsoftError?.data?.message || 'Authentication failed'}
            </Alert>
          </Snackbar>
        )}
      </Box>

      <Box component="footer" sx={{ textAlign: "center", py: 2 }}>
        <Typography variant="body2" color="textSecondary">
          © {new Date().getFullYear()} Coding Platform. All rights reserved.
        </Typography>
      </Box>
    </ThemeProvider>
  );
}
