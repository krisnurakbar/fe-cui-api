import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // For accessing URL parameters
import { Paper, Typography, CircularProgress, Tabs, Tab } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid'; // Import DataGrid for table format
import taskService from '../services/taskServices'; // Import the task service
import projectService from '../services/projectService'; // Import the project service

const ProjectTasks = () => {
  const { project_id } = useParams(); // Get project_id from URL parameters
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabs = [
    { label: 'Tasks', component: <TaskList tasks={tasks} /> },
    { label: 'Progress', component: <ProgressPage project_id={project_id} /> },
  ];

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

  return (
    <Paper sx={{ height: 'calc(81vh - 0px)', width: '100%' }}>
      {/* <Typography variant="h5" padding={1}>
        Tasks for Project ID: {project_id}
      </Typography> */}
      <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
        {tabs.map((tab, index) => (
          <Tab label={tab.label} key={index} />
        ))}
      </Tabs>
      {tabs[value].component}
    </Paper>
  );
};

const TaskList = ({ tasks }) => {
  const columns = [
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

  return (
    <DataGrid
      rows={tasks}
      columns={columns}
      pageSize={10}
      rowsPerPageOptions={[10]}
      autoPageSize
    />
  );
};

const ProgressPage = ({ project_id }) => {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const response = await projectService.projectProgress(project_id);
        setProgressData(response.data);
      } catch (err) {
        setError('Error fetching project progress');
        console.error('Error fetching project progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [project_id]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  const columns = [
    { field: 'id', headerName: 'ID', flex: 1, minWidth: 50 },
    {
      field: 'modified_date',
      headerName: 'Modified Date',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'week_no',
      headerName: 'Week No',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'report_date',
      headerName: 'Report Date',
      flex: 1,
      minWidth: 150,
    },
    { 
      field: 'plan_progress', 
      headerName: 'Plan Progress', 
      flex: 1, 
      minWidth: 120, 
      type: 'number' 
    },
    {
      field: 'actual_progress',
      headerName: 'Actual Progress',
      flex: 1,
      minWidth: 120,
      type: 'number'
    },
    { field: 'plan_cost', headerName: 'Plan Cost', flex: 1, minWidth: 120 },
    { field: 'actual_cost', headerName: 'Actual Cost', flex: 1, minWidth: 120 },
    { field: 'spi', headerName: 'SPI', flex: 1, minWidth: 100 },
    { field: 'cpi', headerName: 'CPI', flex: 1, minWidth: 100 },
    { field: 'created_by', headerName: 'Created By', flex: 1, minWidth: 150 },
  ];
  
  

  return (
    <DataGrid
      rows={progressData}
      columns={columns}
      pageSize={10}
      rowsPerPageOptions={[10]}
      autoPageSize
    />
  );
};

export default ProjectTasks;