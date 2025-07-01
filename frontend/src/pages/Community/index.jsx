import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Container, 
  Typography, 
  Tabs, 
  Tab, 
  Box, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  Avatar,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  Pagination,
  Tooltip
} from '@mui/material';
import { Send, ThumbUp, ChatBubbleOutline, PersonAdd, PersonRemove } from '@mui/icons-material';
import { getPosts, createPost, toggleLike, addComment, toggleFollow, checkFollowStatus } from '../../services/communityService';

const getAvatarUrl = (userId) => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;
};

const Community = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [tabValue, setTabValue] = useState(0);
  const [postContent, setPostContent] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [activePost, setActivePost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [followingStatus, setFollowingStatus] = useState({});

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const filter = tabValue === 0 ? 'recent' : tabValue === 1 ? 'popular' : 'following';
      console.log('Fetching posts with:', { page, filter });
      const data = await getPosts(page, filter);
      console.log('Received data:', data);
      
      if (!data || !data.posts) {
        console.error('Invalid data received:', data);
        throw new Error('Invalid response format from server');
      }

      setPosts(data.posts);
      setTotalPages(data.totalPages);
      setError(null);

      // Fetch follow status for each post's author
      if (isAuthenticated) {
        const statuses = {};
        for (const post of data.posts) {
          if (post.User && post.User._id !== user.id) {
            try {
              const { isFollowing } = await checkFollowStatus(post.User._id);
              statuses[post.User._id] = isFollowing;
            } catch (followErr) {
              console.error('Error checking follow status:', followErr);
              // Don't throw here, just log the error and continue
            }
          }
        }
        setFollowingStatus(statuses);
      }
    } catch (err) {
      console.error('Error in fetchPosts:', err);
      setError(err.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, tabValue]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(1); // Reset to first page when changing tabs
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!postContent.trim() || !isAuthenticated) {
      setSnackbar({ 
        open: true, 
        message: 'Please login to create a post', 
        severity: 'warning' 
      });
      return;
    }
    
    try {
      const newPost = await createPost(postContent, user.id);
      setPosts([newPost, ...posts]);
      setPostContent('');
      setSnackbar({ open: true, message: 'Post created successfully!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to create post', severity: 'error' });
    }
  };

  const handleCommentSubmit = async (postId) => {
    if (!commentContent.trim() || !isAuthenticated) {
      setSnackbar({ 
        open: true, 
        message: 'Please login to comment', 
        severity: 'warning' 
      });
      return;
    }
    
    try {
      const newComment = await addComment(postId, commentContent);
      setPosts(posts.map(post => 
        post._id === postId 
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      ));
      setCommentContent('');
      setActivePost(null);
      setSnackbar({ open: true, message: 'Comment added successfully!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to add comment', severity: 'error' });
    }
  };

  const handleLike = async (postId) => {
    if (!isAuthenticated) {
      setSnackbar({ 
        open: true, 
        message: 'Please login to like posts', 
        severity: 'warning' 
      });
      return;
    }

    try {
      const updatedPost = await toggleLike(postId);
      setPosts(posts.map(post => 
        post._id === postId ? updatedPost : post
      ));
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to like/unlike post', severity: 'error' });
    }
  };

  const handleFollow = async (userId) => {
    if (!isAuthenticated) {
      setSnackbar({ 
        open: true, 
        message: 'Please login to follow users', 
        severity: 'warning' 
      });
      return;
    }

    try {
      const { isFollowing } = await toggleFollow(userId);
      setFollowingStatus(prev => ({ ...prev, [userId]: isFollowing }));
      setSnackbar({ 
        open: true, 
        message: isFollowing ? 'User followed successfully' : 'User unfollowed successfully', 
        severity: 'success' 
      });
    } catch (err) {
      setSnackbar({ 
        open: true, 
        message: err.message || 'Failed to update follow status', 
        severity: 'error' 
      });
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Community
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {isAuthenticated && (
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <form onSubmit={handlePostSubmit}>
            <TextField
              fullWidth
              multiline
              rows={5}
              variant="outlined"
              placeholder="Share something with the community..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ mb: 2, alignSelf: 'flex-end' }}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      color="primary"
                      disabled={!postContent.trim()}
                    >
                      Post
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </form>
        </Paper>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="community tabs">
          <Tab label="Recent Posts" />
          <Tab label="Popular" />
          <Tab label="Following" disabled={!isAuthenticated} />
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {posts.map((post) => (
              <React.Fragment key={post._id}>
                <ListItem alignItems="flex-start">
                  <Avatar 
                    sx={{ bgcolor: 'primary.main', mr: 2 }}
                    src={post.User ? getAvatarUrl(post.User._id) : undefined}
                  >
                    {post.User?.username?.charAt(0) || 'U'}
                  </Avatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" component="span" fontWeight="bold">
                            {post.User?.username || 'Anonymous User'}
                          </Typography>
                          {isAuthenticated && post.User && post.User._id !== user.id && (
                            <Tooltip title={followingStatus[post.User._id] ? "Unfollow user" : "Follow user"}>
                              <IconButton
                                size="small"
                                onClick={() => handleFollow(post.User._id)}
                                color={followingStatus[post.User._id] ? "primary" : "default"}
                                sx={{
                                  border: 1,
                                  borderColor: followingStatus[post.User._id] ? 'primary.main' : 'divider',
                                  '&:hover': {
                                    backgroundColor: followingStatus[post.User._id] ? 'primary.lighter' : 'action.hover'
                                  }
                                }}
                              >
                                {followingStatus[post.User._id] ? <PersonRemove fontSize="small" /> : <PersonAdd fontSize="small" />}
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          • {formatTimestamp(post.createdAt)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body1" component="p" sx={{ mt: 1, mb: 1 }}>
                          {post.content}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                          <Button 
                            size="small" 
                            startIcon={<ThumbUp fontSize="small" />}
                            onClick={() => handleLike(post._id)}
                            color={post.likes.includes(user?.id) ? 'primary' : 'inherit'}
                          >
                            {post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}
                          </Button>
                          <Button 
                            size="small" 
                            startIcon={<ChatBubbleOutline fontSize="small" />}
                            onClick={() => setActivePost(activePost === post._id ? null : post._id)}
                          >
                            {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
                          </Button>
                        </Box>
                        
                        {activePost === post._id && (
                          <Box sx={{ mt: 2 }}>
                            {isAuthenticated ? (
                              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                <Avatar 
                                  sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
                                  src={user?.id ? getAvatarUrl(user.id) : undefined}
                                >
                                  {user?.username?.charAt(0) || 'U'}
                                </Avatar>
                                <TextField
                                  fullWidth
                                  size="small"
                                  variant="outlined"
                                  placeholder="Write a comment..."
                                  value={commentContent}
                                  onChange={(e) => setCommentContent(e.target.value)}
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton 
                                          onClick={() => handleCommentSubmit(post._id)}
                                          disabled={!commentContent.trim()}
                                          color="primary"
                                        >
                                          <Send />
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </Box>
                            ) : (
                              <Alert severity="info" sx={{ mb: 2 }}>
                                Please login to comment
                              </Alert>
                            )}
                            
                            {post.comments.length > 0 && (
                              <List sx={{ bgcolor: 'action.hover', borderRadius: 1, p: 1 }}>
                                {post.comments.map((comment, index) => (
                                  <React.Fragment key={comment._id || index}>
                                    <ListItem alignItems="flex-start" sx={{ py: 1 }}>
                                      <Avatar 
                                        sx={{ width: 32, height: 32, bgcolor: 'secondary.main', mr: 1, fontSize: '0.8rem' }}
                                        src={comment.user ? getAvatarUrl(comment.user._id) : undefined}
                                      >
                                        {comment.user?.username?.charAt(0) || 'U'}
                                      </Avatar>
                                      <Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                          <Typography variant="subtitle2" component="span" fontWeight="bold">
                                            {comment.user?.username || 'Anonymous User'}
                                          </Typography>
                                          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                            {formatTimestamp(comment.createdAt)}
                                          </Typography>
                                        </Box>
                                        <Typography variant="body2">
                                          {comment.text}
                                        </Typography>
                                      </Box>
                                    </ListItem>
                                    {index < post.comments.length - 1 && <Divider variant="inset" component="li" />}
                                  </React.Fragment>
                                ))}
                              </List>
                            )}
                          </Box>
                        )}
                      </>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
              />
            </Box>
          )}
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Community;
