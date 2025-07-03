import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  IconButton,
} from "@mui/material";
import { toast } from "react-toastify";
import { getConfig } from "../../../utils/getConfig";

import CloseIcon from "@mui/icons-material/Close";
import MenuItem from "@mui/material/MenuItem";
import { useCreateUserMutation } from "../../../apis/adminApi";

const Create = ({ openCreateDialog, setOpenCreateDialog, setUsersData }) => {
  const [newUser, setNewUser] = useState({
    firstname: "",
    lastname: "",
    role: "",
    username: "",
    email: "",
    mobile: null,
    password: "",
  });

  const [createUser, { isLoading }] = useCreateUserMutation();

  const handleCreateUser = async () => {
    try {
      await createUser(newUser).unwrap();
      setOpenCreateDialog(false);
      toast.success("User created successfully!");
    } catch (e) {
      toast.error("Failed to create user.");
      console.error(e);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={openCreateDialog}
      onClose={() => setOpenCreateDialog(false)}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pr: 2,
        }}
      >
        Create User
        <IconButton onClick={() => setOpenCreateDialog(false)}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className="dialog-content">
        <DialogContentText>Enter user details</DialogContentText>
        <div className="flex-end">
          <TextField
            label="Firstname"
            variant="outlined"
            fullWidth
            margin="dense"
            name="firstname"
            value={newUser.firstname}
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
            value={newUser.lastname}
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
            value={newUser.username}
            onChange={handleInputChange}
            className="mt-1"
            style={{ width: "45%" }}
          />
          <TextField
            value={newUser.mobile}
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
          value={newUser.role}
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
          value={newUser.email}
          label="Email"
          variant="outlined"
          fullWidth
          name="email"
          onChange={handleInputChange}
          margin="dense"
          className="mt-1"
        />

        <TextField
          value={newUser.password}
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
        <Button onClick={handleCreateUser}>Create</Button>
        <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Create;
