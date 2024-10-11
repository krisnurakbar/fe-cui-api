import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Link, Snackbar } from '@mui/material';
import authService from '../services/authService.js';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false); // State for Snackbar
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.register({
        email,
        password,
        status: true // Added status as a static field
      });
      if (response.status === 201) {
        setOpenSnackbar(true); // Open the Snackbar on successful registration
        setTimeout(() => {
          navigate('/login'); // Redirect to the login page after a short delay
        }, 2000); // Adjust the delay as needed
      }
    } catch (err) {
      console.error(err); // Handle error
    }
  };

  // Function to close the Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Register
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }} // Margin bottom for spacing
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }} // Margin bottom for spacing
        />
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Register
        </Button>
      </form>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Already have an account?{' '}
        <Link href="/login" variant="body2">Login</Link>
      </Typography>

      {/* Snackbar for success message */}
      <Snackbar
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        message="User successfully registered!"
        autoHideDuration={6000} // Automatically close after 6 seconds
      />
    </Container>
  );
};

export default Register;
