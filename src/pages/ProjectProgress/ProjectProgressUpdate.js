import React, { useState, useEffect } from 'react';
import { Drawer, Button, TextField, Snackbar, Box } from '@mui/material';
import projectProgressService from '../../services/projectProgressService';

const ProjectProgressUpdate = ({ open, onClose, currentData }) => {
  const [weekNo, setWeekNo] = useState('');
  const [reportDate, setReportDate] = useState(null);
  const [planProgress, setPlanProgress] = useState('');
  const [actualProgress, setActualProgress] = useState('');
  const [planCost, setPlanCost] = useState('');
  const [actualCost, setActualCost] = useState('');
  const [spi, setSpi] = useState('');
  const [cpi, setCpi] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const modifiedBy = localStorage.getItem('userEmail');
  const [planValue, setPlanValue] = useState('');
  const [actualValue, setActualValue] = useState('');

  // Update form fields when currentData changes
  useEffect(() => {
    if (currentData) {
      setWeekNo(currentData.week_no || '');
      setReportDate(currentData.report_date || '');
      setPlanProgress(currentData.plan_progress || '');
      setActualProgress(currentData.actual_progress || '');
      setPlanCost(currentData.plan_cost || '');
      setActualCost(currentData.actual_cost || '');
      setSpi(currentData.spi || '');
      setCpi(currentData.cpi || '');
      setPlanValue(currentData.plan_value || '');
      setActualValue(currentData.actual_value || '');
    }
  }, [currentData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await projectProgressService.projectProgressUpdate(currentData.id, {
        id: currentData.id,
        project_id: currentData.project_id,
        week_no: weekNo,
        report_date: reportDate,
        plan_progress: planProgress.replace(' %', ''),
        actual_progress: actualProgress.replace(' %', ''),
        plan_cost: planCost,
        actual_cost: actualCost,
        spi: spi,
        cpi: cpi,
        modified_by: modifiedBy,
        plan_value: planValue,
        actual_value: actualValue,
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
            overflowY: 'auto',
            maxHeight: '97vh',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <div style={{ padding: 20 }}>
            <h2>Update Progress</h2>
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <TextField
                  label="Plan Value"
                  size='small'
                  value={planValue}
                  onChange={(event) => setPlanValue(event.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Actual Value"
                  size='small'
                  value={actualValue}
                  onChange={(event) => setActualValue(event.target.value)}
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
                Update
              </Button>
            </form>
          </div>
        </Box>
      </Drawer>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message="Project progress updated successfully!"
      />
    </div>
  );
};

export default ProjectProgressUpdate;