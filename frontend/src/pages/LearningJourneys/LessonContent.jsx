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
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import mockApi from '../../data/mockApi';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


const LessonContent = () => {
  const { pathId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [path, setPath] = useState(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        const pathData = await mockApi.fetchLearningPathById(pathId);
        setPath(pathData);
        
        const module = pathData.modules.find(m => m.id === moduleId);
        if (!module) {
          throw new Error('Module not found');
        }
                const lessonData = module.lessons.find(l => l.id === lessonId);
        if (!lessonData) {
          throw new Error('Lesson not found');
        }
        
        setLesson(lessonData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [pathId, moduleId, lessonId]);

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

  if (!lesson) {
    return (
      <Container maxWidth="md">
        <Alert severity="warning" sx={{ mt: 3 }}>
          Lesson not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
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
          <Typography color="text.primary">{lesson.title}</Typography>
        </Breadcrumbs>
      </Box>

      <Paper sx={{ p: 3, mb: 5 }} elevation={2}>
        <Typography variant="h4" component="h1" gutterBottom>
          {lesson.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Duration: {lesson.duration}
        </Typography>
        <Box sx={{
              fontSize: '1.5rem',
              p: 3,
              lineHeight: 1.8,
              '& > *': {
                marginBottom: '1.5rem',
                '&:last-child': {
                  marginBottom: 0
                }
              },
              '& img': {
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 1,
                my: 3,
              },
              '& h1, & h2, & h3, & h4, & h5, & h6': {
                marginTop: '2rem',
                marginBottom: '1rem',
                fontWeight: 600,
                lineHeight: 1.3,
                '&:first-child': {
                  marginTop: 0
                }
              },
              '& h1': { fontSize: '2.5rem' },
              '& h2': { fontSize: '2rem' },
              '& h3': { fontSize: '1.75rem' },
              '& h4': { fontSize: '1.5rem' },
              '& h5': { fontSize: '1.25rem' },
              '& h6': { fontSize: '1.1rem' },
              '& p': {
                marginBottom: '1.5rem',
                lineHeight: 1.8,
                '&:last-child': {
                  marginBottom: 0
                }
              },
              '& pre': {
                backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                overflowX: 'auto',
                margin: '1.5rem 0',
                fontSize: '1.2rem',
                '& code': {
                  fontFamily: 'monospace',
                  fontSize: '0.9em',
                  lineHeight: 1.5,
                }
              },
              '& code': {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                padding: '0.2em 0.4em',
                borderRadius: '0.3em',
                fontSize: '0.9em',
                fontFamily: 'monospace',
              },
              '& a': {
                color: theme.palette.primary.main,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                }
              },
              '& blockquote': {
                borderLeft: `4px solid ${theme.palette.divider}`,
                padding: '0.5rem 0 0.5rem 1rem',
                margin: '1.5rem 0',
                color: theme.palette.text.secondary,
                '& > p': {
                  margin: 0,
                }
              },
              '& ul, & ol': {
                paddingLeft: '1.5rem',
                margin: '1rem 0',
                '& li': {
                  marginBottom: '0.5rem',
                  '&:last-child': {
                    marginBottom: 0
                  }
                }
              },
              '& table': {
                width: '100%',
                borderCollapse: 'collapse',
                margin: '1.5rem 0',
                '& th, & td': {
                  border: `1px solid ${theme.palette.divider}`,
                  padding: '0.75rem',
                  textAlign: 'left',
                },
                '& th': {
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  fontWeight: 600,
                },
                '& tr:nth-of-type(even)': {
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                }
              },
              '& hr': {
                border: 'none',
                borderTop: `1px solid ${theme.palette.divider}`,
                margin: '2rem 0',
              },
              '& .contains-task-list': {
                listStyle: 'none',
                paddingLeft: '1.5rem',
                '& li': {
                  display: 'flex',
                  alignItems: 'flex-start',
                  '& > input[type="checkbox"]': {
                    marginRight: '0.5rem',
                    marginTop: '0.3em',
                  }
                }
              }
            }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {lesson.content}
          </ReactMarkdown>
        </Box>
      </Paper>
    </Container>
  );
};

export default LessonContent;