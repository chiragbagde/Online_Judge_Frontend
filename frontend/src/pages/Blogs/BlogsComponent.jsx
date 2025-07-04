import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  TextField,
  InputAdornment,
  Container,
  Grid,
  Chip,
  useTheme,
  Paper,
  Stack,
  Fade,
  useMediaQuery
} from "@mui/material";
import { 
  Search as SearchIcon, 
  Add as AddIcon,
  TrendingUp,
  Article,
  AutoAwesome
} from "@mui/icons-material";
import { 
  useGetBlogsQuery, 
  useGetTrendingArticlesQuery, 
  useGetPopularTagsQuery 
} from '../../apis/blogApi';
import BlogCard from './BlogCard';
import BlogSidebar from './BlogSidebar';

const BlogsComponent = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const searchTimeoutRef = useRef(null);
  
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchInput, setSearchInput] = useState('');

  const isDark = theme.palette.mode === "dark";

  // RTK Query hooks
  const {
    data: blogsData,
    isLoading: blogsLoading,
    isFetching: blogsFetching,
    error: blogsError
  } = useGetBlogsQuery({
    page,
    limit: 15,
    search: searchQuery,
    tag: activeFilter !== 'all' ? activeFilter : undefined,
  });

  const { 
    data: trendingArticles, 
    isLoading: trendingLoading,
    error: trendingError
  } = useGetTrendingArticlesQuery({ limit: 5 });

  const { 
    data: popularTags, 
    isLoading: tagsLoading,
    error: tagsError
  } = useGetPopularTagsQuery({ limit: 10 });

  const blogs = blogsData?.data || [];
  const hasMore = blogsData?.pagination?.page < blogsData?.pagination?.pages;

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setPage(1);
      setSearchQuery(value);
    }, 500);
  };

  const handleTagClick = (tag) => {
    setPage(1);
    setActiveFilter(tag);
    setSearchQuery('');
    setSearchInput('');
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  if (blogsError) {
    return (
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            backgroundColor: isDark ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          }}
        >
          <Typography variant="h5" color="error" gutterBottom>
            Failed to load blogs
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {blogsError.data?.message || 'An error occurred while loading the blogs'}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600 }}
          >
            Retry
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: isDark 
          ? 'linear-gradient(135deg, #0a0e27 0%, #1a1d35 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Fade in timeout={800}>
          <Box>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 3 }}>
                <AutoAwesome sx={{ fontSize: 40, color: '#ffd700' }} />
                <Typography 
                  variant="h2" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 900,
                    background: 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  DevHub Blog
                </Typography>
              </Stack>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: 300,
                  maxWidth: 600,
                  mx: 'auto',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                Discover cutting-edge development insights, tutorials, and tech discussions from our community
              </Typography>
            </Box>
          </Box>
        </Fade>

        <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                backgroundColor: isDark ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',

              }}
            >
              <Stack spacing={4}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <TextField
                    variant="outlined"
                    placeholder="Search for articles, tutorials, guides..."
                    value={searchInput}
                    onChange={handleSearch}
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 3,
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        '&:hover': {
                          backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                        },
                        '&.Mui-focused': {
                          backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                        }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/blogs/new')}
                    sx={{ 
                      py: 2, 
                      px: 4, 
                      borderRadius: 3, 
                      textTransform: 'none', 
                      fontWeight: 600,
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 25px rgba(102, 126, 234, 0.4)',
                      },
                      transition: 'all 0.3s ease',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {isMobile ? 'New' : 'Create Post'}
                  </Button>
                </Box>
                
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip 
                    label="All Posts" 
                    clickable 
                    onClick={() => handleTagClick('all')}
                    color={activeFilter === 'all' ? 'primary' : 'default'}
                    variant={activeFilter === 'all' ? 'filled' : 'outlined'}
                    icon={<Article />}
                    sx={{
                      borderRadius: 6,
                      fontWeight: 600,
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: theme.shadows[4],
                      },
                      transition: 'all 0.2s ease',
                    }}
                  />
                  {(popularTags?.data || []).slice(0, 6).map(tag => (
                    <Chip
                      key={tag.name}
                      label={`${tag.name} (${tag.count})`}
                      clickable
                      onClick={() => handleTagClick(tag.name)}
                      color={activeFilter === tag.name ? 'primary' : 'default'}
                      variant={activeFilter === tag.name ? 'filled' : 'outlined'}
                      sx={{
                        borderRadius: 6,
                        fontWeight: 500,
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: theme.shadows[4],
                        },
                        transition: 'all 0.2s ease',
                      }}
                    />
                  ))}
                </Stack>

                {blogsLoading && page === 1 ? (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <CircularProgress size={40} thickness={4} />
                    <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
                      Loading amazing content...
                    </Typography>
                  </Box>
                ) : blogs.length > 0 ? (
                  <Grid container spacing={3}>
                    {blogs.map((blog, index) => (
                      <Grid item xs={12} lg={6} key={blog._id}>
                        <Fade in timeout={600 + index * 100} unmountOnExit>
                          <Box>
                            <BlogCard blog={blog} />
                          </Box>
                        </Fade>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Article sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No articles found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {searchQuery ? 'Try adjusting your search or explore different tags' : 'Check back later for new articles!'}
                    </Typography>
                    {searchQuery && (
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setSearchQuery('');
                          setSearchInput('');
                          setActiveFilter('all');
                          setPage(1);
                        }}
                        sx={{
                          mt: 2,
                          borderRadius: 3,
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                      >
                        Clear Search
                      </Button>
                    )}
                  </Box>
                )}

                {hasMore && !blogsFetching && (
                  <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Button 
                      variant="outlined" 
                      onClick={handleLoadMore}
                      sx={{
                        py: 2,
                        px: 4,
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 600,
                        borderWidth: 2,
                        '&:hover': {
                          borderWidth: 2,
                          transform: 'translateY(-2px)',
                          boxShadow: theme.shadows[8],
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Load More Articles
                    </Button>
                  </Box>
                )}

                {blogsFetching && page > 1 && (
                  <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <CircularProgress size={24} />
                    <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                      Loading more articles...
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <BlogSidebar 
              loading={{ trending: trendingLoading, tags: tagsLoading }}
              trending={trendingArticles?.data || []}
              tags={popularTags?.data || []}
              onTagClick={handleTagClick}
              errors={{ trending: trendingError, tags: tagsError }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BlogsComponent;
