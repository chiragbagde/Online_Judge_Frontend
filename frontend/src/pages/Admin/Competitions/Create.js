import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Chip,
  MenuItem,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { adminRoutes, urlConstants } from "../../../apis";
import { toast } from "react-toastify";
import { getConfig } from "../../../utils/getConfig";
import { useSelector } from "react-redux";
import CustomDatepicker from "./Datepicker";
import { 
  useCreateCompetitionMutation, 
  useGetProblemIdsQuery,
  useGetAdminUsersQuery 
} from "../../../apis/adminApi";

const Create = ({
  openCreateDialog,
  setOpenCreateDialog,
  setCompetitionsData,
}) => {
  const [newCompetition, setNewCompetition] = useState({
    title: "",
    start_date: null,
    end_date: null,
    problems: [],
    users: [],
  });
  const { user } = useSelector((state) => state.auth);

  const { data: problemsData } = useGetProblemIdsQuery(user?.id, { skip: !user?.id });
  const { data: usersData } = useGetAdminUsersQuery(user?.id, { skip: !user?.id });
  const problems = problemsData?.problems || [];
  const users = usersData?.users || [];

  const [createCompetition, { isLoading }] = useCreateCompetitionMutation();

  const handleAddUser = (userId) => {
    const selectedUser = users.find((u) => u._id === userId);
    if (
      selectedUser &&
      !newCompetition.users.some((u) => u._id === selectedUser?.id)
    ) {
      setNewCompetition((prevData) => ({
        ...prevData,
        users: [...prevData.users, selectedUser],
      }));
    }
  };

  const handleAddProblem = (problemId) => {
    const selectedProblem = problems.find((p) => p._id === problemId);
    if (
      selectedProblem &&
      !newCompetition.problems.some((p) => p._id === selectedProblem._id)
    ) {
      setNewCompetition((prevData) => ({
        ...prevData,
        problems: [...prevData.problems, selectedProblem],
      }));
    }
  };

  const handleRemoveItem = (index, type) => {
    setNewCompetition((prevData) => ({
      ...prevData,
      [type]: prevData[type].filter((_, i) => i !== index),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCompetition((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (name, value) => {
    setNewCompetition((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateCompetition = async () => {
    try {
      await createCompetition({
        ...newCompetition,
        start_date: new Date(newCompetition.start_date),
        end_date: new Date(newCompetition.end_date),
      }).unwrap();
      
      setOpenCreateDialog(false);
      toast.success("Competition created successfully!");
      setNewCompetition({
        title: "",
        start_date: null,
        end_date: null,
        problems: [],
        users: [],
      });
    } catch (e) {
      toast.error("Failed to create competition.");
      console.error(e);
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={openCreateDialog}
      onClose={() => setOpenCreateDialog(false)}
    >
      <DialogTitle sx={{ mt: 2, ml: 2 }}>Create Competition</DialogTitle>
      <DialogContent
        sx={{
          p: "2rem",
          width: "80%",
          margin: "0 auto",
        }}
      >
        <DialogContentText sx={{ mb: 2 }}>
          Enter competition details
        </DialogContentText>
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
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          margin="dense"
          name="title"
          value={newCompetition.title}
          onChange={handleInputChange}
          sx={{ my: 2 }}
        />
        <CustomDatepicker
          start_date={newCompetition.start_date}
          end_date={newCompetition.end_date}
          handleChange={handleDateChange}
        />
        <TextField
          label="Applicants"
          variant="outlined"
          fullWidth
          margin="dense"
          name="users"
          select
          sx={{ mt: 2 }}
          value=""
          onChange={(e) => handleAddUser(e.target.value)}
        >
          {users.map((user, index) => (
            <MenuItem key={index} value={user?.id}>
              {`${user.firstname} ${user.lastname}`}
            </MenuItem>
          ))}
        </TextField>
        <Box sx={{ my: 1 }}>
          {newCompetition.users.map((user, index) => (
            <Chip
              key={index}
              label={`${user.firstname} ${user.lastname}`}
              onDelete={() => handleRemoveItem(index, "users")}
              sx={{ mr: 2, mt: 1 }}
            />
          ))}
        </Box>
        <TextField
          label="Problem Ids"
          variant="outlined"
          fullWidth
          margin="dense"
          name="problems"
          select
          sx={{ mt: 1 }}
          value=""
          onChange={(e) => handleAddProblem(e.target.value)}
        >
          {problems.map((problem, index) => (
            <MenuItem key={index} value={problem._id}>
              {problem.statement}
            </MenuItem>
          ))}
        </TextField>
        <Box sx={{ mt: 2 }}>
          {newCompetition.problems.map((problem, index) => (
            <Chip
              key={index}
              label={problem.statement}
              onDelete={() => handleRemoveItem(index, "problems")}
              sx={{ mr: 2, mt: 1 }}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          mb: 2,
          mr: 2,
          display: "flex",
          gap: "1rem",
        }}
      >
        <Button onClick={handleCreateCompetition}>Create</Button>
        <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Create;
