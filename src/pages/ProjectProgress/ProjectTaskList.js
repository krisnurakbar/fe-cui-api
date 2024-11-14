import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Paper, CircularProgress, Tabs, Tab, Box, Button, IconButton, Typography, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import taskService from '../../services/taskServices';
import projectService from '../../services/projectService';
import ProjectProgressCreate from './ProjectProgressCreate';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ProjectProgressUpdate from './ProjectProgressUpdate';
import projectProgressService from '../../services/projectProgressService';

const ProjectTasks = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDrawerUpdate, setOpenDrawerUpdate] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const { project_id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(0);
  const [progressData, setProgressData] = useState([]);
  const refreshProgressData = async () => {
    try {
      const response = await projectService.projectProgress(project_id);
      setProgressData(response.data); // Update the state to refresh the data
    } catch (error) {
      console.error('Error fetching progress data:', error);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleEdit = (rowData) => {
    setSelectedRowData(rowData);
    setOpenDrawer(true);
  };
  
  const handleProgressUpdate = (rowData) => {
    setSelectedRowData(rowData); // Set selected row data
    setOpenDrawerUpdate(true); // Open drawer for update
  };

  const tabs = [
    { label: 'Progress', component: <ProgressPage project_id={project_id} onEdit={handleProgressUpdate} /> }, // Update the onEdit to handle progress updates
    { label: 'Tasks', component: <TaskList tasks={tasks} onEdit={handleEdit} /> },
  ];

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await taskService.getProjectTasks(project_id);
        setTasks(response.data || []);
      } catch (err) {
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [project_id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ height: 'calc(81vh - 0px)', width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          {tabs.map((tab, index) => (
            <Tab label={tab.label} key={index} />
          ))}
        </Tabs>
        {tabs[value].label === 'Progress' && (
          <Button variant="contained" color="primary" size='small' onClick={() => setOpenDrawer(true)} sx={{ margin: '8px' }}>
            Add New
          </Button>
        )}
      </Box>
      {tabs[value].component}
      <ProjectProgressCreate open={openDrawer} onClose={() => setOpenDrawer(false)} /> {/* Keep it as is for Create */}
      <ProjectProgressUpdate open={openDrawerUpdate} onClose={() => {setOpenDrawerUpdate(false); refreshProgressData();}} currentData={selectedRowData} /> {/* Pass currentData */}
      
    </Paper>
  );
};

const TaskList = ({ tasks, onEdit }) => {
  const columns = [
    { field: 'id', headerName: 'ID', flex: 1, minWidth: 50 },
    { field: 'task_title', headerName: 'Task Title', flex: 2, minWidth: 180 },
    {
      field: 'task_status',
      headerName: 'Task Status',
      flex: 2,
      minWidth: 180,
      renderCell: (params) => {
        const status = params.value;
        let color;
        if (status === 'planned') {
          color = 'primary';
        } else if (status === 'in progress') {
          color = 'warning';
        } else if (status === 'complete') {
          color = 'success';
        } else {
          color = 'error';
        }
        return (
          <Box
            sx={{
              display: 'inline-flex',
              backgroundColor: (theme) => theme.palette[color].light,
              padding: '0px 8px',
              borderRadius: '16px',
              height: '22px',
              alignItems: 'center',
              justifyContent: 'center',
              verticalAlign: 'middle',
            }}
          >
            {status}
          </Box>
        );
      },
    },

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
    { field: 'status', headerName: 'Status', flex: 1, minWidth: 100 },
  ];

  return (
    <DataGrid
      rows={tasks}
      columns={columns}
      pageSize={10}
      rowsPerPageOptions={[10]}
      autoPageSize
      onRowClick={(params) => {
        // Optionally implement click handling on a row
      }}
    />
  );
};

const ProgressPage = ({ project_id, onEdit }) => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [project_id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  const columns = [
    // { field: 'id', headerName: 'ID', flex: 1, minWidth: 50 },
    { field: 'week_no', headerName: 'Week No', flex: 1, minWidth: 100 },
    { field: 'report_date', headerName: 'Report Date', flex: 1, minWidth: 150 },
    { field: 'plan_progress', headerName: 'Plan Progress', flex: 1, minWidth: 120, type: 'number' },
    { field: 'actual_progress', headerName: 'Actual Progress', flex: 1, minWidth: 120, type: 'number' },
    { field: 'plan_cost', headerName: 'Plan Cost', flex: 1, minWidth: 120 },
    { field: 'actual_cost', headerName: 'Actual Cost', flex: 1, minWidth: 120 },
    { field: 'plan_value', headerName: 'Plan Value', flex: 1, minWidth: 120 },
    { field: 'actual_value', headerName: 'Actual Value', flex: 1, minWidth: 120 },
    { field: 'spi', headerName: 'SPI', flex: 1, minWidth: 100 },
    { field: 'cpi', headerName: 'CPI', flex: 1, minWidth: 100 },
    { field: 'created_by', headerName: 'Created By', flex: 1, minWidth: 150 },
    { field: 'modified_date', headerName: 'Modified Date', flex: 1, minWidth: 150 },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => onEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const handleDelete = async (id) => {
    try {
      const response = await projectProgressService.deleteProgressProject(id, { data: { id }});

      if (response.ok) {
        // Handle successful deletion
        console.log(`Project progress with ID ${id} deleted successfully`);
        alert('Project progress deleted successfully');
        window.location.reload();
      } else {
        // Handle deletion error
        alert('Project progress deleted successfully');
        window.location.reload();
      }
    } catch (error) {
      // Handle deletion error
      console.error(`Error deleting project progress with ID ${id}: ${error.message}`);
      alert(`Error deleting project progress with ID ${id}: ${error.message}`);
      window.location.reload();
    }
  };


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


