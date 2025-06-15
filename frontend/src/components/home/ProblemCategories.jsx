import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardActionArea, 
  CardContent, 
  useTheme, 
  alpha,
  Button,
  Chip
} from '@mui/material';
import { 
  Code, 
  DataArray, 
  AccountTree, 
  Sort, 
  Share, 
  Functions,
  Search,
  ArrowForward
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import useProblemsApi from '../../pages/Problems/hooks/use-problems-api';
import { categoryConfig } from './data/problem-categories';

const ProblemCategories = () => {
  const theme = useTheme();
  const [topicCounts, setTopicCounts] = useState([]);
  const { fetchTopicCounts } = useProblemsApi();

  useEffect(() => {
    const getTopicCounts = async () => {
      try {
        const data = await fetchTopicCounts();
        setTopicCounts(data.topicCounts);
      } catch (e) {
        console.error(e);
      }
    };
    getTopicCounts();
  }, []);

  const sortedTopics = [...topicCounts].sort((a, b) => b.count - a.count);

  return (
    <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 3, md: 4 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
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
            Explore by Category
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
            Browse through our extensive collection of coding problems organized by categories and difficulty levels.
          </Typography>
        </Box>
        
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {sortedTopics.map((topic) => {
            const category = categoryConfig[topic._id];
            if (!category) return null;

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={topic._id}>
                <Card 
                  elevation={0}
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 10px 30px ${alpha(theme.palette.primary.main, 0.1)}`,
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                    },
                  }}
                >
                  <CardActionArea 
                    component={Link} 
                    to={`/problems?category=${topic._id}`}
                    sx={{ height: '100%', p: 0 }}
                  >
                    <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Box 
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 3,
                          background: `linear-gradient(135deg, ${alpha(category.color, 0.1)} 0%, ${alpha(category.color, 0.05)} 100%)`,
                          color: category.color,
                        }}
                      >
                        {category.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="h6" 
                          component="h3" 
                          sx={{ 
                            fontWeight: 700,
                            mb: 1,
                            color: 'text.primary',
                          }}
                        >
                          {category.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            mb: 2,
                            minHeight: 40,
                          }}
                        >
                          {topic.description}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Chip 
                          label={`${topic.count} Problems`} 
                          size="small" 
                          sx={{ 
                            bgcolor: alpha(category.color, 0.1),
                            color: category.color,
                            fontWeight: 600,
                          }}
                        />
                        <Box 
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            bgcolor: category.color,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateX(4px)',
                            },
                          }}
                        >
                          <ArrowForward sx={{ fontSize: 16 }} />
                        </Box>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
        
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            component={Link}
            to="/problems"
            variant="outlined"
            color="primary"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1.1rem',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.05),
              },
            }}
          >
            View All Problems
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProblemCategories;
