import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  IconButton, 
  Typography, 
  CircularProgress,
  Paper,
  Avatar
} from '@mui/material';
import { CloudUpload as CloudUploadIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { uploadImage } from '../../apis/imageApi';
import { toast } from 'react-toastify';

const ImageUploader = ({
  value = '',
  onChange,
  folder = 'uploads',
  aspectRatio = 1,
  width = '100%',
  height = 200,
  previewSize = 120,
  variant = 'rectangular',
  disabled = false,
  label = 'Upload Image',
  helperText = 'Click to upload or drag and drop',
  required = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    // Check file type
    if (!file.type.match('image.*')) {
      toast.error('Please upload an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);

      const response = await uploadImage(formData);
      onChange(response.data.url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    onChange('');
  };

  const renderPreview = () => {
    if (!value) return null;

    if (variant === 'avatar') {
      return (
        <Box position="relative" width={previewSize} height={previewSize}>
          <Avatar 
            src={value} 
            alt="Preview" 
            sx={{ 
              width: '100%', 
              height: '100%',
              borderRadius: '50%'
            }} 
          />
          {!disabled && (
            <IconButton
              size="small"
              onClick={handleRemoveImage}
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: 'background.paper',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <DeleteIcon fontSize="small" color="error" />
            </IconButton>
          )}
        </Box>
      );
    }

    return (
      <Box 
        position="relative" 
        width="100%" 
        sx={{ 
          paddingTop: `${100 / aspectRatio}%`,
          backgroundColor: 'background.paper',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={value}
          alt="Preview"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {!disabled && (
          <IconButton
            size="small"
            onClick={handleRemoveImage}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'background.paper',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
        )}
      </Box>
    );
  };

  if (value) {
    return (
      <Box>
        {renderPreview()}
        {!disabled && (
          <Button
            variant="outlined"
            color="primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            startIcon={isUploading ? <CircularProgress size={16} /> : <CloudUploadIcon />}
            sx={{ mt: 1 }}
          >
            Change Image
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/*"
        style={{ display: 'none' }}
        disabled={disabled || isUploading}
      />
      <Paper
        variant="outlined"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        sx={{
          p: 3,
          border: '2px dashed',
          borderColor: isDragging ? 'primary.main' : 'divider',
          backgroundColor: isDragging ? 'action.hover' : 'background.paper',
          cursor: disabled ? 'default' : 'pointer',
          transition: 'all 0.3s ease-in-out',
          height: variant === 'rectangular' ? height : 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          '&:hover': {
            borderColor: disabled ? 'divider' : 'primary.main',
            backgroundColor: disabled ? 'background.paper' : 'action.hover',
          },
        }}
      >
        {isUploading ? (
          <Box>
            <CircularProgress size={40} />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Uploading...
            </Typography>
          </Box>
        ) : (
          <Box>
            <CloudUploadIcon 
              color={disabled ? 'disabled' : 'primary'} 
              sx={{ fontSize: 48, mb: 1 }} 
            />
            <Typography variant="subtitle1" color={disabled ? 'text.disabled' : 'text.primary'}>
              {label} {required && '*'}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              {helperText}
            </Typography>
            <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1 }}>
              (Max size: 5MB, JPG, PNG, GIF, WEBP)
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ImageUploader;
