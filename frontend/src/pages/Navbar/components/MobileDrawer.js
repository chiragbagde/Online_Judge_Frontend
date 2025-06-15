import {
  Drawer,
  Box,
  CardMedia,
  Typography,
  MenuItem,
  Divider,
} from "@mui/material";
import logo from "../../../images/logo.png";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GroupsIcon from "@mui/icons-material/Groups";
import ArticleIcon from "@mui/icons-material/Article";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CodeIcon from "@mui/icons-material/Code";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

const MobileDrawer = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  handleMenuLeftItemClick,
  handleMenuRightItemClick,
  handleLogout,
  user,
  darkThemeStyles,
}) => {
  const navigate = useNavigate();

  return (
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
          handleMenuLeftItemClick("/community");
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
        <GroupsIcon fontSize="small" sx={{ color: "#1976d2" }} /> Community
      </MenuItem>
      <MenuItem
        onClick={() => {
          setMobileMenuOpen(false);
          handleMenuLeftItemClick("/blogs");
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
        <ArticleIcon fontSize="small" sx={{ color: "#1976d2" }} /> Blogs
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
        <EmojiEventsIcon fontSize="small" sx={{ color: "#1976d2" }} /> Contests
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
          <AdminPanelSettingsIcon fontSize="small" sx={{ color: "#1976d2" }} /> Admin
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
  );
};

export default MobileDrawer; 