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
import { 
  useGetPostsQuery,
  useCreatePostMutation,
  useToggleLikeMutation,
  useAddCommentMutation,
  useToggleFollowMutation,
  useCheckFollowStatusQuery
} from '../../apis/communityApi';
import { toast } from 'react-toastify';

const getAvatarUrl = (userId) => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;
};

const Community = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [tabValue, setTabValue] = useState(0);
  const [postContent, setPostContent] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [activePost, setActivePost] = useState(null);
  const [page, setPage] = useState(1);
  const [followingStatus, setFollowingStatus] = useState({});

  // RTK Query hooks
  const {
    data: postsData,
    isLoading: postsLoading,
    error: postsError,
    refetch: refetchPosts
  } = useGetPostsQuery({
    page,
    filter: tabValue === 0 ? 'recent' : tabValue === 1 ? 'popular' : 'following',
    limit: 10
  });

  const [createPost, { isLoading: isCreatingPost }] = useCreatePostMutation();
  const [toggleLike, { isLoading: isLiking }] = useToggleLikeMutation();
  const [addComment, { isLoading: isAddingComment }] = useAddCommentMutation();
  const [toggleFollow, { isLoading: isFollowing }] = useToggleFollowMutation();

  const posts = postsData?.posts || [];
  const totalPages = postsData?.totalPages || 1;

  // Fetch follow status for each post's author
  useEffect(() => {
    if (isAuthenticated && posts.length > 0) {
      const fetchFollowStatuses = async () => {
        const statuses = {};
        for (const post of posts) {
          if (post.User && post.User._id !== user.id) {
            try {
              const { data } = await fetch(`/api/community/follow/status/${post.User._id}`, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
              }).then(res => res.json());
              statuses[post.User._id] = data?.isFollowing || false;
            } catch (followErr) {
              console.error('Error checking follow status:', followErr);
            }
          }
        }
        setFollowingStatus(statuses);
      };
      fetchFollowStatuses();
    }
  }, [posts, isAuthenticated, user?.id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(1);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!postContent.trim() || !isAuthenticated) {
      toast.warning('Please login to create a post');
      return;
    }
    
    try {
      await createPost({ content: postContent, id: user.id }).unwrap();
      setPostContent('');
      toast.success('Post created successfully!');
    } catch (err) {
      toast.error(err.data?.message || 'Failed to create post');
    }
  };

  const handleCommentSubmit = async (postId) => {
    if (!commentContent.trim() || !isAuthenticated) {
      toast.warning('Please login to comment');
      return;
    }
    
    try {
      await addComment({ postId, content: commentContent }).unwrap();
      setCommentContent('');
      setActivePost(null);
      toast.success('Comment added successfully!');
    } catch (err) {
      toast.error(err.data?.message || 'Failed to add comment');
    }
  };

  const handleLike = async (postId) => {
    if (!isAuthenticated) {
      toast.warning('Please login to like posts');
      return;
    }

    try {
      await toggleLike(postId).unwrap();
    } catch (err) {
      toast.error(err.data?.message || 'Failed to like/unlike post');
    }
  };

  const handleFollow = async (userId) => {
    if (!isAuthenticated) {
      toast.warning('Please login to follow users');
      return;
    }

    try {
      const result = await toggleFollow(userId).unwrap();
      setFollowingStatus(prev => ({ ...prev, [userId]: result.isFollowing }));
      toast.success(result.isFollowing ? 'User followed successfully' : 'User unfollowed successfully');
    } catch (err) {
      toast.error(err.data?.message || 'Failed to update follow status');
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

  if (postsError) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {postsError.data?.message || 'Failed to load community posts'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Community
      </Typography>

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
              disabled={isCreatingPost}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ mb: 2, alignSelf: 'flex-end' }}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      color="primary"
                      disabled={!postContent.trim() || isCreatingPost}
                      startIcon={isCreatingPost ? <CircularProgress size={16} /> : null}
                    >
                      {isCreatingPost ? 'Posting...' : 'Post'}
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

      {postsLoading ? (
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
                                disabled={isFollowing}
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
                            disabled={isLiking}
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
                                  disabled={isAddingComment}
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton 
                                          onClick={() => handleCommentSubmit(post._id)}
                                          disabled={!commentContent.trim() || isAddingComment}
                                          color="primary"
                                        >
                                          {isAddingComment ? <CircularProgress size={16} /> : <Send />}
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
    </Container>
  );
};

export default Community;
