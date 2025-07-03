import { useState } from "react";
import UserTable from "./Table";
import CreateUser from "./Create";
import Edit from "./Edit";
import Delete from "./Delete";
import { Box } from "@mui/material";

const UserLogic = ({ openCreateDialog, setOpenCreateDialog }) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  return (
    <Box sx={{ width: "100%", padding: "20px" }}>
      <UserTable
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        setOpenEditDialog={setOpenEditDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
      />
      <CreateUser
        openCreateDialog={openCreateDialog}
        setOpenCreateDialog={setOpenCreateDialog}
      />
      {openEditDialog && (
        <Edit
          openEditDialog={openEditDialog}
          selectedUser={selectedUser}
          setOpenEditDialog={setOpenEditDialog}
        />
      )}
      <Delete
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />
    </Box>
  );
};
export default UserLogic;
