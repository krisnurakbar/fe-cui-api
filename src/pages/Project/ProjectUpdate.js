import React, { useState, useEffect } from 'react';
import { Drawer, Button, TextField, Snackbar, Box, MenuItem } from '@mui/material';
import projectService from '../../services/projectService';
import dayjs from 'dayjs';

const ProjectUpdate = ({ open, onClose, currentData }) => {
    const [projectName, setProjectName] = useState('');
    const [cuProjectId, setCuProjectId] = useState('');
    const [status, setStatus] = useState(1);
    const [startDate, setStartDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [auto, setAuto] = useState(true);
    const [projectType, setProjectType] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    // Update form fields when currentData changes
    useEffect(() => {
      if (currentData) {
        setProjectName(currentData.project_name || '');
        setCuProjectId(currentData.cu_project_id || '');
        setStatus(currentData.status || 1);
        setStartDate(currentData.start_date ? dayjs(currentData.start_date).format('YYYY-MM-DD') : '');
        setDueDate(currentData.due_date ? dayjs(currentData.due_date).format('YYYY-MM-DD') : '');
        setAuto(currentData.auto || true);
        setProjectType(currentData.project_type || '');
      }
    }, [currentData]);

    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        const response = await projectService.projectUpdate(currentData.id, {
          id: currentData.id,
          project_name: projectName,
          cu_project_id: cuProjectId,
          status: status,
          start_date: startDate,
          due_date: dueDate,
          auto: auto,
          project_type: projectType,
        });
        if (response.status === 200) {
          setOpenSnackbar(true);
          onClose();
          window.location.reload();
        }
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
          <h2>Update Project</h2>
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
              label="Status"
              select
              size='small'
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              fullWidth
              margin="normal"
            >
              <MenuItem value={1}>Active</MenuItem>
              <MenuItem value={0}>Inactive</MenuItem>
            </TextField>
            <TextField
              label="Start Date"
              size='small'
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Due Date"
              size='small'
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary">
              Update Project
            </Button>
          </form>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={2000}
            onClose={() => setOpenSnackbar(false)}
            message="Project updated successfully"
          />
        </Box>
      </Drawer>
      </div>
    );
};

export default ProjectUpdate;
