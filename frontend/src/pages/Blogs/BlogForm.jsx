import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  useTheme,
  Stack,
  Divider,
  Card,
  CardContent,
  Fade,
  Breadcrumbs,
  Link as MuiLink,
  Alert
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as BackIcon,
  Add as AddIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Code as CodeIcon,
  Image as ImageIcon,
  Home as HomeIcon,
  Article as ArticleIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import {
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useGetBlogByIdQuery,
  useUploadBlogImageMutation,
  useDeleteBlogImageMutation,
} from '../../apis/blogApi';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import ImageUploader from '../../components/common/ImageUploader';
import BlogEditor from './BlogEditor';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const BlogForm = ({ editMode = false }) => {
  const navigate = useNavigate();
  const { id, slug } = useParams();
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);
  const isDark = theme.palette.mode === 'dark';

  // RTK Query hooks
  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();
  const [uploadImage, { isLoading: isUploadingImage }] = useUploadBlogImageMutation();
  const [deleteImage, { isLoading: isDeletingImage }] = useDeleteBlogImageMutation();
  const { 
    data: blogResponse, 
    isLoading: isFetching, 
    error: fetchError,
    refetch: refetchBlog
  } = useGetBlogByIdQuery(id, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  const blogData = blogResponse?.data;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [errors, setErrors] = useState({});
  const [lastUploadedImageUrl, setLastUploadedImageUrl] = useState('');

  const isLoading = isFetching;
  const isSaving = isCreating || isUpdating;
  const isProcessing = isSaving || isDeleting || isUploadingImage || isDeletingImage;

  useEffect(() => {
    if (editMode && blogData) {
      initializeForm(blogData);
    }
  }, [editMode, blogData]);

  const initializeForm = (blog) => {
    setTitle(blog.title || '');
    setContent(blog.content || '');
    setFeaturedImage(blog.featuredImage || '');
    setTags(blog.tags || []);
    setIsPublished(blog.isPublished || false);
  };

  const handleContentChange = (newMarkdown) => {
    setContent(newMarkdown);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLastUploadedImageUrl('');
    const formData = new FormData();
    formData.append('file', file);
    if (editMode && id) {
      formData.append('blogId', id);
    }

    try {
      const response = await uploadImage(formData).unwrap();
      setLastUploadedImageUrl(response.url);
      if (!editMode) {
          setFeaturedImage(response.url);
      }
      toast.success('Image uploaded! URL copied to clipboard.');
      navigator.clipboard.writeText(`![Image](${response.url})`);
    } catch (error) {
      toast.error(error.data?.message || 'Image upload failed.');
      console.error(error);
    } finally {
      // Reset file input
      event.target.value = null;
    }
  };

  const handleDeleteContentImage = async () => {
    if (!lastUploadedImageUrl) return;

    const confirmed = window.confirm(
      'Are you sure you want to permanently delete this image from storage? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      const fileName = lastUploadedImageUrl.split('/').pop();
      await deleteImage(fileName).unwrap();
      
      const markdownToDelete = `![Image](${lastUploadedImageUrl})`;
      setContent((currentContent) => currentContent.replace(markdownToDelete, ''));

      setLastUploadedImageUrl('');
      toast.success('Image deleted successfully and removed from content.');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error(error.data?.message || 'Failed to delete image.');
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 10) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters long';
    } else if (title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (!content.trim()) {
      newErrors.content = 'Content is required';
    } else if (content.length < 100) {
      newErrors.content = 'Content must be at least 100 characters long';
    }

    if (tags.length === 0) {
      newErrors.tags = 'At least one tag is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    const blogPayload = {
      title,
      content,
      featuredImage,
      tags,
      isPublished,
      id: editMode ? id : user.id,
      u_id: user.id,
    };

    try {
      if (editMode) {
        await updateBlog(blogPayload).unwrap();
        toast.success('Blog post updated successfully');
      } else {
        await createBlog(blogPayload).unwrap();
        toast.success('Blog post created successfully');
      }
      navigate('/blogs');
    } catch (error) {
      console.error('Error saving blog:', error);
      const errorMessage = error.data?.message || 'An error occurred';
      toast.error(
        `Failed to ${editMode ? 'update' : 'create'} blog post: ${errorMessage}`
      );
    }
  };

  const handleRetry = () => {
    refetchBlog();
  };

  const handleDelete = async () => {
    if (!editMode || !id) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this blog post? This action cannot be undone and will also delete all associated images.'
    );

    if (!confirmed) return;

    try {
      await deleteBlog({ id, u_id: user.id }).unwrap();
      toast.success('Blog post deleted successfully');
      navigate('/blogs');
    } catch (error) {
      console.error('Error deleting blog:', error);
      const errorMessage = error.data?.message || 'Failed to delete blog post';
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: isDark
            ? 'linear-gradient(135deg, #0a0e27 0%, #1a1d35 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          sx={{
            p: 4,
            background: isDark
              ? 'rgba(30,30,30,0.9)'
              : 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            textAlign: 'center',
          }}
        >
          <CircularProgress size={40} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading editor...
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (fetchError && editMode) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: isDark
            ? 'linear-gradient(135deg, #0a0e27 0%, #1a1d35 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          sx={{
            p: 4,
            background: isDark
              ? 'rgba(30,30,30,0.9)'
              : 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            textAlign: 'center',
          }}
        >
          <Alert severity="error" sx={{ mb: 3 }}>
            {fetchError.data?.message || 'Failed to load blog post'}
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: isDark
          ? 'linear-gradient(135deg, #0a0e27 0%, #1a1d35 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Fade in timeout={600}>
          <Box>
            <Breadcrumbs
              sx={{
                mb: 3,
                '& .MuiBreadcrumbs-separator': { color: 'rgba(255,255,255,0.7)' },
                '& a, & span': { color: 'rgba(255,255,255,0.9)' },
              }}
            >
              <MuiLink
                href="/blogs"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/blogs');
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                <HomeIcon sx={{ fontSize: 16 }} />
                Blogs
              </MuiLink>
              <Typography color="rgba(255,255,255,0.7)">
                {editMode ? 'Edit Post' : 'Create New Post'}
              </Typography>
            </Breadcrumbs>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'stretch', sm: 'center' }}
              spacing={2}
              sx={{ mb: 4 }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <ArticleIcon sx={{ fontSize: 40, color: '#ffd700' }} />
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    color: 'white',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  {editMode ? 'Edit Blog Post' : 'Create New Post'}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<BackIcon />}
                  onClick={() => navigate('/blogs')}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  Back to Blogs
                </Button>

                {editMode && (
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="outlined"
                      color="error"
                      size="large"
                      startIcon={
                        isDeleting ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <DeleteIcon />
                        )
                      }
                      disabled={isProcessing}
                      onClick={handleDelete}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 4,
                        borderColor: 'error.main',
                        color: 'error.main',
                        '&:hover': {
                          borderColor: 'error.dark',
                          backgroundColor: 'error.main',
                          color: 'white',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete Post'}
                    </Button>
                    <Button
                      type="submit"
                      form="blog-form"
                      variant="contained"
                      size="large"
                      startIcon={
                        isSaving ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <SaveIcon />
                        )
                      }
                      disabled={isProcessing}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 4,
                        background:
                          'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                        boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 25px rgba(102, 126, 234, 0.4)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {isSaving ? 'Updating...' : 'Update Post'}
                    </Button>
                  </Stack>
                )}
              </Stack>
            </Stack>

            <Paper
              elevation={0}
              sx={{
                background: isDark
                  ? 'linear-gradient(145deg, rgba(30,30,30,0.95) 0%, rgba(40,40,40,0.95) 100%)'
                  : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                border: `1px solid ${
                  isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
                }`,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                overflow: 'hidden',
              }}
            >
              <form id="blog-form" onSubmit={handleSubmit}>
                <Box sx={{ p: { xs: 3, md: 5 } }}>
                  <Grid container spacing={4}>
                    <Grid item xs={12}>
                      <Card
                        sx={{
                          backgroundColor: isDark
                            ? 'rgba(255,255,255,0.02)'
                            : 'rgba(0,0,0,0.02)',
                          border: `1px solid ${
                            isDark ? 'grey.800' : 'grey.200'
                          }`,
                          borderRadius: 3,
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <EditIcon color="primary" />
                            Post Title
                          </Typography>
                          <TextField
                            fullWidth
                            placeholder="Enter an engaging title for your blog post..."
                            variant="outlined"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            error={!!errors.title}
                            helperText={
                              errors.title || `${title.length}/200 characters`
                            }
                            required
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: isDark
                                  ? 'rgba(255,255,255,0.05)'
                                  : 'rgba(0,0,0,0.02)',
                                fontSize: '1.25rem',
                                fontWeight: 500,
                              },
                            }}
                          />
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} lg={8}>
                          <Card
                            sx={{
                              backgroundColor: isDark
                                ? 'rgba(255,255,255,0.02)'
                                : 'rgba(0,0,0,0.02)',
                              border: `1px solid ${
                                isDark ? 'grey.800' : 'grey.200'
                              }`,
                              borderRadius: 3,
                              height: 'fit-content',
                            }}
                          >
                            <CardContent sx={{ p: 3 }}>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{ mb: 2 }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                  }}
                                >
                                  <CodeIcon color="primary" />
                                  Content *
                                </Typography>
                              </Stack>
                              <Stack direction="row" spacing={1} alignItems="center" sx={{mb: 2}}>
                                <Button
                                    component="label"
                                    variant="outlined"
                                    size="small"
                                    startIcon={isUploadingImage ? <CircularProgress size={16} /> : <ImageIcon />}
                                    disabled={isProcessing}
                                >
                                    Upload Content Image
                                    <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                                </Button>
                                {lastUploadedImageUrl && (
                                    <Chip
                                        label="Copy Markdown"
                                        size="small"
                                        onClick={() => {
                                            navigator.clipboard.writeText(`![Image](${lastUploadedImageUrl})`);
                                            toast.info('Markdown copied to clipboard!');
                                        }}
                                        onDelete={handleDeleteContentImage}
                                     />
                                )}
                               </Stack>
                              <BlogEditor
                                markdownContent={content}
                                onMarkdownChange={handleContentChange}
                                errors={errors}
                              />
                            </CardContent>
                          </Card>
                        </Grid>

                        <Grid item xs={12} lg={4}>
                          <Stack spacing={3}>
                            <Card
                              sx={{
                                backgroundColor: isDark
                                  ? 'rgba(255,255,255,0.02)'
                                  : 'rgba(0,0,0,0.02)',
                                border: `1px solid ${
                                  isDark ? 'grey.800' : 'grey.200'
                                }`,
                                borderRadius: 3,
                              }}
                            >
                              <CardContent sx={{ p: 3 }}>
                                <Typography
                                  variant="h6"
                                  gutterBottom
                                  sx={{
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                  }}
                                >
                                  <ImageIcon color="primary" />
                                  Featured Image
                                </Typography>
                                <ImageUploader
                                  value={featuredImage}
                                  onChange={setFeaturedImage}
                                  folder="blog-featured"
                                  aspectRatio={16 / 9}
                                  blogId={editMode ? id : null}
                                />
                              </CardContent>
                            </Card>

                            <Card
                              sx={{
                                backgroundColor: isDark
                                  ? 'rgba(255,255,255,0.02)'
                                  : 'rgba(0,0,0,0.02)',
                                border: `1px solid ${
                                  isDark ? 'grey.800' : 'grey.200'
                                }`,
                                borderRadius: 3,
                              }}
                            >
                              <CardContent sx={{ p: 3 }}>
                                <Typography
                                  variant="h6"
                                  gutterBottom
                                  sx={{ fontWeight: 600 }}
                                >
                                  Tags *
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    flexWrap="wrap"
                                    useFlexGap
                                  >
                                    {tags.map((tag) => (
                                      <Chip
                                        key={tag}
                                        label={tag}
                                        onDelete={() => handleRemoveTag(tag)}
                                        color="primary"
                                        sx={{
                                          borderRadius: 6,
                                          fontWeight: 600,
                                        }}
                                      />
                                    ))}
                                  </Stack>
                                </Box>
                                <Stack direction="column" spacing={1}>
                                  <TextField
                                    size="small"
                                    placeholder="Add a tag (e.g., JavaScript)"
                                    value={tagInput}
                                    onChange={(e) =>
                                      setTagInput(e.target.value)
                                    }
                                    onKeyPress={(e) =>
                                      e.key === 'Enter' && handleAddTag(e)
                                    }
                                    disabled={tags.length >= 10}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                      },
                                    }}
                                  />
                                  <Button
                                    variant="contained"
                                    onClick={handleAddTag}
                                    startIcon={<AddIcon />}
                                    disabled={
                                      !tagInput.trim() ||
                                      tags.includes(tagInput.trim()) ||
                                      tags.length >= 10
                                    }
                                    fullWidth
                                    sx={{
                                      borderRadius: 2,
                                      textTransform: 'none',
                                      fontWeight: 600,
                                    }}
                                  >
                                    Add Tag
                                  </Button>
                                </Stack>
                                {errors.tags && (
                                  <FormHelperText error sx={{ mt: 1 }}>
                                    {errors.tags}
                                  </FormHelperText>
                                )}
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ mt: 1, display: 'block' }}
                                >
                                  {tags.length}/10 tags | Tags help readers find your content
                                </Typography>
                              </CardContent>
                            </Card>

                            <Card
                              sx={{
                                backgroundColor: isDark
                                  ? 'rgba(255,255,255,0.02)'
                                  : 'rgba(0,0,0,0.02)',
                                border: `1px solid ${
                                  isDark ? 'grey.800' : 'grey.200'
                                }`,
                                borderRadius: 3,
                              }}
                            >
                              <CardContent sx={{ p: 3 }}>
                                <Typography
                                  variant="h6"
                                  gutterBottom
                                  sx={{ fontWeight: 600 }}
                                >
                                  Publish Settings
                                </Typography>
                                <FormGroup>
                                  <FormControlLabel
                                    control={
                                      <Switch
                                        checked={isPublished}
                                        onChange={(e) =>
                                          setIsPublished(e.target.checked)
                                        }
                                        icon={<VisibilityOffIcon />}
                                        checkedIcon={<VisibilityIcon />}
                                      />
                                    }
                                    label={
                                      <Stack
                                        direction="row"
                                        alignItems="center"
                                        spacing={1}
                                      >
                                        <Typography
                                          variant="body1"
                                          sx={{ fontWeight: 600 }}
                                        >
                                          {isPublished ? 'Published' : 'Draft'}
                                        </Typography>
                                        {isPublished ? (
                                          <Chip
                                            label="Public"
                                            color="success"
                                            size="small"
                                          />
                                        ) : (
                                          <Chip
                                            label="Private"
                                            color="default"
                                            size="small"
                                          />
                                        )}
                                      </Stack>
                                    }
                                  />
                                </FormGroup>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mt: 1 }}
                                >
                                  {isPublished
                                    ? 'This post will be visible to everyone and appear in the blog list.'
                                    : 'This post will be saved as a draft and only visible to you.'}
                                </Typography>
                              </CardContent>
                            </Card>

                            {editMode && (
                              <Card
                                sx={{
                                  backgroundColor: isDark
                                    ? 'rgba(255,255,255,0.02)'
                                    : 'rgba(0,0,0,0.02)',
                                  border: `1px solid ${
                                    isDark ? 'grey.800' : 'grey.200'
                                  }`,
                                  borderRadius: 3,
                                }}
                              >
                                <CardContent sx={{ p: 3 }}>
                                  <Typography
                                    variant="h6"
                                    gutterBottom
                                    sx={{ 
                                      fontWeight: 600,
                                      color: 'error.main',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 1
                                    }}
                                  >
                                    <DeleteIcon color="error" />
                                    Danger Zone
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 2 }}
                                  >
                                    Once you delete a blog post, there is no going back. Please be certain.
                                  </Typography>
                                  <Button
                                    variant="outlined"
                                    color="error"
                                    fullWidth
                                    startIcon={
                                      isDeleting ? (
                                        <CircularProgress size={16} color="inherit" />
                                      ) : (
                                        <DeleteIcon />
                                      )
                                    }
                                    disabled={isProcessing}
                                    onClick={handleDelete}
                                    sx={{
                                      textTransform: 'none',
                                      fontWeight: 600,
                                      borderColor: 'error.main',
                                      color: 'error.main',
                                      '&:hover': {
                                        borderColor: 'error.dark',
                                        backgroundColor: 'error.main',
                                        color: 'white',
                                      },
                                    }}
                                  >
                                    {isDeleting ? 'Deleting...' : 'Delete This Post'}
                                  </Button>
                                </CardContent>
                              </Card>
                            )}
                          </Stack>
                        </Grid>
                      </Grid>
                    </Grid>

                    {!editMode && (
                      <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          justifyContent="flex-end"
                          spacing={2}
                        >
                          <Button
                            variant="outlined"
                            onClick={() => navigate('/blogs')}
                            disabled={isProcessing}
                            startIcon={<CancelIcon />}
                            sx={{
                              borderRadius: 3,
                              textTransform: 'none',
                              fontWeight: 600,
                              px: 4,
                              py: 1.5,
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            startIcon={
                              isSaving ? (
                                <CircularProgress size={20} color="inherit" />
                              ) : (
                                <SaveIcon />
                              )
                            }
                            disabled={isProcessing}
                            sx={{
                              borderRadius: 3,
                              textTransform: 'none',
                              fontWeight: 600,
                              px: 4,
                              py: 1.5,
                              background:
                                'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                              boxShadow:
                                '0 8px 20px rgba(102, 126, 234, 0.3)',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow:
                                  '0 12px 25px rgba(102, 126, 234, 0.4)',
                              },
                              transition: 'all 0.3s ease',
                            }}
                          >
                            {isSaving
                              ? 'Publishing...'
                              : isPublished
                              ? 'Publish Post'
                              : 'Save Draft'}
                          </Button>
                        </Stack>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </form>
            </Paper>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default BlogForm;
