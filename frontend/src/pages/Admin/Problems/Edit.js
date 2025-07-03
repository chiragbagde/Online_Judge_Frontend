import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  MenuItem,
  IconButton,
  Grid,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { toast } from "react-toastify";
import { urlConstants } from "../../../apis";
import { getConfig } from "../../../utils/getConfig";
import { useUpdateProblemMutation } from "../../../apis/adminApi";

const Edit = ({
  selectedProblem,
  setOpenEditDialog,
  openEditDialog,
}) => {
  const [updatedProblemData, setUpdatedProblemData] = useState({
    statement: selectedProblem.statement,
    difficulty: selectedProblem.difficulty,
    topic: selectedProblem.topic,
    competition_problem: selectedProblem.competition_problem,
    solution: selectedProblem.solution,
    description: selectedProblem.description,
    constraints: selectedProblem.constraints,
    examples: selectedProblem.examples,
  });

  const [updateProblem, { isLoading }] = useUpdateProblemMutation();

  const handleUpdateProblem = async () => {
    try {
      await updateProblem({ id: selectedProblem._id, ...updatedProblemData }).unwrap();
      toast.success("Problem updated successfully!");
      setOpenEditDialog(false);
    } catch (e) {
      console.error(e);
      toast.error("Failed to update problem.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProblemData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (name, value) => {
    setUpdatedProblemData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddExample = () => {
    setUpdatedProblemData((prev) => ({
      ...prev,
      examples: [...prev.examples, { input: "", output: "", explanation: "" }],
    }));
  };

  const handleDeleteExample = (index) => {
    const examples = [...updatedProblemData.examples];
    examples.splice(index, 1);
    setUpdatedProblemData((prev) => ({ ...prev, examples }));
  };

  const handleExampleChange = (index, field, value) => {
    const examples = [...updatedProblemData.examples];
    examples[index][field] = value;
    setUpdatedProblemData((prev) => ({ ...prev, examples }));
  };

  return (
    selectedProblem && (
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pr: 2,
          }}
        >
          Edit Problem
          <IconButton onClick={() => setOpenEditDialog(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Update the problem details below.
          </DialogContentText>

          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Statement"
              name="statement"
              value={updatedProblemData.statement}
              onChange={handleInputChange}
              fullWidth
              multiline
              minRows={2}
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Difficulty"
                  name="difficulty"
                  value={updatedProblemData.difficulty}
                  onChange={handleInputChange}
                  select
                  fullWidth
                >
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Topic"
                  name="topic"
                  value={updatedProblemData.topic}
                  onChange={handleInputChange}
                  select
                  fullWidth
                >
                  <MenuItem value="strings">Strings</MenuItem>
                  <MenuItem value="arrays">Arrays</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <TextField
              label="Competition Problem"
              name="competition_problem"
              value={updatedProblemData.competition_problem}
              onChange={handleInputChange}
              select
              fullWidth
            >
              <MenuItem value={true}>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </TextField>

            <TextField
              label="Description"
              name="description"
              value={updatedProblemData.description?.join("\n")}
              onChange={(e) =>
                handleArrayInputChange(
                  "description",
                  e.target.value.split("\n")
                )
              }
              fullWidth
              multiline
              minRows={3}
            />

            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Constraints
              </Typography>

              {updatedProblemData.constraints?.map((item, index) => (
                <Box
                  key={index}
                  display="flex"
                  gap={1}
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <TextField
                    value={item}
                    onChange={(e) => {
                      const updated = [...updatedProblemData.constraints];
                      updated[index] = e.target.value;
                      setUpdatedProblemData((prev) => ({
                        ...prev,
                        constraints: updated,
                      }));
                    }}
                    label={`Constraint ${index + 1}`}
                    fullWidth
                    size="small"
                  />
                  <IconButton
                    onClick={() => {
                      const updated = [...updatedProblemData.constraints];
                      updated.splice(index, 1);
                      setUpdatedProblemData((prev) => ({
                        ...prev,
                        constraints: updated,
                      }));
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}

              <Button
                variant="outlined"
                size="small"
                onClick={() =>
                  setUpdatedProblemData((prev) => ({
                    ...prev,
                    constraints: [...(prev.constraints || []), ""],
                  }))
                }
              >
                Add Constraint
              </Button>
            </Box>

            {updatedProblemData.examples?.length > 0 && (
              <>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Examples
                </Typography>

                {updatedProblemData.examples.map((example, index) => (
                  <Box
                    key={index}
                    display="flex"
                    gap={2}
                    alignItems="flex-start"
                  >
                    <Box flexGrow={1}>
                      <TextField
                        label="Input"
                        value={example.input}
                        onChange={(e) =>
                          handleExampleChange(index, "input", e.target.value)
                        }
                        fullWidth
                        margin="dense"
                      />
                      <TextField
                        label="Output"
                        value={example.output}
                        onChange={(e) =>
                          handleExampleChange(index, "output", e.target.value)
                        }
                        fullWidth
                        margin="dense"
                      />
                      <TextField
                        label="Explanation"
                        value={example.explanation}
                        onChange={(e) =>
                          handleExampleChange(
                            index,
                            "explanation",
                            e.target.value
                          )
                        }
                        fullWidth
                        margin="dense"
                      />
                    </Box>
                    <IconButton
                      onClick={() => handleDeleteExample(index)}
                      sx={{ mt: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </>
            )}

            <Button
              variant="outlined"
              onClick={handleAddExample}
              sx={{ mt: 2 }}
            >
              Add Example
            </Button>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleUpdateProblem}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
          <Button onClick={() => setOpenEditDialog(false)} variant="outlined">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    )
  );
};

export default Edit;
