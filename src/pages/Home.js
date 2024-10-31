import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppAppBar from '../components/AppAppBar';
import Hero from '../components/Hero';
import LogoCollection from '../components/LogoCollection';
import Highlights from '../components/Highlights';
import Features from '../components/Features';
import Footer from '../components/Footer';
import { ThemeProvider } from '@mui/material/styles';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import theme from '../components/theme/themePrimitives';

const Home = () => {
  const navigate = useNavigate(); // Hook for programmatic navigation

  const handleGetStarted = () => {
    navigate('/login'); // Navigates to the login page
  };

  return (
    // <Container maxWidth="sm" sx={{ mt: 8 }}>
    //   <Typography variant="h4" component="h1" gutterBottom>
    //     Welcome to Our Application!
    //   </Typography>
    //   <Typography variant="body1" sx={{ mb: 2 }}>
    //     This is the homepage of your application. Here you can find information about how to get started, our features, and more!
    //   </Typography>
    //   <Button variant="contained" color="primary" onClick={handleGetStarted}>
    //     Get Started
    //   </Button>
    // </Container>
    <ThemeProvider theme={theme}>
      <AppAppBar style={{ marginTop: 10 }} />
      <Hero />
      <div>
        {/* <LogoCollection /> */}
        {/* <Features /> */}
        {/* <Divider /> */}
        {/* <Divider /> */}
        {/* <Highlights /> */}
      </div>
    </ThemeProvider>
  );
};

export default Home;
