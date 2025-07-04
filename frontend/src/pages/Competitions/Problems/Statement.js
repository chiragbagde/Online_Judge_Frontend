import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StatementPage from "../../StatementPage/StatementPage";
import Loading from "../../Loader/Loader";
import Compiler from "../../StatementPage/Compiler";
import { useSelector } from "react-redux";
import { setTimestamp } from "../../../features/auth/dataSlice";
import CompetitionTimer from "../timer";
import { 
  Box, 
  Divider, 
  Skeleton, 
  Typography, 
  useTheme,
  Paper,
  Alert,
  Button,
  Fade
} from "@mui/material";
import { 
  Refresh as RefreshIcon,
  Code as CodeIcon
} from "@mui/icons-material";
import { useGetCompetitionProblemQuery, useGetCompetitionTimestampMutation } from "../../../apis/competitionApi";

const CompetitionProblem = () => {
  const params = useParams();
  const [output, setOutput] = useState("");
  const [desc, setDesc] = useState(true);
  const [code, setCode] = useState("");
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const { timestamp } = useSelector((state) => state.data);
  const { user } = useSelector((state) => state.auth);

  // RTK Query hooks
  const {
    data: problemData,
    isLoading: loading,
    error,
    refetch: refetchProblem
  } = useGetCompetitionProblemQuery({ id: params.id }, {
    skip: !params.id,
  });

  const [getCompetitionTimestamp] = useGetCompetitionTimestampMutation();

  const problem = problemData?.customprob || {};

  const handleGetTimestamp = async () => {
    try {
      const timestamp = await getCompetitionTimestamp({
        id: "680e852aeb911a0106b3410b",
        userId: user?.id,
      }).unwrap();
      setTimestamp(timestamp);
    } catch (error) {
      console.error('Error fetching timestamp:', error);
    }
  };

  const handleRetry = () => {
    refetchProblem();
  };

  useEffect(() => {
    if (!timestamp) {
      handleGetTimestamp();
    }
  }, [timestamp, user?.id]);

  if (error) {
    return (
      <Box
        sx={{
          width: "100vw",
          minHeight: "100vh",
          p: { xs: 1, md: 4 },
          pt: 0,
          pb: 10,
          background: isDark 
            ? 'linear-gradient(135deg, #0a0e27 0%, #1a1d35 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Paper
          sx={{
            p: 4,
            background: isDark ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            textAlign: 'center'
          }}
        >
          <Alert severity="error" sx={{ mb: 3 }}>
            {error.data?.message || 'Failed to load competition problem'}
          </Alert>
          <Button 
            variant="contained" 
            startIcon={<RefreshIcon />}
            onClick={handleRetry}
            sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600 }}
          >
            Retry
          </Button>
        </Paper>
      </Box>
    );
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        p: { xs: 1, md: 4 },
        pt: 0,
        pb: 10,
        background: isDark 
          ? 'linear-gradient(135deg, #0a0e27 0%, #1a1d35 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Fade in timeout={800}>
        <Box>
          <Box 
            sx={{ 
              mr: 2, 
              my: 2,
              background: isDark 
                ? 'linear-gradient(145deg, rgba(30,30,30,0.95) 0%, rgba(40,40,40,0.95) 100%)'
                : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              p: 2
            }}
          >
            <CompetitionTimer competitionTimestamp={timestamp} />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
            }}
          >
            <Box
              sx={{
                width: { xs: "100%", md: "50%" },
                height: "90vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <StatementPage
                description={problem.description}
                examples={problem.examples}
                statement={problem.statement}
                setDesc={setDesc}
                constraints={problem.constraints}
                loading={loading}
                darkMode
              />
            </Box>
            <Box sx={{ height: "90vh", width: { xs: "100%", md: "50%" } }}>
              <Compiler
                output={output}
                setOutput={setOutput}
                setLoading={() => {}}
                code={code}
                setCode={setCode}
                setDesc={setDesc}
                id={problem._id}
                c_id={params.c_id}
                darkMode
              />
            </Box>
          </Box>
        </Box>
      </Fade>
    </Box>
  );
};

export default CompetitionProblem;
