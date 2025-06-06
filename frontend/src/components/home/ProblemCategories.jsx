import React from 'react';
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
  Divider,
  Chip
} from '@mui/material';
import { 
  Code, 
  DataArray, 
  AccountTree, 
  Sort, 
  Share, 
  Functions,
  Storage,
  Security,
  ArrowForward
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 'arrays',
    title: 'Arrays',
    icon: <DataArray sx={{ fontSize: 32 }} />,
    count: 150,
    color: '#7b5cff',
    description: 'Master array manipulation and common patterns'
  },
  {
    id: 'strings',
    title: 'Strings',
    icon: <Code sx={{ fontSize: 32 }} />,
    count: 120,
    color: '#00e0d3',
    description: 'Solve string manipulation and pattern matching problems'
  },
  {
    id: 'trees',
    title: 'Trees',
    icon: <AccountTree sx={{ fontSize: 32 }} />,
    count: 90,
    color: '#ff6b6b',
    description: 'Master tree traversals and common tree algorithms'
  },
  {
    id: 'sorting',
    title: 'Sorting',
    icon: <Sort sx={{ fontSize: 32 }} />,
    count: 60,
    color: '#4dabf7',
    description: 'Learn and implement various sorting algorithms'
  },
  {
    id: 'dynamic-programming',
    title: 'Dynamic Programming',
    icon: <Functions sx={{ fontSize: 32 }} />,
    count: 80,
    color: '#ffd43b',
    description: 'Solve problems using dynamic programming techniques'
  },
  {
    id: 'graphs',
    title: 'Graphs',
    icon: <Share sx={{ fontSize: 32 }} />,
    count: 110,
    color: '#69db7c',
    description: 'Master graph algorithms and traversals'
  },
  {
    id: 'databases',
    title: 'Databases',
    icon: <Storage sx={{ fontSize: 32 }} />,
    count: 45,
    color: '#ff922b',
    description: 'SQL and NoSQL database problems and optimization'
  },
  {
    id: 'system-design',
    title: 'System Design',
    icon: <Security sx={{ fontSize: 32 }} />,
    count: 35,
    color: '#9c36b5',
    description: 'Design scalable and efficient systems'
  }
];

const ProblemCategories = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 3, md: 4 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
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
            Problem Categories
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
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
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
                  to={`/problems?category=${category.id}`}
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
                        {category.description}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Chip 
                        label={`${category.count} Problems`} 
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
          ))}
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
