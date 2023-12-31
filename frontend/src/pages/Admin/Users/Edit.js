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

import MenuItem from "@mui/material/MenuItem";
import CloseIcon from "@mui/icons-material/Close";

const Edit = ({
  selectedUser,
  openEditDialog,
  setOpenEditDialog,
  setUsers,
  users,
  updateUser,
}) => {
  const [updatedUserData, setUpdatedUserData] = useState({
    firstname: selectedUser.firstname,
    lastname: selectedUser.lastname,
    email: selectedUser.email,
    role: selectedUser.role,
    username: selectedUser.username,
    mobile: selectedUser.mobile,
    password: "",
  });

  const handleUpdateUser = async () => {
    try {
      await axios.post(
        urlConstants.updateUserProfile,
        {
          id: selectedUser._id,
          user: { ...selectedUser, ...updatedUserData },
        },
        getConfig()
      );
      const updatedUser = { ...selectedUser, ...updatedUserData };
      setUsers(
        users.map((user) => (user._id === updatedUser._id ? updatedUser : user))
      );
      setOpenEditDialog(false);
      toast.success("User updated successfully!");
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    selectedUser && (
      <div>
        <Dialog
          fullWidth
          maxWidth={false}
          fullScreen
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
        >
          <DialogTitle>Edit User</DialogTitle>
          <div onClick={() => setOpenEditDialog(false)} className="close-icon">
            <CloseIcon />
          </div>
          <DialogContent className="dialog-content">
            <DialogContentText>Enter user details</DialogContentText>
            <div className="flex-end">
              <TextField
                label="Firstname"
                variant="outlined"
                fullWidth
                margin="dense"
                name="firstname"
                value={updatedUserData.firstname}
                onChange={handleInputChange}
                className="mt-1"
                style={{ width: "45%" }}
              />
              <TextField
                label="Lastname"
                variant="outlined"
                fullWidth
                margin="dense"
                name="lastname"
                value={updatedUserData.lastname}
                onChange={handleInputChange}
                className="mt-1"
                style={{ width: "45%" }}
              />
            </div>
            <div className="flex-end">
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="dense"
                name="username"
                value={updatedUserData.username}
                onChange={handleInputChange}
                className="mt-1"
                style={{ width: "45%" }}
              />
              <TextField
                value={updatedUserData.mobile}
                label="Mobile"
                variant="outlined"
                fullWidth
                name="mobile"
                onChange={handleInputChange}
                margin="dense"
                className="mt-1"
                style={{ width: "45%" }}
              />
            </div>

            <TextField
              value={updatedUserData.role}
              label="Role"
              variant="outlined"
              fullWidth
              margin="dense"
              name="role"
              onChange={handleInputChange}
              className="mt-1"
              select
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>

            <TextField
              value={updatedUserData.email}
              label="Email"
              variant="outlined"
              fullWidth
              name="email"
              onChange={handleInputChange}
              margin="dense"
              className="mt-1"
            />

            <TextField
              value={updatedUserData.password}
              label="Password"
              variant="outlined"
              fullWidth
              margin="dense"
              name="password"
              onChange={handleInputChange}
              className="mt-1"
            />
          </DialogContent>
          <DialogActions className="action-buttons">
            <Button onClick={handleUpdateUser}>Update</Button>
            <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  );
};

export default Edit;
