import React, { useState, useEffect } from 'react';
import { Paper, Button, IconButton, CircularProgress, Snackbar, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import projectService from '../../services/projectService'; // Assuming you have a projectService for API calls
import axios from 'axios'; // Import axios for sending API requests
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import ScurveIcon from '@mui/icons-material/ShowChart';
import CheckIcon from '@mui/icons-material/Check'; // Import an icon for activation
import CloseIcon from '@mui/icons-material/Close'; // Import an icon for deactivation
import VisibilityIcon from '@mui/icons-material/Visibility'; // Import the eye icon
import dayjs from 'dayjs';
import ProjectCreate from './ProjectCreate';
import OptionsMenuProject from '../../components/OptionsMenuProject';
import OptionsMenuSyncProject from '../../components/OptionsMenuSyncProject';
import ProjectUpdate from './ProjectUpdate';
import EditIcon from '@mui/icons-material/Edit';

const ProjectList = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDrawerUpdate, setOpenDrawerUpdate] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [projects, setProjects] = useState([]); // Store all projects
  const [filteredProjects, setFilteredProjects] = useState([]); // Store filtered projects
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await projectService.getProjects();
        setProjects(response.data || []); // Ensure it defaults to an empty array if undefined
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Retrieve userEmail from local storage
    const userEmail = localStorage.getItem('userEmail'); // Adjust the key as per your storage
    const companyId = localStorage.getItem('companyId');

    if (projects && companyId) { // Check if projects and userEmail are defined
      const filtered = projects.filter(project => project.company_id === parseInt(companyId));
      // console.log(companyId);
      setFilteredProjects(filtered);
    }
  }, [projects]); // Run filtering when projects change

  const handleToggleProject = async (id, currentStatus, project_name) => {
    const newStatus = !currentStatus;
  
    try {
      const response = await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/projects/${id}/${newStatus}`);
      if (response.status === 200) {
        setProjects(prevProjects =>
          prevProjects.map(project =>
            project.id === id ? { ...project, status: newStatus } : project
          )
        );
        setSnackbarMessage(`Project ${project_name} status updated to ${newStatus ? 'active' : 'inactive'}`);
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage(`Error updating project ${project_name} status: ${error.message}`);
      setOpenSnackbar(true);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'cu_project_id', headerName: 'CU Project ID', width: 130 },
    { field: 'project_name', headerName: 'Project Name', width: 200 },
    { 
      field: 'project_type', 
      headerName: 'Project Type', 
      width: 170,
      renderCell: (params) => {
        const project_type = params.value;
        let color;
        if (project_type === 'New Development') {
          color = 'primary';
        } else if (project_type === 'Enhancement') {
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
            {project_type}
          </Box>
        );
      } 
    },
    { field: 'start_date', headerName: 'Start Date', width: 110, 
      valueFormatter: (params) => dayjs(params.value).format('DD-MM-YYYY') },
    { field: 'due_date', headerName: 'Due Date', width: 110, 
      valueFormatter: (params) => dayjs(params.value).format('DD-MM-YYYY') },
    // { field: 'createdAt', headerName: 'Created At', width: 150, 
    //   valueFormatter: (params) => dayjs(params.value).format('DD-MM-YYYY') },
    // { field: 'company_id', headerName: 'Company ID', hide: true },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <>
          <IconButton
            color={params.row.status ? 'success' : 'error'} // Green for active, red for deactivate
            onClick={() => handleToggleProject(params.row.id, params.row.status, params.row.project_name)}
            size='small'
            aria-label={params.row.status ? 'Deactivate' : 'Activate'}
          >
            {params.row.status ? <CheckIcon /> : <CloseIcon />}
          </IconButton>
        </>
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 250,
      renderCell: (params) => (
        <>
          <OptionsMenuSyncProject params={params} />
          <OptionsMenuProject params={params} />
          <IconButton
            aria-label="view"
            onClick={() => navigate(`/tasks/${params.row.cu_project_id}`)}
            size='small'
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            aria-label="edit"
            onClick={() => {setOpenDrawerUpdate(true); setSelectedRowData(params.row)}}
            size='small'
          >
            <EditIcon />
          </IconButton>
          <ProjectUpdate params={params} open={openDrawerUpdate} onClose={() => {setOpenDrawerUpdate(false);}} currentData={selectedRowData} /> {/* Pass currentData */}
        </>
      ),
    },
  ];
  const rows = filteredProjects.map(project => ({
    id: project.id,
    cu_project_id: project.cu_project_id,
    project_name: project.project_name,
    project_type: project.project_type,
    start_date: project.start_date,
    due_date: project.due_date,
    status: project.status,
    createdAt: project.created_at,
    // company_id: project.company_id
  }));

  const paginationModel = { pageSize: 5, page: 0 };
  const initialState = {
    pagination: { paginationModel },
    sorting: {
      sortModel: [
        { field: 'id', sort: 'asc' }, // Sort by id in ascending order by default
      ],
    },
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <CircularProgress />
      </Box>
    );

  }

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
        initialState={initialState} // Use the modified initialState
        autoPageSize
        sx={{ border: 0 }}
      />
      <ProjectCreate />
      <ProjectCreate open={openDrawer} onClose={() => setOpenDrawer(false)} />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </Paper>
  );
};

export default ProjectList;


