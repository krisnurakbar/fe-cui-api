import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Link, Snackbar } from '@mui/material';
import authService from '../services/authService.js'; // Importing the authentication service
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for navigation

const Login = () => {
  const [email, setEmail] = useState(''); // State for email
  const [password, setPassword] = useState(''); // State for password
  const [openSnackbar, setOpenSnackbar] = useState(false); // State for Snackbar visibility
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const navigate = useNavigate(); // Hook for programmatic navigation

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await authService.login({ email, password }); // Call the login service

      if (response.status === 200 || response.status === 201) {
        localStorage.setItem("userToken", response.data.token); // Store the token
        localStorage.setItem("userEmail", response.data.email);
        localStorage.setItem("userRole", response.data.role);
        localStorage.setItem("companyId", response.data.company_id);
        localStorage.setItem("firstName", response.data.first_name);

        setOpenSnackbar(true); // Show Snackbar for success
        setTimeout(() => {
          navigate('/dashboard'); // Redirect to dashboard after success
        }, 2000); // 2 seconds delay before redirect
        window.location.reload(); // Force a refresh if necessary
      }

    } catch (err) {
      // Custom error handling for 401 status
      if (err.response && err.response.status === 401) {
        setErrorMessage('Unauthorized: Invalid email or password.'); // Message for 401 error
      } else {
        setErrorMessage(err.response ? err.response.data.message : 'Login failed, please try again.'); // Show generic error message for other errors
      }
      
      setOpenSnackbar(true); // Show Snackbar for error
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false); // Close the Snackbar
    setErrorMessage(''); // Clear the error message after closing
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ 
        mt: 8,
        display: 'flex',
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh' // Ensure the Container takes the full height of the viewport
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Handle email input change
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Handle password input change
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Login
        </Button>
      </form>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Don't have an account?{' '}
        <Link href="/register" variant="body2">Register</Link> {/* Link to register */}
      </Typography>

      {/* Snackbar Message for Success/Error */}
      <Snackbar
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        message={errorMessage || "User successfully logged in!"} // Show error message if set, otherwise show success
        autoHideDuration={6000} // Duration before the Snackbar disappears 
      />
    </Container>
  );
};

export default Login;
