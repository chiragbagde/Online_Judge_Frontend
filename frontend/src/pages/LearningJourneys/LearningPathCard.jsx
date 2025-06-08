import React, { useState, useCallback, useMemo } from 'react';
import { styled } from '@mui/material/styles';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Button,
  LinearProgress,
  Chip,
  useTheme,
  Skeleton
} from '@mui/material';
import {
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  PlayCircleOutline as PlayCircleOutlineIcon
} from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const StyledCardMedia = styled(Box)({
  height: 140,
  position: 'relative',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
});

const LearningPathCard = ({ path, onViewDetails, onBookmarkToggle }) => {
  const theme = useTheme();
  
  // Ensure path is an object with default values
  const safePath = useMemo(() => ({
    id: path?.id || `path-${Math.random().toString(36).substr(2, 9)}`,
    title: path?.title || 'Untitled Learning Path',
    description: path?.description || '',
    level: path?.level || 'Beginner',
    duration: path?.duration || 'Self-paced',
    image: path?.image || '/images/learning-path-placeholder.jpg',
    modules: Array.isArray(path?.modules) ? path.modules : [],
    features: Array.isArray(path?.features) ? path.features : [],
    isBookmarked: !!path?.isBookmarked,
    progress: typeof path?.progress === 'number' ? path.progress : 0,
  }), [path]);
  
  const [isBookmarked, setIsBookmarked] = useState(safePath.isBookmarked);

  // Handle card click with error boundary
  const handleCardClick = useCallback((e) => {
    e?.stopPropagation();
    try {
      if (safePath.id && onViewDetails) {
        onViewDetails(safePath.id);
      }
    } catch (error) {
      console.error('Error handling card click:', error);
    }
  }, [safePath.id, onViewDetails]);

  // Handle bookmark toggle with error boundary
  const handleBookmarkClick = useCallback(async (e) => {
    e?.stopPropagation();
    try {
      const newBookmarkState = !isBookmarked;
      setIsBookmarked(newBookmarkState);
      if (onBookmarkToggle && safePath.id) {
        await onBookmarkToggle(safePath.id, newBookmarkState);
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      setIsBookmarked(prev => !prev); // Revert on error
    }
  }, [isBookmarked, onBookmarkToggle, safePath.id]);

  // Safely calculate progress
  const progress = useMemo(() => {
    try {
      const modules = Array.isArray(safePath.modules) ? safePath.modules : [];
      
      const { completed, total } = modules.reduce((acc, module) => {
        const lessons = Array.isArray(module.lessons) ? module.lessons : [];
        const validLessons = lessons.filter(lesson => 
          lesson && typeof lesson === 'object' && 'completed' in lesson
        );
        
        return {
          completed: acc.completed + validLessons.filter(l => l.completed).length,
          total: acc.total + validLessons.length
        };
      }, { completed: 0, total: 0 });
      
      return total > 0 ? Math.round((completed / total) * 100) : 0;
    } catch (error) {
      console.error('Error calculating progress:', error);
      return safePath.progress || 0; // Fallback to path's progress if calculation fails
    }
  }, [safePath.modules, safePath.progress]);

  // If path is not provided, return a placeholder card
  if (!path) {
    return (
      <StyledCard>
        <Box sx={{ p: 2 }}>
          <Skeleton variant="rectangular" width="100%" height={140} />
          <Box sx={{ pt: 2 }}>
            <Skeleton width="60%" />
            <Skeleton width="80%" />
            <Skeleton width="40%" />
          </Box>
        </Box>
      </StyledCard>
    );
  }

  return (
    <StyledCard 
      onClick={handleCardClick} 
      sx={{ 
        cursor: safePath.id ? 'pointer' : 'default',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <StyledCardMedia
          sx={{
            backgroundImage: `url(${safePath.image})`,
            backgroundColor: theme.palette.grey[200],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.palette.grey[500]
          }}
        >
          {!safePath.image && (
            <Typography variant="body2">No Image Available</Typography>
          )}
        </StyledCardMedia>
        <IconButton
          onClick={handleBookmarkClick}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
            },
          }}
        >
          {isBookmarked ? (
            <BookmarkIcon color="primary" />
          ) : (
            <BookmarkBorderIcon />
          )}
        </IconButton>
      </Box>
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Chip 
            label={safePath.level} 
            size="small" 
            color="primary"
            sx={{ 
              mr: 1,
              fontWeight: 600,
              textTransform: 'uppercase',
              fontSize: '0.7rem',
              letterSpacing: '0.5px'
            }} 
          />
          <Typography variant="caption" color="text.secondary">
            {safePath.duration}
          </Typography>
        </Box>
        
        <Typography variant="h6" component="h3" gutterBottom sx={{ flexGrow: 1 }}>
          {safePath.title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          {safePath.description?.length > 120 
            ? `${safePath.description.substring(0, 120)}...` 
            : safePath.description}
        </Typography>
        
        <Box sx={{ mt: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box sx={{ width: '100%', mr: 2 }}>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ 
                  height: 6, 
                  borderRadius: 3,
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                  },
                }} 
              />
            </Box>
            <Typography variant="caption" color="text.secondary">
              {progress}%
            </Typography>
          </Box>
          
          <Button 
            fullWidth 
            variant="contained" 
            color="primary"
            onClick={handleCardClick}
            startIcon={<PlayCircleOutlineIcon />}
            sx={{
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: 2,
              },
            }}
          >
            {progress === 0 ? 'Start Learning' : 'Continue'}
          </Button>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default React.memo(LearningPathCard);
