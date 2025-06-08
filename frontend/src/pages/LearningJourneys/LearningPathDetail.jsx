import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  LinearProgress, 
  Divider, 
  IconButton, 
  Paper, 
  Chip, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  CircularProgress,
  useTheme,
  Avatar,
  Grid
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  AccessTime as AccessTimeIcon,
  Star as StarIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Article as ArticleIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  PlayCircleOutline as PlayCircleOutlineIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import mockApi from '../../data/mockLearningPaths';

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  boxShadow: 'none',
  border: `1px solid ${theme.palette.divider}`,
  '&:before': {
    display: 'none',
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  '&.Mui-expanded': {
    backgroundColor: theme.palette.grey[100],
  },
}));

const LessonContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  '& pre': {
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    overflowX: 'auto',
    margin: theme.spacing(2, 0),
  },
  '& code': {
    fontFamily: 'monospace',
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.shape.borderRadius,
  },
  '& ul, & ol': {
    paddingLeft: theme.spacing(3),
    margin: theme.spacing(2, 0),
  },
  '& li': {
    marginBottom: theme.spacing(1),
  },
  '& h1, & h2, & h3, & h4, & h5, & h6': {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  '& p': {
    marginBottom: theme.spacing(2),
    lineHeight: 1.6,
  },
  '& blockquote': {
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    paddingLeft: theme.spacing(2),
    margin: theme.spacing(2, 0),
    fontStyle: 'italic',
    color: theme.palette.text.secondary,
  },
}));

const LearningPathDetail = ({ path, onBack, onBookmarkToggle }) => {
  const theme = useTheme();
  const { pathId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedModule, setExpandedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(path?.isBookmarked || false);

  const handleModuleExpand = (moduleId) => (event, isExpanded) => {
    setExpandedModule(isExpanded ? moduleId : null);
    if (!isExpanded) {
      setSelectedLesson(null);
    }
  };

  const handleLessonClick = (moduleId, lessonId) => {
    const lessonUrl = `/learning-journeys/${pathId}/modules/${moduleId}/lessons/${lessonId}`;
    window.open(lessonUrl, '_blank');
  };

  const handleBookmarkClick = async (e) => {
    e.stopPropagation();
    try {
      const newBookmarkState = !isBookmarked;
      setIsBookmarked(newBookmarkState);
      await onBookmarkToggle?.(path.id, newBookmarkState);
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      setIsBookmarked(prev => !prev); // Revert on error
    }
  };

  // Calculate progress
  const progress = useMemo(() => {
    if (!path?.modules) return 0;
    
    const { completed, total } = path.modules.reduce((acc, module) => {
      const lessons = Array.isArray(module.lessons) ? module.lessons : [];
      return {
        completed: acc.completed + lessons.filter(l => l.completed).length,
        total: acc.total + lessons.length
      };
    }, { completed: 0, total: 0 });
    
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }, [path?.modules]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
        <Button onClick={onBack} startIcon={<ArrowBackIcon />}>
          Back to Learning Paths
        </Button>
      </Box>
    );
  }

  if (!path) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" gutterBottom>
          Learning path not found
        </Typography>
        <Button onClick={onBack} startIcon={<ArrowBackIcon />}>
          Back to Learning Paths
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ mr: 2 }}
        >bjbhjb
          Back to Learning Paths
        </Button>
        
        <IconButton
          onClick={handleBookmarkClick}
          sx={{
            color: isBookmarked ? 'primary.main' : 'text.secondary',
            '&:hover': {
              color: 'primary.main',
            },
          }}
        >
          {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
        </IconButton>
      </Box>

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
                    {path.modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)} lessons
                  </Typography>
                </Box>
              </Box>
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
              {console.log("path.image",path.image)}
              <img 
                src={path.image || '/images/learning-path-placeholder.jpg'} 
                alt={path.title} 
              />
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Modules and Lessons */}
      <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', lg: 'row' } }}>
        {/* Modules List */}
        <Box sx={{ flex: { xs: '1 1 auto', lg: '0 0 350px' } }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Course Content
          </Typography>
          
          {path.modules.map((module, moduleIndex) => (
            <StyledAccordion
              key={module.id}
              expanded={expandedModule === module.id}
              onChange={handleModuleExpand(module.id)}
            >
              <StyledAccordionSummary 
                expandIcon={<ExpandMoreIcon />}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 600,
                      }}
                    >
                      {module.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {module.lessons?.length || 0} lessons • {module.duration}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                      {module.lessons?.filter(l => l.completed).length || 0}/{module.lessons?.length || 0}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={module.lessons?.length ? 
                        (module.lessons.filter(l => l.completed).length / module.lessons.length) * 100 : 
                        0
                      }
                      sx={{ width: 60, height: 6, borderRadius: 3 }}
                    />
                  </Box>
                </Box>
              </StyledAccordionSummary>
              
              <AccordionDetails>
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
            </StyledAccordion>
          ))}
        </Box>

        {/* Lesson Content */}
        <Box sx={{ flex: 1 }}>
          {selectedLesson ? (
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                {selectedLesson.title}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Chip
                  icon={<ArticleIcon />}
                  label="Text Lesson"
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {selectedLesson.duration}
                </Typography>
              </Box>

              <LessonContent>
                {selectedLesson.content.split('\n\n').map((paragraph, index) => {
                  // Handle bullet points
                  if (paragraph.startsWith('•')) {
                    return (
                      <Box key={index} component="ul" sx={{ pl: 2 }}>
                        {paragraph.split('\n').map((item, i) => (
                          item.startsWith('•') ? (
                            <Typography key={i} component="li" variant="body1">
                              {item.substring(1).trim()}
                            </Typography>
                          ) : null
                        ))}
                      </Box>
                    );
                  }
                  
                  // Handle numbered lists
                  if (paragraph.match(/^\d+\./)) {
                    return (
                      <Box key={index} component="ol" sx={{ pl: 2 }}>
                        {paragraph.split('\n').map((item, i) => (
                          item.match(/^\d+\./) ? (
                            <Typography key={i} component="li" variant="body1">
                              {item.replace(/^\d+\.\s*/, '')}
                            </Typography>
                          ) : null
                        ))}
                      </Box>
                    );
                  }
                  
                  // Handle headings
                  if (paragraph.startsWith('Key') || paragraph.startsWith('Common') || paragraph.startsWith('Best')) {
                    return (
                      <Typography key={index} variant="h6" sx={{ mt: 3, mb: 2 }}>
                        {paragraph}
                      </Typography>
                    );
                  }
                  
                  // Regular paragraphs
                  return (
                    <Typography key={index} variant="body1" paragraph>
                      {paragraph}
                    </Typography>
                  );
                })}
              </LessonContent>
            </Paper>
          ) : (
            <Paper 
              elevation={2} 
              sx={{ 
                p: 4, 
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 400,
                bgcolor: 'background.default'
              }}
            >
              <ArticleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" align="center">
                Select a lesson to start learning
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                Click on any lesson from the course content to view its details
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>

      {/* Features */}
      {path.features?.length > 0 && (
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            What You'll Learn
          </Typography>
          <Grid container spacing={2}>
            {path.features.map((feature, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <CheckCircleIcon 
                    sx={{ 
                      color: 'primary.main', 
                      mr: 1, 
                      mt: 0.5,
                      fontSize: 20 
                    }} 
                  />
                  <Typography variant="body1">
                    {feature}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Instructor */}
      {path.instructor && (
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Instructor
          </Typography>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={path.instructor.avatar}
                alt={path.instructor.name}
                sx={{ width: 64, height: 64, mr: 2 }}
              />
              <Box>
                <Typography variant="h6">
                  {path.instructor.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {path.instructor.role}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body1" paragraph>
              {path.instructor.bio}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Chip
                icon={<StarIcon />}
                label={`${path.instructor.rating} Rating`}
                size="small"
              />
              <Chip
                icon={<PersonIcon />}
                label={`${path.instructor.students} Students`}
                size="small"
              />
              <Chip
                icon={<SchoolIcon />}
                label={`${path.instructor.courses} Courses`}
                size="small"
              />
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default LearningPathDetail; 