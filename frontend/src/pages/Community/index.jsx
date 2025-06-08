import React, { useState } from 'react';
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
  Paper
} from '@mui/material';
import { Send, ThumbUp, ChatBubbleOutline } from '@mui/icons-material';

const Community = () => {
  const [tabValue, setTabValue] = useState(0);
  const [postContent, setPostContent] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [activePost, setActivePost] = useState(null);

  // Sample data - in a real app, this would come from an API
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: 'CodeMaster42',
      avatar: 'CM',
      content: 'Just solved a really tough dynamic programming problem! Anyone else working on DP?',
      timestamp: '2 hours ago',
      likes: 5,
      comments: [
        { user: 'AlgoWizard', text: 'Nice! Which problem was it?', timestamp: '1 hour ago' },
        { user: 'CodeMaster42', text: 'It was the knapsack problem variant!', timestamp: '30 mins ago' }
      ]
    },
    {
      id: 2,
      user: 'WebDevPro',
      avatar: 'WD',
      content: 'Check out this cool React hook I found for form validation! #react #webdev',
      timestamp: '5 hours ago',
      likes: 12,
      comments: []
    }
  ]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!postContent.trim()) return;
    
    const newPost = {
      id: Date.now(),
      user: 'CurrentUser',
      avatar: 'CU',
      content: postContent,
      timestamp: 'Just now',
      likes: 0,
      comments: []
    };
    
    setPosts([newPost, ...posts]);
    setPostContent('');
  };

  const handleCommentSubmit = (postId) => {
    if (!commentContent.trim()) return;
    
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            { 
              user: 'CurrentUser', 
              text: commentContent, 
              timestamp: 'Just now' 
            }
          ]
        };
      }
      return post;
    });
    
    setPosts(updatedPosts);
    setCommentContent('');
    setActivePost(null);
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 } 
        : post
    ));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Community
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handlePostSubmit}>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            placeholder="Share something with the community..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ mt: 1, alignSelf: 'flex-end' }}>
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

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="community tabs">
          <Tab label="Recent Posts" />
          <Tab label="Popular" />
          <Tab label="Following" />
        </Tabs>
      </Box>

      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {posts.map((post) => (
          <React.Fragment key={post.id}>
            <ListItem alignItems="flex-start">
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                {post.avatar}
              </Avatar>
              <ListItemText
                primary={
                  <>
                    <Typography variant="subtitle1" component="span" fontWeight="bold">
                      {post.user}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      • {post.timestamp}
                    </Typography>
                  </>
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
                        onClick={() => handleLike(post.id)}
                      >
                        {post.likes} {post.likes === 1 ? 'Like' : 'Likes'}
                      </Button>
                      <Button 
                        size="small" 
                        startIcon={<ChatBubbleOutline fontSize="small" />}
                        onClick={() => setActivePost(activePost === post.id ? null : post.id)}
                      >
                        {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
                      </Button>
                    </Box>
                    
                    {activePost === post.id && (
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>CU</Avatar>
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
                                    onClick={() => handleCommentSubmit(post.id)}
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
                        
                        {post.comments.length > 0 && (
                          <List sx={{ bgcolor: 'action.hover', borderRadius: 1, p: 1 }}>
                            {post.comments.map((comment, index) => (
                              <React.Fragment key={index}>
                                <ListItem alignItems="flex-start" sx={{ py: 1 }}>
                                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', mr: 1, fontSize: '0.8rem' }}>
                                    {comment.user.charAt(0)}
                                  </Avatar>
                                  <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                      <Typography variant="subtitle2" component="span" fontWeight="bold">
                                        {comment.user}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                        {comment.timestamp}
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
    </Container>
  );
};

export default Community;
