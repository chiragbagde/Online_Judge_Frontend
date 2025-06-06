import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Box, 
  CircularProgress,
  Chip,
  Pagination,
  TextField,
  InputAdornment
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { getBlogs } from '../../apis/blogApi';
import { formatDate } from '../../utils/dateUtils';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await getBlogs(page, 9, searchQuery);
      setBlogs(response.data);
      setTotalPages(response.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page, searchQuery]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBlogs();
  };

  if (loading && blogs.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Blog Posts
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Discover the latest articles and tutorials
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSearch} mb={4}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search blogs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                sx={{ ml: 1 }}
              >
                Search
              </Button>
            ),
          }}
        />
      </Box>

      
      {blogs.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="textSecondary">
            No blog posts found. Check back later for updates!
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={4}>
            {blogs.map((blog) => (
              <Grid item xs={12} sm={6} md={4} key={blog._id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3,
                    },
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/blogs/${blog.slug}`)}
                >
                  {blog.featuredImage && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={blog.featuredImage}
                      alt={blog.title}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                      {blog.tags?.slice(0, 3).map((tag) => (
                        <Chip 
                          key={tag} 
                          label={tag} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      ))}
                    </Box>
                    <Typography gutterBottom variant="h6" component="h2">
                      {blog.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                      {blog.excerpt?.substring(0, 150)}...
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt="auto">
                      <Typography variant="caption" color="textSecondary">
                        {formatDate(blog.publishedAt || blog.createdAt)}
                      </Typography>
                      <Box display="flex" alignItems="center">
                        <Typography variant="caption" color="textSecondary" sx={{ mr: 1 }}>
                          {blog.likes?.length || 0} {blog.likes?.length === 1 ? 'like' : 'likes'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {blog.comments?.length || 0} {blog.comments?.length === 1 ? 'comment' : 'comments'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={6}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default BlogList;
