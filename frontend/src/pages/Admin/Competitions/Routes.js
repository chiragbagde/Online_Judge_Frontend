import { useState } from "react";
import Table from "./Table";
import Create from "./Create";
import Edit from "./Edit";
import Delete from "./Delete";
import { Box } from "@mui/material";

const CompetitonHandle = ({ openCreateDialog, setOpenCreateDialog }) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  return (
    <Box sx={{ width: "100%", padding: "20px" }}>
      <Table
        selectedCompetition={selectedCompetition}
        setSelectedCompetition={setSelectedCompetition}
        setOpenEditDialog={setOpenEditDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
      />
      <Create
        openCreateDialog={openCreateDialog}
        setOpenCreateDialog={setOpenCreateDialog}
      />
      {openEditDialog && (
        <Edit
          openEditDialog={openEditDialog}
          selectedCompetition={selectedCompetition}
          setOpenEditDialog={setOpenEditDialog}
        />
      )}
      <Delete
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
        selectedCompetition={selectedCompetition}
        setSelectedCompetition={setSelectedCompetition}
      />
    </Box>
  );
};
export default CompetitonHandle;
