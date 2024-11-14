import React, { useState, useEffect } from 'react';
import { Drawer, Paper, Button, TextField, Snackbar, Box } from '@mui/material';
import userService from '../../services/userService';
import companiesService from '../../services/companiesService';
import MenuItem from '@mui/material/MenuItem';

const UserCreate = ({ open, onClose }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [status, setStatus] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const modifiedBy = localStorage.getItem('userEmail');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await userService.createUser({
        first_name : firstName,
        last_name : lastName,
        email: email,
        password: password,
        company_id: companyId,
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

  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      const response = await companiesService.getCompanies();
      setCompanies(response.data);
    };
    fetchCompanies();
  }, []);

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
          <h2>Create New User</h2>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                label="First Name"
                size='small'
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                fullWidth
                margin="normal"
                sx={{ flex: 1 }}
              />
              <TextField
                label="Last Name"
                size='small'
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                fullWidth
                margin="normal"
                sx={{ flex: 1 }}
              />
            </Box>
            <TextField
              label="Email"
              size='small'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Password"
              type="password"
              size='small'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              select
              label="Company"
              size='small'
              value={companyId}
              onChange={(event) => setCompanyId(event.target.value)}
              fullWidth
              margin="normal"
            >
              {companies.map((company) => (
                <MenuItem key={company.id} value={company.id}>
                  {company.name}
                </MenuItem>
              ))}
            </TextField>

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

export default UserCreate;


