import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
  CardMedia,
  Paper,
  Fade,
  Alert,
  Snackbar,
  Stack,
} from "@mui/material";
import { toast } from "react-toastify";
import bgImg from "../../images/onboarding.png";
import logoImage from "../../images/logo.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../features/auth/authSlice";
import { useVerifyOtpMutation } from "../../apis/authApi";

export default function VerifyOtp({ email }) {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // RTK Query hooks
  const [verifyOtp, { isLoading: verifyLoading, error: verifyError }] = useVerifyOtpMutation();

  const handleVerify = async () => {
    try {
      const result = await verifyOtp({
        email,
        otp,
      }).unwrap();

      localStorage.setItem("user", JSON.stringify({ user: result.user }));
      localStorage.setItem("token", result.token);
      dispatch(loginSuccess({ user: result.user }));
      toast.success("OTP Verified! Redirecting...");
      navigate("/");
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error(error.data?.message || "Invalid OTP!");
    }
  };

  return (
    <Box
      sx={{
        p: 2,
      }}
    >
      <Fade in timeout={800}>
        <Paper
          elevation={0}
          sx={{
            maxWidth: "xs",
            width: "100%",
            bgcolor: "rgba(0,0,0,0.8)",
            py: 3,
            px: 4,
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            minWidth: "30vw"
          }}
        >
          <Stack spacing={3}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 2,
              }}
            >
              <CardMedia
                component="img"
                image={logoImage}
                alt="Platform Logo"
                sx={{ maxWidth: "80px" }}
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
              Verify OTP
            </Typography>
            
            <Typography
              variant="body1"
              align="center"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Enter the 6-digit code sent to <strong>{email}</strong>
            </Typography>

            <TextField
              label="OTP"
              variant="outlined"
              fullWidth
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
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
                    borderColor: 'primary.main',
                  },
                }
              }}
            />

            <Button
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
              onClick={handleVerify}
              disabled={verifyLoading}
            >
              {verifyLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <Typography variant="h6">Verify</Typography>
              )}
            </Button>
          </Stack>
        </Paper>
      </Fade>

      {verifyError && (
        <Snackbar
          open={!!verifyError}
          autoHideDuration={6000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            severity="error" 
            sx={{ width: '100%' }}
          >
            {verifyError.data?.message || 'OTP verification failed'}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}
