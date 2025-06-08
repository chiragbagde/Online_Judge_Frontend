import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Breadcrumbs,
  Link,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArticleIcon from '@mui/icons-material/Article';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import mockApi from '../../data/mockApi';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const ModuleContent = () => {
  const { pathId, moduleId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [module, setModule] = useState(null);
  const [path, setPath] = useState(null);

  useEffect(() => {
    const fetchModule = async () => {
      try {
        setLoading(true);
        const pathData = await mockApi.fetchLearningPathById(pathId);
        setPath(pathData);
        
        const moduleData = pathData.modules.find(m => m.id === moduleId);
        if (!moduleData) {
          throw new Error('Module not found');
        }
        
        setModule(moduleData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [pathId, moduleId]);

  const handleLessonClick = (lessonId) => {
    const lessonUrl = `/learning-journeys/${pathId}/modules/${moduleId}/lessons/${lessonId}`;
    window.open(lessonUrl, '_blank');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!module) {
    return (
      <Container maxWidth="md">
        <Alert severity="warning" sx={{ mt: 3 }}>
          Module not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 3, mb: 2 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
          <Link
            component="button"
            variant="body1"
            onClick={() => navigate('/learning-journeys')}
            color="inherit"
          >
            Learning Paths
          </Link>
          <Link
            component="button"
            variant="body1"
            onClick={() => navigate(`/learning-journeys/${pathId}`)}
            color="inherit"
          >
            {path?.title}
          </Link>
          <Typography color="text.primary">{module.title}</Typography>
        </Breadcrumbs>
      </Box>

      <StyledPaper elevation={2}>
        <Typography variant="h4" component="h1" gutterBottom>
          {module.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Duration: {module.duration}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Lessons
        </Typography>
        <List>
          {module.lessons.map((lesson, index) => (
            <ListItem
              key={lesson.id}
              button
              onClick={() => handleLessonClick(lesson.id)}
              sx={{
                mb: 1,
                borderRadius: 1,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemIcon>
                {lesson.completed ? (
                  <CheckCircleOutlineIcon color="success" />
                ) : (
                  <ArticleIcon color="primary" />
                )}
              </ListItemIcon>
              <ListItemText
                primary={`${index + 1}. ${lesson.title}`}
                secondary={
                  <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label="Text Lesson"
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ height: 20 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {lesson.duration}
                    </Typography>
                  </Box>
                }
                primaryTypographyProps={{
                  fontWeight: lesson.completed ? 500 : 400,
                }}
              />
            </ListItem>
          ))}
        </List>
      </StyledPaper>
    </Container>
  );
};

export default ModuleContent; 