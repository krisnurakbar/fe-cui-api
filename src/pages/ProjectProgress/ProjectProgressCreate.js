import React, { useState } from 'react';
import { Drawer, Paper, Button, TextField, Snackbar, Box } from '@mui/material';
import projectProgressService from '../../services/projectProgressService';
import { useParams } from 'react-router-dom';

const ProjectProgressCreate = ({ open, onClose }) => {
  const { project_id } = useParams();
  const [weekNo, setWeekNo] = useState('');
  const [reportDate, setReportDate] = useState(null);
  const [planProgress, setPlanProgress] = useState('');
  const [actualProgress, setActualProgress] = useState('');
  const [planCost, setPlanCost] = useState('0');
  const [actualCost, setActualCost] = useState('0');
  const [spi, setSpi] = useState('0');
  const [cpi, setCpi] = useState('0');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const modifiedBy = localStorage.getItem('userEmail');

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Call API to create new project progress
    try {
      const response = await projectProgressService.projectProgressCreate({
        project_id: project_id,
        week_no: weekNo,
        report_date: reportDate,
        plan_progress: parseFloat(planProgress),
        actual_progress: parseFloat(actualProgress),
        plan_cost: parseFloat(planCost),
        actual_cost: parseFloat(actualCost),
        spi: parseFloat(spi),
        cpi: parseFloat(cpi),
        modified_by: modifiedBy,
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
            <h2>Add New Progress</h2>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Week No"
                size='small'
                value={weekNo}
                onChange={(event) => setWeekNo(event.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Report Date"
                size='small'
                type="date"
                value={reportDate}
                onChange={(event) => setReportDate(event.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <TextField
                  label="Plan Progress"
                  size='small'
                  value={planProgress}
                  onChange={(event) => setPlanProgress(event.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Actual Progress"
                  size='small'
                  value={actualProgress}
                  onChange={(event) => setActualProgress(event.target.value)}
                  fullWidth
                  margin="normal"
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <TextField
                  label="Plan Cost"
                  size='small'
                  value={planCost}
                  onChange={(event) => setPlanCost(event.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Actual Cost"
                  size='small'
                  value={actualCost}
                  onChange={(event) => setActualCost(event.target.value)}
                  fullWidth
                  margin="normal"
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <TextField
                  label="SPI"
                  size='small'
                  value={spi}
                  onChange={(event) => setSpi(event.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="CPI"
                  size='small'
                  value={cpi}
                  onChange={(event) => setCpi(event.target.value)}
                  fullWidth
                  margin="normal"
                />
              </Box>
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
        message="Project progress created successfully!"
      />
    </div>
  );
};

export default ProjectProgressCreate;
