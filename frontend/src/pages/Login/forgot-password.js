import React, { useRef, useState } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Paper,
  Fade,
  Snackbar,
  Stack,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../features/auth/authSlice";
import { toast } from "react-toastify";
import logoImage from "../../images/logo.png";
import bgImg from "../../images/onboarding.png";
import { useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import { 
  useVerifyOtpMutation, 
  useResetPasswordMutation, 
  useResendOtpMutation 
} from "../../apis/authApi";

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

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState(""); 
  const [otp, setOtp] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  // RTK Query hooks
  const [verifyOtp, { isLoading: verifyLoading, error: verifyError }] = useVerifyOtpMutation();
  const [resetPassword, { isLoading: resetLoading, error: resetError }] = useResetPasswordMutation();
  const [resendOtp, { isLoading: resendLoading, error: resendError }] = useResendOtpMutation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await verifyOtp({
        email,
        otp,
      }).unwrap();
      
      toast.success("OTP verified! Please set your new password.");
      setShowPasswordFields(true);
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error(error.data?.message || "Invalid OTP!");
    }
  };

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    
    try {
      const result = await resetPassword({
        email,
        password,
      }).unwrap();
      
      localStorage.setItem("user", JSON.stringify({ user: result.user }));
      localStorage.setItem("token", result.token);
      dispatch(loginSuccess({ user: result.user }));
      toast.success("Password reset successful! Signing you in...");
      navigate("/");
    } catch (error) {
      console.error('Password reset error:', error);
      if (error.data === "Password is already used.") {
        toast.error("Password is already used. Please try a different password.");
      } else {
        toast.error(error.data?.message || "Failed to reset password.");
      }
    }
  };

  const verifyEmailAddress = async () => {
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    
    try {
      await resendOtp({ email }).unwrap();
      setShowOtpInput(true);
      toast.success("OTP sent to your email address.");
    } catch (error) {
      console.error('Email verification error:', error);
      toast.error(error.data?.message || "Error verifying email address.");
    }
  };

  const isLoading = verifyLoading || resetLoading || resendLoading;

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
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              maxWidth: "xs",
              width: "100%",
              bgcolor: "background.paper",
              py: 3,
              px: 4,
              borderRadius: 3,
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              backdropFilter: 'blur(10px)',
              border: `1.5px solid ${theme.palette.primary.main}`,
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
                Reset Your Password
              </Typography>

              <Box
                component="form"
                ref={formRef}
                onSubmit={showPasswordFields ? handlePasswordReset : handleSubmit}
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
                    disabled={showPasswordFields}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    onClick={verifyEmailAddress} 
                    variant="text" 
                    disabled={showPasswordFields || resendLoading}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    {resendLoading ? 'Sending...' : 'Send OTP to email'}
                  </Button>

                  {showOtpInput && !showPasswordFields && (
                    <>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>Enter OTP</Typography>
                        <OtpInput
                          value={otp}
                          onChange={setOtp}
                          numInputs={6}
                          isInputNum={true}
                          shouldAutoFocus={true}
                          separator={<span style={{ width: "8px" }}></span>}
                          renderInput={(props, idx) => (
                            <input
                              {...props}
                              style={{
                                border: "1px solid transparent",
                                borderRadius: "8px",
                                width: "54px",
                                height: "54px",
                                fontSize: "18px",
                                color: "#fff",
                                fontWeight: 400,
                                caretColor: "#3F51B5",
                                background: "#23272f",
                                marginRight: idx !== 5 ? 8 : 0,
                                textAlign: 'center',
                              }}
                              key={idx}
                            />
                          )}
                        />
                      </Box>
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
                        disabled={verifyLoading}
                      >
                        {verifyLoading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          <Typography variant="h6">Verify OTP</Typography>
                        )}
                      </Button>
                    </>
                  )}

                  {showPasswordFields && (
                    <>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="password"
                        label="New Password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
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
                        margin="normal"
                        required
                        fullWidth
                        id="confirmPassword"
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
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
                        disabled={resetLoading}
                      >
                        {resetLoading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          <Typography variant="h6">Reset Password</Typography>
                        )}
                      </Button>
                    </>
                  )}

                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6" color="text.secondary">
                      Go Back
                      <Button
                        onClick={() => navigate("/signin")}
                        variant="text"
                        size="small"
                        sx={{ textTransform: "none" }}
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
        </Fade>

        {(verifyError || resetError || resendError) && (
          <Snackbar
            open={!!(verifyError || resetError || resendError)}
            autoHideDuration={6000}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert 
              severity="error" 
              sx={{ width: '100%' }}
            >
              {verifyError?.data?.message || resetError?.data?.message || resendError?.data?.message || 'Operation failed'}
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
