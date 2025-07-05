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
  Avatar,
  Stack,
  IconButton,
  Divider
} from '@mui/material';
import { 
  Schedule as TimeIcon,
  Visibility as ViewIcon,
  FavoriteBorder as LikeIcon,
  BookmarkBorder as BookmarkIcon
} from '@mui/icons-material';
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
        background: isDark 
          ? 'linear-gradient(145deg, rgba(30,30,30,0.95) 0%, rgba(40,40,40,0.95) 100%)'
          : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: 4,
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
        boxShadow: isDark 
          ? '0 8px 32px rgba(0,0,0,0.3)' 
          : '0 8px 32px rgba(0,0,0,0.12)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: isDark 
            ? '0 20px 40px rgba(0,0,0,0.4)' 
            : '0 20px 40px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          '& .blog-image': {
            transform: 'scale(1.05)',
          },
          '& .blog-chip': {
            transform: 'scale(1.05)',
          },
        }
      }}
      onClick={() => handleBlogClick(blog.slug)}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        {blog.featuredImage && (
          <CardMedia
            component="img"
            image={blog.featuredImage || defaultImage}
            alt={blog.title}
            onError={handleImageError}
            className="blog-image"
            sx={{
              height: 220,
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
            }}
          />
        )}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          {blog.tags?.slice(0, 2).map(tag => (
            <Chip 
              key={tag} 
              label={tag} 
              size="small"
              className="blog-chip"
              sx={{ 
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.75rem',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.8)',
                }
              }} 
            />
          ))}
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
          }}
        >
          <IconButton
            size="small"
            sx={{
              backgroundColor: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,1)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease',
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <BookmarkIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>

      <CardContent sx={{ display: 'flex', flexDirection: 'column', flex: 1, p: 3 }}>
        <Typography 
          variant="h6" 
          component="h2" 
          sx={{ 
            fontWeight: 700,
            fontSize: '1.25rem',
            lineHeight: 1.3,
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: isDark ? 'grey.100' : 'grey.900',
          }}
        >
          {blog.title}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            flexGrow: 1, 
            mb: 3,
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {blog.excerpt?.substring(0, 120) || 'No excerpt available...'}...
        </Typography>

        <Divider sx={{ mb: 2, borderColor: isDark ? 'grey.800' : 'grey.200' }} />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar 
              src={blog.author?.avatar || ''}
              alt={blog.author?.name || 'Author'}
              sx={{ 
                width: 36, 
                height: 36,
                border: `2px solid ${isDark ? 'grey.700' : 'grey.300'}`,
              }}
            />
            <Box>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  fontWeight: 600,
                  color: isDark ? 'grey.200' : 'grey.800',
                  fontSize: '0.875rem',
                }}
              >
                {blog.author?.name || 'Anonymous'}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <TimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {timeAgo(blog.publishedAt || blog.createdAt)}
                </Typography>
              </Stack>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <LikeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {blog.likes?.length || 0}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <ViewIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {blog.views || 0}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default BlogCard; 