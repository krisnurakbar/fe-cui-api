import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // For navigation
import QuadrantGraph from '../components/QuadrantGraph';

const Dashboard = () => {
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const points = [
    { x: 50, y: 50 },
    { x: -50, y: 50 },
    { x: 50, y: -50 },
    { x: -50, y: -50 },
  ];

  const handleLogout = () => {
    console.log("Logging out..."); // Log for debugging
    localStorage.removeItem("userToken"); // Clear the user token from local storage
    navigate('/login'); // Redirect to the login page after logout
    window.location.reload(); // Force a refresh if necessary
  };

  return (
    <Paper sx={{ height: 'calc(81vh - 0px)', width: '100%', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'left', paddingLeft: 2, paddingRight: 2 }}>
        <QuadrantGraph />
      </Box>
    </Paper>
  );
};

export default Dashboard;

