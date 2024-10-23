import React, { useState, useEffect  } from 'react';
import { Drawer, Paper, Button, TextField, Snackbar, Box } from '@mui/material';
import projectService from '../services/projectService';


const ProjectCreate = ({ open, onClose }) => {
  const [projectName, setProjectName] = useState('');
  const [cuProjectId, setCuProjectId] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [status, setStatus] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const modifiedBy = localStorage.getItem('userEmail');

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Call API to create new project
    try {
      const response = await projectService.projectCreate({
        project_name: projectName,
        cu_project_id: cuProjectId,
        start_date: startDate,
        due_date: dueDate,
        modified_by: modifiedBy,
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
        variant="temporary"  // Ensure this is a temporary drawer for custom positioning
        PaperProps={{
          sx: {
            width: '30%',  // Set the drawer width to 30% of the screen
            position: 'fixed',  // Use fixed positioning to align relative to the viewport
            bottom: 0,  // Keep the drawer at the bottom
            transform: 'none',  // Disable default Drawer transform behavior
            maxWidth: 'none',  // Remove default maxWidth limit
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
        <div style={{ padding: 20 }}>
          <h2>Create New Project</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Project Name"
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="CU Project ID"
              value={cuProjectId}
              onChange={(event) => setCuProjectId(event.target.value)}
              fullWidth
              margin="normal"
            />
            <input type="hidden" value={modifiedBy} />
            <TextField
              label="Start Date"
              type="datetime-local"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }} // add this line
            />
            <TextField
              label="Due Date"
              type="datetime-local"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }} // add this line
            />
            {/* <FormControlLabel
              control={
                <Checkbox
                  checked={status}
                  onChange={(event) => setStatus(event.target.checked)}
                />
              }
              label="Status"
            /> */}
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