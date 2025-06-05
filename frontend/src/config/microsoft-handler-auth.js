import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/auth/authSlice";
import { msalInstance } from "../config/auth";
import axios from "axios";
import { urlConstants } from "../apis";
import { toast } from "react-toastify";
import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingOverlay = () => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1400,
      color: 'white'
    }}
  >
    <CircularProgress color="inherit" size={60} thickness={4} />
    <Typography variant="h6" sx={{ mt: 2 }}>Signing in with Microsoft...</Typography>
  </Box>
);

export default function MicrosoftAuthHandler() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const handleRedirect = async () => {
      try {
        setIsLoading(true);
        await msalInstance.initialize();
        const response = await msalInstance.handleRedirectPromise();

        if (response) {
          const account = response.account;
          msalInstance.setActiveAccount(account);

          const tokenResponse = await msalInstance.acquireTokenSilent({
            scopes: ["openid", "profile", "email"],
            account,
          });

          const { data } = await axios.post(urlConstants.loginMicrosoft, {
            access_token: tokenResponse.accessToken,
            id_token: tokenResponse.idToken,
          });

          if (data.user && data.token) {
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);
            dispatch(loginSuccess({ user: data.user, token: data.token }));
            toast.success("Microsoft login successful");
            window.location.href = "/home";
          }
        } else {
          const accounts = msalInstance.getAllAccounts();
          if (accounts.length > 0) {
            msalInstance.setActiveAccount(accounts[0]);
          }
        }
      } catch (error) {
        console.error("Microsoft Redirect Login Error:", error);
        toast.error("Microsoft login failed: " + (error.message || "Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };

    handleRedirect();
  }, [dispatch]);
  
  if (isLoading) {
    return <LoadingOverlay />;
  }
  
  return null;
}
