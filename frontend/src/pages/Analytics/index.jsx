import React, { useState } from "react";
import { 
  Container, 
  CardContent, 
  Typography, 
  Avatar, 
  Box, 
  Stack,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  useTheme,
  Tabs,
  Tab,
  Card,
  CardHeader,
  IconButton,
  Tooltip,
  LinearProgress
} from "@mui/material";
import { useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CodeIcon from "@mui/icons-material/Code";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PersonIcon from "@mui/icons-material/Person";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  useGetUserAnalyticsQuery,
  useGetUserStatsQuery,
  useGetUserVerdictDistributionQuery,
  useGetUserCompetitionsQuery,
  useGetUserSocialStatsQuery,
  useGetUserProgressQuery,
  useGetPerformanceMetricsQuery
} from "../../apis/analyticsApi";
import { useSelector } from "react-redux";

const AnalyticsCard = styled(Card)(({ theme }) => ({
  height: '100%',
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(145deg, rgba(30,30,30,0.95) 0%, rgba(40,40,40,0.95) 100%)'
    : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
  backdropFilter: 'blur(20px)',
  borderRadius: 16,
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 8px 32px rgba(0,0,0,0.3)' 
    : '0 8px 32px rgba(0,0,0,0.12)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 20px 40px rgba(0,0,0,0.4)' 
      : '0 20px 40px rgba(0,0,0,0.15)',
  }
}));

const StatCard = ({ title, value, icon, color = "primary", subtitle, progress }) => {
  const theme = useTheme();
  
  return (
    <AnalyticsCard>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: theme.palette[color].main }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              backgroundColor: `${theme.palette[color].main}20`,
              color: theme.palette[color].main,
            }}
          >
            {icon}
          </Box>
        </Stack>
        {progress !== undefined && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: `${theme.palette[color].main}20`,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: theme.palette[color].main,
                  borderRadius: 4,
                }
              }} 
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {progress}% complete
            </Typography>
          </Box>
        )}
      </CardContent>
    </AnalyticsCard>
  );
};

const VerdictCard = ({ verdict, count, total, color }) => {
  const theme = useTheme();
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  
  return (
    <AnalyticsCard>
      <CardContent sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: color, mb: 1 }}>
          {count}
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {verdict}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <LinearProgress 
            variant="determinate" 
            value={percentage} 
            sx={{ 
              height: 6, 
              borderRadius: 3,
              backgroundColor: `${color}20`,
              '& .MuiLinearProgress-bar': {
                backgroundColor: color,
                borderRadius: 3,
              }
            }} 
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {percentage}% of total submissions
          </Typography>
        </Box>
      </CardContent>
    </AnalyticsCard>
  );
};

export default function UserAnalyticsPage() {
  const { userId } = useParams();
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);
  const [tabValue, setTabValue] = useState(0);
  const [timeframe, setTimeframe] = useState('month');

  // RTK Query hooks
  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError,
    refetch: refetchAnalytics
  } = useGetUserAnalyticsQuery(userId || user?.id);

  const {
    data: userStats,
    isLoading: statsLoading,
    error: statsError
  } = useGetUserStatsQuery(userId || user?.id);

  const {
    data: verdictData,
    isLoading: verdictLoading,
    error: verdictError
  } = useGetUserVerdictDistributionQuery(userId || user?.id);

  const {
    data: competitionsData,
    isLoading: competitionsLoading,
    error: competitionsError
  } = useGetUserCompetitionsQuery(userId || user?.id);

  const {
    data: socialStats,
    isLoading: socialLoading,
    error: socialError
  } = useGetUserSocialStatsQuery(userId || user?.id);

  const {
    data: progressData,
    isLoading: progressLoading,
    error: progressError
  } = useGetUserProgressQuery({ userId: userId || user?.id, timeframe });

  const {
    data: performanceData,
    isLoading: performanceLoading,
    error: performanceError
  } = useGetPerformanceMetricsQuery({ userId: userId || user?.id, timeframe });

  const isLoading = analyticsLoading || statsLoading || verdictLoading || competitionsLoading;
  const hasError = analyticsError || statsError || verdictError || competitionsError;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRefresh = () => {
    refetchAnalytics();
  };

  if (isLoading) {
    return (
      <Container sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Stack spacing={2} alignItems="center">
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" color="text.secondary">
              Loading analytics data...
            </Typography>
          </Stack>
        </Box>
      </Container>
    );
  }

  if (hasError) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          action={
            <IconButton color="inherit" size="small" onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          }
        >
          Failed to load analytics data. Please try again.
        </Alert>
      </Container>
    );
  }

  const totalSubmissions = userStats?.totalSubmissions || 0;
  const verdictDistribution = verdictData?.verdicts || {};
  const competitions = competitionsData?.competitions || [];
  const socialLinks = socialStats?.socialLinks || {};
  const progress = progressData?.progress || 0;
  const performance = performanceData?.metrics || {};

  const verdictColors = {
    Accepted: theme.palette.success.main,
    WrongAnswer: theme.palette.error.main,
    TimeLimitExceeded: theme.palette.warning.main,
    RuntimeError: theme.palette.error.main,
    CompilationError: theme.palette.info.main,
    MemoryLimitExceeded: theme.palette.warning.main,
  };

  const totalVerdicts = Object.values(verdictDistribution).reduce((sum, count) => sum + count, 0);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
            Analytics Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Performance insights and statistics
          </Typography>
        </Box>
        <Tooltip title="Refresh data">
          <IconButton onClick={handleRefresh} size="large">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 4 }}>
        <Tab label="Overview" />
        <Tab label="Performance" />
        <Tab label="Competitions" />
        <Tab label="Progress" />
      </Tabs>

      {tabValue === 0 && (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Submissions"
                value={totalSubmissions}
                icon={<CodeIcon />}
                color="primary"
                subtitle="All time submissions"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Success Rate"
                value={`${userStats?.successRate || 0}%`}
                icon={<TrendingUpIcon />}
                color="success"
                subtitle="Accepted submissions"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Competitions"
                value={competitions.length}
                icon={<EmojiEventsIcon />}
                color="warning"
                subtitle="Participated in"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Ranking"
                value={`#${userStats?.ranking || 'N/A'}`}
                icon={<PersonIcon />}
                color="info"
                subtitle="Global position"
              />
            </Grid>
          </Grid>

          <AnalyticsCard sx={{ mb: 4 }}>
            <CardHeader
              title="User Information"
              titleTypographyProps={{ variant: 'h5', fontWeight: 600 }}
            />
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={3}>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    fontSize: '2rem',
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)'
                  }}
                >
                  {user.firstname?.charAt(0) || 'U'}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" gutterBottom>
                    {user.firstname} {user.lastname}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    {user.email}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Chip label={`${userStats?.problemsSolved || 0} Problems Solved`} color="primary" />
                    <Chip label={`${userStats?.streak || 0} Day Streak`} color="success" />
                    <Chip label={`${userStats?.rating || 0} Rating`} color="warning" />
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </AnalyticsCard>

          <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
            Verdict Distribution
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {Object.entries(verdictDistribution).map(([verdict, count]) => (
              <Grid item xs={12} sm={6} md={3} key={verdict}>
                <VerdictCard
                  verdict={verdict}
                  count={count}
                  total={totalVerdicts}
                  color={verdictColors[verdict] || theme.palette.grey.main}
                />
              </Grid>
            ))}
          </Grid>

          <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
            Social Profiles
          </Typography>
          <AnalyticsCard>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                {socialLinks.github && (
                  <Tooltip title="GitHub Profile">
                    <IconButton 
                      href={socialLinks.github} 
                      target="_blank"
                      sx={{ color: '#333' }}
                    >
                      <GitHubIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {socialLinks.linkedin && (
                  <Tooltip title="LinkedIn Profile">
                    <IconButton 
                      href={socialLinks.linkedin} 
                      target="_blank"
                      sx={{ color: '#0077b5' }}
                    >
                      <LinkedInIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {socialLinks.twitter && (
                  <Tooltip title="Twitter Profile">
                    <IconButton 
                      href={socialLinks.twitter} 
                      target="_blank"
                      sx={{ color: '#1DA1F2' }}
                    >
                      <TwitterIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {socialLinks.instagram && (
                  <Tooltip title="Instagram Profile">
                    <IconButton 
                      href={socialLinks.instagram} 
                      target="_blank"
                      sx={{ color: '#E4405F' }}
                    >
                      <InstagramIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {Object.keys(socialLinks).length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No social profiles linked
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </AnalyticsCard>
        </>
      )}

      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <AnalyticsCard>
              <CardHeader
                title="Performance Metrics"
                titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
              />
              <CardContent>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Average Submission Time
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {performance.avgSubmissionTime || 'N/A'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Best Language
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {performance.bestLanguage || 'N/A'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Problem Solving Speed
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {performance.solvingSpeed || 'N/A'}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </AnalyticsCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <AnalyticsCard>
              <CardHeader
                title="Recent Activity"
                titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Performance tracking and activity data will be displayed here.
                </Typography>
              </CardContent>
            </AnalyticsCard>
          </Grid>
        </Grid>
      )}

      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <AnalyticsCard>
              <CardHeader
                title="Competition History"
                titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
              />
              <CardContent>
                {competitions.length > 0 ? (
                  <Stack spacing={2}>
                    {competitions.map((competition, index) => (
                      <Box key={competition._id || index}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="h6">{competition.title}</Typography>
                          <Chip 
                            label={`Rank: ${competition.rank || 'N/A'}`} 
                            color="primary" 
                            size="small" 
                          />
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {competition.date} • {competition.score || 0} points
                        </Typography>
                        {index < competitions.length - 1 && <Divider sx={{ my: 2 }} />}
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No competition history available.
                  </Typography>
                )}
              </CardContent>
            </AnalyticsCard>
          </Grid>
        </Grid>
      )}

      {tabValue === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <StatCard
              title="Learning Progress"
              value={`${progress}%`}
              icon={<TrendingUpIcon />}
              color="success"
              progress={progress}
              subtitle="Overall completion"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <AnalyticsCard>
              <CardHeader
                title="Progress Details"
                titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Detailed progress tracking and learning path completion will be displayed here.
                </Typography>
              </CardContent>
            </AnalyticsCard>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
