import React, { useState, useEffect } from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { Pagination } from "@mui/material";
import axios from "axios";
import { getConfig } from "../../../utils/getConfig";
import Loading from "../../Loader/Loader";
import { COMPETITIONS_PER_PAGE } from "../../../utils/constants";
import { urlConstants } from "../../../apis";
import getFormattedDateTime from "../../../utils/time";
import { useGetCompetitionsQuery } from "../../../apis/adminApi";
import { toast } from "react-toastify";

const CompetitionTable = ({
  setSelectedCompetition,
  setOpenEditDialog,
  setOpenDeleteDialog,
}) => {
  const {
    data: competitionsResponse,
    isLoading: loading,
    error,
  } = useGetCompetitionsQuery();
  const competitionsData = competitionsResponse?.competitions || [];
  
  const [pageNumber, setPageNumber] = useState(1);
  const count = Math.ceil(competitionsData.length / COMPETITIONS_PER_PAGE);

  const handleChangePage = (event, newPage) => {
    setPageNumber(newPage);
  };

  useEffect(() => {
    if (error) {
      toast.error("Failed to fetch competitions.");
    }
  }, [error]);

  useEffect(() => {
    if (competitionsData.length) {
      const filteredCompetitions = competitionsData.slice(
        (pageNumber - 1) * COMPETITIONS_PER_PAGE,
        pageNumber * COMPETITIONS_PER_PAGE
      );
    }
  }, [pageNumber, competitionsData]);

  const handleEdit = (competition) => {
    setSelectedCompetition(competition);
    setOpenEditDialog(true);
  };

  return (
    <>
      <TableContainer
        className="table"
        sx={{ width: "80%", margin: "2rem auto" }}
        component={Paper}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="center">Title</TableCell>
              <TableCell className="center">Start Date</TableCell>
              <TableCell className="center">End Date</TableCell>
              <TableCell className="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {competitionsData.map((competition) => (
              <TableRow key={competition?._id}>
                <TableCell>{competition.title}</TableCell>
                <TableCell>
                  {getFormattedDateTime(competition.start_date)}
                </TableCell>
                <TableCell>
                  {getFormattedDateTime(competition.end_date)}
                </TableCell>
                <TableCell sx={{ display: "flex", gap: 2 }}>
                  <Button
                    onClick={() => handleEdit(competition)}
                  >
                    <Edit />
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedCompetition(competition);
                      setOpenDeleteDialog(true);
                    }}
                  >
                    <Delete />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={count}
        page={pageNumber}
        onChange={handleChangePage}
        sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      />
    </>
  );
};

export default CompetitionTable;
