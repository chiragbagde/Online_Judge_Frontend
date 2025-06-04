import React, { useCallback } from 'react';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import { useMsal } from '@azure/msal-react';

const MicrosoftButton = ({ loading, setLoading }) => {
  const { instance } = useMsal();

  const handleLogin = useCallback(async () => {
    try {
      setLoading(true);
      await instance.loginRedirect({
        scopes: ['openid', 'profile', 'email'],
        prompt: 'select_account'
      });
    } catch (error) {
      console.error('Microsoft login error:', error);
      setLoading(false);
    }
  }, [instance, setLoading]);

  return (
    <Button
      onClick={handleLogin}
      variant="outlined"
      fullWidth
      disabled={loading}
      sx={{
        mt: 1,
        py: 1,
        borderColor: 'text.secondary',
        '&:hover': {
          borderColor: 'primary.main',
          backgroundColor: 'rgba(63, 81, 181, 0.04)',
        },
      }}
    >
      {loading ? (
        <CircularProgress size={24} color="inherit" />
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MicrosoftIcon />
          <Typography variant="h6">Sign in with Microsoft</Typography>
        </Box>
      )}
    </Button>
  );
};

export default MicrosoftButton;
