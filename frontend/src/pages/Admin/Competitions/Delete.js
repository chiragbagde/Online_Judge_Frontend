import React from "react";
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
import { useDeleteCompetitionMutation } from "../../../apis/adminApi";

const Delete = ({
  selectedCompetition,
  setSelectedCompetition,
  openDeleteDialog,
  setOpenDeleteDialog,
  competitions,
  setCompetitions,
}) => {
  const [deleteCompetition, { isLoading }] = useDeleteCompetitionMutation();

  const handleDeleteCompetition = async () => {
    try {
      await deleteCompetition(selectedCompetition._id).unwrap();
      setCompetitions(
        competitions.filter(
          (compeitition) => compeitition._id !== selectedCompetition._id
        )
      );
      setSelectedCompetition(null);
      setOpenDeleteDialog(false);
      toast.success("Competition deleted successfully!");
    } catch (e) {
      console.error(e);
      toast.error("Error in deleting the competition.");
    }
  };

  return (
    <div>
      {selectedCompetition && (
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
        >
          <DialogTitle>Delete Competition</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this compeitition?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={handleDeleteCompetition}>
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
