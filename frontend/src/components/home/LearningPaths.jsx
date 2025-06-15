import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  LinearProgress,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  School,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import mockApi from '../../data/mockApi';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 200,
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(3),
}));

const LearningPaths = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [learningPaths, setLearningPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLearningPaths = async () => {
      try {
        setLoading(true);
        const paths = await mockApi.fetchLearningPaths();
        setLearningPaths(paths);
      } catch (err) {
        console.error('Failed to load learning paths:', err);
        setError('Failed to load learning paths. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPaths();
  }, []);

  const handlePathClick = (pathId) => {
    navigate(`/learning-journeys/${pathId}`);
  };

  const handleBookmarkClick = async (e, pathId, isBookmarked) => {
    e.stopPropagation();
    try {
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <LinearProgress sx={{ width: '100%', maxWidth: 600 }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 8, px: { xs: 2, sm: 4, md: 6 } }}>
      <Typography 
        variant="h3" 
        component="h2" 
        gutterBottom 
        sx={{ 
          textAlign: 'center',
          mb: 6,
          fontWeight: 600,
          color: 'text.primary'
        }}
      >
        Learning Paths
      </Typography>

      <Grid container spacing={4}>
        {learningPaths.map((path) => (
          <Grid item xs={12} md={6} lg={4} key={path.id}>
            <StyledCard onClick={() => handlePathClick(path.id)}>
              <StyledCardMedia
                image={path.image || '/images/learning-path-placeholder.jpg'}
                title={path.title}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 2,
                    color: 'white',
                    zIndex: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Chip
                      label={path.level}
                      size="small"
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        fontSize: '0.7rem',
                        letterSpacing: '0.5px'
                      }}
                    />
                    <IconButton
                      onClick={(e) => handleBookmarkClick(e, path.id, path.isBookmarked)}
                      sx={{ color: 'white' }}
                    >
                      {path.isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                    </IconButton>
                  </Box>
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 600 }}>
                    {path.title}
                  </Typography>
                </Box>
              </StyledCardMedia>

              <StyledCardContent>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {path.description}
                </Typography>

                <Box sx={{ mt: 'auto', pt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccessTimeIcon sx={{ fontSize: 20, color: 'text.secondary', mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {path.duration}
                    </Typography>
                    <Box sx={{ flex: 1 }} />
                    <PersonIcon sx={{ fontSize: 20, color: 'text.secondary', mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {path.students?.toLocaleString()} students
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <StarIcon sx={{ fontSize: 20, color: 'warning.main', mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {path.rating} rating
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Progress
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={path.progress || 0}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'palette.background.main2',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {path.tags?.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        sx={{
                          bgcolor: 'palette.background.main2',
                        }}
                      />
                    ))}
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      mt: 2,
                      py: 1,
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Start Learning
                  </Button>
                </Box>
              </StyledCardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LearningPaths;
