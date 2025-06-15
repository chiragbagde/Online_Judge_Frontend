import {
  Menu,
  MenuItem,
  Divider,
  useTheme,
} from "@mui/material";
import ProfileAvatar from "../../../components/Profile/components/ProfileAvatar";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

const UserMenu = ({
  anchorElRight,
  handleMenuRightItemClick,
  handleRightMenuClick,
  handleRightMenuClose,
  handleLogout,
  user,
  darkThemeStyles,
  avatar,
}) => {
  return (
    <>
      <ProfileAvatar
        onClick={(e) => handleRightMenuClick(e)}
        src={avatar}
        alt="avatar"
        userId={user?.id}
        sx={{
          width: 36,
          height: 36,
          boxShadow: useTheme().shadows[2],
          background: useTheme().palette.background.paper,
          cursor: "pointer"
        }}
      />
      <Menu
        disableScrollLock
        id="left-menu-appbar"
        anchorEl={anchorElRight}
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
            <AdminPanelSettingsIcon fontSize="small" sx={{ color: "#1976d2" }} /> Admin
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
          <DashboardIcon fontSize="small" sx={{ color: "#1976d2" }} /> Playground
        </MenuItem>
        <MenuItem
          onClick={() => handleMenuRightItemClick("/community")}
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
    </>
  );
};

export default UserMenu; 