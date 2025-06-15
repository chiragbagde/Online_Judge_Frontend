import React from "react";
import { Box, Chip, TextField, InputAdornment, Button, Menu, MenuItem, Typography, Paper, Checkbox } from "@mui/material";
import { Search, Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ProblemsTable = ({
  topicCounts,
  selectedTopic,
  setSelectedTopic,
  search,
  setSearch,
  selectedProblems,
  myLists,
  anchorEl,
  setAnchorEl,
  handleAddToList,
  filteredProblems,
  handleSelectAll,
  handleSelectProblem,
  paginationModel,
  setPaginationModel,
  borderColor,
  hoverColor,
  difficultyColors,
  problems,
}) => {
  const navigate = useNavigate();

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic === "All Topics" ? null : topic);
  };

  return <Box sx={{ width: "100%", maxWidth: 950, mx: "auto" }}>
    <Box
      sx={{
        display: "flex",
        gap: 1,
        mb: 2,
        overflowX: "auto",
        pb: 1,
        width: "100%",
      }}
    >
      <Chip
        label="All Topics"
        color={!selectedTopic ? "primary" : "default"}
        onClick={() => handleTopicClick("All Topics")}
        sx={{
          fontWeight: 700,
          fontSize: 15,
          px: 2,
          height: 36,
          bgcolor:
            !selectedTopic ? "border.secondary" : "border.primary",
          border: "none",
          boxShadow: "none",
        }}
      />
      {topicCounts.map((topic) => (
        <Chip
          key={topic._id}
          label={`${topic._id} (${topic.count})`}
          color={selectedTopic === topic._id ? "primary" : "default"}
          onClick={() => handleTopicClick(topic._id)}
          sx={{
            fontWeight: 700,
            fontSize: 15,
            px: 2,
            height: 36,
            border: "none",
            boxShadow: "none",
            bgcolor:
              selectedTopic === topic._id ? "border.secondary" : "border.primary",
          }}
        />
      ))}
    </Box>
    {/* Search */}
    <TextField
      fullWidth
      placeholder="Search questions"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      sx={{ mb: 2, borderRadius: 2, fontSize: 16 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
        style: { fontSize: 16, height: 44 },
      }}
      inputProps={{ style: { fontSize: 16, height: 44 } }}
    />
    {/* Add to List */}
    {selectedProblems.length > 0 && (
      <Box sx={{ mb: 2, display: "flex", gap: 2, alignItems: "center" }}>
        <Typography>{selectedProblems.length} problem(s) selected</Typography>
        <Button
          variant="contained"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          startIcon={<Add />}
          disabled={myLists.length === 0}
        >
          Add to List
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{ sx: { maxHeight: 300 } }}
        >
          {myLists.length === 0 ? (
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">
                No lists available. Create a list first.
              </Typography>
            </MenuItem>
          ) : (
            myLists.map((list) => (
              <MenuItem
                key={list._id}
                onClick={() => handleAddToList(list._id)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  py: 1,
                }}
              >
                <Typography variant="body1">{list.name}</Typography>
                {list.description && (
                  <Typography variant="caption" color="text.secondary">
                    {list.description}
                  </Typography>
                )}
              </MenuItem>
            ))
          )}
        </Menu>
      </Box>
    )}
    {/* Problems Table */}
    <Paper
      sx={{
        p: 0,
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "none",
        border: `1px solid ${borderColor}`,
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          bgcolor: "background.main",
          borderBottom: `1px solid ${borderColor}`,
          px: 2,
          py: 1,
          fontWeight: 700,
          fontSize: 16,
          alignItems: "center",
        }}
      >
        <Box sx={{ width: 40 }}>
          <Checkbox
            checked={selectedProblems.length === filteredProblems.length}
            indeterminate={
              selectedProblems.length > 0 &&
              selectedProblems.length < filteredProblems.length
            }
            onChange={handleSelectAll}
          />
        </Box>
        <Box sx={{ flex: 2 }}>Title</Box>
        <Box sx={{ width: 120, textAlign: "center" }}>Acceptance</Box>
        <Box sx={{ width: 100, textAlign: "center" }}>Difficulty</Box>
        <Box sx={{ width: 140, textAlign: "center" }}>Topic</Box>
      </Box>
      {filteredProblems.length === 0 && (
        <Typography sx={{ p: 3, textAlign: "center", fontSize: 16 }}>
          No problems found.
        </Typography>
      )}
      {filteredProblems
        .slice(
          paginationModel.page * paginationModel.pageSize,
          (paginationModel.page + 1) * paginationModel.pageSize
        )
        .map((problem, idx) => (
          <Box
            key={problem._id}
            sx={{
              display: "flex",
              alignItems: "center",
              px: 2,
              py: 1.5,
              borderBottom: `1px solid ${borderColor}`,
              bgcolor: "background.main",
              transition: "background 0.2s",
              cursor: "pointer",
              fontSize: 16,
              "&:hover": { bgcolor: hoverColor },
            }}
            component={"div"}
          >
            <Box sx={{ width: 40 }}>
              <Checkbox
                checked={selectedProblems.includes(problem._id)}
                onChange={() => handleSelectProblem(problem._id)}
                onClick={(e) => e.stopPropagation()}
              />
            </Box>
            <Box onClick={() => navigate(`/problems/statement/${problem._id}`)} sx={{ flex: 2, fontWeight: 500, fontSize: 16 }}>
              {problem.statement}
            </Box>
            <Box sx={{ width: 120, textAlign: "center", fontSize: 16 }}>
              {problem.acceptance ? `${problem.acceptance.toFixed(1)}%` : "-"}
            </Box>
            <Box sx={{ width: 100, textAlign: "center" }}>
              <Chip
                label={problem.difficulty}
                size="medium"
                sx={{
                  bgcolor: difficultyColors[problem.difficulty] || "#eee",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 15,
                  textTransform: "capitalize",
                  height: 32,
                  border: "none",
                  boxShadow: "none",
                }}
              />
            </Box>
            <Box sx={{ width: 140, textAlign: "center", fontSize: 16 }}>
              {problem.topic}
            </Box>
          </Box>
        ))}
    </Paper>
    {/* Pagination */}
    <Box
      sx={{ display: "flex", justifyContent: "center", mt: 2, fontSize: 16 }}
    >
      <Button
        disabled={paginationModel.page === 0}
        onClick={() =>
          setPaginationModel((prev) => ({ ...prev, page: prev.page - 1 }))
        }
        sx={{ fontSize: 15, px: 2, textTransform: "none", boxShadow: "none" }}
      >
        Previous
      </Button>
      <Typography sx={{ mx: 2, alignSelf: "center", fontSize: 16 }}>
        Page {paginationModel.page + 1} of{" "}
        {Math.ceil(filteredProblems.length / paginationModel.pageSize)}
      </Typography>
      <Button
        disabled={
          (paginationModel.page + 1) * paginationModel.pageSize >=
          filteredProblems.length
        }
        onClick={() =>
          setPaginationModel((prev) => ({ ...prev, page: prev.page + 1 }))
        }
        sx={{ fontSize: 15, px: 2, textTransform: "none", boxShadow: "none" }}
      >
        Next
      </Button>
    </Box>
  </Box>
};

export default ProblemsTable;
