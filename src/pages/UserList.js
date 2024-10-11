import React, { useState, useEffect } from 'react';
import { Paper, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import userService from '../services/userService'; // Assuming you have a userService for API calls
import axios from 'axios'; // Import axios for sending API requests

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await userService.getUsers();
      setUsers(response.data);
    };

    fetchData();
  }, []);

  // Function to handle status update
  const handleStatusUpdate = async (id, currentStatus) => {
  let newStatus = null; // Declare newStatus here

  try {
    newStatus = !currentStatus; // Toggle status (true/false)
    const response = await axios.patch(`http://localhost:5000/users/${id}/${newStatus}`);

    if (response.status === 200) {
      setUsers((prevUsers) => 
        prevUsers.map((user) =>
          user.id === id ? { ...user, status: newStatus } : user
        )
      );
    }
  } catch (error) {
    console.log("Updating user ID:", id);
    console.log(`Current Status: ${currentStatus}, New Status: ${newStatus}`); // This will now have the correct value
    console.error('Error updating user status:', error);
  }
};


  // Columns definition including the Action column
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'email', headerName: 'Email', width: 150 },
    { field: 'role', headerName: 'Role', width: 90 },
    { field: 'status', headerName: 'Status', width: 90 },
    { field: 'createdAt', headerName: 'Created At', width: 150 },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
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
  ];

  // Mapping users to rows and sorting by ID in ascending order
const rows = users
  .sort((a, b) => a.id - b.id) // Sort users by ID in ascending order
  .map(user => ({
    id: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
  }));


  const paginationModel = { pageSize: 5, page: 0 };

  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
};

export default UserList;
