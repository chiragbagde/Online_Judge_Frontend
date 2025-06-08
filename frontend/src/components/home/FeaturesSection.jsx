import React from 'react';
import { Box, Container, Grid, Typography, Paper, useTheme, alpha } from '@mui/material';
import { Code, Speed, School, Group, EmojiEvents, Terminal } from '@mui/icons-material';
import { styled } from '@mui/system';

const FeatureCard = styled(Paper)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(4, 3),
  borderRadius: '16px',
  transition: 'all 0.3s ease',
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 10px 30px ${alpha(theme.palette.primary.main, 0.1)}`,
    borderColor: alpha(theme.palette.primary.main, 0.3),
  },
}));

const features = [
  {
    icon: <Code sx={{ fontSize: 40, color: '#7b5cff' }} />,
    title: 'Interactive Coding',
    description: 'Practice with our in-browser code editor that supports multiple programming languages and provides real-time feedback.'
  },
  {
    icon: <Speed sx={{ fontSize: 40, color: '#00e0d3' }} />,
    title: 'Performance Tracking',
    description: 'Get detailed performance analysis and optimize your solutions with our comprehensive metrics and insights.'
  },
  {
    icon: <School sx={{ fontSize: 40, color: '#ff6b6b' }} />,
    title: 'Structured Learning',
    title: 'Structured Learning',
    description: 'Follow curated learning paths designed by industry experts to master data structures and algorithms step by step.'
  },
  {
    icon: <Group sx={{ fontSize: 40, color: '#4dabf7' }} />,
    title: 'Community Support',
    description: 'Join a vibrant community of developers, participate in discussions, and learn from others.'
  },
  {
    icon: <EmojiEvents sx={{ fontSize: 40, color: '#ffd43b' }} />,
    title: 'Compete & Excel',
    description: 'Test your skills in coding contests and climb the leaderboard to showcase your abilities.'
  },
  {
    icon: <Terminal sx={{ fontSize: 40, color: '#69db7c' }} />,
    title: 'Real-world Problems',
    description: 'Solve problems that mirror real-world technical interview questions from top tech companies.'
  },
];

const FeaturesSection = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{ py: 10, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="overline" 
            sx={{ 
              color: 'primary.main',
              fontWeight: 600,
              letterSpacing: 1,
              mb: 2,
              display: 'inline-block',
              px: 2,
              py: 1,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              borderRadius: 4,
            }}
          >
            Why Choose Us
          </Typography>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800,
              mb: 2,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
            }}
          >
            Everything You Need to Succeed
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.secondary',
              maxWidth: '700px',
              mx: 'auto',
              lineHeight: 1.7,
            }}
          >
            Our platform offers a comprehensive set of tools and resources to help you master coding interviews and become a better developer.
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <FeatureCard elevation={0}>
                <Box sx={{ 
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                }}>
                  {feature.icon}
                </Box>
                <Typography 
                  variant="h5" 
                  component="h3" 
                  sx={{ 
                    fontWeight: 700,
                    mb: 2,
                    color: 'text.primary',
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary',
                    lineHeight: 1.7,
                  }}
                >
                  {feature.description}
                </Typography>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
