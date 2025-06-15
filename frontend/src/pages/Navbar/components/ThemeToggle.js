import { IconButton, Popover, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

const ThemeToggle = ({ anchorSettingsEl, handleSettingsClose, handleThemeChange, themePref }) => {
  const settingsId = "primary-theme-menu";
  const isSettingsOpen = Boolean(anchorSettingsEl);

  return (
    <>
      <IconButton
        onClick={(e) => handleSettingsClose(e)}
        sx={{ color: "#1976d2" }}
      >
        <DarkModeOutlinedIcon />
      </IconButton>
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
    </>
  );
};

export default ThemeToggle; 