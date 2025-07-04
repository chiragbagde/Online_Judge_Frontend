import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Paper,
  CircularProgress,
  useTheme,
  Stack,
  Avatar,
  Divider,
  IconButton,
  Alert,
  Button
} from '@mui/material';
import { 
  TrendingUp, 
  LocalOffer, 
  Article,
  FavoriteBorder as LikeIcon,
  Visibility as ViewIcon,
  ArrowForward as ArrowIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SidebarSection = ({ title, icon, children, subtitle, error, onRetry }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        mb: 3,
        background: isDark 
          ? 'linear-gradient(145deg, rgba(30,30,30,0.95) 0%, rgba(40,40,40,0.95) 100%)'
          : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
        borderRadius: 4,
        boxShadow: isDark 
          ? '0 8px 32px rgba(0,0,0,0.3)' 
          : '0 8px 32px rgba(0,0,0,0.12)',
        transition: 'all 0.3s ease',
        position: 'sticky',
        top: 100,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: 2,
            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
            color: 'white',
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography 
            variant="h6" 
            component="h3" 
            sx={{ 
              fontWeight: 700,
              color: isDark ? 'grey.100' : 'grey.900',
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Stack>
      
      {error ? (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.data?.message || 'Failed to load data'}
          </Alert>
          {onRetry && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={onRetry}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Retry
            </Button>
          )}
        </Box>
      ) : (
        children
      )}
    </Paper>
  );
};

const BlogSidebar = ({ loading, trending, tags, onTagClick, errors }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box>
      <SidebarSection 
        title="Trending Now" 
        subtitle="Most popular this week"
        icon={<TrendingUp />}
        error={errors?.trending}
      >
        {loading.trending ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <Stack spacing={1}>
            {trending.length > 0 ? (
              trending.map((article, index) => (
                <Box key={article._id}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        transform: 'translateX(4px)',
                      }
                    }}
                    onClick={() => navigate(`/blogs/${article.slug}`)}
                  >
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Box
                        sx={{
                          minWidth: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '0.875rem',
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 600,
                            mb: 0.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            lineHeight: 1.3,
                            color: isDark ? 'grey.200' : 'grey.800',
                          }}
                        >
                          {article.title}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <LikeIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {article.likes?.length || 0}
                            </Typography>
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <ViewIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {article.views || 0}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Box>
                      <IconButton 
                        size="small"
                        sx={{ 
                          opacity: 0,
                          transition: 'opacity 0.2s ease',
                          '.MuiBox-root:hover &': {
                            opacity: 1,
                          }
                        }}
                      >
                        <ArrowIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Stack>
                  </Box>
                  {index < trending.length - 1 && (
                    <Divider sx={{ my: 1, borderColor: isDark ? 'grey.800' : 'grey.200' }} />
                  )}
                </Box>
              ))
            ) : (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  No trending articles yet
                </Typography>
              </Box>
            )}
          </Stack>
        )}
      </SidebarSection>

      <SidebarSection 
        title="Popular Tags" 
        subtitle="Explore topics"
        icon={<LocalOffer />}
        error={errors?.tags}
      >
        {loading.tags ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {tags.length > 0 ? (
              tags.map((tag) => (
                <Chip
                  key={tag.name}
                  label={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {tag.name}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          px: 1,
                          py: 0.25,
                          borderRadius: 1,
                          fontWeight: 600,
                        }}
                      >
                        {tag.count}
                      </Typography>
                    </Stack>
                  }
                  onClick={() => onTagClick(tag.name)}
                  clickable
                  sx={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    py: 1.5,
                    px: 2,
                    borderRadius: 2,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[4],
                      '& .MuiTypography-root': {
                        color: 'white',
                      }
                    },
                    transition: 'all 0.2s ease',
                  }}
                />
              ))
            ) : (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  No tags available
                </Typography>
              </Box>
            )}
          </Stack>
        )}
      </SidebarSection>

      <SidebarSection 
        title="Write & Share" 
        subtitle="Join our community"
        icon={<Article />}
      >
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            Share your knowledge and connect with fellow developers. Every great journey starts with a single step.
          </Typography>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              color: 'white',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[8],
              }
            }}
            onClick={() => navigate('/blogs/new')}
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Start Writing Today
            </Typography>
          </Box>
        </Stack>
      </SidebarSection>
    </Box>
  );
};

export default BlogSidebar; 