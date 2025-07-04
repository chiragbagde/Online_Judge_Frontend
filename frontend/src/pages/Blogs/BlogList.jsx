import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Typography, 
  Button, 
  Box, 
  CircularProgress,
  Pagination,
  TextField,
  InputAdornment,
  Paper,
  Stack,
  Fade,
  useTheme,
  useMediaQuery,
  Alert
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Article,
  TrendingUp,
  AutoAwesome,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useGetBlogsQuery } from '../../apis/blogApi';
import BlogCard from './BlogCard';

const BlogList = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDark = theme.palette.mode === 'dark';

  // RTK Query hook
  const {
    data: blogsData,
    isLoading: loading,
    error,
    refetch
  } = useGetBlogsQuery({
    page,
    limit: 9,
    search: searchQuery,
  });

  const blogs = blogsData?.data || [];
  const totalPages = blogsData?.pagination?.pages || 1;

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchQuery(searchInput);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchInput('');
    setPage(1);
  };

  const handleRetry = () => {
    refetch();
  };

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: isDark 
            ? 'linear-gradient(135deg, #0a0e27 0%, #1a1d35 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Paper
          sx={{
            p: 4,
            background: isDark ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            textAlign: 'center'
          }}
        >
          <Alert severity="error" sx={{ mb: 3 }}>
            {error.data?.message || 'Failed to load blogs'}
          </Alert>
          <Button 
            variant="contained" 
            startIcon={<RefreshIcon />}
            onClick={handleRetry}
            sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600 }}
          >
            Retry
          </Button>
        </Paper>
      </Box>
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
                <TrendingUp sx={{ fontSize: 40, color: '#ffd700' }} />
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
                  Blog Archive
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
                Explore our comprehensive collection of development articles and tutorials
              </Typography>
            </Box>
          </Box>
        </Fade>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            backgroundColor: isDark ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          }}
        >
          <Box component="form" onSubmit={handleSearch}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search for articles, tutorials, guides..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
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
                endAdornment: (
                  <Button 
                    type="submit" 
                    variant="contained"
                    sx={{
                      ml: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: theme.shadows[4],
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Search
                  </Button>
                ),
              }}
            />
          </Box>
        </Paper>
        
        {loading && blogs.length === 0 ? (
          <Box
            sx={{
              minHeight: '50vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Paper
              sx={{
                p: 4,
                background: isDark ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                textAlign: 'center'
              }}
            >
              <CircularProgress size={40} thickness={4} />
              <Typography variant="h6" sx={{ mt: 2 }}>Loading blogs...</Typography>
            </Paper>
          </Box>
        ) : blogs.length === 0 ? (
          <Paper
            sx={{
              p: 8,
              textAlign: 'center',
              backgroundColor: isDark ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            }}
          >
            <Article sx={{ fontSize: 60, color: 'text.disabled', mb: 3 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No blog posts found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {searchQuery ? 'Try adjusting your search terms' : 'Check back later for new articles!'}
            </Typography>
            {searchQuery && (
              <Button
                variant="outlined"
                onClick={handleClearSearch}
                sx={{
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Clear Search
              </Button>
            )}
          </Paper>
        ) : (
          <>
            <Grid container spacing={4}>
              {blogs.map((blog, index) => (
                <Grid item xs={12} sm={6} lg={4} key={blog._id}>
                  <Fade in timeout={600 + index * 100}>
                    <Box>
                      <BlogCard blog={blog} />
                    </Box>
                  </Fade>
                </Grid>
              ))}
            </Grid>
            
            {totalPages > 1 && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mt: 8,
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: isDark ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 4,
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                  }}
                >
                  <Pagination 
                    count={totalPages} 
                    page={page} 
                    onChange={handlePageChange} 
                    color="primary" 
                    size={isMobile ? "medium" : "large"}
                    sx={{
                      '& .MuiPaginationItem-root': {
                        borderRadius: 2,
                        fontWeight: 600,
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: theme.shadows[2],
                        },
                        transition: 'all 0.2s ease',
                      },
                      '& .Mui-selected': {
                        background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                        color: 'white',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                        }
                      }
                    }}
                  />
                </Paper>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default BlogList;
