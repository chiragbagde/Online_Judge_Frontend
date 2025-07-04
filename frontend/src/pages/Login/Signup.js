import React, { useRef, useState } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Box,
  Typography,
  Container,
  CircularProgress,
  Link,
  CardMedia,
  Stack,
  Paper,
  Fade,
  Alert,
  Snackbar,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import logoImage from "../../images/logo.png";
import bgImg from "../../images/onboarding.png";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../features/auth/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useGoogleSignIn from "./hooks/use-google-signin.hook";
import GoogleButton from "./components/google-button";
import VerifyOtp from "./verifyOtp";
import { useRegisterUserMutation } from "../../apis/authApi";

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

export default function SignUp() {
  const dispatch = useDispatch();
  const [showOtp, setShowOtp] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const formRef = useRef(null);
  const navigate = useNavigate();

  // RTK Query hooks
  const [registerUser, { isLoading: registerLoading, error: registerError }] = useRegisterUserMutation();

  const { handleGoogleSignIn } = useGoogleSignIn(() => {});

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(formRef.current);

    try {
      const result = await registerUser({
        email: data.get("email"),
        password: data.get("password"),
        firstname: data.get("firstname"),
        lastname: data.get("lastname"),
        username: data.get("username"),
      }).unwrap();
      
      toast.success("OTP sent to your email! Please verify to log in.");
      setUserEmail(result.email);
      setShowOtp(true);
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.data?.message || "Registration failed!");
    }
  };

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
        {showOtp ? (
          <VerifyOtp email={userEmail} />
        ) : (
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
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={logoImage}
                      alt="Platform Logo"
                      sx={{
                        maxWidth: "80px",
                      }}
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
                    Sign Up
                  </Typography>

                  <Box
                    component="form"
                    ref={formRef}
                    onSubmit={handleSubmit}
                    noValidate
                  >
                    <Stack spacing={2}>
                      <Stack direction="row" gap={2}>
                        <TextField
                          label="First Name"
                          name="firstname"
                          fullWidth
                          required
                          margin="normal"
                          InputLabelProps={{ style: { fontSize: "1.1rem" } }}
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
                          label="Last Name"
                          name="lastname"
                          fullWidth
                          required
                          margin="normal"
                          InputLabelProps={{ style: { fontSize: "1.1rem" } }}
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
                      </Stack>
                      
                      <TextField
                        label="Email Address"
                        name="email"
                        fullWidth
                        required
                        margin="normal"
                        InputLabelProps={{ style: { fontSize: "1.1rem" } }}
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
                        label="Password"
                        name="password"
                        type="password"
                        fullWidth
                        required
                        margin="normal"
                        InputLabelProps={{ style: { fontSize: "1.1rem" } }}
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
                        variant="contained"
                        color="primary"
                        fullWidth
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
                        disabled={registerLoading}
                      >
                        {registerLoading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          <Typography variant="h6">Sign Up</Typography>
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

                        <GoogleButton
                          handleGoogleSignIn={handleGoogleSignIn}
                        />
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="h6" color="text.secondary">
                          Already have an account?
                          <Button
                            onClick={() => navigate("/signin")}
                            variant="text"
                            size="small"
                            sx={{ textTransform: "none", ml: 1 }}
                          >
                            <Typography sx={{ color: "primary.main" }} variant="h6">
                              Sign In
                            </Typography>
                          </Button>
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              </Paper>
            </Container>
          </Fade>
        )}

        {registerError && (
          <Snackbar
            open={!!registerError}
            autoHideDuration={6000}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert 
              severity="error" 
              sx={{ width: '100%' }}
            >
              {registerError.data?.message || 'Registration failed'}
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
