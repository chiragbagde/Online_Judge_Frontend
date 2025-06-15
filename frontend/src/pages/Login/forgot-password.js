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
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../features/auth/authSlice";
import axios from "axios";
import { urlConstants } from "../../apis";
import { toast } from "react-toastify";
import logoImage from "../../images/logo.png";
import bgImg from "../../images/onboarding.png";
import { useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";

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
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState(""); 
  const [otp, setOtp] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(urlConstants.verifyOtp, {
        email,
        otp,
      });
      toast.success("OTP verified! Please set your new password.");
      setShowPasswordFields(true);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Invalid OTP!");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(urlConstants.resetPassword, {
        email,
        password,
      });
      
      localStorage.setItem("user", JSON.stringify({ user: res.data.user }));
      localStorage.setItem("token", res.data.token);
      dispatch(loginSuccess({ user: res.data.user }));
      toast.success("Password reset successful! Signing you in...");
      navigate("/");
    } catch (err) {
      console.error(err.response.data);
      if (err.response?.data === "Password is already used."){
        toast.error("Password is already used. Please try a different password.");
      } else
        toast.error(err.response?.data?.error || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  const verifyEmailAddress = async () => {
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(urlConstants.resendOTP, {
        email: email,
      });
      setShowOtpInput(true);
      toast.success("OTP sent to your email address.");
    } catch (e) {
      console.error(e);
      toast.error("Error verifying email address.");
    } finally {
      setLoading(false);
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
        }}
      >
        <Container
          maxWidth="xs"
          sx={{
            bgcolor: "background.paper",
            py: 2,
            px: 3,
            borderRadius: 3,
            boxShadow: 6,
            border: `1.5px solid ${theme.palette.primary.main}`,
            backdropFilter: 'blur(2px)',
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

          <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
            Reset Your Password
          </Typography>

          <Box
            component="form"
            ref={formRef}
            onSubmit={showPasswordFields ? handlePasswordReset : handleSubmit}
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
              InputLabelProps={{ style: { fontSize: "1.1rem" } }}
              disabled={showPasswordFields}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={verifyEmailAddress} variant="text" disabled={showPasswordFields}>
              Send OTP to email
            </Button>
            {/* OTP Input and Verify Button */}
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
                    py: 1,
                    fontWeight: "bold",
                    borderRadius: 2,
                    boxShadow: "none",
                    fontSize: '1.1rem',
                    letterSpacing: 1,
                    transition: "box-shadow 0.3s ease-in-out",
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <Typography variant="h6">Verify OTP</Typography>
                  )}
                </Button>
              </>
            )}
            {/* Password Fields and Reset Button */}
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
                    fontSize: '1.1rem',
                    letterSpacing: 1,
                    transition: "box-shadow 0.3s ease-in-out",
                    '&:hover': {
                      boxShadow: '0 0 10px 2px #39ff14',
                    },
                  }}
                  disabled={loading}
                >
                  {loading ? (
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
