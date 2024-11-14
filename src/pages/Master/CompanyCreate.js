import React, { useState, useEffect } from 'react';
import { Drawer, Paper, Button, TextField, Snackbar, Box } from '@mui/material';
import companiesService from '../../services/companiesService';

const CompanyCreate = ({ open, onClose }) => {
  const [companyName, setCompanyName] = useState('');
  const [status, setStatus] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const modifiedBy = localStorage.getItem('userEmail');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await companiesService.createCompanies({
        name: companyName,
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
          <h2>Create New Company</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Company Name"
              size='small'
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              fullWidth
              margin="normal"
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
        message="Company created successfully!"
      />
    </div>
  );
};

export default CompanyCreate;



