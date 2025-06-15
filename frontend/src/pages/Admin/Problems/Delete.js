import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
} from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import { urlConstants } from "../../../apis";
import { getConfig } from "../../../utils/getConfig";

const Delete = ({
  selectedProblem,
  setSelectedProblem,
  openDeleteDialog,
  setOpenDeleteDialog,
  problems,
  setProblems,
}) => {
  const handleDeleteProblem = async () => {
    try {
      await axios.delete(
        `${urlConstants.problem}/${selectedProblem._id}`,
        getConfig()
      );
      setProblems(
        problems.filter((problem) => problem._id !== selectedProblem._id)
      );
      setSelectedProblem(null);
      setOpenDeleteDialog(false);
      toast.success("Problem deleted successfully!");
    } catch (e) {
      console.error(e.message);
      toast.error("Error in deleting the problem.");
    }
  };

  return (
    <div>
      {selectedProblem && (
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
        >
          <DialogTitle>Delete Problem</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this problem?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={handleDeleteProblem}>
              Delete
            </Button>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default Delete;
