import React, { useState, useEffect } from 'react';
import { Paper, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import userService from '../services/userService'; // Assuming you have a userService for API calls
import axios from 'axios'; // Import axios for sending API requests
import dayjs from 'dayjs';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const response = await userService.getUsers();
      setUsers(response.data);
    };

    fetchData();
  }, []);

  // Function to handle status update
  const handleStatusUpdate = async (id, currentStatus) => {
    const newStatus = !currentStatus; // Toggle status (true/false)

    try {
      const response = await axios.patch(`${process.env.BE_URL}/users/${id}/${newStatus}`);

      if (response.status === 200) {
        setUsers((prevUsers) => prevUsers.map(user => user.id === id ? { ...user, status: newStatus } : user));
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const columns = React.useMemo(
    () => [
      { field: 'id', headerName: 'ID', flex: 1, minWidth: 90 },
      { field: 'email', headerName: 'Email', flex: 3, minWidth: 150 },
      { field: 'role', headerName: 'Role', flex: 2, minWidth: 90 },
      { field: 'status', headerName: 'Status', flex: 1, minWidth: 90 },
      { field: 'created_at', headerName: 'Created At', flex: 1, minWidth: 150, 
        valueFormatter: (params) => dayjs(params.value).format('YYYY-MM-DD') },
      {
        field: 'action',
        headerName: 'Action',
        flex: 1, minWidth: 150,
        renderCell: (params) => (
          <Button
            variant="contained"
            color={params.row.status ? 'secondary' : 'primary'}
            onClick={() => handleStatusUpdate(params.row.id, params.row.status)}
          >
            {params.row.status ? 'Deactivate' : 'Activate'}
          </Button>
        ),
      },
    ],
    []
  );

  const rows = React.useMemo(
    () =>
      users
        .sort((a, b) => a.id - b.id) // Sort users by ID in ascending order
        .map(user => ({
          id: user.id,
          email: user.email,
          role: user.role,
          status: user.status,
          created_at: user.created_at,
        })),
    [users]
  );

  return (
    <Paper sx={{ height: 'calc(81vh - 0px)', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: paginationModel }}
        onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
};

export default UserList;
