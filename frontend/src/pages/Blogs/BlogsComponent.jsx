import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
  Button,
  CircularProgress,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Collapse,
  Container,
  Divider,
  Grid,
  Paper,
  Badge,
  useTheme
} from "@mui/material";
import {
  BookmarkAddOutlined,
  BookmarkAddedOutlined,
  Favorite,
  FavoriteBorder,
  TrendingUp,
  AccessTime as AccessTimeIcon,
  Comment as CommentIcon,
  Send as SendIcon,
  People as PeopleIcon,
  Search as SearchIcon,
  MailOutline as MailOutlineIcon,
  Add as AddIcon
} from "@mui/icons-material";
import { getBlogs, getTrendingArticles, getCategories, getPopularTags, getBlogBySlug, addComment } from '../../apis/blogApi';
import { timeAgo } from '../../utils/dateUtils';

const useIsTab = () => false;

const BlogsComponent = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme();
  const handleBlogClick = (slug) => {
    navigate(`/blogs/${slug}`);
  };
  const isMobile = useIsTab();
  const searchTimeoutRef = useRef(null);
  
  const [blogs, setBlogs] = useState([]);
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  
  // Comments state
  const [expandedBlogs, setExpandedBlogs] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalBlogs, setTotalBlogs] = useState(0);
  
  // Loading and UI state
  const [loading, setLoading] = useState(true);
  const [sidebarLoading, setSidebarLoading] = useState({
    trending: true,
    categories: true,
    tags: true
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchInput, setSearchInput] = useState('');

  const isDark = theme.palette.mode === "dark";

  // Toggle comments section for a blog
  const toggleComments = (blogId) => {
    setExpandedBlogs(prev => ({
      ...prev,
      [blogId]: !prev[blogId]
    }));
  };

  // Initialize comments from blog data when blogs are loaded
  useEffect(() => {
    if (blogs.length > 0) {
      const initialComments = {};
      blogs.forEach(blog => {
        if (blog.comments && blog.comments.length > 0) {
          initialComments[blog._id] = blog.comments;
        }
      });
      setComments(prev => ({
        ...prev,
        ...initialComments
      }));
    }
  }, [blogs]);

  // Handle adding a new comment
  const handleAddComment = async (blogId) => {
    // Get the blog to update local state
    const blogToUpdate = blogs.find(blog => blog._id === blogId);
    if (!newComment.trim()) return;
    
    if (!user) {
      toast.info('Please login to comment');
      return;
    }

    setCommentLoading(true);
    try {
      const comment = {
        content: newComment,
        author: user._id,
        name: user.name,
        avatar: user.avatar
      };

      const response = await addComment(blogId, comment);
      // Update local state for both comments and blog's comment count
      setComments(prev => ({
        ...prev,
        [blogId]: [...(prev[blogId] || []), response.data]
      }));
      
      // Update the blog's comment count in the blogs array
      setBlogs(prev => 
        prev.map(blog => 
          blog._id === blogId 
            ? { ...blog, commentsCount: (blog.commentsCount || 0) + 1 }
            : blog
        )
      );
      
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set a new timeout
    searchTimeoutRef.current = setTimeout(() => {
      setSearchQuery(value);
      setPage(1); // Reset to first page on new search
    }, 500);
  };

  // Fetch blogs with pagination and search
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await getBlogs({
        page,
        limit: 10,
        search: searchQuery,
        filter: activeFilter === 'all' ? '' : activeFilter
      });
      setBlogs(prev => page === 1 ? res.data : [...prev, ...res.data]);
      setTotalBlogs(res.total);
      setHasMore(res.hasMore);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  // Load more blogs
  const loadMore = () => {
    if (hasMore) {
      setPage(prev => prev + 1);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchBlogs();
    
    // Fetch trending articles
    const fetchTrending = async () => {
      try {
        const response = await getTrendingArticles({ limit: 5 });
        setTrendingArticles(response.data);
      } catch (error) {
        console.error('Error fetching trending articles:', error);
      } finally {
        setSidebarLoading(prev => ({ ...prev, trending: false }));
      }
    };

    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setSidebarLoading(prev => ({ ...prev, categories: false }));
      }
    };

    // Fetch popular tags
    const fetchPopularTags = async () => {
      try {
        const response = await getPopularTags({ limit: 10 });
        setPopularTags(response.data);
      } catch (error) {
        console.error('Error fetching popular tags:', error);
      } finally {
        setSidebarLoading(prev => ({ ...prev, tags: false }));
      }
    };

    fetchTrending();
    fetchCategories();
    fetchPopularTags();
  }, [page, searchQuery, activeFilter]);

  // Default image URL
  const defaultImage = 'https://via.placeholder.com/800x400?text=Blog+Image';

  // Handle image error
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loop if default image also fails
    e.target.src = defaultImage;
  };

  // Render blog card
  const renderBlogCard = (blog) => {
    const isExpanded = expandedBlogs[blog._id] || false;
    // Use comments from blog data if available, otherwise from comments state
    const blogComments = blog.comments || comments[blog._id] || [];
    
    return (
      <Card 
        key={blog._id} 
        sx={{ 
          mb: 3,
          height: '100%',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          '&:hover': {
            boxShadow: 3,
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease-in-out',
            cursor: 'pointer'
          },
          transition: 'all 0.3s ease-in-out'
        }}
        onClick={() => handleBlogClick(blog.slug)}
      >
        <Box 
          sx={{ 
            width: { xs: '100%', sm: '40%' },
            height: { xs: '200px', sm: 'auto' },
            minHeight: { sm: '200px' },
            position: 'relative',
            backgroundColor: 'background.paper',
            overflow: 'hidden'
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleBlogClick(blog.slug);
          }}
        >
          <CardMedia
            component="img"
            image={"https://picsum.photos/800/400"}
            alt={blog.title}
            onError={handleImageError}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0,
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          />
        </Box>
        <Box sx={{ 
          width: { xs: '100%', sm: blog.featuredImage ? '60%' : '100%' },
          display: 'flex',
          flexDirection: 'column',
          flex: 1
        }}>
        <CardContent>
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom
            onClick={(e) => {
              e.stopPropagation();
              handleBlogClick(blog.slug);
            }}
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              mb: 1.5,
              fontWeight: 600,
              color: 'text.primary',
              cursor: 'pointer',
              '&:hover': {
                color: 'primary.main',
                textDecoration: 'underline'
              }
            }}
          >
            {blog.title}
          </Typography>
          
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar 
              src={blog.author?.avatar} 
              alt={blog.author?.name}
              sx={{ width: 32, height: 32, mr: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              {blog.author?.name || 'Unknown Author'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mx: 1 }}>•</Typography>
            <Typography variant="body2" color="text.secondary">
              {timeAgo(blog.createdAt)}
            </Typography>
          </Box>
          
          <Box sx={{ 
            mb: 2,
            '& p': { 
              margin: 0,
              color: 'text.primary',
              '&:not(:last-child)': {
                mb: 1.5
              }
            },
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              mt: 2,
              mb: 1.5,
              color: 'text.primary',
              lineHeight: 1.2
            },
            '& a': {
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            },
            '& code': {
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              padding: '0.2em 0.4em',
              borderRadius: '3px',
              fontFamily: 'monospace',
              fontSize: '0.9em'
            },
            '& pre': {
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              padding: '1em',
              borderRadius: '4px',
              overflowX: 'auto',
              margin: '1em 0'
            },
            '& blockquote': {
              borderLeft: '4px solid #e0e0e0',
              paddingLeft: '1em',
              margin: '1em 0',
              color: 'text.secondary',
              fontStyle: 'italic'
            },
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '4px',
              margin: '1em 0'
            },
            '& ul, & ol': {
              paddingLeft: '1.5em',
              margin: '0.5em 0'
            },
            '& li': {
              marginBottom: '0.5em'
            },
            '& table': {
              width: '100%',
              borderCollapse: 'collapse',
              margin: '1em 0',
              '& th, & td': {
                border: '1px solid #e0e0e0',
                padding: '0.5em 1em',
                textAlign: 'left'
              },
              '& th': {
                backgroundColor: 'rgba(0, 0, 0, 0.02)'
              }
            }
          }}>
            <ReactMarkdown>
              {blog.excerpt || blog.content || ''}
            </ReactMarkdown>
          </Box>
          
          <Box sx={{ mt: 'auto', pt: 2 }}>
            <Box>
              <IconButton size="small" onClick={() => {}}>
                {blog.isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  {blog.likes?.length || 0}
                </Typography>
              </IconButton>
              
              <IconButton 
                size="small" 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleComments(blog._id);
                }}
              >
                <CommentIcon />
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  {blog.comments?.length || 0}
                </Typography>
              </IconButton>
              
              <IconButton size="small" onClick={() => {}}>
                {blog.isBookmarked ? <BookmarkAddedOutlined /> : <BookmarkAddOutlined />}
              </IconButton>
            </Box>
            
            <Button 
              variant="text" 
              size="small" 
              onClick={() => navigate(`/blogs/${blog.slug}`)}
            >
              Read More
            </Button>
          </Box>
          
          {/* Comments Section */}
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box mt={2} pt={2} borderTop={1} borderColor="divider">
              {/* Comment input */}
              {user ? (
                <Box display="flex" mb={2}>
                  <Avatar 
                    src={user.avatar} 
                    alt={user.name}
                    sx={{ width: 32, height: 32, mr: 1 }}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment(blog._id);
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={() => handleAddComment(blog._id)}
                            disabled={!newComment.trim() || commentLoading}
                          >
                            {commentLoading ? (
                              <CircularProgress size={20} />
                            ) : (
                              <SendIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              ) : (
                <Box mb={2} textAlign="center">
                  <Button 
                    variant="outlined" 
                    color="primary"
                    onClick={() => navigate('/login')}
                  >
                    Login to comment
                  </Button>
                </Box>
              )}
              
              {/* Comments list */}
              {blogComments.length > 0 && (
                <List>
                  {blogComments.map((comment) => (
                    <ListItem key={comment._id} alignItems="flex-start" disableGutters>
                      <Box display="flex" width="100%">
                        <Avatar 
                          src={comment.author?.avatar} 
                          alt={comment.author?.name}
                          sx={{ width: 32, height: 32, mr: 1, mt: 0.5 }}
                        />
                        <Box flex={1}>
                          <Box display="flex" alignItems="center" mb={0.5}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              {comment.author?.name || 'Anonymous'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </Typography>
                          </Box>
                          <Typography variant="body2">
                            {comment.content}
                          </Typography>
                        </Box>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              )}
              
              {blogComments.length === 0 && !commentLoading && (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                  No comments yet. Be the first to comment!
                </Typography>
              )}
            </Box>
          </Collapse>
        </CardContent>
        </Box>
      </Card>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/blogs/new')}
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1
          }}
        >
          New Post
        </Button>
      </Box>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', lg: 'row' }, 
        gap: 4,
        maxWidth: '1440px',
        mx: 'auto',
        px: { xs: 2, sm: 3, md: 4 }
      }}>
        {/* Main content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Hero Section */}
          <Box sx={{ 
            mb: 6,
            textAlign: 'center',
            background: isDark
              ? 'linear-gradient(135deg,rgb(50, 42, 42) 0%,rgb(30, 18, 21) 100%)'
              : 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',            borderRadius: 4,
            p: { xs: 4, md: 6 },
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                mb: 2,
                fontWeight: 700,
                background: 'linear-gradient(90deg, #3f51b5 0%, #2196f3 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2rem', md: '2.75rem' }
              }}
            >
              Insights & Updates
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                maxWidth: '700px',
                mx: 'auto',
                mb: 3,
                fontSize: { xs: '1rem', md: '1.25rem' }
              }}
            >
              Discover the latest articles, tutorials, and insights from our community
            </Typography>
            <Box sx={{ maxWidth: '600px', mx: 'auto' }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search articles..."
                value={searchInput}
                onChange={handleSearch}
                InputProps={{
                  sx: { 
                    bgcolor: 'background.paper',
                    borderRadius: '50px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
          
          {/* Filter chips */}
          <Box sx={{ 
            mb: 4,
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 1.5,
            justifyContent: 'center'
          }}>
            {['all', 'popular', 'recent', 'trending'].map((filter) => (
              <Chip
                key={filter}
                label={filter.charAt(0).toUpperCase() + filter.slice(1)}
                onClick={() => setActiveFilter(filter)}
                color={activeFilter === filter ? 'primary' : 'default'}
                variant={activeFilter === filter ? 'filled' : 'outlined'}
                sx={{
                  px: 2,
                  py: 1,
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }
                }}
              />
            ))}
          </Box>
          
          {/* Blog list */}
          {loading && blogs.length === 0 ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : blogs?.length > 0 ? (
            <Grid container spacing={3}>
              {blogs.map(blog => (
                <Grid item xs={12} key={blog._id}>
                  {renderBlogCard(blog)}
                </Grid>
              ))}
              {hasMore && (
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="center" mt={3}>
                    <Button 
                      variant="outlined" 
                      onClick={loadMore}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : null}
                    >
                      {loading ? 'Loading...' : 'Load More'}
                    </Button>
                  </Box>
                </Grid>
              )}
            </Grid>
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No blogs found
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Try adjusting your search or filter to find what you're looking for.
              </Typography>
            </Paper>
          )}
        </Box>
        
        {/* Sidebar */}
        <Box sx={{ 
          width: { xs: '100%', lg: '350px' }, 
          flexShrink: 0,
          position: 'sticky',
          top: '100px',
          alignSelf: 'flex-start',
          '& > *': {
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
            },
            '&:not(:last-child)': {
              mb: 3
            }
          }
        }}>
          {/* About Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                About Blog
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Welcome to our blog! Discover the latest articles, tutorials, and insights on technology, programming, and more.
              </Typography>
              <Button 
                variant="outlined" 
                size="small" 
                sx={{ mt: 2 }}
                startIcon={<MailOutlineIcon />}
              >
                Subscribe
              </Button>
            </CardContent>
          </Card>
          
          {/* Trending Articles */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingUp sx={{ mr: 1 }} />
                <Typography variant="h6">Trending</Typography>
              </Box>
              
              {sidebarLoading.trending ? (
                <Box display="flex" justifyContent="center" py={2}>
                  <CircularProgress size={24} />
                </Box>
              ) : trendingArticles.length > 0 ? (
                <List>
                  {trendingArticles.map((article) => (
                    <ListItem 
                      key={article._id} 
                      button 
                      disableGutters
                      onClick={() => navigate(`/blogs/${article.slug}`)}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        }
                      }}
                    >
                      <ListItemText
                        primary={article.title}
                        primaryTypographyProps={{
                          variant: 'body2',
                          noWrap: true,
                          title: article.title,
                          sx: { fontWeight: 500 }
                        }}
                        secondary={timeAgo(article.publishedAt)}
                        secondaryTypographyProps={{
                          variant: 'caption',
                          color: 'text.secondary'
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={1}>
                  No trending articles
                </Typography>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Categories
              </Typography>
              
              {sidebarLoading.categories ? (
                <Box display="flex" justifyContent="center" py={2}>
                  <CircularProgress size={24} />
                </Box>
              ) : categories.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {categories.map((category, index) => (
                    <Chip 
                      key={`category-${index}`}
                      label={category} 
                      size="small" 
                      variant="outlined"
                      onClick={() => setActiveFilter(category)}
                      sx={{
                        mb: 0.5,
                        '&:hover': {
                          bgcolor: 'primary.light',
                          color: 'primary.contrastText'
                        }
                      }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={1}>
                  No categories found
                </Typography>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Popular Tags
              </Typography>
              
              {sidebarLoading.tags ? (
                <Box display="flex" justifyContent="center" py={2}>
                  <CircularProgress size={24} />
                </Box>
              ) : popularTags.length > 0 ? (
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {popularTags.map((tag) => (
                    <Chip
                      key={tag._id}
                      label={tag.name}
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setSearchQuery(tag.name);
                        setSearchInput(tag.name);
                        setActiveFilter('all');
                      }}
                      sx={{ mb: 0.5 }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={1}>
                  No tags found
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default BlogsComponent;
