import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Paper, CircularProgress, Tabs, Tab, Box, Button, IconButton, Typography, Divider, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import taskService from '../../services/taskServices';
import projectService from '../../services/projectService';
import ProjectProgressCreate from './ProjectProgressCreate';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ProjectProgressUpdate from './ProjectProgressUpdate';
import projectProgressService from '../../services/projectProgressService';
import dayjs from 'dayjs';
import { LineChart } from '@mui/x-charts/LineChart';
import OptionsMenuCopyProject from '../../components/OptionsMenuCopyProject';
import moment from 'moment/moment';

const ProjectTasks = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDrawerUpdate, setOpenDrawerUpdate] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const { cu_project_id } = useParams();
  const [value, setValue] = useState(0);
  const [progressData, setProgressData] = useState([]);
  const refreshProgressData = async () => {
    try {
      const response = await projectService.projectProgress(cu_project_id);
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
    { label: 'Progress', component: <ProgressPage cu_project_id={cu_project_id} onEdit={handleProgressUpdate} /> }, // Update the onEdit to handle progress updates
    { label: 'Tasks', component: <TaskList cu_project_id={cu_project_id} onEdit={handleEdit} /> },
    { label: 'S-Curve', component: <SCurve cu_project_id={cu_project_id} /> },

  ];

  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('');

  useEffect(() => {
    const fetchProjectName = async () => {
      try {
        const response = await projectService.getProjectById(cu_project_id);
        setProjectName(response.data.project_name);
        setProjectType(response.data.project_type);
        // console.log(response.data.project_name);
      } catch (error) {
        console.error('Error fetching project name:', error);
      }
    };

    fetchProjectName();
  }, [cu_project_id]);

  return (
    <Paper sx={{ height: 'calc(81vh - 0px)', width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', pt: 1, pl: 2 }}>
        <Typography variant="caption" sx={{ fontSize: '9px' }}>Project Name</Typography>
        <Chip label={projectName} sx={{ ml: 2, fontSize: '9px', fontWeight: 'bold' }} variant="outlined" />
        <Typography variant="caption" sx={{ ml: 2, fontSize: '9px' }}>Type</Typography>
        <Chip
          label={projectType}
          sx={{
            ml: 2,
            fontSize: '9px',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor:
              projectType === 'New Development' ? '#2196f3' : projectType === 'Enhancement' ? '#4caf50' : '',
          }}
          variant="outlined"
        />
      </Box>
      <Divider sx={{ mt: 1}} />
      
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
        {tabs[value].label === 'S-Curve' && (
          <Box sx={{ mr: 2 }}>
            <OptionsMenuCopyProject params={{ row: { cu_project_id } }} />
          </Box>
        )}
      </Box>
      {tabs[value].component}
      <ProjectProgressCreate open={openDrawer} onClose={() => setOpenDrawer(false)} /> {/* Keep it as is for Create */}
      <ProjectProgressUpdate open={openDrawerUpdate} onClose={() => {setOpenDrawerUpdate(false); refreshProgressData();}} currentData={selectedRowData} /> {/* Pass currentData */}
      
    </Paper>
  );
};

const TaskList = ({ cu_project_id, onEdit }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await taskService.getProjectTasks(cu_project_id);
        const data = response.data.map((task, index) => ({
          ...task,
          id: task.id || index, // Ensure every row has a unique 'id'
        }));
        setTasks(data);
      } catch (err) {
        setError('Error fetching tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [cu_project_id]);

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
    return <Box>{error}</Box>;
  }

  const columns = [
    { field: 'id', headerName: 'ID', flex: 1, minWidth: 50, resizable: true },
    { field: 'cu_task_id', headerName: 'CU Task ID', flex: 1, minWidth: 100, resizable: true },
    { field: 'task_title', headerName: 'Task Title', flex: 2, minWidth: 180, resizable: true },
    {
      field: 'task_status',
      headerName: 'Task Status',
      flex: 2,
      minWidth: 180,
      resizable: true,
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
              padding: '0px 12px',
              borderRadius: '16px',
              height: '22px',
              alignItems: 'center',
              justifyContent: 'center',
              verticalAlign: 'middle',
              color: 'white',
              fontSize: '11px',
            }}
          >
            {status}
          </Box>
        );
      },
    },
    {
      field: 'start_date',
      headerName: 'Start Date',
      flex: 1,
      minWidth: 110,
      resizable: true,
    },
    {
      field: 'due_date',
      headerName: 'Due Date',
      flex: 1,
      minWidth: 110,
      resizable: true,
    },
    { field: 'rate_card', headerName: 'Rate Card', flex: 1, minWidth: 100, resizable: true },
    { field: 'plan_cost', headerName: 'Plan Cost', flex: 1, minWidth: 100, resizable: true },
    { field: 'actual_cost', headerName: 'Actual Cost', flex: 1, minWidth: 100, resizable: true },
    { field: 'spi', headerName: 'SPI', flex: 1, minWidth: 50, resizable: true },
    { field: 'cpi', headerName: 'CPI', flex: 1, minWidth: 50, resizable: true },
    { field: 'status', headerName: 'Status', flex: 1, minWidth: 100, resizable: true },
  ];

  return (
    <DataGrid
      rows={tasks}
      columns={columns}
      pageSize={10}
      rowsPerPageOptions={[10]}
      autoPageSize
      onRowClick={(params) => onEdit(params.row)}
    />
  );
};

const ProgressPage = ({ cu_project_id, onEdit }) => {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const response = await projectService.projectProgress(cu_project_id);
        setProgressData(response.data);
      } catch (err) {
        setError('Error fetching project progress');
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [cu_project_id]);

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

const SCurve = ({cu_project_id}) => {
  const [SCurveData, setSCurveData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { projectId } = useParams(); // Get project_id from URL parameters
  const [chartData, setChartData] = useState({
    reportDates: [],
    planProgress: [],
    actualProgress: []
  });

  // <OptionsMenuProject params={params} />

  useEffect(() => {
    console.log('useEffect triggered'); // Debug log
    console.log('projectId:', projectId); // Debug log
    const fetchProgressData = async () => {
      try {
        console.log(`Fetching progress data for projectId: ${cu_project_id}`);

        const response = await projectService.projectProgress(cu_project_id);
        const progressData = response.data;

        if (!Array.isArray(progressData) || progressData.length === 0) {
          console.warn('No progress data received.');
          return;
        }

        // Extract data for the chart in one mapping and sort by report_date
        const chartData = progressData.map(item => ({
          reportDate: item.report_date || '',
          planProgress: item.plan_progress
            ? parseFloat(item.plan_progress.toString().replace('%', '')) // Ensure plan_progress is a string before using replace
            : 0, // Default to 0 if plan_progress is null or undefined
          actualProgress: item.actual_progress !== undefined && item.actual_progress !== null
            ? parseFloat(item.actual_progress.toString().replace('%', '')) // Ensure actual_progress is a string before using replace
            : null, // Default to null if actual_progress is missing
          week_no: item.week_no || 0,
        }));

        // Sort the data by reportDate in ascending order
        chartData.sort((a, b) => new Date(a.reportDate) - new Date(b.reportDate));

        // Separate the sorted data back into individual arrays
        const reportDates = chartData.map(item => item.reportDate);
        const planProgress = chartData.map(item => item.planProgress);
        const actualProgress = chartData.map(item => item.actualProgress);
        const week_no = chartData.map(item => item.week_no);

        setChartData({ reportDates, planProgress, actualProgress, week_no });
        console.log('Data set successfully in state:', { reportDates, planProgress, actualProgress, week_no });
      } catch (error) {
        console.error('Error fetching project progress data:', error);
      }
    };


    if (cu_project_id) {
      fetchProgressData(); // Fetch data only if projectId is provided
    }
  }, [cu_project_id]); // Re-fetch data if projectId changes

  const { reportDates, planProgress, actualProgress, week_no } = chartData;

  return (
    <div style={{ height: `calc(100vh - ${50}%)`, width: "100%", padding: "0 16px", }}>
      <h2>S-curve Chart</h2>
      {/* The outermost div is the container for the chart, and it's given a fixed height so that it doesn't overflow the page. The height is set to be the full height of the viewport minus the height of the header and a little padding at the top and bottom. The overflow is set to "hidden" so that the chart doesn't spill out of the container if the data is too big. */}
      <div style={{ 
        height: "97%", // Take up the full height of the page
        width: "98%", // Take up the full width of the page
        overflow: "hidden" // Don't let the chart spill out of the container if the data is too big
      }}>
        <LineChart
          slotProps={{
            legend: {
              direction: 'row',
              position: {vertical: 'top', horizontal: 'right'},
              padding: 0,
            }
          }}
          series={[
            { label: 'Planned Progress (%)', data: planProgress, color: 'red' },
            { label: 'Actual Progress (%)', data: actualProgress, color: 'green' },
          ]}
          xAxis={[
            {
              title: 'Report Date',
              data: reportDates,
              scaleType: 'point',
              valueFormatter: (value) => dayjs(value).format('DD MMM YYYY'),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default ProjectTasks;



