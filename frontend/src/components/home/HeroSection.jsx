import React from 'react';
import { Box, Button, Container, Grid, TextField, Typography, useTheme, alpha } from '@mui/material';
import { Search, Code, TrendingUp } from '@mui/icons-material';
import { styled, keyframes } from '@mui/system';
import { Link } from 'react-router-dom';

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 ${alpha('#7b5cff', 0.4)}; }
  70% { box-shadow: 0 0 0 10px ${alpha('#7b5cff', 0)}; }
  100% { box-shadow: 0 0 0 0 ${alpha('#7b5cff', 0)}; }
`;

const AnimatedButton = styled(Button)({
  position: 'relative',
  overflow: 'hidden',
  '&:after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 5,
    height: 5,
    background: 'rgba(255, 255, 255, 0.5)',
    opacity: 0,
    borderRadius: '100%',
    transform: 'scale(1, 1) translate(-50%)',
    transformOrigin: '50% 50%',
  },
  '&:focus:not(:active)::after': {
    animation: `${pulse} 1s ease-out`,
  },
});

const HeroSection = ({ onSearch }) => {
  const theme = useTheme();
  const accent = "#7b5cff";
  const accent2 = "#00e0d3";

  return (
    <Box 
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
        pt: 8,
        pb: 4,
        position: 'relative',
        overflow: 'hidden',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 30%, ' + alpha(accent, 0.1) + ' 0%, transparent 50%)',
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{
                fontWeight: 800,
                mb: 3,
                background: `linear-gradient(90deg, ${accent}, ${accent2})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
                lineHeight: 1.2,
              }}
            >
              Master Coding with
              <Box component="span" sx={{ display: 'block' }}>Interactive Challenges</Box>
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'text.secondary',
                mb: 4,
                maxWidth: '90%',
                lineHeight: 1.7,
              }}
            >
              Level up your coding skills with our comprehensive collection of challenges, 
              tutorials, and practice problems. Perfect for beginners and experienced developers alike.
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              mb: 4,
              flexDirection: { xs: 'column', sm: 'row' } 
            }}>
              <Button
                component={Link}
                to="/problems"
                variant="contained"
                size="large"
                sx={{
                  background: `linear-gradient(90deg, ${accent}, ${accent2})`,
                  color: 'white',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 20px ${alpha(accent, 0.3)}`,
                    background: `linear-gradient(90deg, ${accent2}, ${accent})`,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Start Coding Now
              </Button>
              
              <Button
                component={Link}
                to="/learning-paths"
                variant="outlined"
                size="large"
                sx={{
                  color: 'text.primary',
                  borderColor: 'text.secondary',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  '&:hover': {
                    borderColor: accent,
                    color: accent,
                    backgroundColor: alpha(accent, 0.05),
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Explore Learning Paths
              </Button>
            </Box>

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
              mt: 4
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp sx={{ color: accent2, mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Join <strong>50,000+</strong> developers
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Code sx={{ color: accent, mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  <strong>1000+</strong> coding problems
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                height: '100%',
                background: `url('/assets/coding-illustration.svg') no-repeat center center`,
                backgroundSize: 'contain',
                animation: 'float 6s ease-in-out infinite',
                '@keyframes float': {
                  '0%': { transform: 'translateY(0px)' },
                  '50%': { transform: 'translateY(-20px)' },
                  '100%': { transform: 'translateY(0px)' },
                }
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
