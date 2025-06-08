import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  useTheme, 
  alpha,
  Divider,
  Grid,
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import { Timer, Bolt, Code, ArrowForward } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const difficultyColors = {
  Easy: 'success',
  Medium: 'warning',
  Hard: 'error'
};

const DailyChallenge = ({ dailyProblem, loading }) => {
  const theme = useTheme();
  const [timeLeft, setTimeLeft] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  // Mock challenge data - replace with actual data from props
  const mockChallenge = {
    title: 'Two Sum',
    difficulty: 'Easy',
    description: 'Given an array of integers, return indices of the two numbers such that they add up to a specific target.',
    tags: ['Array', 'Hash Table'],
    submissions: 85,
    acceptance: '78%',
    points: 50
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      
      const diff = endOfDay - now;
      
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      
      setTimeLeft({
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0')
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  if (!dailyProblem || loading) {
    return <LinearProgress />;
  }

  return (
    <Card 
      elevation={0}
      sx={{
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.1)}`,
        },
      }}
    >
      <Box sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ 
            width: 40, 
            height: 40, 
            borderRadius: '50%', 
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2,
          }}>
            <Bolt sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="overline" color="text.secondary" sx={{ lineHeight: 1, display: 'block' }}>
              Daily Challenge
            </Typography>
            <Typography variant="h5" component="h3" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {dailyProblem.statement}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ mb: 3, mt: 1 }}>
          <Chip 
            label={dailyProblem.difficulty} 
            size="small" 
            sx={{ mr: 1, mb: 1, fontWeight: 600 }}
          />
            <Chip 
              label={dailyProblem.topic} 
              size="small" 
              variant="outlined"
              sx={{ mr: 1, mb: 1, color: 'text.secondary' }}
            />
        </Box>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, flex: 1 }}>
          {dailyProblem.description.map((item, index) => (
            <p key={index}>{item}</p>
          ))}
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Submissions: <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>{mockChallenge.submissions}</Box>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Acceptance: <Box component="span" sx={{ color: 'success.main', fontWeight: 600 }}>{mockChallenge.acceptance}</Box>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Points: <Box component="span" sx={{ color: 'warning.main', fontWeight: 600 }}>{mockChallenge.points}</Box>
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={78} 
            sx={{ 
              height: 6, 
              borderRadius: 3,
              '& .MuiLinearProgress-bar': {
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              }
            }} 
          />
        </Box>
        
        <Divider sx={{ my: 2, borderColor: 'divider' }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Timer color="primary" sx={{ mr: 1 }} />
            <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
              Time Left: {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
            </Typography>
          </Box>
          <Button
            component={Link}
            to={`/problems/statement/${dailyProblem.id}`}
            variant="contained"
            color="primary"
            endIcon={<ArrowForward />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              py: 1,
              fontWeight: 600,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
              },
            }}
          >
            Solve Challenge
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default DailyChallenge;
