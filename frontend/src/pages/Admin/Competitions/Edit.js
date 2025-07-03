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
import { getConfig } from "../../../utils/getConfig";
import { urlConstants } from "../../../apis";
import axios from "axios";
import { useUpdateCompetitionMutation } from "../../../apis/adminApi";

const Edit = ({
  selectedCompetition,
  openEditDialog,
  setOpenEditDialog,
  setCompetitions,
  competitions,
}) => {
  const [updatedCompetitionData, setUpdatedCompetitionData] = useState({
    title: selectedCompetition.title,
    start_date: selectedCompetition.start_date,
    end_date: selectedCompetition.end_date,
  });

  const [updateCompetition, { isLoading }] = useUpdateCompetitionMutation();

  const handleUpdateCompetition = async () => {
    try {
      await updateCompetition({ 
        id: selectedCompetition._id, 
        ...updatedCompetitionData 
      }).unwrap();
      
      setOpenEditDialog(false);
      toast.success("Competition updated successfully!");
    } catch (e) {
      toast.error("Failed to update competition.");
      console.error(e);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCompetitionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    selectedCompetition && (
      <div>
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <DialogTitle>Edit Competition</DialogTitle>
          <DialogContent>
            <DialogContentText>Edit compeitition details</DialogContentText>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              margin="dense"
              name="title"
              value={updatedCompetitionData.title}
              onChange={handleInputChange}
            />
            <TextField
              label="Start Date"
              variant="outlined"
              fullWidth
              margin="dense"
              name="start_date"
              value={updatedCompetitionData.start_date}
              onChange={handleInputChange}
            />
            <TextField
              label="End Date"
              variant="outlined"
              fullWidth
              margin="dense"
              name="end_date"
              value={updatedCompetitionData.end_date}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUpdateCompetition}>Update</Button>
            <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  );
};

export default Edit;
