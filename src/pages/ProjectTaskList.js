import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // For accessing URL parameters
import { Paper, Typography, CircularProgress, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid'; // Import DataGrid for table format
import taskService from '../services/taskServices'; // Import the task service
import ScurveIcon from '@mui/icons-material/ShowChart';

const ProjectTasks = () => {
  const { project_id } = useParams(); // Get project_id from URL parameters
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await taskService.getProjectTasks(project_id);
        setTasks(response.data); // Assuming response.data contains the list of tasks
      } catch (err) {
        setError('Error fetching tasks');
        console.error('Error fetching project tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [project_id]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

// Define columns for the DataGrid with auto width
const columns = [
  {
    field: 'S-Curve',
    headerName: 'S-Curve',
    width: 70,
    renderCell: (params) => (
      <IconButton
        aria-label="s-curve"
        size="small" // Makes the button small
      >
        <ScurveIcon fontSize="small" /> {/* Adjust icon size as needed */}
      </IconButton>
    ),
  },
  { field: 'id', headerName: 'ID', flex: 1, minWidth: 50 },
  { field: 'task_title', headerName: 'Task Title', flex: 2, minWidth: 180 },
  { field: 'status', headerName: 'Status', flex: 1, minWidth: 100 },
  { field: 'created_at', headerName: 'Created At', flex: 1, minWidth: 100 },
  { field: 'cu_task_id', headerName: 'CU Task ID', flex: 1, minWidth: 100 },
  { field: 'start_date', headerName: 'Start Date', flex: 1, minWidth: 100 },
  { field: 'due_date', headerName: 'Due Date', flex: 1, minWidth: 100 },
  { field: 'actual_start_date', headerName: 'Act. Start Date', flex: 1, minWidth: 100 },
  { field: 'actual_end_date', headerName: 'Act. End Date', flex: 1, minWidth: 100 },
  { field: 'rate_card', headerName: 'Rate Card', flex: 1, minWidth: 100 },
  { field: 'plan_cost', headerName: 'Plan Cost', flex: 1, minWidth: 100 },
  { field: 'actual_cost', headerName: 'Actual Cost', flex: 1, minWidth: 100 },
  { field: 'spi', headerName: 'SPI', flex: 1, minWidth: 50 },
  { field: 'cpi', headerName: 'CPI', flex: 1, minWidth: 50 },
];


  // cu_task_id, start_date, due_date, actual_start_date, actual_end_date, rate_card, plan_cost, actual_cost, spi, cpi    

  // Mapping tasks to rows for DataGrid
    const rows = tasks.map(task => ({
    id: task.id,
    task_title: task.task_title,
    status: task.status,
    created_at: new Date(task.created_at).toLocaleDateString(), // Format date as needed
    cu_task_id: task.cu_task_id,
    start_date: task.start_date,
    due_date: task.due_date,
    actual_start_date: task.actual_start_date,
    actual_end_date: task.actual_end_date,
    rate_card: task.rate_card,
    plan_cost: task.plan_cost,
    actual_cost: task.actual_cost,
    spi: task.spi,
    cpi: task.cpi,
    }));


  return (
    <Paper sx={{ height: 400, width: '100%' }}>
        <Typography variant="h5" padding={2}>
        Tasks for Project ID: {project_id}
        </Typography>
        <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            checkboxSelection
            disableSelectionOnClick
            sx={{ border: 0, minWidth: '100%' }} // Ensure minimum width for horizontal scrolling
        />
    </Paper>


    );

};

export default ProjectTasks;
