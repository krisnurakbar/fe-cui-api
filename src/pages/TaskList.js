import React, { useState, useEffect } from 'react';
import { Paper, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import taskService from '../services/taskServices'; // Assuming you have a taskService for API calls
import axios from 'axios'; // Import axios for sending API requests

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await taskService.getTasks();
        console.log('Fetched tasks:', response.data);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        // Additional error tracking can be implemented here (e.g. sending error info to an error monitoring service)
      }
    };

    fetchData();
  }, []);

  // Function to handle status update
  const handleToggleTask = async (id, currentStatus) => {
    const newStatus = !currentStatus; // Toggle status (true/false)

    try {
      const response = await axios.patch(`${process.env.BE_URL}/tasks/${id}/${newStatus}`);

      if (response.status === 200) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === id ? { ...task, status: newStatus } : task
          )
        );
      } else {
        console.error(`Failed to update task ID:${id}, Status: ${newStatus}, Response: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error updating task ID:${id} - New Status: ${newStatus}`, error);
      // You can log additional details if available.
      if (error.response) {
        console.error('Server responded with status:', error.response.status);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('Request was made but no response received:', error.request);
      } else {
        console.error('Error', error.message);
      }
    }
  };

  // Columns definition including the Action column
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'task_title', headerName: 'Task Title', width: 150 },
    { field: 'status', headerName: 'Status', width: 90 },
    { field: 'created_at', headerName: 'Created At', width: 150 },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: ({ row: { id, status } }) => (
        <Button
          variant="contained"
          color={status ? 'secondary' : 'primary'}
          onClick={() => handleToggleTask(id, status)}
        >
          {status ? 'Deactivate' : 'Activate'}
        </Button>
      ),
    },
  ];

  // Use tasks directly instead of mapping, as we are not transforming data
  const paginationModel = { pageSize: 5, page: 0 };

  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={tasks}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
};

export default TaskList;
