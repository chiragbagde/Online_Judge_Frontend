import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Box,
} from "@mui/material";
import axios from "axios";
import { urlConstants } from "../../../apis";
import { toast } from "react-toastify";
import { getConfig } from "../../../utils/getConfig";
import CloseIcon from "@mui/icons-material/Close";

import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

const Create = ({ openCreateDialog, setOpenCreateDialog, setProblemsData }) => {
  const [newProblem, setNewProblem] = useState({
    statement: "",
    difficulty: "",
    topic: "",
    competition_problem: "",
    solution: "",
    description: [""],
    constraints: [""],
    examples: [],
    testCases: []
  });
  const handleCreateProblem = async () => {
    try {
      let { data } = await axios.post(
        urlConstants.createProblem,
        {
          ...newProblem,
        },
        getConfig()
      );
      const problem = data.newprob;
      setProblemsData((prev) => [...prev, problem]);
      setOpenCreateDialog(false);
      toast.success("Problem created successfully!");
      setNewProblem({});
    } catch (e) {
      console.error(e.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProblem((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleExampleChange = (index, field, value) => {
    const updatedExamples = [...newProblem.examples];
    updatedExamples[index][field] = value;

    setNewProblem((prevProblem) => ({
      ...prevProblem,
      examples: updatedExamples,
    }));
  };

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...newProblem.testCases];
    updatedTestCases[index][field] = value;

    setNewProblem((prevProblem) => ({
      ...prevProblem,
      testCases: updatedTestCases,
    }));
  };

  const handleAddExample = () => {
    setNewProblem((prevProblem) => ({
      ...prevProblem,
      examples: [
        ...prevProblem.examples,
        { input: "", output: "", explanation: "" },
      ],
    }));
  };

  const handleAddTestCase = () => {
    setNewProblem((prevProblem) => ({
      ...prevProblem,
      testCases: [
        ...prevProblem.testCases,
        { input: "", output: "" },
      ],
    }));
  };

  const handleDeleteExample = (index) => {
    const updatedExamples = [...newProblem.examples];
    updatedExamples.splice(index, 1);

    setNewProblem((prevProblem) => ({
      ...prevProblem,
      examples: updatedExamples,
    }));
  };

  const handleDeleteTestCase = (index) => {
    const updatedTestCases = [...newProblem.examples];
    updatedTestCases.splice(index, 1);

    setNewProblem((prevProblem) => ({
      ...prevProblem,
      testCases: updatedTestCases,
    }));
  };

  const handleArrayInputChange = (name, value) => {
    setNewProblem((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Dialog
      open={openCreateDialog}
      onClose={() => setOpenCreateDialog(false)}
      fullWidth
      maxWidth="md"
      sx={{ overflowY: "hidden" }}
    >
      <DialogTitle sx={{ mt: 2, ml: 2 }}>Create Problem</DialogTitle>
      <Box
        onClick={() => setOpenCreateDialog(false)}
        sx={{
          position: "absolute",
          cursor: "pointer",
          top: "2rem",
          right: "2rem",
        }}
      >
        <CloseIcon />
      </Box>
      <DialogContent
        sx={{
          width: "95%",
          margin: "0 auto",
        }}
      >
        <DialogContentText mb={2}>Enter problem details</DialogContentText>
        <TextField
          label="Statement"
          variant="outlined"
          fullWidth
          margin="dense"
          name="statement"
          value={newProblem.statement}
          onChange={handleInputChange}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <TextField
            label="Difficulty"
            variant="outlined"
            margin="dense"
            name="difficulty"
            select
            sx={{ width: "45%", mt: 2 }}
            value={newProblem.difficulty}
            onChange={handleInputChange}
          >
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
          </TextField>
          <TextField
            value={newProblem.topic}
            label="Topic"
            className="mt-1"
            variant="outlined"
            fullWidth
            name="topic"
            select
            sx={{ width: "45%", mt: 2 }}
            margin="dense"
            onChange={handleInputChange}
          >
            <MenuItem value="strings">Strings</MenuItem>
            <MenuItem value="arrays">Arrays</MenuItem>
          </TextField>
        </Box>

        <TextField
          value={newProblem.competition_problem}
          label="Competition Problem"
          variant="outlined"
          sx={{ mt: 2 }}
          fullWidth
          margin="dense"
          name="competition_problem"
          select
          onChange={handleInputChange}
        >
          <MenuItem value={true}>Yes</MenuItem>
          <MenuItem value={false}>No</MenuItem>
        </TextField>

        <TextField
          value={newProblem.description?.join("\n")}
          label="Description"
          variant="outlined"
          sx={{ mt: 2 }}
          fullWidth
          multiline
          rows={3}
          margin="dense"
          name="description"
          onChange={(e) =>
            handleArrayInputChange("description", e.target.value.split("\n"))
          }
        />
        <TextField
          value={newProblem.constraints?.join("\n")}
          label="Constraints"
          variant="outlined"
          sx={{ mt: 2 }}
          fullWidth
          multiline
          rows={3}
          margin="dense"
          name="constraints"
          onChange={(e) =>
            handleArrayInputChange("constraints", e.target.value.split("\n"))
          }
        />
        {newProblem?.examples && newProblem.examples?.length && (
          <Box
            sx={{
              height: "12rem",
              overflowY: "scroll",
              mt: 2,
            }}
          >
            {newProblem.examples.map((example, index) => (
              <Box key={index}>
                <TextField
                  label="Input Example"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  name={`inputExample-${index}`}
                  value={example.input}
                  onChange={(e) =>
                    handleExampleChange(index, "input", e.target.value)
                  }
                />

                <TextField
                  label="Output Example"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  name={`outputExample-${index}`}
                  value={example.output}
                  onChange={(e) =>
                    handleExampleChange(index, "output", e.target.value)
                  }
                />

                <TextField
                  label="Explanation"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  name={`explanation-${index}`}
                  value={example.explanation}
                  onChange={(e) =>
                    handleExampleChange(index, "explanation", e.target.value)
                  }
                />

                <IconButton onClick={() => handleDeleteExample(index)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}
        <Button sx={{ display: "block", mt: 2 }} onClick={handleAddExample}>
          Add Example
        </Button>

        {newProblem.testCases?.length && (
          <Box className="examples mt-2">
            {newProblem.testCases.map((testcase, index) => (
              <Box key={index}>
                <TextField
                  label="Input"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  name={`inputExample-${index}`}
                  value={testcase.input}
                  onChange={(e) =>
                    handleTestCaseChange(index, "input", e.target.value)
                  }
                />

                <TextField
                  label="Output"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  name={`outputExample-${index}`}
                  value={testcase.output}
                  onChange={(e) =>
                    handleTestCaseChange(index, "output", e.target.value)
                  }
                />
                <IconButton onClick={() => handleDeleteTestCase(index)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}
        <Button sx={{ mt: 2 }} onClick={handleAddTestCase}>
          Add TestCases
        </Button>
      </DialogContent>
      <DialogActions
        sx={{
          mb: 2,
          mr: 2,
          display: "flex",
          gap: "1rem",
        }}
      >
        <Button onClick={handleCreateProblem}>Create</Button>
        <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Create;
