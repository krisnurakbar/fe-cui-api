import React, { useState, useEffect } from 'react';
import { Drawer, Paper, Button, TextField, Snackbar, Box } from '@mui/material';
import projectService from '../../services/projectService';

const ProjectCreate = ({ open, onClose }) => {
  const [projectName, setProjectName] = useState('');
  const [cuProjectId, setCuProjectId] = useState('');
  const [projectType, setProjectType] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [status, setStatus] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const modifiedBy = localStorage.getItem('userEmail');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await projectService.projectCreate({
        project_name: projectName,
        cu_project_id: cuProjectId,
        start_date: startDate,
        due_date: dueDate,
        modified_by: modifiedBy,
        project_type: projectType,
        company_id: localStorage.getItem('companyId'),
        status: status ? 1 : 0,
      });
      if (response.status === 201) {
        setOpenSnackbar(true);
        onClose();
        window.location.reload();
      }
      console.log(response);
    } catch (error) {
      setOpenSnackbar(true);
      console.error(error);
    }
  };

  return (
    <div>
      <Drawer
          anchor="right"
          open={open}
          onClose={onClose}
          variant="temporary"
          PaperProps={{
            sx: {
              width: '30%',
              position: 'fixed',
              bottom: 0,
              transform: 'none',
              maxWidth: 'none',
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10,
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
              marginRight: 2,
              marginTop: 1,
              marginBottom: 1,
              overflowY: 'auto', // Ensures the drawer is scrollable
              maxHeight: '97vh', // Set max height for scrolling to activate
            },
          }}
        >
        <Box sx={{ p: 2 }}>
        <div style={{ padding: 20 }}>
          <h2>Create New Project</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Project Name"
              size='small'
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="CU Project ID"
              size='small'
              value={cuProjectId}
              onChange={(event) => setCuProjectId(event.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              select
              label="Project Type"
              size='small'
              value={projectType}
              onChange={(event) => setProjectType(event.target.value)}
              fullWidth
              margin="normal"
              SelectProps={{
                shrink: true,
                native: true,
              }}
            >
              <option value=""></option>
              <option value="New Development">New Development</option>
              <option value="Enhancement">Enhancement</option>
            </TextField>
            <input type="hidden" value={modifiedBy} />
            <TextField
              label="Start Date"
              size='small'
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true, format: 'YYYY-MM-DD', }}
            />
            <TextField
              label="Due Date"
              size='small'
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true, format: 'YYYY-MM-DD', }}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ width: '100%', marginTop: 2 }}
            >
              Submit
            </Button>
          </form>
        </div>
        </Box>
      </Drawer>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message="Project created successfully!"
      />
    </div>
  );
};

export default ProjectCreate;

