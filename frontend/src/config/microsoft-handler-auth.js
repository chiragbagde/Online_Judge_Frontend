import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/auth/authSlice";
import { msalInstance } from "../config/auth";
import axios from "axios";
import { urlConstants } from "../apis";
import { toast } from "react-toastify";

export default function MicrosoftAuthHandler() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const handleRedirect = async () => {
      try {
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
      }
    };

    handleRedirect();
  }, [dispatch]);

  return null;
}
