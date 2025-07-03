import {
  Sidebar as ReactSidebar,
  Menu,
  MenuItem,
  SubMenu,
} from "react-pro-sidebar";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import SettingsApplicationsRoundedIcon from "@mui/icons-material/SettingsApplicationsRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import PersonIcon from "@mui/icons-material/Person";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { Typography, useTheme } from "@mui/material";

const Sidebar = ({
  setOpenCreateDialog,
  sidebarCollapsed,
  setSidebarCollapsed,
  setCurrentState,
  setOpenProblemCreateDialog,
}) => {
  const collapseSidebar = () => {
    setSidebarCollapsed(true);
  };
  const dispatch = useDispatch();
  const theme = useTheme();

  return (
    <ReactSidebar
      collapsed={sidebarCollapsed}
      collapseSidebar={collapseSidebar}
      rootStyles={{
        width: "20%",
        color: theme.palette.mode === "dark" ? "white" : theme.palette.text.primary,

        "& .ps-sidebar-root": {
          backgroundColor: theme.palette.mode === "dark" ? "#1a1a1a" : "#f5f5f5",
          borderRight: `1px solid ${theme.palette.mode === "dark" ? "#333" : "#e0e0e0"}`,
        },
        "& .css-dip3t8": {
          backgroundColor: theme.palette.mode === "dark" ? "#1a1a1a" : "#f5f5f5",
        },
        "& .ps-menuitem-root:hover, & .ps-menuitem-root.ps-active, & .ps-submenu-root .ps-menuitem-root:hover, & .ps-submenu-root .ps-menuitem-root.ps-active": {
          backgroundColor:
            theme.palette.mode === "dark" ? "#23272b" : "#e0e0e0",
          color: theme.palette.primary.main,
          transition: "background 0.2s, color 0.2s",
        },
        "& .ps-sidebar-root.ps-open, & .css-1tqrhto": {
          backgroundColor: theme.palette.mode === "dark" ? "#1a1a1a" : "#f5f5f5",
        },
        "& .ps-menu-button": {
          color: theme.palette.mode === "dark" ? "white" : theme.palette.text.primary,
        },
        "& .ps-submenu-content": {
          backgroundColor: theme.palette.mode === "dark" ? "#1a1a1a" : "#f5f5f5",
        },
      }}
    >
      <Menu>
        <MenuItem
          onClick={() => setSidebarCollapsed((prev) => !prev)}
          className="menu1"
          icon={<MenuRoundedIcon />}
        >
          <Typography variant="h6">Admin</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => setCurrentState("Problems")}
          icon={<GridViewRoundedIcon />}
        >
          {" "}
          <Typography>Dashboard</Typography>
        </MenuItem>
        <SubMenu label={<Typography>Users </Typography>} icon={<PersonIcon />}>
          <MenuItem
            onClick={() => setCurrentState("Users")}
            icon={<AccountCircleRoundedIcon />}
          >
            <Typography> User Table </Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setCurrentState("Users");
              setOpenCreateDialog(true);
            }}
            icon={<ShieldRoundedIcon />}
          >
            <Typography> Create User </Typography>
          </MenuItem>
        </SubMenu>
        <SubMenu
          label={<Typography>Problems </Typography>}
          icon={<SettingsApplicationsRoundedIcon />}
        >
          <MenuItem
            onClick={() => setCurrentState("Problems")}
            icon={<AccountCircleRoundedIcon />}
          >
            <Typography>Problem Table </Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setCurrentState("Problems");
              setOpenProblemCreateDialog(true);
            }}
            icon={<ShieldRoundedIcon />}
          >
            <Typography>Create Problem </Typography>
          </MenuItem>
        </SubMenu>
        <SubMenu
          label={<Typography>Competitions</Typography>}
          icon={<PersonIcon />}
        >
          <MenuItem
            onClick={() => setCurrentState("Competitions")}
            icon={<AccountCircleRoundedIcon />}
          >
            <Typography> Competition Table </Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setCurrentState("Competitions");
              setOpenCreateDialog(true);
            }}
            icon={<ShieldRoundedIcon />}
          >
            <Typography> Create Competition </Typography>
          </MenuItem>
        </SubMenu>
        <MenuItem
          onClick={() => {
            localStorage.removeItem("user");
            dispatch(logout());
          }}
          icon={<LogoutRoundedIcon />}
        >
          <Typography>Logout</Typography>
        </MenuItem>
      </Menu>
    </ReactSidebar>
  );
};
export default Sidebar;
