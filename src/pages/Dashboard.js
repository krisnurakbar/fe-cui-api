import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // For navigation

const Dashboard = () => {
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const handleLogout = () => {
    console.log("Logging out..."); // Log for debugging
    localStorage.removeItem("userToken"); // Clear the user token from local storage
    navigate('/login'); // Redirect to the login page after logout
    window.location.reload(); // Force a refresh if necessary
  };

  return (
    <Container maxWidth="sm" 
      sx={{ 
        mt: 8,
        display: 'flex',
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: '100vh' // Ensure the Container takes the full height of the viewport
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Welcome to your dashboard! Here you can manage your settings and view your data.
      </Typography>
      
    </Container>
  );
};

export default Dashboard;
