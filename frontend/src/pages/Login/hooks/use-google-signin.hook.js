import React from 'react';
import { toast } from 'react-toastify';
import { loginSuccess } from '../../../features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGoogleLoginMutation } from '../../../apis/authApi';

const useGoogleSignIn = (setLoading) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // RTK Query hook
  const [googleLogin, { isLoading: googleLoading, error: googleError }] = useGoogleLoginMutation();

  const handleGoogleSignIn = () => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id:
        "20870351451-mpi3unchgdhhoigegso0d6c1hcjo117r.apps.googleusercontent.com",
      scope: "openid email profile",
      callback: async (tokenResponse) => {
        try {
          setLoading(true);
          const accessToken = tokenResponse.access_token;
          const res = await fetch(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const userInfo = await res.json();

          const result = await googleLogin({
            email: userInfo.email,
            name: userInfo.name,
          }).unwrap();

          const { user, token } = result;

          localStorage.setItem("user", JSON.stringify({ user }));
          localStorage.setItem("token", token);
          dispatch(loginSuccess({ user, token }));
          toast.success("Logged in with Google!");
          navigate("/");
        } catch (error) {
          console.error("Google login failed", error);
          toast.error(error.data?.message || "Google sign-in failed!");
          setLoading(false);
        }
      },
    });

    client.requestAccessToken();
  };

  return { handleGoogleSignIn };
};

export default useGoogleSignIn;