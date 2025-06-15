import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Paper, 
  CircularProgress, 
  Chip, 
  FormHelperText,
  Grid,
  FormControlLabel,
  Switch,
  FormGroup,
  useTheme
} from '@mui/material';
import { 
  Save as SaveIcon, 
  ArrowBack as BackIcon, 
  Add as AddIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import MDEditor from '@uiw/react-md-editor';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { createBlog, updateBlog, getBlogBySlug } from '../../apis/blogApi';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import ImageUploader from '../../components/common/ImageUploader';

const BlogForm = ({ editMode = false }) => {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [markdown, setMarkdown] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(editMode);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  
  // Load blog data in edit mode
  useEffect(() => {
    const fetchBlog = async () => {
      if (!editMode) return;
      
      try {
        setLoading(true);
        // Try to get blog from location state first (for better UX)
        if (location.state?.blog) {
          const blog = location.state.blog;
          initializeForm(blog);
        } else if (id) {
          // Fallback to API call if page is refreshed
          const response = await getBlogBySlug(id);
          const blog = response.data;
          
          // Check if current user is the author
          if (blog.author._id !== user?._id && user?.role !== 'admin') {
            toast.error('You are not authorized to edit this blog');
            navigate(`/blogs`);
            return;
          }
          
          initializeForm(blog);
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        toast.error('Failed to load blog post');
        navigate(`/blogs/${slug}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlog();
  }, [editMode, id, location.state, user]);
  
  const initializeForm = (blog) => {
    setTitle(blog.title || '');
    setMarkdown(blog.content || '');
    setContent(blog.content || '');
    setFeaturedImage(blog.featuredImage || '');
    setTags(blog.tags || []);
    setIsPublished(blog.isPublished || false);
  };
  
  // Update content when markdown changes
  const handleMarkdownChange = (value) => {
    setMarkdown(value || '');
    setContent(value || '');
  };


  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!content.trim() || content === '<p></p>\n') {
      newErrors.content = 'Content is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      
      const blogData = {
        title,
        content,
        featuredImage,
        tags,
        isPublished,
        id,
        u_id: user.id
      };
      
      if (editMode && id) {
        // Update existing blog
        await updateBlog(blogData);
        toast.success('Blog post updated successfully');
      } else {
        // Create new blog
        await createBlog(blogData);
        toast.success('Blog post created successfully');
      }
      
      navigate(`/blogs/${slug}`);
    } catch (error) {
      console.error('Error saving blog:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred';
      toast.error(`Failed to ${editMode ? 'update' : 'create'} blog post: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };



  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          {editMode ? 'Edit Blog Post' : 'Create New Blog Post'}
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<BackIcon />} 
          onClick={() => navigate(`/blogs/${slug}`)}
        >
          Back to Blogs
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={!!errors.title}
                helperText={errors.title}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box mb={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Featured Image
                </Typography>
                <ImageUploader 
                  value={featuredImage}
                  onChange={setFeaturedImage}
                  folder="blog-featured"
                  aspectRatio={16/9}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Box mb={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Content *
                </Typography>
                <Box 
                  border={1} 
                  borderColor={errors.content ? 'error.main' : 'divider'} 
                  borderRadius={1}
                  p={1}
                  sx={{ 
                    '& .w-md-editor': {
                      minHeight: '500px',
                      height: '100%',
                      '& .w-md-editor-content': {
                        minHeight: '500px',
                        height: '100%',
                      }
                    }
                  }}
                >
                  <MDEditor
                    value={markdown}
                    onChange={handleMarkdownChange}
                    height={500}
                    placeholder="Write your blog content in Markdown format..."
                    data-color-mode={isDark ? "dark" : "light"}
                  />
                </Box>
                {errors.content && (
                  <FormHelperText error>{errors.content}</FormHelperText>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Box mb={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Tags
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
                  {tags.map((tag) => (
                    <Chip 
                      key={tag} 
                      label={tag} 
                      onDelete={() => handleRemoveTag(tag)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
                <Box display="flex" gap={1}>
                  <TextField
                    size="small"
                    placeholder="Add a tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag(e)}
                    sx={{ flexGrow: 1 }}
                  />
                  <Button 
                    variant="outlined" 
                    onClick={handleAddTag}
                    startIcon={<AddIcon />}
                  >
                    Add
                  </Button>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <FormGroup>
                <FormControlLabel 
                  control={
                    <Switch 
                      checked={isPublished} 
                      onChange={(e) => setIsPublished(e.target.checked)} 
                    />
                  } 
                  label={isPublished ? 'Published' : 'Draft'} 
                />
              </FormGroup>
              <FormHelperText>
                {isPublished 
                  ? 'This post will be visible to everyone.' 
                  : 'This post will be saved as a draft and only visible to you.'}
              </FormHelperText>
            </Grid>
            
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate(`/blogs/${slug}`)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={saving ? <CircularProgress size={24} color="inherit" /> : <SaveIcon />}
                  disabled={saving}
                >
                  {saving 
                    ? (editMode ? 'Updating...' : 'Publishing...') 
                    : (editMode ? 'Update Post' : 'Publish Post')
                  }
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default BlogForm;
