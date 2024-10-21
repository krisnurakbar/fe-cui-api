import React, { useState, useEffect } from 'react';
import { Paper, Button, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import projectService from '../services/projectService'; // Assuming you have a projectService for API calls
import axios from 'axios'; // Import axios for sending API requests
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import ScurveIcon from '@mui/icons-material/ShowChart';
import CheckIcon from '@mui/icons-material/Check'; // Import an icon for activation
import CloseIcon from '@mui/icons-material/Close'; // Import an icon for deactivation
import VisibilityIcon from '@mui/icons-material/Visibility'; // Import the eye icon

const ProjectList = () => {
  const [projects, setProjects] = useState([]); // Store all projects
  const [filteredProjects, setFilteredProjects] = useState([]); // Store filtered projects
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await projectService.getProjects();
        setProjects(response.data || []); // Ensure it defaults to an empty array if undefined
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Retrieve userEmail from local storage
    const userEmail = localStorage.getItem('userEmail'); // Adjust the key as per your storage

    if (projects && userEmail) { // Check if projects and userEmail are defined
      const filtered = projects.filter(project => project.modified_by === userEmail);
      setFilteredProjects(filtered);
    }
  }, [projects]); // Run filtering when projects change

  const handleToggleProject = async (id, currentStatus) => {
    const newStatus = !currentStatus;

    try {
      const response = await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/projects/${id}/${newStatus}`);
      if (response.status === 200) {
        setProjects(prevProjects => 
          prevProjects.map(project =>
            project.id === id ? { ...project, status: newStatus } : project
          )
        );
      }
    } catch (error) {
      console.error(`Error updating project ID:${id} - New Status: ${newStatus}`, error);
    }
  };

  const columns = [
    // {
    //   field: 'S-Curve',
    //   headerName: 'S-Curve',
    //   flex: 1,
    //   minWidth: 70,
    //   renderCell: (params) => (
    //     <IconButton
    //       aria-label="s-curve"
    //       onClick={() => window.open(`/project/${params.id}/s-curve`, '_blank')} // Opens the link in a new tab
    //       size="small"
    //     >
    //       <ScurveIcon fontSize="small" />
    //     </IconButton>
    //   ),
    // },
    { field: 'id', headerName: 'ID', flex: 1, minWidth: 50 },
    { field: 'project_name', headerName: 'Project Name', flex: 1, minWidth: 150 },
    { field: 'start_date', headerName: 'Start Date', flex: 1, minWidth: 90 },
    { field: 'due_date', headerName: 'Due Date', flex: 1, minWidth: 90 },
    { field: 'status', headerName: 'Status', flex: 1, minWidth: 90 },
    { field: 'createdAt', headerName: 'Created At', flex: 1, minWidth: 150 },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <>
          <IconButton
            aria-label="s-curve"
            onClick={() => window.open(`/project/s-curve/${params.id}`, '_blank')} // Opens the link in a new tab
            size="small"
          >
            <ScurveIcon fontSize="small" />
          </IconButton>
          <IconButton
            color={params.row.status ? 'success' : 'error'} // Green for active, red for deactivate
            onClick={() => handleToggleProject(params.row.id, params.row.status)}
            size='small'
            aria-label={params.row.status ? 'Deactivate' : 'Activate'}
          >
            {params.row.status ? <CheckIcon /> : <CloseIcon />}
          </IconButton>
          <IconButton
            aria-label="view"
            onClick={() => navigate(`/tasks/project/${params.row.id}`)}
            size='small'
          >
            <VisibilityIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const rows = filteredProjects.map(project => ({
    id: project.id,
    project_name: project.project_name,
    start_date: project.start_date,
    due_date: project.due_date,
    status: project.status,
    createdAt: project.created_at,
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

  return (
    <Paper sx={{ height: 'calc(81vh - 0px)', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={initialState} // Use the modified initialState
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
};

export default ProjectList;
