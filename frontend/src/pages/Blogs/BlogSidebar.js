import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Paper,
  Divider,
  CircularProgress,
  useTheme
} from '@mui/material';
import { TrendingUp, Category, LocalOffer } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SidebarSection = ({ title, icon, children }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2, 
        mb: 3,
        backgroundColor: isDark ? 'background.paper' : '#f7f9fc',
        border: '1px solid',
        borderColor: isDark ? 'grey.800' : 'grey.200',
        borderRadius: '12px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon}
        <Typography variant="h6" component="h3" sx={{ ml: 1, fontWeight: 'bold' }}>
          {title}
        </Typography>
      </Box>
      {children}
    </Paper>
  );
};

const BlogSidebar = ({ loading, trending, tags, onTagClick }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box>
      <SidebarSection title="Trending" icon={<TrendingUp color="primary" />}>
        {loading.trending ? <CircularProgress size={24} /> : (
          <List dense>
            {trending.map((article) => (
              <ListItem 
                key={article._id} 
                button 
                onClick={() => navigate(`/blogs/${article.slug}`)}
                sx={{ borderRadius: '8px' }}
              >
                <ListItemText
                  primary={article.title}
                  secondary={`${article.likes} likes`}
                  primaryTypographyProps={{ fontWeight: 'medium' }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </SidebarSection>

      <SidebarSection title="Popular Tags" icon={<LocalOffer color="primary" />}>
        {loading.tags ? <CircularProgress size={24} /> : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {tags.map((tag) => (
              <Chip
                key={tag.name}
                label={`${tag.name} (${tag.count})`}
                onClick={() => onTagClick(tag.name)}
                clickable
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        )}
      </SidebarSection>
    </Box>
  );
};

export default BlogSidebar; 