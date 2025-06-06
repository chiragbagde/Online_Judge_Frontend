import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { 
  Container, 
  Typography, 
  Box, 
  CircularProgress, 
  Button, 
  Divider, 
  Avatar, 
  TextField, 
  IconButton, 
  Chip,
  Grid,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Favorite as LikeIcon, 
  FavoriteBorder as LikeBorderIcon, 
  ArrowBack as BackIcon,
  Send as SendIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { getBlogBySlug, toggleLike, addComment, deleteBlog } from '../../apis/blogApi';
import { formatDate, formatDateTime } from '../../utils/dateUtils';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleComments, setVisibleComments] = useState(5);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await getBlogBySlug(slug);
        setBlog(response.data);
        setIsLiked(response.data.likes?.includes(user?._id) || false);
      } catch (error) {
        console.error('Error fetching blog:', error);
        toast.error('Failed to load blog post');
        navigate('/blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug, user?._id, navigate]);

  const handleLike = async () => {
    if (!user) {
      toast.info('Please login to like this post');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await toggleLike(blog._id);
      setBlog(prev => ({
        ...prev,
        likes: response.data.isLiked 
          ? [...prev.likes, user._id] 
          : prev.likes.filter(id => id !== user._id)
      }));
      setIsLiked(response.data.isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    if (!user) {
      toast.info('Please login to add a comment');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await addComment(blog._id, comment);
      
      // Add the new comment to the beginning of the comments array
      setBlog(prev => ({
        ...prev,
        comments: [response.data, ...(prev.comments || [])]
      }));
      
      // Reset the comment input and show success message
      setComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add comment';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBlog = () => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this blog post?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await deleteBlog(blog._id);
              toast.success('Blog post deleted successfully');
              navigate('/blogs');
            } catch (error) {
              console.error('Error deleting blog:', error);
              toast.error('Failed to delete blog post');
            }
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  };

  const handleEditBlog = () => {
    if (!user) {
      toast.error('Please sign in to edit this post');
      navigate('/signin', { state: { from: `/blogs/${blog.slug}` } });
      return;
    }
    
    if (user._id !== blog.author?._id && user.role !== 'admin') {
      toast.error('You do not have permission to edit this post');
      return;
    }
    
    navigate(`/blogs/edit/${blog._id}/${blog.slug}`, { state: { blog } });
  };

  if (loading || !blog) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const isAuthor = user && (user._id === blog.author?._id || user.role === 'admin');

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button 
        startIcon={<BackIcon />} 
        onClick={() => navigate('/blogs')}
        sx={{ mb: 2 }}
      >
        Back to Blogs
      </Button>

      {isAuthor && (
        <Box display="flex" justifyContent="flex-end" gap={1} mb={2}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEditBlog}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteBlog}
          >
            Delete
          </Button>
        </Box>
      )}

      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {blog.title}
        </Typography>
        
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar 
            src={blog.author?.avatar} 
            alt={blog.author?.name}
            sx={{ width: 40, height: 40, mr: 1.5 }}
          >
            {blog.author?.name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1">
              {blog.author?.name || 'Anonymous'}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {formatDateTime(blog.publishedAt || blog.createdAt)}
              {blog.updatedAt > blog.createdAt && ` • Updated ${formatDate(blog.updatedAt)}`}
            </Typography>
          </Box>
        </Box>

        {blog.featuredImage && (
          <Box mb={4} borderRadius={2} overflow="hidden">
            <img 
              src={blog.featuredImage} 
              alt={blog.title} 
              style={{ 
                width: '100%', 
                maxHeight: '500px', 
                objectFit: 'cover',
                borderRadius: '8px'
              }} 
            />
          </Box>
        )}

        <Box mb={4}>
          {blog.tags?.length > 0 && (
            <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
              {blog.tags.map((tag) => (
                <Chip 
                  key={tag} 
                  label={`#${tag}`} 
                  size="small" 
                  variant="outlined"
                  onClick={() => navigate(`/blogs?tag=${encodeURIComponent(tag)}`)}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          )}

          <Box 
            className="blog-content"
            sx={{
              fontSize: '1.2rem',
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
            }}
          >
            <ReactMarkdown>
              {blog.content}
            </ReactMarkdown>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2} mb={4}>
          <Box display="flex" alignItems="center">
            <IconButton 
              onClick={handleLike} 
              disabled={isSubmitting}
              color={isLiked ? 'error' : 'default'}
              aria-label={isLiked ? 'Unlike' : 'Like'}
            >
              {isLiked ? <LikeIcon /> : <LikeBorderIcon />}
            </IconButton>
            <Typography variant="body1">
              {blog.likes?.length || 0} {blog.likes?.length === 1 ? 'Like' : 'Likes'}
            </Typography>
          </Box>
          <Typography variant="body1" color="textSecondary">
            {blog.comments?.length || 0} {blog.comments?.length === 1 ? 'Comment' : 'Comments'}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" component="h2" gutterBottom>
          Comments
        </Typography>

        {user ? (
          <Box component="form" onSubmit={handleCommentSubmit} mb={4}>
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isSubmitting}
              InputProps={{
                endAdornment: (
                  <IconButton 
                    type="submit" 
                    color="primary" 
                    disabled={!comment.trim() || isSubmitting}
                  >
                    <SendIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>
        ) : (
          <Box textAlign="center" py={3} mb={4} bgcolor="action.hover" borderRadius={1}>
            <Typography variant="body1" gutterBottom>
              Please login to leave a comment
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate('/login', { state: { from: `/blogs/${slug}` } })}
            >
              Login
            </Button>
          </Box>
        )}

        {commentsError ? (
          <Box textAlign="center" py={3} color="error.main">
            <Typography>Error loading comments. Please try again.</Typography>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={() => window.location.reload()}
              sx={{ mt: 1 }}
            >
              Retry
            </Button>
          </Box>
        ) : blog.comments?.length > 0 ? (
          <Box>
            {blog.comments.slice(0, visibleComments).map((comment) => (
              <Box key={comment._id} mb={3}>
                <Box 
                  component="div"
                  display="flex" 
                  alignItems="flex-start" 
                  gap={2}
                  sx={{ cursor: 'default' }}
                >
                  <Box 
                    component="div"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      return false;
                    }}
                  >
                    <Avatar 
                      src={comment.user?.avatar} 
                      alt={comment.user?.name}
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        bgcolor: 'primary.main',
                        pointerEvents: 'none' // This will make the avatar itself non-interactive
                      }}
                    >
                      {comment.user?.name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </Box>
                  <Box flexGrow={1}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {comment.user?.name || 'Anonymous'}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {formatDateTime(comment.createdAt)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                      {comment.content}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
            {blog.comments.length > visibleComments && (
              <Box textAlign="center" mt={2}>
                <Button 
                  variant="outlined" 
                  onClick={() => setVisibleComments(prev => prev + 5)}
                  disabled={commentsLoading}
                >
                  {commentsLoading ? 'Loading...' : 'Load More Comments'}
                </Button>
              </Box>
            )}
          </Box>
        ) : (
          <Box textAlign="center" py={3} bgcolor="action.hover" borderRadius={1}>
            <Typography variant="body1" color="textSecondary">
              No comments yet. Be the first to comment!
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default BlogDetail;
