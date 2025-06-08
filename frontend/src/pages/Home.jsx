import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  useTheme, 
  useMediaQuery,
  Chip,
  alpha,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  CardActions,
  Avatar,
  Skeleton
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { getBlogs, getTrendingArticles } from '../apis/blogApi';
import { formatDistanceToNow } from 'date-fns';

import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import DailyChallenge from '../components/home/DailyChallenge';
import ProblemCategories from '../components/home/ProblemCategories';
import LearningPaths from '../components/home/LearningPaths';
import axios from 'axios';
import urlConstants from '../apis/urlConstants';
import { getConfig } from '../utils/getConfig';

const accent = "#7b5cff";
const accent2 = "#00e0d3";

const BlogPostCard = ({ blog }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[8],
      },
    }}>
      <CardActionArea 
        onClick={() => navigate(`/blogs/${blog.slug}`)}
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
      >
        <Box sx={{ width: '100%', height: 200, position: 'relative' }}>
          {!imageLoaded && (
            <Skeleton variant="rectangular" width="100%" height={200} />
          )}
          <CardMedia
            component="img"
            height="200"
            image={blog.featuredImage || 'https://source.unsplash.com/random/600x400?programming'}
            alt={blog.title}
            onLoad={() => setImageLoaded(true)}
            sx={{
              display: imageLoaded ? 'block' : 'none',
              objectFit: 'cover',
              width: '100%',
            }}
          />
        </Box>
        <CardContent sx={{ width: '100%' }}>
          <Box display="flex" gap={1} mb={1} flexWrap="wrap">
            {blog.tags?.slice(0, 2).map((tag, index) => (
              <Chip 
                key={index} 
                label={tag} 
                size="small" 
                sx={{ 
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  color: 'text.secondary',
                  fontSize: '0.7rem',
                }} 
              />
            ))}
          </Box>
          <Typography 
            variant="h6" 
            component="h3"
            gutterBottom
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minHeight: '3.5rem',
              mb: 1,
            }}
          >
            {blog.title}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              mb: 2,
              minHeight: '4.5rem',
            }}
          >
            {blog.excerpt || blog.content.substring(0, 200) + '...'}
          </Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center" mt="auto">
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar 
                src={blog.author?.avatar} 
                alt={blog.author?.name}
                sx={{ width: 32, height: 32 }}
              >
                {blog.author?.name?.charAt(0) || 'U'}
              </Avatar>
              <Box>
                <Typography variant="caption" display="block" lineHeight={1.2}>
                  {blog.author?.name || 'Anonymous'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {blog.createdAt ? formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true }) : ''}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="caption" color="text.secondary">
                {blog.readingTime || '5'} min read
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dailyProblem, setDailyProblem] = useState(null);
  
  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  
  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        setLoading(true);
        const response = await getBlogs({ limit: 5, page: 1 });
        setFeaturedPosts(response.data || []);
      } catch (error) {
        console.error('Error fetching featured posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPosts();
  }, []);

  useEffect(() => {
    const fetchDailyProblem = async () => {
      try {
        setLoading(true);
        const {data} = await axios.get(`${urlConstants.getDailyProblem}`, getConfig());
        console.log(data.dailyProblem);
        setDailyProblem(data.dailyProblem || []);
      } catch (error) {
        console.error('Error fetching daily problem:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyProblem();
  }, []);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh',
      bgcolor: 'background.default',
    }}>
      <HeroSection onSearch={handleSearch} />
      
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box mb={10}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h4" component="h2" fontWeight={700}>
              Latest Blog Posts
            </Typography>
            <Button 
              component={Link} 
              to="/blogs" 
              variant="outlined"
              endIcon={<span>→</span>}
              sx={{ textTransform: 'none' }}
            >
              View All Posts
            </Button>
          </Box>
          
          {loading ? (
            <Grid container spacing={3}>
              {[1, 2, 3].map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item}>
                  <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
                </Grid>
              ))}
            </Grid>
          ) : featuredPosts.length > 0 ? (
            <Grid container spacing={3}>
              {featuredPosts.map((post) => (
                <Grid item xs={12} sm={6} md={4} key={post._id}>
                  <BlogPostCard blog={post} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box 
              display="flex" 
              flexDirection="column" 
              alignItems="center" 
              justifyContent="center" 
              minHeight="200px"
              textAlign="center"
              p={4}
              sx={{ 
                bgcolor: 'background.paper', 
                borderRadius: 2,
                border: `1px dashed ${theme.palette.divider}`
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No blog posts found
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Check back later for new content
              </Typography>
              <Button 
                component={Link} 
                to="/blogs/new" 
                variant="contained"
                color="primary"
                sx={{ textTransform: 'none' }}
              >
                Write Your First Post
              </Button>
            </Box>
          )}
        </Box>
      </Container>
      
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 800, 
                  mb: 4,
                  background: `linear-gradient(90deg, ${accent}, ${accent2})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block',
                }}
              >
                Today's Challenge
              </Typography>
              <DailyChallenge loading={loading} dailyProblem={dailyProblem} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 800, 
                  mb: 4,
                  background: `linear-gradient(90deg, ${accent}, ${accent2})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block',
                }}
              >
                Quick Links
              </Typography>
              <Box sx={{ 
                bgcolor: 'background.paper',
                borderRadius: 3,
                p: 3,
                boxShadow: theme.shadows[1],
                border: `1px solid ${theme.palette.divider}`,
              }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Get Started
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    { text: 'Explore Problems', to: '/problems', icon: '🔍' },
                    { text: 'View Contests', to: '/competitions', icon: '🏆' },
                    { text: 'Join Community', to: '/community', icon: '👥' },
                    { text: 'Read Blog', to: '/blogs', icon: '📝' },
                  ].map((item, index) => (
                    <Box 
                      key={index}
                      component={Link} 
                      to={item.to}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 2,
                        textDecoration: 'none',
                        color: 'text.primary',
                        bgcolor: 'background.default',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'translateX(4px)',
                          boxShadow: theme.shadows[2],
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      <Box sx={{ fontSize: '1.5rem', mr: 2 }}>{item.icon}</Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {item.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      <ProblemCategories />
      
      <LearningPaths />
      
      <Box sx={{ 
        py: 12, 
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        position: 'relative',
        overflow: 'hidden',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at top right, ' + 
            alpha(theme.palette.primary.light, 0.2) + ' 0%, ' + 
            alpha(theme.palette.primary.dark, 0.2) + ' 100%)',
          zIndex: 0,
        },
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800, 
              mb: 3,
              color: 'white',
            }}
          >
            Ready to take your coding skills to the next level?
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 5, 
              maxWidth: '700px', 
              mx: 'auto',
              opacity: 0.9,
              color: 'white',
            }}
          >
            Join thousands of developers who have improved their coding skills with our platform.
            Start solving problems today and track your progress.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              href="/signup"
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1.1rem',
                boxShadow: '0 4px 20px ' + alpha(theme.palette.secondary.main, 0.3),
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 24px ' + alpha(theme.palette.secondary.main, 0.4),
                },
                transition: 'all 0.3s ease',
              }}
            >
              Get Started for Free
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              href="/problems"
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1.1rem',
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  bgcolor: alpha(theme.palette.common.white, 0.1),
                },
              }}
            >
              Explore Problems
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
