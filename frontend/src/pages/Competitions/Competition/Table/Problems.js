import React from "react";
import { 
  Box, 
  Typography, 
  Chip, 
  Tooltip, 
  IconButton, 
  useTheme,
  CircularProgress,
  Alert,
  Button,
  Paper
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate, useParams } from "react-router-dom";
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Code as CodeIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "#00b8a3";
    case "medium":
      return "#ffc01e";
    case "hard":
      return "#ff375f";
    default:
      return "#666";
  }
};

const getTopicColor = (topic) => {
  const colors = {
    "array": "#4caf50",
    "string": "#2196f3",
    "dynamic programming": "#9c27b0",
    "graph": "#ff9800",
    "tree": "#795548",
    "sorting": "#607d8b",
    "searching": "#e91e63",
    "math": "#3f51b5",
    "greedy": "#009688",
    "backtracking": "#ff5722",
  };
  return colors[topic?.toLowerCase()] || "#666";
};

const Problems = ({ problems, verifySubmissions, loading, error, onRetry }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const columns = [
    {
      field: "statement",
      headerName: "Problem",
      flex: 2.2,
      sortable: true,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
          <IconButton
            size="small"
            onClick={() => navigate(`/competitions/${id}/statement/${params.row._id}`)}
            sx={{ 
              color: 'primary.main',
              backgroundColor: 'rgba(25, 118, 210, 0.08)',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.12)',
              },
              mr: 1
            }}
          >
            <CodeIcon fontSize="small" />
          </IconButton>
          <Typography
            sx={{
              cursor: "pointer",
              color: "text.primary",
              fontWeight: 600,
              lineHeight: 1.3,
              '&:hover': { color: "primary.main" },
              whiteSpace: 'normal',
            }}
            onClick={() => navigate(`/competitions/${id}/statement/${params.row._id}`)}
          >
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "topic",
      headerName: "Topic",
      flex: 1,
      sortable: true,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            backgroundColor: `${getTopicColor(params.value)}15`,
            color: getTopicColor(params.value),
            fontWeight: 500,
            height: 24,
            border: `1px solid ${getTopicColor(params.value)}30`,
          }}
        />
      ),
    },
    {
      field: "difficulty",
      headerName: "Difficulty",
      flex: 1,
      sortable: true,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            backgroundColor: `${getDifficultyColor(params.value)}15`,
            color: getDifficultyColor(params.value),
            fontWeight: 600,
            height: 24,
            border: `1px solid ${getDifficultyColor(params.value)}30`,
          }}
        />
      ),
    },
    {
      field: "verdict",
      headerName: "Status",
      flex: 1,
      sortable: false,
      valueGetter: (params) =>
        verifySubmissions(params?.row?._id) > 0 ? "Passed" : "Not Attempted",
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
          {params.value === "Passed" ? (
            <Tooltip title="Problem Solved">
              <CheckCircleIcon sx={{ color: "#00b8a3", fontSize: 22 }} />
            </Tooltip>
          ) : (
            <Tooltip title="Not Attempted">
              <ErrorIcon sx={{ color: "#666", fontSize: 22 }} />
            </Tooltip>
          )}
          <Typography
            sx={{
              fontWeight: 600,
              color: params.value === "Passed" ? "#00b8a3" : "#666",
              ml: 0.5
            }}
          >
            {params.value}
          </Typography>
        </Box>
      ),
    },
  ];

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        py: 8,
        minHeight: 400
      }}>
        <CircularProgress size={40} thickness={4} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading problems...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        py: 8,
        minHeight: 400
      }}>
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
            border: `1px solid ${isDark ? 'grey.800' : 'grey.200'}`,
            borderRadius: 3,
          }}
        >
          <Alert severity="error" sx={{ mb: 3 }}>
            {error.data?.message || 'Failed to load problems'}
          </Alert>
          <Button 
            variant="contained" 
            startIcon={<RefreshIcon />}
            onClick={onRetry}
            sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600 }}
          >
            Retry
          </Button>
        </Paper>
      </Box>
    );
  }

  if (!problems || problems.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        py: 8,
        minHeight: 400
      }}>
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
            border: `1px solid ${isDark ? 'grey.800' : 'grey.200'}`,
            borderRadius: 3,
          }}
        >
          <CodeIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 3 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No problems available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Problems will be available when the competition starts.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: "100%", 
      height: "auto",
      overflowX: "auto",
      '& .MuiDataGrid-root': {
        minWidth: 800,
      }
    }}>
      <DataGrid
        rows={problems}
        columns={columns}
        getRowId={(row) => row._id}
        autoHeight
        disableColumnSeparator
        disableSelectionOnClick
        hideFooterSelectedRowCount
        getRowClassName={(params) =>
          verifySubmissions(params.row._id) > 0 ? "solved-row" : ""
        }
        sx={{
          border: "none",
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.paper,
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
          "& .MuiDataGrid-row": {
            cursor: "pointer",
            "&:hover": {
              backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
              transition: "background-color 0.2s ease",
            },
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: `1px solid ${theme.palette.divider}`,
          },
          '& .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center',
            borderBottom: "1px solid #f0f0f0",
            background: 'transparent',
            py: 1.5,
          },
          '& .MuiDataGrid-pagination': {
            fontSize: "0.98rem",
          },
        }}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
        pageSizeOptions={[10, 25, 50]}
      />
    </Box>
  );
};

export default Problems;
