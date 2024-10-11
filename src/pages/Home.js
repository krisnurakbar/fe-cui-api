import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate(); // Hook for programmatic navigation

  const handleGetStarted = () => {
    navigate('/login'); // Navigates to the login page
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to Our Application!
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        This is the homepage of your application. Here you can find information about how to get started, our features, and more!
      </Typography>
      <Button variant="contained" color="primary" onClick={handleGetStarted}>
        Get Started
      </Button>
    </Container>
  );
};

export default Home;
