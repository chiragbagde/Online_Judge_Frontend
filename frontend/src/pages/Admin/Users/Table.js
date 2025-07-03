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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { Pagination } from "@mui/material";
import axios from "axios";
import { getConfig } from "../../../utils/getConfig";
import Loading from "../../Loader/Loader";
import { USERS_PER_PAGE } from "../../../utils/constants";
import { urlConstants } from "../../../apis";
import { useGetAdminUsersQuery } from "../../../apis/adminApi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const UserTable = ({
  setSelectedUser,
  setOpenEditDialog,
  setOpenDeleteDialog,
}) => {
  const [pageNumber, setPageNumber] = useState(1);
  const { user } = useSelector((state) => state.auth);

  const {
    data: usersResponse,
    isLoading: loading,
    error,
  } = useGetAdminUsersQuery(user?.id, { skip: !user?.id });
  const usersData = usersResponse?.users || [];

  const count = Math.ceil(usersData.length / USERS_PER_PAGE);

  const handleChangePage = (event, newPage) => {
    setPageNumber(newPage);
  };

  useEffect(() => {
    if (error) {
      toast.error("Failed to fetch users.");
    }
  }, [error]);

  useEffect(() => {
    if (usersData.length) {
      const filteredUsers = usersData.slice(
        (pageNumber - 1) * USERS_PER_PAGE,
        pageNumber * USERS_PER_PAGE
      );
      // setUsers(filteredUsers);
    }
  }, [pageNumber, usersData]);

  return (
    <>
      <TableContainer
        className="table"
        sx={{ width: "100%", margin: "2rem auto" }}
        component={Paper}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="center">Firstname</TableCell>
              <TableCell className="center">Lastname</TableCell>
              <TableCell className="center">Email</TableCell>
              <TableCell className="center">Role</TableCell>
              <TableCell className="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usersData.map((user) => (
              <TableRow key={user?.id}>
                <TableCell>{user.firstname}</TableCell>
                <TableCell>{user.lastname}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell sx={{ display: "flex", gap: 2 }}>
                  <Button
                    onClick={() => {
                      setSelectedUser(user);
                      setOpenEditDialog(true);
                    }}
                  >
                    <Edit />
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedUser(user);
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

export default UserTable;
