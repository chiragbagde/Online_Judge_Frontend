import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Box, FormHelperText, Typography, useTheme } from '@mui/material';

const BlogEditor = ({ markdownContent, onMarkdownChange, errors }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box data-color-mode={isDark ? 'dark' : 'light'}>
      <Box
        sx={{
          '.w-md-editor': {
            boxShadow: 'none',
          },
          '.w-md-editor-toolbar': {
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
          },
          '.w-md-editor-content': {
             '& .w-md-editor-preview': {
                fontSize: '1rem',
                lineHeight: 1.7,
                fontFamily: theme.typography.fontFamily,
                color: theme.palette.text.primary,
             },
          },
          '.w-md-editor-input': {
            fontSize: '1rem',
            lineHeight: 1.7,
            fontFamily: theme.typography.fontFamily,
          },
          border: `1px solid ${errors.content ? theme.palette.error.main : theme.palette.divider}`,
          borderRadius: 1,
          overflow: 'hidden',
          minHeight: '600px',
        }}
      >
        <MDEditor
          height={600}
          value={markdownContent}
          onChange={onMarkdownChange}
          preview="live"
        />
      </Box>
      {errors.content && (
        <FormHelperText error sx={{ mt: 1 }}>
          {errors.content}
        </FormHelperText>
      )}
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        {markdownContent?.length || 0} characters | Minimum 100 characters required
      </Typography>
    </Box>
  );
};

export default BlogEditor;