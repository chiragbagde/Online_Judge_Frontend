import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { toast } from "react-toastify";
import { useDeleteProblemMutation } from "../../../apis/adminApi";

const Delete = ({
  selectedProblem,
  setSelectedProblem,
  openDeleteDialog,
  setOpenDeleteDialog,
}) => {
  const [deleteProblem, { isLoading }] = useDeleteProblemMutation();

  const handleDeleteProblem = async () => {
    try {
      await deleteProblem(selectedProblem._id).unwrap();
      setSelectedProblem(null);
      setOpenDeleteDialog(false);
      toast.success("Problem deleted successfully!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete problem.");
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
