import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  Tabs,
  Tab,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Avatar,
  IconButton,
  Divider,
  Chip,
  LinearProgress,
  Skeleton,
  Snackbar,
  Alert,
  useTheme,
  Card,
  CardContent,
  CardMedia,
  Rating,
  CircularProgress
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
  PlayCircleOutline as PlayCircleOutlineIcon,
  Article as ArticleIcon,
  Code as CodeIcon,
  Videocam as VideocamIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Link as LinkIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  ErrorOutline as ErrorOutlineIcon,
  Refresh as RefreshIcon,
  AccessTime as AccessTimeIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  ArrowForward as ArrowForwardIcon,
  EmojiEvents as EmojiEventsIcon,
} from '@mui/icons-material';

// Import mock API
import mockApi from '../../data/mockLearningPaths';

// Styled components
const StyledTabs = styled(Tabs)({
  '& .MuiTabs-indicator': {
    height: 3,
    borderRadius: '3px 3px 0 0',
  },
});

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.9rem',
  minHeight: 48,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
}));

const LearningPathCard = ({ path, onViewDetails, onBookmarkToggle }) => {
  const theme = useTheme();
  const [isBookmarked, setIsBookmarked] = useState(path.isBookmarked || false);
  
  const handleBookmarkClick = async (e) => {
    e.stopPropagation();
    try {
      await onBookmarkToggle?.(path.id, !isBookmarked);
      setIsBookmarked(!isBookmarked);
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const calculateProgress = () => {
    if (!path.modules || !Array.isArray(path.modules)) return 0;
    
    let completedLessons = 0;
    let totalLessons = 0;
    
    path.modules.forEach(module => {
      if (module.lessons && Array.isArray(module.lessons)) {
        totalLessons += module.lessons.length;
        completedLessons += module.lessons.filter(lesson => lesson && lesson.completed).length;
      }
    });
    
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  };

  const progress = calculateProgress();

  return (
    <Card 
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'visible',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 15px 30px ${theme.palette.primary.main}`,
          borderColor: theme.palette.primary.main,
        },
      }}
      onClick={() => onViewDetails?.(path.id)}
    >
      {path.popular && (
        <Box 
          sx={{
            position: 'absolute',
            top: -12,
            right: 20,
            bgcolor: theme.palette.warning.main,
            color: theme.palette.warning.contrastText,
            px: 2,
            py: 0.5,
            borderRadius: 2,
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            boxShadow: `0 4px 12px ${theme.palette.warning.main}`,
          }}
        >
          <StarIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
          Most Popular
        </Box>
      )}
      
      <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box 
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <CardMedia
            component="img"
            image={"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"}
            alt={path.title}
            sx={{ width: 60, height: 60, borderRadius: '50%' }}
          />
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography 
            variant="h5" 
            component="h3" 
            sx={{ 
              fontWeight: 800,
              mb: 1,
              color: 'text.primary',
            }}
          >
          {path.title}
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: 'text.secondary',
              mb: 2,
              fontWeight: 500,
            }}
          >
            {path.subtitle}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            {path.description}
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Progress: {progress}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {path.duration} • {path.lessons || 0} lessons
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 6, 
              borderRadius: 3,
              bgcolor: theme.palette.divider,
              '& .MuiLinearProgress-bar': {
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.main})`,
                borderRadius: 3,
              }
            }} 
          />
        </Box>
        
        {path.features && path.features.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <List dense disablePadding>
              {path.features.map((feature, index) => (
                <ListItem key={index} disableGutters sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main, fontSize: '1rem' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={feature} 
                    primaryTypographyProps={{ 
                      variant: 'body2',
                      color: 'text.primary',
                    }} 
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        
        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              borderRadius: 2,
              py: 1.5,
              px: 1,
              textTransform: 'none',
              fontWeight: 600,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.main})`,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `0 4px 12px ${theme.palette.primary.main}`,
              },
            }}
          >
            {progress > 0 ? 'Continue Learning' : 'Start Learning'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const LearningPathDetail = ({ path, onBack, onBookmarkToggle }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedModule, setExpandedModule] = useState(null);
  const theme = useTheme();
  const { pathId } = useParams();
  const navigate = useNavigate();

  const handleLessonClick = (moduleId, lessonId) => {
    const lessonUrl = `/learning-journeys/${pathId}/modules/${moduleId}/lessons/${lessonId}`;
    navigate(lessonUrl);
  };

  const handleModuleClick = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (!path) return null;

  const completedLessons = path.modules.flatMap(m => m.lessons).filter(l => l.completed).length;
  const totalLessons = path.modules.flatMap(m => m.lessons).length;
  const progress = Math.round((completedLessons / totalLessons) * 100) || 0;

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={onBack}
        sx={{ mb: 3 }}
      >
        Back to Learning Paths
      </Button>

      <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Chip 
                label={path.level} 
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
              <Typography variant="body2" color="text.secondary">
                {path.duration} • {path.modules.length} Modules
              </Typography>
            </Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {path.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {path.longDescription || path.description}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ width: '100%', mr: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={progress} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    mb: 1,
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                    },
                  }} 
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">
                    {progress}% Complete
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {completedLessons} of {totalLessons} lessons
                  </Typography>
                </Box>
              </Box>
              <Button 
                variant="contained" 
                color="primary"
                size="large"
                sx={{ whiteSpace: 'nowrap' }}
              >
                {progress === 0 ? 'Start Learning' : 'Continue'}
              </Button>
            </Box>
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: 300 }, flexShrink: 0 }}>
            <Box sx={{ 
              borderRadius: 2, 
              overflow: 'hidden',
              boxShadow: 1,
              height: '100%',
              minHeight: { xs: 200, md: 'auto' },
              '& img': {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }
            }}>
              <img 
                src={path.image || '/images/learning-path-placeholder.jpg'} 
                alt={path.title} 
              />
            </Box>
          </Box>
        </Box>
      </Paper>

      <Paper elevation={2} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
        <StyledTabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{ mb: 3 }}
        >
          <StyledTab label="Curriculum" />
          <StyledTab label="Prerequisites" />
          <StyledTab label="Instructor" />
        </StyledTabs>

        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              What you'll learn
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {(path.whatYoullLearn || []).map((item, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <CheckCircleOutlineIcon  
                      color="primary" 
                      sx={{ mr: 1.5, mt: 0.5, flexShrink: 0 }}
                    />
                    <Typography variant="body1">{item}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            
            <Typography variant="h6" gutterBottom>
              Course Content
            </Typography>
            <List sx={{ bgcolor: 'background.paper' }}>
              {path.modules.map((module, moduleIndex) => (
                <Accordion 
                  key={module.id} 
                  elevation={0} 
                  expanded={expandedModule === module.id}
                  onChange={() => handleModuleClick(module.id)}
                  sx={{ 
                    border: '1px solid', 
                    borderColor: 'divider',
                    '&:not(:last-child)': {
                      mb: 1,
                    },
                    '&:before': {
                      display: 'none',
                    },
                  }}
                >
                  <AccordionSummary 
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      bgcolor: expandedModule === module.id ? 'action.hover' : 'background.paper',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Box sx={{ 
                        width: 32, 
                        height: 32, 
                        borderRadius: '50%', 
                        bgcolor: 'primary.main', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: 'white',
                        mr: 2,
                        flexShrink: 0,
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      }}>
                        {moduleIndex + 1}
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1">{module.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {module.lessons.length} lessons • {module.duration}
                        </Typography>
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    <List disablePadding>
                      {module.lessons.map((lesson, lessonIndex) => (
                        <ListItem 
                        onClick={() => handleLessonClick(module.id, lesson.id)}

                          key={lesson.id} 
                          button 
                          sx={{ 
                            pl: 4,
                            borderTop: '1px solid', 
                            borderColor: 'divider',
                            '&:hover': { 
                              bgcolor: 'action.hover',
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            {lesson.completed ? (
                              <CheckCircleOutlineIcon color="success" />
                            ) : (
                              <PlayCircleOutlineIcon color="action" />
                            )}
                          </ListItemIcon>
                          <ListItemText 
                            primary={`${moduleIndex + 1}.${lessonIndex + 1} ${lesson.title}`}
                            secondary={lesson.duration}
                            primaryTypographyProps={{
                              color: lesson.completed ? 'text.primary' : 'text.primary',
                              fontWeight: lesson.completed ? 500 : 400,
                            }}
                          />
                          {lesson.preview && (
                            <Chip 
                              label="Preview" 
                              size="small" 
                              variant="outlined"
                              sx={{ 
                                fontSize: '0.6rem',
                                height: 20,
                                '& .MuiChip-label': {
                                  px: 0.75,
                                },
                              }}
                            />
                          )}
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}
            </List>
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Prerequisites
            </Typography>
            <List>
              {(path.prerequisites || []).map((prereq, index) => (
                <ListItem key={index} disableGutters>
                  <ListItemIcon>
                    <CheckCircleOutlineIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={prereq} />
                </ListItem>
              ))}
              {(!path.prerequisites || path.prerequisites.length === 0) && (
                <Typography color="text.secondary">
                  No specific prerequisites are required for this learning path.
                </Typography>
              )}
            </List>
          </Box>
        )}

        {activeTab === 2 && path.instructor && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 4 }}>
              <Avatar 
                src={path.instructor.avatar} 
                alt={path.instructor.name}
                sx={{ 
                  width: 80, 
                  height: 80, 
                  mr: 3,
                  fontSize: '2rem',
                  bgcolor: 'primary.main',
                }}
              >
                {path.instructor.name.split(' ').map(n => n[0]).join('')}
              </Avatar>
              <Box>
                <Typography variant="h6" gutterBottom>
                  {path.instructor.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {path.instructor.bio || 'No bio available.'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Rating 
                      value={path.instructor.rating || 0} 
                      precision={0.5} 
                      readOnly 
                      size="small"
                      emptyIcon={<StarBorderIcon fontSize="inherit" />}
                      sx={{ mr: 0.5 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {path.instructor.rating?.toFixed(1) || 'N/A'} ({path.instructor.students?.toLocaleString() || 0} students)
                    </Typography>
                  </Box>
                  {path.instructor.coursesCount > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      {path.instructor.coursesCount} courses
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>

            {(path.instructor.socialLinks || []).length > 0 && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Connect with the instructor:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {path.instructor.socialLinks?.map((link, index) => (
                    <Chip
                      key={index}
                      icon={link.type === 'website' ? <LinkIcon /> : 
                           link.type === 'email' ? <EmailIcon /> : 
                           link.type === 'twitter' ? <span>𝕏</span> : null}
                      label={link.type === 'email' ? 'Email' : link.label || link.type}
                      component="a"
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      clickable
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

const formatLearningPath = (path) => {
  return {
    ...path,
    modules: Array.isArray(path.modules) ? path.modules.map(module => ({
      ...module,
      lessons: Array.isArray(module.lessons) ? module.lessons.map(lesson => ({
        ...lesson,
        completed: Boolean(lesson.completed),
        duration: lesson.duration || '10 min',
        type: lesson.type || 'text',
        content: lesson.content || ''
      })) : []
    })) : [],
    level: path.level || 'Beginner',
    duration: path.duration || '10 hours',
    isBookmarked: Boolean(path.isBookmarked),
    features: Array.isArray(path.features) ? path.features : [],
    instructor: path.instructor || null
  };
};

const LearningJourneys = () => {
  const theme = useTheme();
  const [learningPaths, setLearningPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const { pathId } = useParams();
  const navigate = useNavigate();

  const fetchPaths = async () => {
    setLoading(true);
    try {
      const response = await mockApi.fetchLearningPaths();
      console.log('API Response:', response);
      const formattedPaths = response.data.map(formatLearningPath);
      console.log('Formatted Paths:', formattedPaths);
      setLearningPaths(formattedPaths);
      
      // If pathId is present in URL, select that path
      if (pathId) {
        const selectedPath = formattedPaths.find(p => p.id === pathId);
        if (selectedPath) {
          setSelectedPath(selectedPath);
        } else {
          setSnackbar({
            open: true,
            message: 'Learning path not found',
            severity: 'error',
          });
          navigate('/learning-journeys', { replace: true });
        }
      } else {
        // Reset selected path when returning to the main list
        setSelectedPath(null);
      }
    } catch (err) {
      console.error('Error fetching learning paths:', err);
      setError('Failed to load learning paths. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch paths when component mounts or pathId changes
  useEffect(() => {
    fetchPaths();
  }, [pathId]);

  const handleViewDetails = (pathId) => {
    navigate(`/learning-journeys/${pathId}`);
  };

  const handleBackToList = () => {
    setSelectedPath(null);
    navigate('/learning-journeys');
  };

  const handleBookmarkToggle = async (pathId, isBookmarked) => {
    try {
      await mockApi.toggleBookmark(pathId, isBookmarked);
      // Update the learning paths with the new bookmark status
      setLearningPaths(prevPaths => 
        prevPaths.map(path => 
          path.id === pathId 
            ? { ...path, isBookmarked } 
            : path
        )
      );
      // If a path is selected, update its bookmark status too
      if (selectedPath?.id === pathId) {
        setSelectedPath(prev => ({ ...prev, isBookmarked }));
      }
      setSnackbar({
        open: true,
        message: isBookmarked ? 'Path bookmarked' : 'Path unbookmarked',
        severity: 'success',
      });
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update bookmark',
        severity: 'error',
      });
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={() => window.location.reload()}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {selectedPath ? (
        <LearningPathDetail 
          path={selectedPath} 
          onBack={handleBackToList}
          onBookmarkToggle={handleBookmarkToggle}
        />
      ) : (
        <>
          <Typography variant="h4" component="h1" gutterBottom>
            Learning Journeys
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Choose a learning path to start your journey
          </Typography>
          
          {loading ? (
            <Grid container spacing={3}>
              {[1, 2, 3].map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item}>
                  <Card>
                    <Skeleton variant="rectangular" height={140} />
                    <CardContent>
                      <Skeleton variant="text" width="60%" height={32} />
                      <Skeleton variant="text" width="90%" height={24} />
                      <Skeleton variant="text" width="80%" height={24} />
                      <Box sx={{ mt: 2 }}>
                        <Skeleton variant="rectangular" height={6} sx={{ mb: 1, borderRadius: 3 }} />
                        <Skeleton variant="text" width="40%" />
                      </Box>
                      <Skeleton variant="rectangular" height={36} sx={{ mt: 2, borderRadius: 1 }} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : error ? (
            <Box textAlign="center" py={6}>
              <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6" color="error" gutterBottom>
                {error}
              </Typography>
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={() => window.location.reload()}
                startIcon={<RefreshIcon />}
                sx={{ mt: 2 }}
              >
                Try Again
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {learningPaths && learningPaths.length > 0 ? (
                learningPaths.map((path) => (
                  <Grid item xs={12} sm={6} md={4} key={path.id}>
                    <LearningPathCard
                      path={path}
                      onViewDetails={handleViewDetails}
                      onBookmarkToggle={handleBookmarkToggle}
                    />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Box textAlign="center" py={6}>
                    <SchoolIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      No learning paths available at the moment
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Check back later for new learning paths
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LearningJourneys;
