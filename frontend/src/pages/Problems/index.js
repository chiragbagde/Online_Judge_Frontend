import React, { useState, useEffect } from "react";
import {
  Box,
  Chip,
  Paper,
  Typography,
  useTheme,
  Button,
  Avatar,
  InputAdornment,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Badge,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Star,
  Lock,
  MenuBook,
  Forum,
  Assignment,
  Favorite,
  CalendarToday,
  EmojiEvents,
  Search,
  CheckCircle,
  ListAlt,
  TrendingUp,
  School,
  LibraryBooks,
  PlayCircleFilled,
  ArrowForwardIos,
  Add,
  Edit,
  Delete,
} from "@mui/icons-material";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import LeftSidebar from "./components/LeftSidebar";
import ProblemsTable from "./components/ProblemsTable";
import { EditListDialog, DeleteListDialog } from "./components/ListPopups";
import { 
  useGetProblemsQuery, 
  useGetTopicCountsQuery, 
  useGetMyListsQuery, 
  useCreateListMutation, 
  useUpdateListMutation, 
  useDeleteListMutation 
} from '../../apis/problemsApi';
import EmailForm from "./components/EmailMe";
import Loading from "../Loader/Loader";

const difficultyColors = {
  easy: "#4CAF50",
  medium: "#FF9800",
  hard: "#F44336",
};

const sidebarLists = [
  { icon: <LibraryBooks />, label: "Library" },
  { icon: <School />, label: "Study Plan" },
  { icon: <Forum />, label: "Discuss" },
];

const PROBLEMS_PER_PAGE = 10;

const Problems = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PROBLEMS_PER_PAGE,
  });
  const selectedTopic = searchParams.get('category') || null;
  const [search, setSearch] = useState("");
  const [myLists, setMyLists] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [openNewListDialog, setOpenNewListDialog] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedListForAdd, setSelectedListForAdd] = useState(null);
  const [editingList, setEditingList] = useState(null);
  const [listDescription, setListDescription] = useState("");
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);
  

  const theme = useTheme();
  const isLightMode = theme.palette.mode === "light";
  const borderColor = theme.palette.border.secondary;
  const hoverColor = isLightMode ? "#f0f7ff" : "#333";

  // RTK Query hooks
  const { data: problemsData, isLoading: problemsLoading, error: problemsError } = useGetProblemsQuery();
  const { data: topicCountsData, isLoading: topicCountsLoading, error: topicCountsError } = useGetTopicCountsQuery();
  const { data: myListsData, isLoading: myListsLoading, error: myListsError, refetch: refetchMyLists } = useGetMyListsQuery(user?.id, { skip: !user?.id });
  const [createList] = useCreateListMutation();
  const [updateList] = useUpdateListMutation();
  const [deleteList] = useDeleteListMutation();

  useEffect(() => {
    if (myListsData && myListsData.lists) {
      setMyLists(myListsData.lists);
    }
  }, [myListsData]);

  const problems = problemsData?.problems || [];
  const topicCounts = topicCountsData?.topicCounts || [];

  const setSelectedTopic = (topic) => {
    if (topic === "All Topics" || !topic) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', topic);
    }
    setSearchParams(searchParams);
  };

  const filteredProblems = problems.filter(
    (p) =>
      (!selectedTopic || p.topic === selectedTopic) &&
      (!search || p.statement.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSelectProblem = (problemId) => {
    setSelectedProblems(prev => 
      prev.includes(problemId) 
        ? prev.filter(id => id !== problemId)
        : [...prev, problemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProblems.length === filteredProblems.length) {
      setSelectedProblems([]);
    } else {
      setSelectedProblems(filteredProblems.map(p => p._id));
    }
  };

  const handleCreateList = async () => {
    try {
      const { data } = await createList({ 
        name: newListName, 
        description: listDescription,
        user_id: user?.id,
        problems: [] 
      });
      setMyLists(prev => [...prev, data.list]);
      setOpenNewListDialog(false);
      setNewListName("");
      setListDescription("");
      toast.success("List created successfully!");
    } catch (e) {
      toast.error("Failed to create list");
      console.error(e);
    }
  };

  const handleEditList = async () => {
    if (!editingList) return;
    
    try {
      const { data } = await updateList({
        id: editingList._id,
        name: newListName,
        description: listDescription,
        problems: editingList.problems
      });
      
      setMyLists(prev => 
        prev.map(list => 
          list._id === editingList._id ? data.list : list
        )
      );
      
      setOpenEditDialog(false);
      setEditingList(null);
      setNewListName("");
      setListDescription("");
      toast.success("List updated successfully!");
    } catch (e) {
      toast.error("Failed to update list");
      console.error(e);
    }
  };

  const handleDeleteList = async () => {
    if (!listToDelete || !listToDelete._id) {
        toast.error("No list selected for deletion.");
        return;
    }

    try {
        await deleteList({ id: listToDelete._id });

        setMyLists(prev => prev.filter(list => list._id !== listToDelete._id));
        setOpenDeleteDialog(false);
        setListToDelete(null);
        toast.success("List deleted successfully!");
    } catch (e) {
        toast.error("Failed to delete list");
        console.error(e);
    }
  };

  const openEditListDialog = (list) => {
    setEditingList(list);
    setNewListName(list.name);
    setListDescription(list.description || "");
    setOpenEditDialog(true);
  };

  const openDeleteListDialog = (list) => {
    setListToDelete(list);
    setOpenDeleteDialog(true);
  };

  const handleAddToList = async (listId) => {
    try {
      // Get the current list to update
      const currentList = myLists.find(list => list._id === listId);
      if (!currentList) {
        throw new Error("List not found");
      }

      // Create new problems array by combining existing and new problems
      const updatedProblems = [...new Set([...currentList.problems, ...selectedProblems])];

      // Update the list with new problems
      const { data } = await updateList({
        id: listId,
        name: currentList.name,
        description: currentList.description,
        problems: updatedProblems
      });

      // Update the lists in state
      setMyLists(prev => 
        prev.map(list => 
          list._id === listId ? data.list : list
        )
      );

      toast.success(`Added ${selectedProblems.length} problem(s) to ${currentList.name}`);
      setAnchorEl(null);
      setSelectedProblems([]);
    } catch (e) {
      toast.error("Failed to add problems to list");
      console.error(e);
    }
  };

  // --- UI ---
  if (problemsLoading || topicCountsLoading || myListsLoading) return <Loading />;
  if (problemsError || topicCountsError || myListsError) return <Box p={4}><Typography color="error">Failed to load problems data.</Typography></Box>;

  const activeAvatarBg = '#1976d2';

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: theme.palette.background.main,
        minHeight: "100vh",
        p: { xs: 2, lg: 0 },
      }}
    >
      <LeftSidebar
        myLists={myLists}
        openEditListDialog={openEditListDialog}
        openDeleteListDialog={openDeleteListDialog}
        setEditingList={setEditingList}
        setNewListName={setNewListName}
        setListDescription={setListDescription}
        setOpenNewListDialog={setOpenNewListDialog}
        borderColor={borderColor}
      />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: 0,
          py: 4,
          width: "100%",
          overflowX: { xs: "auto", lg: "hidden" },
        }}
      >
        <ProblemsTable
          topicCounts={topicCounts}
          selectedTopic={selectedTopic}
          setSelectedTopic={setSelectedTopic}
          search={search}
          setSearch={setSearch}
          selectedProblems={selectedProblems}
          myLists={myLists}
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          handleAddToList={handleAddToList}
          filteredProblems={filteredProblems}
          handleSelectAll={handleSelectAll}
          handleSelectProblem={handleSelectProblem}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          borderColor={borderColor}
          hoverColor={hoverColor}
          difficultyColors={difficultyColors}
          problems={problems}
        />
      </Box>

      <Box
        sx={{
          width: 300,
          borderLeft: `1px solid ${borderColor}`,
          py: 3,
          px: 2,
          display: { xs: "none", lg: "flex" },
          flexDirection: "column",
          gap: 3,
        }}
      >
        <EmailForm />
        <Paper
          sx={{
            p: 2,
            borderRadius: 2,
            boxShadow: "none",
            border: `1px solid ${borderColor}`,
            bgcolor: theme.palette.background.main,
          }}
        >
          <Typography fontWeight={700} sx={{ mb: 1, fontSize: 16 }}>
            Would you recommend your friends to try the new Library?
          </Typography>
          <Box sx={{ display: "flex", gap: 0.2, flexwrap: "wrap" }}>
            {["😞", "🤔", "😐", "😃", "🤩"].map((emoji, idx) => (
              <IconButton
                key={idx}
                sx={{ fontSize: 22, color: activeAvatarBg }}
              >
                {emoji}
              </IconButton>
            ))}
          </Box>
        </Paper>
      </Box>

      <EditListDialog
        open={openNewListDialog || openEditDialog}
        editingList={editingList}
        newListName={newListName}
        setNewListName={setNewListName}
        listDescription={listDescription}
        setListDescription={setListDescription}
        handleEditList={handleEditList}
        handleCreateList={handleCreateList}
        setOpenNewListDialog={setOpenNewListDialog}
        setOpenEditDialog={setOpenEditDialog}
        setEditingList={setEditingList}
      />
      <DeleteListDialog
        open={openDeleteDialog}
        listToDelete={listToDelete}
        setOpenDeleteDialog={setOpenDeleteDialog}
        setListToDelete={setListToDelete}
        handleDeleteList={handleDeleteList}
      />
    </Box>
  );
};

export default Problems;
