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
import { useDeleteUserMutation } from "../../../apis/adminApi";

const Delete = ({
  selectedUser,
  setSelectedUser,
  openDeleteDialog,
  setOpenDeleteDialog,
  users,
  setUsers,
}) => {
  const [deleteUser, { isLoading }] = useDeleteUserMutation();

  const handleDeleteUser = async () => {
    try {
      await deleteUser(selectedUser?.id).unwrap();
      setUsers(users.filter((user) => user?.id !== selectedUser?.id));
      setSelectedUser(null);
      setOpenDeleteDialog(false);
      toast.success("User deleted successfully!");
    } catch (e) {
      toast.error("Failed to delete user.");
      console.error(e);
    }
  };

  return (
    <div>
      {selectedUser && (
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
        >
          <DialogTitle>Delete User</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this user?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={handleDeleteUser}>
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
