import React, { useState, useEffect } from 'react';
import { Paper, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import projectService from '../services/projectService'; // Assuming you have a projectService for API calls
import axios from 'axios'; // Import axios for sending API requests
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

  const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await projectService.getProjects();
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchData();
  }, []);

  // Function to handle status update
  const handleToggleProject = async (id, currentStatus) => {
    const newStatus = !currentStatus; // Toggle status (true/false)
  
    try {
      const response = await axios.patch(`http://localhost:5000/projects/${id}/${newStatus}`);
  
      if (response.status === 200) {
        setProjects((prevProjects) => 
          prevProjects.map((project) =>
            project.id === id ? { ...project, status: newStatus } : project
          )
        );
      }
    } catch (error) {
      console.error(`Error updating project ID:${id} - New Status: ${newStatus}`, error);
    }
  };

  // Columns definition including the Action column
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'project_name', headerName: 'Project Name', width: 150 },
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
          onClick={() => handleToggleProject(params.row.id, params.row.status)}
        >
          {params.row.status ? 'Deactivate' : 'Activate'}
        </Button>
      ),
    },
    {
      field: '',
      headerName: '',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          onClick={() => navigate(`/tasks/project/${params.row.id}`)} // Link to project tasks page
        >
          View Tasks
        </Button>
      ),
    },
    
  ];

  // Mapping projects to rows
  const rows = projects.map((project) => ({
    id: project.id,
    project_name: project.project_name,
    status: project.status,
    createdAt: project.created_at,
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

export default ProjectList;
