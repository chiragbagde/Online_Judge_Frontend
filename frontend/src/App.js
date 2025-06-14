import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logout, setLoading } from "./features/auth/authSlice";
import React, { useEffect } from "react";
import Loader from "./pages/Loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { urlConstants } from "./apis";
import { getConfig } from "./utils/getConfig";
import { CheckOutlined, ErrorOutline, InfoOutlined, WarningOutlined } from "@mui/icons-material";
import { useTheme } from "@mui/material";
import { useIsSystemDarkMode, useTheme as useThemeContext } from "./ThemeContext";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { Suspense } from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig, msalInstance } from "./config/auth";
import { MsalProvider } from "@azure/msal-react";
import MicrosoftAuthHandler from "./config/microsoft-handler-auth";

function App() {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const { isSystemDarkMode } = useIsSystemDarkMode();
  const { themePref } = useThemeContext();

  const verifyUser = async () => {
  };
  
  useEffect(() => {
    const intervalId = setInterval(verifyUser, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [dispatch]);  

  useEffect(() => {
    verifyUser();
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => console.log("Service Worker registered with scope:", registration.scope))
        .catch((err) => console.error("Service Worker registration failed:", err));
    }
  }, []);

  if (loading) return <Loader />;

  return (
    <MsalProvider instance={msalInstance}>
    <MicrosoftAuthHandler />
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        icon={({ type }) => {
          switch (type) {
            case "success": return <CheckOutlined sx={{ color: palette.success.main }} />;
            case "info": return <InfoOutlined sx={{ color: palette.info.main }} />;
            case "warning": return <WarningOutlined sx={{ color: palette.warning.main }} />;
            case "error": return <ErrorOutline sx={{ color: palette.error.main }} />;
            default: return false;
          }
        }}
        theme={themePref === "system" ? (isSystemDarkMode ? "dark" : "light") : themePref}
        toastClassName="custom-toast"
      />
    </Suspense>
    </MsalProvider>
  );
}

export default App;
