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
            <input type="hidden" value={modifiedBy} />
            <TextField
              label="Start Date"
              size='small'
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true, format: 'YYYY-MM-DD', }} // add this line
            />
            <TextField
              label="Due Date"
              size='small'
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true, format: 'YYYY-MM-DD', }} // add this line
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