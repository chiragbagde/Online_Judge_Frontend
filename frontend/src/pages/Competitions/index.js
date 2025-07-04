import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../Loader/Loader";
import getFormattedDateTime from "../../utils/time";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardContent,
  Typography,
  CardActions,
  Box,
  CardMedia,
  useTheme,
  Paper,
  Stack,
  Fade,
  Alert,
  CircularProgress
} from "@mui/material";
import { 
  Event, 
  Group, 
  CheckCircle, 
  Refresh as RefreshIcon,
  TrendingUp,
  Schedule as ScheduleIcon
} from "@mui/icons-material";
import { 
  useGetCompetitionsQuery,
  useAddUserToCompetitionMutation,
  useGetCompetitionOverviewMutation
} from "../../apis/competitionApi";
import { images } from "../../data/contest";
import axios from "axios";
import { urlConstants } from "../../apis";
import { getConfig } from "../../utils/getConfig";

const Competitions = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // RTK Query hooks
  const {
    data: competitionsData,
    isLoading: loading,
    error,
    refetch
  } = useGetCompetitionsQuery(user?.id, {
    skip: !user?.id,
  });

  const [addUserToCompetition, { isLoading: isRegistering }] = useAddUserToCompetitionMutation();
  const [getCompetitionOverview] = useGetCompetitionOverviewMutation();

  const [imagesUrls, setImagesUrls] = useState([]);
  const [competitions, setCompetitions] = useState([]);

  useEffect(() => {
    if (competitionsData?.competitions) {
      setCompetitions(competitionsData.competitions);
    }
  }, [competitionsData]);

  const handleAddUserToCompetition = async (id) => {
    try {
      await addUserToCompetition({
        user_id: user?.id,
        id,
      }).unwrap();
      
      setCompetitions((prevCompetitions) =>
        prevCompetitions.map((competition) =>
          competition._id === id
            ? {
                ...competition,
                user: {
                  ...competition.user,
                  userId: user?.id, 
                  timestamp: new Date(),
                },
              }
            : competition
        )
      );
      toast.success("Registered for competition successfully!");
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.data?.message || 'Failed to register for competition');
    }
  };

  const handleCompetitionRedirect = async (competition) => {
    const currentDate = new Date();
    if (
      currentDate >= new Date(competition.start_date) &&
      currentDate <= new Date(competition.end_date)
    ) {
      if (!foundUser(competition)) {
        toast.error("Please register for this competition first");
        return;
      }

      try {
        await getCompetitionOverview({
          id: competition._id,
          userId: user?.id
        }).unwrap();
        navigate(`/competitions/${competition._id}`);
      } catch (error) {
        console.error('Navigation error:', error);
        toast.error('Failed to access competition');
      }
    } else {
      toast.error("This competition is not currently active");
    }
  };

  const foundUser = (competition) => {    
    if(!competition.user) return false;
    return competition.user["userId"] === user?.id;
  };

  const getStatus = (competition) => {
    const now = new Date();
    if (now < new Date(competition.start_date)) return { label: "Upcoming", color: "info" };
    if (now > new Date(competition.end_date)) return { label: "Ended", color: "default" };
    return { label: "Ongoing", color: "success" };
  };

  const handleRetry = () => {
    refetch();
  };

  useEffect(() => {
    const fetchCompetitionsImages = async () => {
      const cached = localStorage.getItem("competitionImages");
  
      if (cached) {
        const parsed = JSON.parse(cached);
        const now = Date.now();
  
        if (now - parsed.timestamp < 3600000) {
          setImagesUrls(parsed.urls);
          return;
        }
      }
  
      try {
        const response = await axios.post(urlConstants.getSignedUrl, {
          keys: images,
        }, getConfig());
        
        if (response.data) {
          const urls = response.data.map((obj) => obj.url);
          setImagesUrls(urls);
  
          localStorage.setItem(
            "competitionImages",
            JSON.stringify({ urls, timestamp: Date.now() })
          );
        }
      } catch (e) {
        console.error("Error fetching signed URLs:", e);
      }
    };
  
    fetchCompetitionsImages();
  }, [user?.token]);

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
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
            {error.data?.message || 'Failed to load competitions'}
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
        minHeight: '100vh',
        background: isDark 
          ? 'linear-gradient(135deg, #0a0e27 0%, #1a1d35 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
        px: 2
      }}
    >
      <Fade in timeout={800}>
        <Box>
          <Box sx={{ mb: 6, textAlign: "center" }}>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 3 }}>
              <TrendingUp sx={{ fontSize: 40, color: '#ffd700' }} />
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 900,
                  background: 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                }}
              >
                Competitions
              </Typography>
            </Stack>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 300,
                maxWidth: 600,
                mx: 'auto',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              Join, compete, and climb the leaderboard!
            </Typography>
          </Box>

          {competitions.length === 0 ? (
            <Paper
              sx={{
                p: 8,
                textAlign: 'center',
                backgroundColor: isDark ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              <ScheduleIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 3 }} />
              <Typography variant="h5" color="text.secondary" gutterBottom>
                No competitions available
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Check back later for upcoming competitions!
              </Typography>
            </Paper>
          ) : (
            <Box
              sx={{
                width: { xs: "100%", lg: "80%" },
                mx: "auto",
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                gap: 3,
                py: 2,
              }}
            >
              {competitions.map((competition, index) => {
                const status = getStatus(competition);
                return (
                  <Fade in timeout={600 + index * 100} key={competition._id}>
                    <Card
                      sx={{
                        borderRadius: 3,
                        boxShadow: 3,
                        transition: "transform 0.2s, box-shadow 0.2s",
                        position: "relative",
                        background: isDark 
                          ? 'linear-gradient(145deg, rgba(30,30,30,0.95) 0%, rgba(40,40,40,0.95) 100%)'
                          : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                        "&:hover": {
                          transform: "scale(1.025)",
                          boxShadow: 6,
                        },
                      }}
                    >
                      <Box
                        sx={{ position: "absolute", top: 16, left: 16, zIndex: 2 }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            bgcolor:
                              status.color === "success"
                                ? "#e8f5e9"
                                : status.color === "info"
                                ? "#e3f2fd"
                                : "#ececec",
                            color:
                              status.color === "success"
                                ? "#388e3c"
                                : status.color === "info"
                                ? "#1976d2"
                                : "#7b8ba3",
                            fontWeight: 700,
                          }}
                        >
                          {status.label}
                        </Typography>
                      </Box>
                      <CardMedia
                        component="img"
                        onClick={() => handleCompetitionRedirect(competition)}
                        sx={{
                          height: 180,
                          objectFit: "cover",
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12,
                          cursor: "pointer",
                        }}
                        src={imagesUrls[index % imagesUrls.length]}
                        alt="Competition Banner"
                      />
                      <CardContent sx={{ p: 2 }}>
                        <Typography
                          variant="h6"
                          fontWeight={800}
                          sx={{ 
                            cursor: "pointer", 
                            mb: 1, 
                            color: isDark ? 'grey.100' : '#2d3a4a',
                            '&:hover': {
                              color: theme.palette.primary.main,
                            }
                          }}
                          onClick={() => handleCompetitionRedirect(competition)}
                        >
                          {competition.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          📅 Start:{" "}
                          <strong>
                            {getFormattedDateTime(competition.start_date)}
                          </strong>
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={1}>
                          🏁 End:{" "}
                          <strong>
                            {getFormattedDateTime(competition.end_date)}
                          </strong>
                        </Typography>
                        {competition.participants && (
                          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                            <Group sx={{ fontSize: 18, color: theme.palette.primary.main, mr: 0.5 }} />
                            <Typography variant="caption" color="primary">
                              {competition.participants.length} participants
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                      <CardActions sx={{ px: 2, pb: 2 }}>
                        <Button
                          fullWidth
                          variant={foundUser(competition) ? "contained" : "outlined"}
                          color={foundUser(competition) ? "success" : "primary"}
                          onClick={() => handleAddUserToCompetition(competition._id)}
                          startIcon={
                            foundUser(competition) ? <CheckCircle /> : 
                            isRegistering ? <CircularProgress size={16} /> : null
                          }
                          title={
                            foundUser(competition)
                              ? "You are registered for this competition"
                              : "Register to participate"
                          }
                          sx={{ 
                            fontWeight: 700, 
                            fontSize: 16, 
                            borderRadius: 2,
                            textTransform: 'none',
                          }}
                          disabled={foundUser(competition) || isRegistering}
                        >
                          {foundUser(competition) ? "Registered" : 
                           isRegistering ? "Registering..." : "Register"}
                        </Button>
                      </CardActions>
                    </Card>
                  </Fade>
                );
              })}
            </Box>
          )}
        </Box>
      </Fade>
    </Box>
  );
};

export default Competitions;
