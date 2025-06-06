import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import GreyCircle from "../../components/GreyCircle";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import {
  CardMedia,
  IconButton,
  Popover,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  Badge,
  Modal,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Drawer,
  Stack,
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
import { Notifications as NotificationsFilled, NotificationsNoneOutlined } from "@mui/icons-material";
import { ListItemAvatar, Avatar as MuiAvatar } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CodeIcon from '@mui/icons-material/Code';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ProfileAvatar from "../../components/Profile/components/ProfileAvatar";
import { useProfilePage } from "../../hooks/use-profile-page.hook";

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
  }

  const handleCloseNotifications = () => {
    setNotificationsAnchor(null);
    setbadgeCount(0);
  }

  const handleMarkAllRead = () => {
    setNotifications([]);
    setbadgeCount(0);
    handleCloseNotifications();
  };

  const settingsId = "primary-theme-menu";
  const isSettingsOpen = Boolean(anchorSettingsEl);

  const getAllNotifications = async () => {
    try {
      const res = await axios.get(`${urlConstants.getAllNotifications}?userId=${user?.id}`, getConfig());
      setNotifications(res.data);
    }catch(e){
      console.error(e);
    }
  }

  const renderTheme = (
    <Popover
      disableScrollLock
      id={settingsId}
      open={isSettingsOpen}
      anchorEl={anchorSettingsEl}
      onClose={handleSettingsClose}
      anchorOrigin={{
        vertical: "bottom",
      }}
    >
      <ToggleButtonGroup
        value={themePref}
        exclusive
        onChange={handleThemeChange}
        aria-label="theme selection"
      >
        <ToggleButton value="light" aria-label="Light">
          <Typography p={1}>Light</Typography>
        </ToggleButton>
        <ToggleButton value="dark" aria-label="Dark">
          <Typography p={1}>Dark</Typography>
        </ToggleButton>
        <ToggleButton value="system" aria-label="System">
          <Typography p={1}>System</Typography>
        </ToggleButton>
      </ToggleButtonGroup>
    </Popover>
  );

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
  }, [])

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
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}
        >
          <Box
            sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}
          >
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

        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 2,
            ml: 4,
          }}
        >
          <Button
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: 16,
              color: darkThemeStyles.color,
              px: 2,
              borderRadius: 2,
              "&:hover": { bgcolor: darkThemeStyles.hoverBackground },
            }}
            onClick={() => navigate("/blogs")}
            color="inherit"
          >
            Blog
          </Button>
          <Button
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: 16,
              color: darkThemeStyles.color,
              px: 2,
              borderRadius: 2,
              "&:hover": { bgcolor: darkThemeStyles.hoverBackground },
            }}
            onClick={() => navigate("/problems")}
            color="inherit"
          >
            Problems
          </Button>
          <Button
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: 16,
              color: darkThemeStyles.color,
              px: 2,
              borderRadius: 2,
              "&:hover": { bgcolor: darkThemeStyles.hoverBackground },
            }}
            onClick={() => navigate("/competitions")}
            color="inherit"
          >
            Contests
          </Button>
          <Button
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: 16,
              color: darkThemeStyles.color,
              px: 2,
              borderRadius: 2,
              "&:hover": { bgcolor: darkThemeStyles.hoverBackground },
            }}
            onClick={() => navigate("/compiler")}
            color="inherit"
          >
            Playground
          </Button>
        </Box>

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
            <IconButton
              onClick={() => setShowSearch(true)}
              sx={{ color: "#1976d2" }}
            >
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
          <IconButton
            onClick={handleSettingsMenuOpen}
            sx={{ color: "#1976d2" }}
          >
            <DarkModeOutlinedIcon />
          </IconButton>
          <Badge
            badgeContent={notifications.length}
            color="error"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <IconButton
              onClick={handleOpenNotifications}
              sx={{ color: notifications.length ? "#1976d2" : "#b0b0b0" }}
            >
              {notifications.length ? (
                <NotificationsFilled />
              ) : (
                <NotificationsNoneOutlined />
              )}
            </IconButton>
          </Badge>
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              mx: 1,
              display: { xs: "none", md: "block" },
              bgcolor: darkThemeStyles.borderColor,
            }}
          />
          <ProfileAvatar
            onClick={handleRightMenuClick}
            src={avatar}
            alt="avatar"
            userId={user?.id}
            sx={{
              width: 36,
              height: 36,
              boxShadow: theme.shadows[2],
              background: theme.palette.background.paper,
              cursor: "pointer"
            }}
          />
          {/* <Avatar
            sx={{
              bgcolor: "#1976d2",
              width: 36,
              height: 36,
              border: "2px solid #e3f2fd",
              fontWeight: 700,
              cursor: "pointer",
              ml: 1,
            }}
            onClick={handleRightMenuClick}
          >
            {user?.name ? user.name[0].toUpperCase() : "C"}
          </Avatar> */}
        </Box>

        <Menu
          disableScrollLock
          id="menu-appbar"
          anchorel={anchorElLeft}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          open={Boolean(anchorElLeft)}
          onClose={handleLeftMenuClose}
          PaperProps={{
            sx: {
              bgcolor: darkThemeStyles.background,
              boxShadow: 3,
              borderRadius: 2,
              p: 1,
              minWidth: 180,
            },
          }}
        >
          <MenuItem
            onClick={() => handleMenuLeftItemClick("/")}
            sx={{
              fontWeight: 600,
              fontSize: 16,
              borderRadius: 2,
              mb: 0.5,
              "&:hover": { bgcolor: darkThemeStyles.hoverBackground },
              gap: 1.5,
            }}
          >
            <HomeIcon fontSize="small" sx={{ color: "#1976d2" }} /> Home
          </MenuItem>
          <MenuItem
            onClick={() => handleMenuLeftItemClick("/problems")}
            sx={{
              fontWeight: 600,
              fontSize: 16,
              borderRadius: 2,
              mb: 0.5,
              "&:hover": { bgcolor: darkThemeStyles.hoverBackground },
              gap: 1.5,
            }}
          >
            <AssignmentIcon fontSize="small" sx={{ color: "#1976d2" }} />{" "}
            Problems
          </MenuItem>
          <MenuItem
            onClick={() => handleMenuLeftItemClick("/competitions")}
            sx={{
              fontWeight: 600,
              fontSize: 16,
              borderRadius: 2,
              mb: 0.5,
              "&:hover": { bgcolor: darkThemeStyles.hoverBackground },
              gap: 1.5,
            }}
          >
            <EmojiEventsIcon fontSize="small" sx={{ color: "#1976d2" }} />{" "}
            Contests
          </MenuItem>
          <MenuItem
            onClick={() => handleMenuLeftItemClick("/compiler")}
            sx={{
              fontWeight: 600,
              fontSize: 16,
              borderRadius: 2,
              mb: 0.5,
              "&:hover": { bgcolor: darkThemeStyles.hoverBackground },
              gap: 1.5,
            }}
          >
            <CodeIcon fontSize="small" sx={{ color: "#1976d2" }} /> Playground
          </MenuItem>
          {isMobile && (
            <>
              {user && user.role === "admin" && (
                <MenuItem
                  onClick={() => handleMenuRightItemClick("/admin")}
                  sx={{
                    fontWeight: 600,
                    fontSize: 16,
                    borderRadius: 2,
                    mb: 0.5,
                    "&:hover": { bgcolor: darkThemeStyles.hoverBackground },
                    gap: 1.5,
                  }}
                >
                  <AdminPanelSettingsIcon
                    fontSize="small"
                    sx={{ color: "#1976d2" }}
                  />{" "}
                  Admin
                </MenuItem>
              )}
              <MenuItem
                onClick={() => handleMenuRightItemClick("/compiler")}
                sx={{
                  fontWeight: 600,
                  fontSize: 16,
                  borderRadius: 2,
                  mb: 0.5,
                  "&:hover": { bgcolor: darkThemeStyles.hoverBackground },
                  gap: 1.5,
                }}
              >
                <DashboardIcon fontSize="small" sx={{ color: "#1976d2" }} />{" "}
                Playground
              </MenuItem>
              <MenuItem
                onClick={() => handleMenuRightItemClick("/profile")}
                sx={{
                  fontWeight: 600,
                  fontSize: 16,
                  borderRadius: 2,
                  mb: 0.5,
                  "&:hover": { bgcolor: darkThemeStyles.hoverBackground },
                  gap: 1.5,
                }}
              >
                <PersonIcon fontSize="small" sx={{ color: "#1976d2" }} />{" "}
                Profile
              </MenuItem>
              <Divider sx={{ my: 1, bgcolor: darkThemeStyles.borderColor }} />
              <MenuItem
                onClick={() => {
                  handleLogout();
                  handleLeftMenuClose();
                }}
                sx={{
                  fontWeight: 600,
                  fontSize: 16,
                  borderRadius: 2,
                  color: "#d32f2f",
                  "&:hover": { bgcolor: "#ffebee" },
                  gap: 1.5,
                }}
              >
                <LogoutIcon fontSize="small" sx={{ color: "#d32f2f" }} /> Logout
              </MenuItem>
            </>
          )}
        </Menu>
        <Menu
          disableScrollLock
          id="left-menu-appbar"
          anchorel={anchorElRight}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElRight)}
          onClose={handleRightMenuClose}
          PaperProps={{
            sx: {
              bgcolor: darkThemeStyles.background,
              boxShadow: 3,
              borderRadius: 2,
              p: 1,
              minWidth: 180,
            },
          }}
        >
          {user && user.role === "admin" && (
            <MenuItem
              onClick={() => handleMenuRightItemClick("/admin")}
              sx={{
                fontWeight: 600,
                fontSize: 16,
                borderRadius: 2,
                mb: 0.5,
                "&:hover": { bgcolor: darkThemeStyles.hoverBackground },
                gap: 1.5,
              }}
            >
              <AdminPanelSettingsIcon
                fontSize="small"
                sx={{ color: "#1976d2" }}
              />{" "}
              Admin
            </MenuItem>
          )}
          <MenuItem
            onClick={() => handleMenuRightItemClick("/compiler")}
            sx={{
              fontWeight: 600,
              fontSize: 16,
              borderRadius: 2,
              mb: 0.5,
              "&:hover": { bgcolor: darkThemeStyles.hoverBackground },
              gap: 1.5,
            }}
          >
            <DashboardIcon fontSize="small" sx={{ color: "#1976d2" }} />{" "}
            Playground
          </MenuItem>
          <MenuItem
            onClick={() => handleMenuRightItemClick("/profile")}
            sx={{
              fontWeight: 600,
              fontSize: 16,
              borderRadius: 2,
              mb: 0.5,
              "&:hover": { bgcolor: darkThemeStyles.hoverBackground },
              gap: 1.5,
            }}
          >
            <PersonIcon fontSize="small" sx={{ color: "#1976d2" }} /> Profile
          </MenuItem>
          <Divider sx={{ my: 1, bgcolor: darkThemeStyles.borderColor }} />
          <MenuItem
            onClick={() => {
              handleLogout();
              handleRightMenuClose();
            }}
            sx={{
              fontWeight: 600,
              fontSize: 16,
              borderRadius: 2,
              color: "#d32f2f",
              "&:hover": { bgcolor: "#ffebee" },
              gap: 1.5,
            }}
          >
            <LogoutIcon fontSize="small" sx={{ color: "#d32f2f" }} /> Logout
          </MenuItem>
        </Menu>
      </Toolbar>
      {renderTheme}
      <Popover
        disableScrollLock
        id="notifications-popover"
        open={Boolean(notificationsAnchor)}
        anchorEl={notificationsAnchor}
        onClose={handleCloseNotifications}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 0,
            bgcolor: darkThemeStyles.background,
            minWidth: 320,
            maxWidth: 400,
            boxShadow: 3,
            borderRadius: 2,
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: `1px solid ${darkThemeStyles.borderColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            color={darkThemeStyles.color}
          >
            Notifications
          </Typography>
          {notifications.length > 0 && (
            <Button
              size="small"
              onClick={handleMarkAllRead}
              sx={{ color: "#1976d2", fontWeight: 600 }}
            >
              Mark all as read
            </Button>
          )}
        </Box>
        <List sx={{ maxHeight: 320, overflowY: "auto", p: 0 }}>
          {notifications.length === 0 ? (
            <ListItem sx={{ justifyContent: "center", py: 4 }}>
              <Typography color="#7b8ba3">No notifications</Typography>
            </ListItem>
          ) : (
            notifications.map((notification, index) => (
              <ListItem
                alignItems="flex-start"
                key={index}
                sx={{
                  px: 2,
                  py: 1.5,
                  borderBottom: `1px solid ${darkThemeStyles.borderColor}`,
                }}
              >
                <ListItemAvatar>
                  <MuiAvatar
                    sx={{
                      bgcolor: "#e3f2fd",
                      color: "#1976d2",
                      width: 32,
                      height: 32,
                    }}
                  >
                    <NotificationsFilled fontSize="small" />
                  </MuiAvatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography fontWeight={600} color={darkThemeStyles.color}>
                      {notification.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="#7b8ba3">
                        {notification.body}
                      </Typography>
                      {notification.timestamp && (
                        <Typography
                          variant="caption"
                          color="#b0b0b0"
                          sx={{ display: "block", mt: 0.5 }}
                        >
                          {new Date(notification.timestamp).toLocaleString()}
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
            ))
          )}
        </List>
      </Popover>

      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: darkThemeStyles.background,
            width: 260,
            p: 2,
            boxShadow: 3,
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <CardMedia
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              boxShadow: 1,
              mr: 1,
            }}
            component="img"
            src={logo}
            alt="CodeQuest Logo"
            onClick={() => {
              setMobileMenuOpen(false);
              navigate("/");
            }}
            style={{ cursor: "pointer" }}
          />
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{ letterSpacing: 1, color: "#1976d2", cursor: "pointer" }}
            onClick={() => {
              setMobileMenuOpen(false);
              navigate("/");
            }}
          >
            CodeQuest
          </Typography>
        </Box>
        <MenuItem
          onClick={() => {
            setMobileMenuOpen(false);
            handleMenuLeftItemClick("/");
          }}
          sx={{
            fontWeight: 600,
            fontSize: 16,
            borderRadius: 2,
            mb: 0.5,
            "&:hover": { bgcolor: darkThemeStyles.hoverBackground },
            gap: 1.5,
          }}
        >
          <HomeIcon fontSize="small" sx={{ color: "#1976d2" }} /> Home
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMobileMenuOpen(false);
            handleMenuLeftItemClick("/problems");
          }}
          sx={{
            fontWeight: 600,
            fontSize: 16,
            borderRadius: 2,
            mb: 0.5,
            "&:hover": { bgcolor: darkThemeStyles.hoverBackground },
            gap: 1.5,
          }}
        >
          <AssignmentIcon fontSize="small" sx={{ color: "#1976d2" }} /> Problems
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMobileMenuOpen(false);
            handleMenuLeftItemClick("/competitions");
          }}
          sx={{
            fontWeight: 600,
            fontSize: 16,
            borderRadius: 2,
            mb: 0.5,
            "&:hover": { bgcolor: darkThemeStyles.hoverBackground },
            gap: 1.5,
          }}
        >
          <EmojiEventsIcon fontSize="small" sx={{ color: "#1976d2" }} />{" "}
          Contests
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMobileMenuOpen(false);
            handleMenuLeftItemClick("/compiler");
          }}
          sx={{
            fontWeight: 600,
            fontSize: 16,
            borderRadius: 2,
            mb: 0.5,
            "&:hover": { bgcolor: darkThemeStyles.hoverBackground },
            gap: 1.5,
          }}
        >
          <CodeIcon fontSize="small" sx={{ color: "#1976d2" }} /> Playground
        </MenuItem>
        {user && user.role === "admin" && (
          <MenuItem
            onClick={() => {
              setMobileMenuOpen(false);
              handleMenuRightItemClick("/admin");
            }}
            sx={{
              fontWeight: 600,
              fontSize: 16,
              borderRadius: 2,
              mb: 0.5,
              "&:hover": { bgcolor: darkThemeStyles.hoverBackground },
              gap: 1.5,
            }}
          >
            <AdminPanelSettingsIcon
              fontSize="small"
              sx={{ color: "#1976d2" }}
            />{" "}
            Admin
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            setMobileMenuOpen(false);
            handleMenuRightItemClick("/compiler");
          }}
          sx={{
            fontWeight: 600,
            fontSize: 16,
            borderRadius: 2,
            mb: 0.5,
            "&:hover": { bgcolor: darkThemeStyles.hoverBackground },
            gap: 1.5,
          }}
        >
          <DashboardIcon fontSize="small" sx={{ color: "#1976d2" }} /> Dashboard
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMobileMenuOpen(false);
            handleMenuRightItemClick("/profile");
          }}
          sx={{
            fontWeight: 600,
            fontSize: 16,
            borderRadius: 2,
            mb: 0.5,
            "&:hover": { bgcolor: darkThemeStyles.hoverBackground },
            gap: 1.5,
          }}
        >
          <PersonIcon fontSize="small" sx={{ color: "#1976d2" }} /> Profile
        </MenuItem>
        <Divider sx={{ my: 1, bgcolor: darkThemeStyles.borderColor }} />
        <MenuItem
          onClick={() => {
            setMobileMenuOpen(false);
            handleLogout();
          }}
          sx={{
            fontWeight: 600,
            fontSize: 16,
            borderRadius: 2,
            color: "#d32f2f",
            "&:hover": { bgcolor: "#ffebee" },
            gap: 1.5,
          }}
        >
          <LogoutIcon fontSize="small" sx={{ color: "#d32f2f" }} /> Logout
        </MenuItem>
      </Drawer>
    </AppBar>
  );
}
