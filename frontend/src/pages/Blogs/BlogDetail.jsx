import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';
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
  useMediaQuery,
  Stack,
  Fade,
  Breadcrumbs,
  Link as MuiLink,
  Alert
} from '@mui/material';
import { 
  Favorite as LikeIcon, 
  FavoriteBorder as LikeBorderIcon, 
  ArrowBack as BackIcon,
  Send as SendIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as TimeIcon,
  Visibility as ViewIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import {
  useGetBlogBySlugQuery,
  useToggleLikeMutation,
  useAddCommentMutation,
  useDeleteBlogMutation,
  useIncrementBlogViewMutation,
} from '../../apis/blogApi';
import { formatDate, formatDateTime } from '../../utils/dateUtils';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useSelector } from 'react-redux';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDark = theme.palette.mode === 'dark';
  
  // RTK Query hooks
  const {
    data: blogData,
    isLoading: loading,
    error,
    refetch: refetchBlog
  } = useGetBlogBySlugQuery(slug);

  const [addComment, { isLoading: isAddingComment }] = useAddCommentMutation();
  const [toggleLike, { isLoading: isLiking }] = useToggleLikeMutation();
  const [deleteBlog] = useDeleteBlogMutation();
  const [incrementView] = useIncrementBlogViewMutation();

  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleComments, setVisibleComments] = useState(5);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState(null);

  const blog = blogData?.data;

  useEffect(() => {
    if (blog) {
      setIsLiked(blog.likes?.includes(user?._id) || false);
      // Increment view count when blog is loaded
      if (blog._id) {
        incrementView(blog._id);
      }
    }
    if (error) {
      toast.error('Failed to load blog post');
      navigate('/blogs');
    }
  }, [blog, user?._id, error, navigate, incrementView]);

  const handleLike = async () => {
    if (!user) {
      toast.info('Please login to like this post');
      return;
    }
    try {
      await toggleLike(blog._id).unwrap();
    } catch (error) {
      toast.error('Failed to like/unlike post');
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
      await addComment({ blogId: blog._id, content: comment }).unwrap();
      setComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      const errorMessage = error.data?.message || 'Failed to add comment';
      toast.error(errorMessage);
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
              await deleteBlog({ id: blog._id, u_id: user.id }).unwrap();
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

  const handleRetry = () => {
    refetchBlog();
  };

  if (loading || !blog) {
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
          <CircularProgress size={40} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2 }}>Loading article...</Typography>
        </Paper>
      </Box>
    );
  }

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
            {error.data?.message || 'Failed to load blog post'}
          </Alert>
          <Button 
            variant="contained" 
            onClick={handleRetry}
            sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600 }}
          >
            Retry
          </Button>
        </Paper>
      </Box>
    );
  }

  const isAuthor = user && blog && (user.id === blog.author || user.role === 'admin');

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: isDark 
          ? 'linear-gradient(135deg, #0a0e27 0%, #1a1d35 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Fade in timeout={600}>
          <Box>
            <Breadcrumbs 
              sx={{ 
                mb: 3, 
                '& .MuiBreadcrumbs-separator': { color: 'rgba(255,255,255,0.7)' },
                '& a, & span': { color: 'rgba(255,255,255,0.9)' }
              }}
            >
              <MuiLink 
                href="/blogs" 
                onClick={(e) => { e.preventDefault(); navigate('/blogs'); }}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                <HomeIcon sx={{ fontSize: 16 }} />
                Blogs
              </MuiLink>
              <Typography color="rgba(255,255,255,0.7)">{blog.title}</Typography>
            </Breadcrumbs>

            {isAuthor && (
              <Stack direction="row" spacing={1} sx={{ mb: 3, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleEditBlog}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    }
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteBlog}
                  sx={{
                    borderColor: 'rgba(244,67,54,0.5)',
                    '&:hover': {
                      borderColor: 'error.main',
                      backgroundColor: 'rgba(244,67,54,0.1)',
                    }
                  }}
                >
                  Delete
                </Button>
              </Stack>
            )}

            <Paper 
              elevation={0}
              sx={{
                background: isDark 
                  ? 'linear-gradient(145deg, rgba(30,30,30,0.95) 0%, rgba(40,40,40,0.95) 100%)'
                  : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                border: `1px solid ${isDark ? 'grey.800' : 'grey.200'}`,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                overflow: 'hidden'
              }}
            >
              {blog.featuredImage && (
                <Box 
                  sx={{ 
                    height: { xs: 250, md: 400 },
                    backgroundImage: `url(${blog.featuredImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%)',
                    }
                  }}
                />
              )}

              <Box sx={{ p: { xs: 3, md: 5 } }}>
                <Stack spacing={3}>
                  {blog.tags?.length > 0 && (
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {blog.tags.map((tag) => (
                        <Chip 
                          key={tag} 
                          label={`#${tag}`} 
                          size="small" 
                          onClick={() => navigate(`/blogs?tag=${encodeURIComponent(tag)}`)}
                          sx={{
                            backgroundColor: theme.palette.primary.main,
                            color: 'white',
                            fontWeight: 600,
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: theme.palette.primary.dark,
                              transform: 'translateY(-1px)',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        />
                      ))}
                    </Stack>
                  )}

                  <Typography 
                    variant="h3" 
                    component="h1" 
                    sx={{ 
                      fontWeight: 800,
                      lineHeight: 1.2,
                      fontSize: { xs: '2rem', md: '3rem' },
                      color: isDark ? 'grey.100' : 'grey.900',
                    }}
                  >
                    {blog.title}
                  </Typography>
                  
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    justifyContent="space-between" 
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    spacing={2}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar 
                        src={blog.author?.avatar} 
                        alt={blog.author?.name}
                        sx={{ 
                          width: 50, 
                          height: 50,
                          border: `3px solid ${theme.palette.primary.main}`,
                        }}
                      >
                        {blog.author?.name?.charAt(0)?.toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600,
                            color: isDark ? 'grey.200' : 'grey.800',
                          }}
                        >
                          {blog.author?.name || 'Anonymous'}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <TimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(blog.publishedAt || blog.createdAt)}
                            </Typography>
                          </Stack>
                          {blog.updatedAt > blog.createdAt && (
                            <Typography variant="body2" color="text.secondary">
                              • Updated {formatDate(blog.updatedAt)}
                            </Typography>
                          )}
                        </Stack>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={2}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <ViewIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {blog.views || 0}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <LikeIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {blog.likes?.length || 0}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <CommentIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {blog.comments?.length || 0}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>

                  <Divider sx={{ borderColor: isDark ? 'grey.800' : 'grey.200' }} />

                  <Box 
                    className="blog-content"
                    sx={{
                      fontSize: '1.5rem',
                      lineHeight: 1.8,
                      color: isDark ? 'grey.200' : 'grey.800',
                      '& > *': {
                        marginBottom: '1.5rem',
                        '&:last-child': {
                          marginBottom: 0
                        }
                      },
                      '& img': {
                        maxWidth: '100%',
                        height: 'auto',
                        borderRadius: 2,
                        my: 3,
                        boxShadow: theme.shadows[4],
                      },
                      '& h1, & h2, & h3, & h4, & h5, & h6': {
                        marginTop: '2.5rem',
                        marginBottom: '1rem',
                        fontWeight: 700,
                        lineHeight: 1.3,
                        color: isDark ? 'grey.100' : 'grey.900',
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
                      },
                      '& pre': {
                        backgroundColor: isDark ? '#0d1117' : '#f6f8fa',
                        padding: '1.25rem',
                        borderRadius: 2,
                        overflowX: 'auto',
                        margin: '1.5rem 0',
                        border: `1px solid ${isDark ? '#30363d' : '#d0d7de'}`,
                        fontSize: '16px',
                        lineHeight: 1.6,
                        '& code': {
                          fontFamily: '"SFMono-Regular", "Consolas", "Liberation Mono", "Menlo", monospace',
                          fontSize: 'inherit',
                          lineHeight: 'inherit',
                          backgroundColor: 'transparent',
                          border: 'none',
                          padding: 0,
                        }
                      },
                      '& code': {
                        backgroundColor: isDark ? 'rgba(110,118,129,0.4)' : 'rgba(175,184,193,0.2)',
                        padding: '0.2em 0.4em',
                        borderRadius: 3,
                        fontSize: '15px',
                        fontFamily: '"SFMono-Regular", "Consolas", "Liberation Mono", "Menlo", monospace',
                        fontWeight: 400,
                      },
                      '& a': {
                        color: theme.palette.primary.main,
                        textDecoration: 'none',
                        fontSize: '1.5rem',
                        fontWeight: 500,
                        '&:hover': {
                          textDecoration: 'underline',
                        }
                      },
                      '& blockquote': {
                        borderLeft: `4px solid ${theme.palette.primary.main}`,
                        padding: '1rem 1.5rem',
                        margin: '2rem 0',
                        backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                        borderRadius: '0 8px 8px 0',
                        fontStyle: 'italic',
                        '& > p': {
                          margin: 0,
                        }
                      },
                      '& ul, & ol': {
                        paddingLeft: '1.5rem',
                        margin: '1.5rem 0',
                        '& li': {
                          marginBottom: '0.75rem',
                          '&:last-child': {
                            marginBottom: 0
                          }
                        }
                      },
                      '& table': {
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '1.5rem',
                        margin: '2rem 0',
                        border: `1px solid ${isDark ? 'grey.800' : 'grey.200'}`,
                        borderRadius: 2,
                        overflow: 'hidden',
                        '& th, & td': {
                          border: `1px solid ${isDark ? 'grey.800' : 'grey.200'}`,
                          padding: '1rem',
                          textAlign: 'left',
                        },
                        '& th': {
                          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                          fontWeight: 600,
                        },
                        '& tr:nth-of-type(even)': {
                          backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                        }
                      },
                      '& hr': {
                        border: 'none',
                        borderTop: `2px solid ${isDark ? 'grey.800' : 'grey.200'}`,
                        margin: '3rem 0',
                        borderRadius: 1,
                      },
                    }}
                  >
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight, rehypeRaw]}
                    >
                      {blog.content}
                    </ReactMarkdown>
                  </Box>

                  <Divider sx={{ borderColor: isDark ? 'grey.800' : 'grey.200', my: 4 }} />

                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    justifyContent="space-between" 
                    alignItems="center" 
                    spacing={2}
                  >
                    <Stack direction="row" spacing={1}>
                      <Button
                        onClick={handleLike}
                        disabled={isSubmitting || isLiking}
                        startIcon={isLiked ? <LikeIcon /> : <LikeBorderIcon />}
                        variant={isLiked ? "contained" : "outlined"}
                        color={isLiked ? "error" : "primary"}
                        sx={{
                          borderRadius: 3,
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                      >
                        {blog.likes?.length || 0} Likes
                      </Button>
                      <IconButton
                        sx={{
                          borderRadius: 3,
                          border: `1px solid ${isDark ? 'grey.700' : 'grey.300'}`,
                          '&:hover': {
                            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                          }
                        }}
                      >
                        <ShareIcon />
                      </IconButton>
                      <IconButton
                        sx={{
                          borderRadius: 3,
                          border: `1px solid ${isDark ? 'grey.700' : 'grey.300'}`,
                          '&:hover': {
                            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                          }
                        }}
                      >
                        <BookmarkIcon />
                      </IconButton>
                    </Stack>
                  </Stack>

                  <Divider sx={{ borderColor: isDark ? 'grey.800' : 'grey.200', my: 4 }} />

                  <Box>
                    <Typography 
                      variant="h5" 
                      component="h2" 
                      sx={{ 
                        fontWeight: 700, 
                        mb: 3,
                        color: isDark ? 'grey.100' : 'grey.900',
                      }}
                    >
                      Comments ({blog.comments?.length || 0})
                    </Typography>

                    {user ? (
                      <Paper
                        component="form"
                        onSubmit={handleCommentSubmit}
                        sx={{
                          p: 3,
                          mb: 4,
                          backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                          border: `1px solid ${isDark ? 'grey.800' : 'grey.200'}`,
                          borderRadius: 3,
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="flex-start">
                          <Avatar 
                            src={user?.avatar} 
                            alt={user?.name}
                            sx={{ width: 40, height: 40 }}
                          >
                            {user?.name?.charAt(0)?.toUpperCase()}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <TextField
                              fullWidth
                              multiline
                              rows={3}
                              variant="outlined"
                              placeholder="Share your thoughts..."
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              disabled={isAddingComment}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                }
                              }}
                            />
                            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
                              <Button
                                type="submit"
                                variant="contained"
                                disabled={!comment.trim() || isAddingComment}
                                startIcon={isAddingComment ? <CircularProgress size={16} /> : <SendIcon />}
                                sx={{
                                  borderRadius: 3,
                                  textTransform: 'none',
                                  fontWeight: 600,
                                }}
                              >
                                {isAddingComment ? 'Posting...' : 'Post Comment'}
                              </Button>
                            </Stack>
                          </Box>
                        </Stack>
                      </Paper>
                    ) : (
                      <Paper
                        sx={{
                          p: 4,
                          mb: 4,
                          textAlign: 'center',
                          backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                          border: `1px solid ${isDark ? 'grey.800' : 'grey.200'}`,
                          borderRadius: 3,
                        }}
                      >
                        <Typography variant="h6" gutterBottom>
                          Join the conversation
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          Login to share your thoughts and engage with the community
                        </Typography>
                        <Button 
                          variant="contained" 
                          onClick={() => navigate('/login', { state: { from: `/blogs/${slug}` } })}
                          sx={{
                            borderRadius: 3,
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 4,
                          }}
                        >
                          Login to Comment
                        </Button>
                      </Paper>
                    )}

                    {blog.comments?.length > 0 ? (
                      <Stack spacing={3}>
                        {blog.comments.slice(0, visibleComments).map((comment) => (
                          <Paper
                            key={comment._id}
                            sx={{
                              p: 3,
                              backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                              border: `1px solid ${isDark ? 'grey.800' : 'grey.200'}`,
                              borderRadius: 3,
                            }}
                          >
                            <Stack direction="row" spacing={2} alignItems="flex-start">
                              <Avatar 
                                src={comment.user?.avatar} 
                                alt={comment.user?.name}
                                sx={{ width: 40, height: 40 }}
                              >
                                {comment.user?.name?.charAt(0)?.toUpperCase()}
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Stack 
                                  direction={{ xs: 'column', sm: 'row' }}
                                  justifyContent="space-between" 
                                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                                  spacing={1}
                                  sx={{ mb: 1 }}
                                >
                                  <Typography 
                                    variant="subtitle1" 
                                    sx={{ 
                                      fontWeight: 600,
                                      color: isDark ? 'grey.200' : 'grey.800',
                                    }}
                                  >
                                    {comment.user?.name || 'Anonymous'}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {formatDateTime(comment.createdAt)}
                                  </Typography>
                                </Stack>
                                <Typography 
                                  variant="body1" 
                                  sx={{ 
                                    whiteSpace: 'pre-line',
                                    lineHeight: 1.6,
                                  }}
                                >
                                  {comment.content}
                                </Typography>
                              </Box>
                            </Stack>
                          </Paper>
                        ))}
                        
                        {blog.comments.length > visibleComments && (
                          <Box sx={{ textAlign: 'center' }}>
                            <Button 
                              variant="outlined" 
                              onClick={() => setVisibleComments(prev => prev + 5)}
                              disabled={commentsLoading}
                              sx={{
                                borderRadius: 3,
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 4,
                              }}
                            >
                              {commentsLoading ? 'Loading...' : `Load ${Math.min(5, blog.comments.length - visibleComments)} More Comments`}
                            </Button>
                          </Box>
                        )}
                      </Stack>
                    ) : (
                      <Paper
                        sx={{
                          p: 4,
                          textAlign: 'center',
                          backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                          border: `1px solid ${isDark ? 'grey.800' : 'grey.200'}`,
                          borderRadius: 3,
                        }}
                      >
                        <CommentIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No comments yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Be the first to share your thoughts on this article
                        </Typography>
                      </Paper>
                    )}
                  </Box>
                </Stack>
              </Box>
            </Paper>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default BlogDetail;
