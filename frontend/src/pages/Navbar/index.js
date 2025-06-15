import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import {
  CardMedia,
  TextField,
  Divider,
  Stack,
  useTheme,
} from "@mui/material";
import logo from "../../images/logo.png";
import MenuIcon from "@mui/icons-material/Menu";
import { useIsTab } from "../../hooks/use-is-tab";
import { useIsMobile } from "../../hooks/use-is-mobile";
import { useContext, useEffect, useState } from "react";
import { setSearch } from "../../features/auth/dataSlice";
import { ThemeContext } from "../../ThemeContext";
import app from "../../config/firebase";
import { getMessaging, onMessage, getToken } from "firebase/messaging";
import axios from "axios";
import { urlConstants } from "../../apis";
import { getConfig } from "../../utils/getConfig";
import { useProfilePage } from "../../hooks/use-profile-page.hook";

// Import components
import NavigationLinks from "./components/NavigationLinks";
import ThemeToggle from "./components/ThemeToggle";
import NotificationsMenu from "./components/NotificationsMenu";
import UserMenu from "./components/UserMenu";
import MobileDrawer from "./components/MobileDrawer";

export default function Navbar() {
  const { palette } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isTab = useIsTab();
  const isMobile = useIsMobile();
  const { user } = useSelector((state) => state.auth);
  const { search } = useSelector((state) => state.data);

  const [anchorElLeft, setAnchorelLeft] = useState(null);
  const [anchorElRight, setAnchorelRight] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [anchorSettingsEl, setAnchorSettingsEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [badgeCount, setbadgeCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();

  const { themePref, toggleTheme } = useContext(ThemeContext);
  const { avatar } = useProfilePage();

  const darkThemeStyles = {
    background: theme.palette.mode === "dark" ? "#121212" : "#f7f8fa",
    color: theme.palette.mode === "dark" ? "#ffffff" : "#2d3a4a",
    hoverBackground: theme.palette.mode === "dark" ? "#1e1e1e" : "#e3f2fd",
    borderColor: theme.palette.mode === "dark" ? "#333333" : "#ececec",
  };

  const handleLeftMenuClick = (event) => {
    setAnchorelLeft(event.currentTarget);
  };

  const handleRightMenuClick = (event) => {    
    setAnchorelRight(event.currentTarget);
  };

  const handleLeftMenuClose = () => {
    setAnchorelLeft(null);
  };

  const handleRightMenuClose = () => {
    setAnchorelRight(null);
  };

  const handleSettingsClose = () => {
    setAnchorSettingsEl(null);
  };

  const handleThemeChange = (event, newTheme) => {
    if (newTheme !== null) {
      toggleTheme(newTheme);
    }
    setAnchorSettingsEl(null);
  };

  const handleMenuLeftItemClick = (path) => {
    navigate(path);
    handleLeftMenuClose();
    setMobileMenuOpen(false);
    setAnchorelLeft(null);
  };

  const handleMenuRightItemClick = (path) => {
    handleRightMenuClose();
    setMobileMenuOpen(false);
    setAnchorelRight(null);
    navigate(path);
  };

  const handleSettingsMenuOpen = (e) => {
    setAnchorSettingsEl(e.currentTarget);
  };

  const handleOpenNotifications = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setNotificationsAnchor(null);
    setbadgeCount(0);
  };

  const handleMarkAllRead = () => {
    setNotifications([]);
    setbadgeCount(0);
    handleCloseNotifications();
  };

  const getAllNotifications = async () => {
    try {
      const res = await axios.get(`${urlConstants.getAllNotifications}?userId=${user?.id}`, getConfig());
      setNotifications(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const messaging = getMessaging(app);

  useEffect(() => {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        getToken(messaging, {
          vapidKey:
            "BGAXG2l9occppUVO9zV8ylwn-PInDSYT5jqEWdoYQZIPqyDt8bW3_kedTikf5oZM_h0ufWIza3X2O8O_aypW6AI",
        })
          .then((currentToken) => {
            if (currentToken) {
              // Token available
            } else {
              console.log(
                "No registration token available. Request permission to generate one."
              );
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }
    });
  }, []);

  onMessage(messaging, (payload) => {
    console.log(payload, "payload");
    const notifs = [
      ...notifications,
      {
        title: payload.notification.title,
        body: payload.notification.body,
      },
    ];
    setNotifications(notifs);
    setbadgeCount(notifs.length);
  });

  useEffect(() => {
    getAllNotifications();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch(logout());
    navigate("/signin");
  };

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        bgcolor: darkThemeStyles.background,
        color: darkThemeStyles.color,
        boxShadow: "0 2px 8px 0 rgba(60,72,88,0.07)",
        borderRadius: 0,
        zIndex: 1201,
      }}
    >
      <Toolbar
        sx={{
          minHeight: 64,
          px: { xs: 1, md: 4 },
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
          <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}>
            <IconButton onClick={() => setMobileMenuOpen(true)}>
              <MenuIcon sx={{ color: "#1976d2" }} />
            </IconButton>
          </Box>
          <Stack direction="row" gap={0} alignItems="center">
            <CardMedia
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                boxShadow: 1,
                mr: 1,
              }}
              component="img"
              src={logo}
              alt="CodeQuest Logo"
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            />
            <Typography
              variant="h6"
              fontWeight={800}
              sx={{ letterSpacing: 1, color: "#1976d2", cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              CodeQuest
            </Typography>
          </Stack>
        </Box>

        <NavigationLinks darkThemeStyles={darkThemeStyles} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {showSearch ? (
            <TextField
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate(`/problems/search?terms=${search}`);
                }
              }}
              onChange={(e) => dispatch(setSearch(e.target.value))}
              onBlur={() => setShowSearch(false)}
              size="small"
              value={search}
              sx={{ borderRadius: 2, minWidth: 180 }}
              autoFocus
            />
          ) : (
            <IconButton onClick={() => setShowSearch(true)} sx={{ color: "#1976d2" }}>
              <SearchOutlinedIcon />
            </IconButton>
          )}
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              mx: 1,
              display: { xs: "none", md: "block" },
              bgcolor: darkThemeStyles.borderColor,
            }}
          />
          
          <ThemeToggle
            anchorSettingsEl={anchorSettingsEl}
            handleSettingsClose={handleSettingsMenuOpen}
            handleThemeChange={handleThemeChange}
            themePref={themePref}
          />

          <NotificationsMenu
            notificationsAnchor={notificationsAnchor}
            handleOpenNotifications={handleOpenNotifications}
            handleCloseNotifications={handleCloseNotifications}
            handleMarkAllRead={handleMarkAllRead}
            notifications={notifications}
            darkThemeStyles={darkThemeStyles}
          />

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              mx: 1,
              display: { xs: "none", md: "block" },
              bgcolor: darkThemeStyles.borderColor,
            }}
          />

          <UserMenu
            anchorElRight={anchorElRight}
            handleRightMenuClick={handleRightMenuClick}
            handleRightMenuClose={handleRightMenuClose}
            handleMenuRightItemClick={handleMenuRightItemClick}
            handleLogout={handleLogout}
            user={user}
            darkThemeStyles={darkThemeStyles}
            avatar={avatar}
          />
        </Box>
      </Toolbar>

      <MobileDrawer
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        handleMenuLeftItemClick={handleMenuLeftItemClick}
        handleMenuRightItemClick={handleMenuRightItemClick}
        handleLogout={handleLogout}
        user={user}
        darkThemeStyles={darkThemeStyles}
      />
    </AppBar>
  );
} 