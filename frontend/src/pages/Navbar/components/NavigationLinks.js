import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NavigationLinks = ({ darkThemeStyles }) => {
  const navigate = useNavigate();

  return (
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
  );
};

export default NavigationLinks; 