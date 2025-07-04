import React from "react";
import { 
  Box, 
  Typography, 
  Chip, 
  Avatar, 
  Tooltip,
  CircularProgress,
  Alert,
  Button,
  Paper
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { 
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Code as CodeIcon,
  Assignment as ProblemIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import getFormattedDateTime from "../../../../utils/time";
import { useTheme } from "@mui/material";

const getVerdictColor = (verdict) => {
  switch (verdict?.toLowerCase()) {
    case "passed":
      return "#00b8a3";
    case "failed":
      return "#ff375f";
    case "time limit exceeded":
      return "#ffc01e";
    case "memory limit exceeded":
      return "#9c27b0";
    default:
      return "#666";
  }
};

const getLanguageColor = (language) => {
  const colors = {
    "python": "#306998",
    "javascript": "#f7df1e",
    "java": "#007396",
    "cpp": "#00599c",
    "c": "#a8b9cc",
  };
  return colors[language?.toLowerCase()] || "#666";
};

const Submissions = ({ allSubmissions, loading, error, onRetry }) => {  
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const columns = [
    {
      field: "user",
      headerName: "User",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            sx={{ 
              bgcolor: 'primary.main',
              width: 32,
              height: 32,
            }}
          >
            {params.value.username[0].toUpperCase()}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 600 }}>
              {params.value.username}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              {params.value.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "verdict",
      headerName: "Result",
      width: 180,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {params.value === "passed" ? (
            <CheckCircleIcon sx={{ color: getVerdictColor(params.value), fontSize: 20 }} />
          ) : (
            <ErrorIcon sx={{ color: getVerdictColor(params.value), fontSize: 20 }} />
          )}
          <Chip
            label={params.value}
            size="small"
            sx={{
              backgroundColor: `${getVerdictColor(params.value)}15`,
              color: getVerdictColor(params.value),
              fontWeight: 600,
              height: 24,
              border: `1px solid ${getVerdictColor(params.value)}30`,
            }}
          />
        </Box>
      ),
    },
    {
      field: "language",
      headerName: "Language",
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            backgroundColor: `${getLanguageColor(params.value)}15`,
            color: getLanguageColor(params.value),
            fontWeight: 500,
            height: 24,
            border: `1px solid ${getLanguageColor(params.value)}30`,
          }}
        />
      ),
    },
    {
      field: "submitted_at",
      headerName: "Submitted At",
      width: 200,
      renderCell: (params) => (
        <Box>
          <Typography sx={{ color: 'text.secondary' }}>
            {getFormattedDateTime(params.value)}
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            {new Date(params.value).toLocaleTimeString()}
          </Typography>
        </Box>
      ),
    },
  ];

  const rows = allSubmissions.map((submission) => ({
    id: submission._id,
    user: submission.user,
    problem: submission.p_id,
    verdict: submission.verdict,
    submitted_at: submission.submitted_at,
    language: submission.language,
  }));

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
          Loading submissions...
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
            {error.data?.message || 'Failed to load submissions'}
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

  if (!allSubmissions || allSubmissions.length === 0) {
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
          <ProblemIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 3 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No submissions yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Submissions will appear here once participants start solving problems.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", height: "auto" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        disableColumnSeparator
        disableSelectionOnClick
        hideFooterSelectedRowCount
        sx={{
          border: "none",
          '& .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center',
            borderBottom: "1px solid #f0f0f0",
            background: 'transparent',
            py: 1.5,
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : "#fafafa",
            borderBottom: "2px solid #f0f0f0",
            '& .MuiDataGrid-columnHeader': {
              padding: "14px 8px",
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 700,
              color: "text.primary",
            },
          },
          '& .MuiDataGrid-row': {
            '&:hover': {
              backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : "#f5faff",
            },
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: "1px solid #f0f0f0",
            padding: "12px",
          },
          '& .MuiDataGrid-pagination': {
            fontSize: "0.98rem",
          },
        }}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
          sorting: {
            sortModel: [{ field: 'submitted_at', sort: 'desc' }],
          },
        }}
        pageSizeOptions={[10, 25, 50]}
      />
    </Box>
  );
};

export default Submissions;
