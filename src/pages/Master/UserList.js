import React, { useState, useEffect } from 'react';
import { Paper, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import userService from '../../services/userService'; // Assuming you have a userService for API calls
import axios from 'axios'; // Import axios for sending API requests
import dayjs from 'dayjs';
import UserCreate from './UserCreate';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await userService.getUsers();
      setUsers(response.data);
    };

    fetchData();
  }, []);

  // Function to handle status update
  const handleStatusUpdate = async (id, currentStatus) => {
    const newStatus = !currentStatus;
  
    try {
      const response = await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/users/${id}/${newStatus}`);
      if (response.status === 200) {
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === id ? { ...user, status: newStatus } : user
          )
        );
        setSnackbarMessage(`Company ${response.email} status updated to ${newStatus ? 1 : 0}`);
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage(`Error updating user status: ${error.message}`);
      setOpenSnackbar(true);
    }
  };

  const columns = React.useMemo(
    () => [
      { field: 'id', headerName: 'ID', flex: 1, minWidth: 90 },
      { field: 'first_name', headerName: 'First Name', flex: 2, minWidth: 150 },
      { field: 'last_name', headerName: 'Last Name', flex: 2, minWidth: 150 },
      { field: 'email', headerName: 'Email', flex: 3, minWidth: 150 },
      { field: 'role', headerName: 'Role', flex: 2, minWidth: 90 },
      { field: 'name', headerName: 'Company Name', flex: 2, minWidth: 90 },
      { field: 'status', headerName: 'Status', flex: 1, minWidth: 90,
        renderCell: (params) => (
          <>
            <IconButton
              color={params.row.status ? 'success' : 'error'} // Green for active, red for deactivate
              onClick={() => handleStatusUpdate(params.row.id, params.row.status, params.row.name)}
              size='small'
              aria-label={params.row.status ? 0 : 1}
            >
              {params.row.status ? <CheckIcon /> : <CloseIcon />}
            </IconButton>
          </>
        ),
       },
      { field: 'created_at', headerName: 'Created At', flex: 1, minWidth: 150, 
        valueFormatter: (params) => dayjs(params.value).format('YYYY-MM-DD') },
      
    ],
    []
  );

  const rows = React.useMemo(
    () =>
      users
        .sort((a, b) => a.id - b.id) // Sort users by ID in ascending order
        .map(user => ({
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role,
          company_id: user.company_id,
          name: user.name,
          status: user.status,
          created_at: user.created_at,
        })),
    [users]
  );

  return (
    <Paper sx={{ height: 'calc(81vh - 0px)', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDrawer(true)}
          size='small'
          sx={{ m: 2 }}
        >
          Add New
        </Button>
      </div>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: paginationModel }}
        onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
      <UserCreate />
      <UserCreate open={openDrawer} onClose={() => setOpenDrawer(false)} />
    </Paper>
  );
};

export default UserList;

