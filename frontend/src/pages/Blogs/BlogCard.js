import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Typography,
  useTheme,
  Avatar
} from '@mui/material';
import { timeAgo } from '../../utils/dateUtils';

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const handleBlogClick = (slug) => {
    navigate(`/blogs/${slug}`);
  };

  const defaultImage = 'https://source.unsplash.com/random/800x600?technology,coding';
  const handleImageError = (e) => {
    if (e.target.src !== defaultImage) {
      e.target.onerror = null;
      e.target.src = defaultImage;
    }
  };

  return (
    <Card 
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isDark ? '0 1px 3px rgba(255,255,255,0.12)' : '0 1px 3px rgba(0,0,0,0.12)',
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 4px 20px 0px ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`,
          cursor: 'pointer'
        }
      }}
      onClick={() => handleBlogClick(blog.slug)}
    >
      {blog.featuredImage && (
        <CardMedia
          component="img"
          image={blog.featuredImage || defaultImage}
          alt={blog.title}
          onError={handleImageError}
          sx={{
            height: 200,
            objectFit: 'cover'
          }}
        />
      )}
      <CardContent sx={{ display: 'flex', flexDirection: 'column', flex: 1, p: 3 }}>
        <Box sx={{ mb: 2 }}>
          {blog.tags?.slice(0, 3).map(tag => (
            <Chip 
              key={tag} 
              label={tag} 
              size="small" 
              sx={{ 
                mr: 1, 
                mb: 1,
                fontWeight: 'medium',
                backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'primary.light',
                color: isDark ? 'primary.light' : 'primary.main',
              }} 
            />
          ))}
        </Box>
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          {blog.title}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ flexGrow: 1, mb: 3 }}
        >
          {blog.excerpt?.substring(0, 150) || 'No excerpt available...'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
          <Avatar 
            src={blog.author?.avatar || ''}
            alt={blog.author?.name || 'Author'}
            sx={{ width: 40, height: 40, mr: 2 }}
          />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              {blog.author?.name || 'Anonymous'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {timeAgo(blog.publishedAt || blog.createdAt)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BlogCard; 