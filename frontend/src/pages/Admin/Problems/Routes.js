import React, { useState } from "react";
import Table from "./Table";
import Create from "./Create";
import Edit from "./Edit";
import Delete from "./Delete";
import { Box } from "@mui/material";

const ProblemRoutes = ({
  openCreateProblemDialog,
  setOpenProblemCreateDialog,
}) => {
  const [selectedProblem, setSelectedProblem] = useState({});
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  return (
    <Box sx={{ width: "100%", padding: "20px" }}>
      <Table
        selectedProblem={selectedProblem}
        setSelectedProblem={setSelectedProblem}
        setOpenEditDialog={setOpenEditDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
      />
      {openEditDialog && (
        <Edit
          openEditDialog={openEditDialog}
          selectedProblem={selectedProblem}
          setOpenEditDialog={setOpenEditDialog}
        />
      )}
      <Create
        openCreateDialog={openCreateProblemDialog}
        setOpenCreateDialog={setOpenProblemCreateDialog}
      />
      <Delete
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
        selectedProblem={selectedProblem}
        setSelectedProblem={setSelectedProblem}
      />
    </Box>
  );
};

export default ProblemRoutes;
