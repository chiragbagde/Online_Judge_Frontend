import React, { useState, useEffect, useRef } from 'react';
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
  useTheme
} from "@mui/material";
import { Search as SearchIcon, Add as AddIcon } from "@mui/icons-material";
import { getBlogs, getTrendingArticles, getPopularTags } from '../../apis/blogApi';
import BlogCard from './BlogCard';
import BlogSidebar from './BlogSidebar';

const BlogsComponent = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const searchTimeoutRef = useRef(null);
  
  const [blogs, setBlogs] = useState([]);
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const [loading, setLoading] = useState(true);
  const [sidebarLoading, setSidebarLoading] = useState({
    trending: true,
    tags: true
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchInput, setSearchInput] = useState('');

  const isDark = theme.palette.mode === "dark";

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setSearchQuery(value);
      setPage(1);
    }, 500);
  };

  const fetchBlogs = async (isNewSearch = false) => {
    try {
      setLoading(true);
      const res = await getBlogs({
        page: isNewSearch ? 1 : page,
        limit: 15,
        search: searchQuery,
        tag: activeFilter !== 'all' ? activeFilter : undefined
      });
      setBlogs(isNewSearch ? res.data : (prev) => [...prev, ...res.data]);
      setHasMore(res.hasMore);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(true);
  }, [searchQuery, activeFilter]);

  useEffect(() => {
    if (page > 1) {
      fetchBlogs();
    }
  }, [page]);
  
  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        setSidebarLoading({ trending: true, tags: true });
        const [trendingRes, tagsRes] = await Promise.all([
          getTrendingArticles({ limit: 5 }),
          getPopularTags({ limit: 10 })
        ]);
        setTrendingArticles(trendingRes.data);
        setPopularTags(tagsRes.data);
      } catch (error) {
        console.error('Error fetching sidebar data:', error);
      } finally {
        setSidebarLoading({ trending: false, tags: false });
      }
    };
    fetchSidebarData();
  }, []);

  const handleTagClick = (tag) => {
    setPage(1);
    setActiveFilter(tag);
    setSearchQuery('');
    setSearchInput('');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, backgroundColor: isDark ? theme.palette.background.default : '#f4f6f8' }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold' }}>
          Tech & Code Insights
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
          Your daily dose of development articles, tutorials, and discussions.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <TextField
              variant="outlined"
              placeholder="Search articles..."
              value={searchInput}
              onChange={handleSearch}
              sx={{
                flexGrow: 1,
                mr: 2,
                '& .MuiOutlinedInput-root': { borderRadius: '8px' }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => navigate('/blogs/new')}
              sx={{ py: '12px', px: 3, borderRadius: '8px', textTransform: 'none', fontWeight: 'bold' }}
            >
              New Post
            </Button>
          </Box>
          
          <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              label="All Posts" 
              clickable 
              onClick={() => handleTagClick('all')}
              color={activeFilter === 'all' ? 'primary' : 'default'}
              variant={activeFilter === 'all' ? 'filled' : 'outlined'}
            />
            {popularTags.slice(0, 5).map(tag => (
              <Chip
                key={tag.name}
                label={tag.name}
                clickable
                onClick={() => handleTagClick(tag.name)}
                color={activeFilter === tag.name ? 'primary' : 'default'}
                variant={activeFilter === tag.name ? 'filled' : 'outlined'}
              />
            ))}
          </Box>

          {loading && page === 1 ? (
            <Box sx={{ textAlign: 'center', p: 5 }}><CircularProgress /></Box>
          ) : blogs.length > 0 ? (
            <Grid container spacing={4}>
              {blogs.map((blog) => (
                <Grid item xs={12} md={6} key={blog._id}>
                  <BlogCard blog={blog} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography sx={{ textAlign: 'center', p: 5 }}>No blogs found.</Typography>
          )}

          {hasMore && !loading && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button variant="outlined" onClick={() => setPage(p => p + 1)}>
                Load More
              </Button>
            </Box>
          )}
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Box sx={{ position: 'sticky', top: '80px' }}>
            <BlogSidebar 
              loading={sidebarLoading}
              trending={trendingArticles}
              tags={popularTags}
              onTagClick={handleTagClick}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BlogsComponent;
