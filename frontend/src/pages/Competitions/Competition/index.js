import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import CompetitionTimer from "../timer";
import { setTimestamp } from "../../../features/auth/dataSlice";
import { 
  TableContainer, 
  Paper, 
  Box, 
  Container,
  Typography,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Divider,
  Alert,
  Button,
  Stack,
  Fade
} from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";
import Problems from "./Table/Problems";
import Submissions from "./Table/Submissions";
import Leaderboard from "./Table/Leaderboard";
import CompetitionTerms from "../Terms";
import { 
  useGetCompetitionOverviewMutation,
  useGetCompetitionMutation,
  useGetUserSubmissionsMutation,
  useGetAllSubmissionsMutation,
  useGetLeaderboardMutation,
  useRegisterUserForCompetitionMutation
} from "../../../apis/competitionApi";

const Competition = () => {
  const params = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDark = theme.palette.mode === 'dark';
  const [menuOption, setMenuOption] = useState("problems");
  const [terms, setTerms] = useState(true);

  const { user } = useSelector((state) => state.auth);
  const { timestamp } = useSelector((state) => state.data);
  const dispatch = useDispatch();

  // RTK Query hooks
  const [getCompetitionOverview, { 
    data: overviewData,
    isLoading: overviewLoading,
    error: overviewError 
  }] = useGetCompetitionOverviewMutation();

  const [getCompetition, { 
    data: problemsData,
    isLoading: problemsLoading,
    error: problemsError 
  }] = useGetCompetitionMutation();

  const [getUserSubmissions, { 
    data: submissionsData,
    isLoading: submissionsLoading,
    error: submissionsError 
  }] = useGetUserSubmissionsMutation();

  const [getAllSubmissions, { 
    data: allSubmissionsData,
    isLoading: allSubmissionsLoading,
    error: allSubmissionsError 
  }] = useGetAllSubmissionsMutation();

  const [getLeaderboard, { 
    data: leaderboardData,
    isLoading: leaderboardLoading,
    error: leaderboardError 
  }] = useGetLeaderboardMutation();

  const [registerUserForCompetition, { isLoading: isRegistering }] = useRegisterUserForCompetitionMutation();

  const checkTimeStamp = (data) => {
    const timestamp = data?.fetchedCompetition?.user?.timestamp;
    dispatch(setTimestamp(timestamp));
    if (timestamp) {
      setTerms(false);
    }
  };

  useEffect(() => {
    if (params.id && user?.id) {
      getCompetitionOverview({
        id: params.id,
        userId: user?.id
      });
    }
  }, [params.id, user?.id]);

  useEffect(() => {
    if (overviewData) {
      checkTimeStamp(overviewData);
    }
  }, [overviewData]);

  useEffect(() => {
    if (!terms && params.id) {
      getCompetition({ _id: params.id });
      getUserSubmissions({
        c_id: params.id,
        u_id: user?.id,
        verdict: "passed"
      });
      getAllSubmissions({ c_id: params.id });
      getLeaderboard({ c_id: params.id });
    }
  }, [terms, params.id, user?.id]);

  const handleRegisterUser = async () => {
    try {
      await registerUserForCompetition({
        user_id: user?.id,
        id: params.id,
      }).unwrap();
      
      await getCompetitionOverview({
        id: params.id,
        userId: user?.id
      }).unwrap();
      toast.success("Successfully registered for competition!");
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.data?.message || 'Failed to register for competition');
    }
  };

  const handleRetry = () => {
    getCompetitionOverview({
      id: params.id,
      userId: user?.id
    });
    getCompetition({ _id: params.id });
    getUserSubmissions({
      c_id: params.id,
      u_id: user?.id,
      verdict: "passed"
    });
    getAllSubmissions({ c_id: params.id });
    getLeaderboard({ c_id: params.id });
  };

  const verifySubmissions = (problemId) => {
    const submissions = submissionsData?.submissions || [];
    const numberOfPassedSubmissions = submissions.length ? submissions.filter(
      (submission) =>
        String(submission.p_id) === problemId && submission.verdict === "passed"
    ).length : 0;
    return numberOfPassedSubmissions;
  };

  const isLoading = overviewLoading || problemsLoading || submissionsLoading || allSubmissionsLoading || leaderboardLoading;
  const hasError = overviewError || problemsError || submissionsError || allSubmissionsError || leaderboardError;

  if (terms) {
    return <CompetitionTerms onAccept={handleRegisterUser} />;
  }

  if (hasError) {
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
          p: 2
        }}
      >
        <Fade in timeout={800}>
          <Paper
            sx={{
              p: 4,
              background: isDark ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              textAlign: 'center',
              maxWidth: 500
            }}
          >
            <Alert severity="error" sx={{ mb: 3 }}>
              {overviewError?.data?.message || problemsError?.data?.message || 'Failed to load competition data'}
            </Alert>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button 
                variant="contained" 
                startIcon={<RefreshIcon />}
                onClick={handleRetry}
                sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600 }}
              >
                Retry
              </Button>
              <Button 
                variant="outlined"
                onClick={() => navigate("/competitions")}
                sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600 }}
              >
                Back to Competitions
              </Button>
            </Stack>
          </Paper>
        </Fade>
      </Box>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  const problems = problemsData?.fetchedCompetition?.problems || [];
  const submissions = submissionsData?.submissions || [];
  const allSubmissions = allSubmissionsData?.submissions || [];
  const leaderboard = leaderboardData?.leaderboard || [];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: isDark 
          ? 'linear-gradient(135deg, #0a0e27 0%, #1a1d35 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
      }}
    >
      <Fade in timeout={800}>
        <Container
          maxWidth="xl"
          sx={{
            width: { xs: "100%", lg: "70%" },
          }}
        >
          <Box
            sx={{
              mb: 4,
              p: 3,
              background: isDark ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            }}
          >
            <CompetitionTimer competitionTimestamp={timestamp} />
          </Box>

          <Box
            sx={{
              mb: 3,
              borderRadius: 2,
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              background: isDark ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
            }}
          >
            <Tabs
              value={menuOption}
              onChange={(e, newValue) => setMenuOption(newValue)}
              variant={isMobile ? "fullWidth" : "standard"}
              centered={!isMobile}
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  py: 2.5,
                  minWidth: 160,
                  color: "text.secondary",
                  "&:hover": {
                    bgcolor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.04)",
                    color: "text.primary",
                  },
                },
                "& .Mui-selected": {
                  color: "primary.main",
                },
                "& .MuiTabs-indicator": {
                  height: 3,
                  backgroundColor: "primary.main",
                },
              }}
            >
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Typography variant="h6">Problems</Typography>
                    {problems.length > 0 && (
                      <Box
                        sx={{
                          bgcolor: "primary.main",
                          borderRadius: "12px",
                          px: 1.5,
                          py: 0.5,
                          fontSize: "1rem",
                          fontWeight: 600,
                          color: isDark ? "#000" : "#fff",
                        }}
                      >
                        {problems.length}
                      </Box>
                    )}
                  </Box>
                }
                value="problems"
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Typography variant="h6">Submissions</Typography>
                    {submissions.length > 0 && (
                      <Box
                        sx={{
                          bgcolor: "primary.main",
                          borderRadius: "12px",
                          px: 1.5,
                          py: 0.5,
                          fontSize: "1rem",
                          fontWeight: 600,
                          color: isDark ? "#000" : "#fff",
                        }}
                      >
                        {submissions.length}
                      </Box>
                    )}
                  </Box>
                }
                value="submissions"
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Typography variant="h6">Leaderboard</Typography>
                    {leaderboard.length > 0 && (
                      <Box
                        sx={{
                          bgcolor: "primary.main",
                          borderRadius: "12px",
                          px: 1.5,
                          py: 0.5,
                          fontSize: "1rem",
                          fontWeight: 600,
                          color: isDark ? "#000" : "#fff",
                        }}
                      >
                        {leaderboard.length}
                      </Box>
                    )}
                  </Box>
                }
                value="leaderboard"
              />
            </Tabs>
          </Box>

          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              overflow: "hidden",
              background: isDark ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
            }}
          >
            {menuOption === "problems" && (
              <Problems
                problems={problems}
                verifySubmissions={verifySubmissions}
              />
            )}
            {menuOption === "submissions" && (
              <Submissions allSubmissions={allSubmissions} />
            )}
            {menuOption === "leaderboard" && (
              <Leaderboard leaderboard={leaderboard} />
            )}
          </TableContainer>
        </Container>
      </Fade>
    </Box>
  );
};

export default Competition;
