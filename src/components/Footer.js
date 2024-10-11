import React from 'react';
import { Box, Typography } from '@mui/material';

function App() {
  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '91.2vh', // Full height of the viewport
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        {/* Main content area */}
        {/* Add your content here */}
      </Box>
      <Footer />
    </Box>
  );
}

const Footer = () => {
  return (
    <Box 
      sx={{ 
        bgcolor: 'primary.main', 
        color: 'white', 
        p: 2, 
        textAlign: 'center' 
      }} 
      component="footer"
    >
      <Typography variant="body1">
        &copy; 2024 My App
      </Typography>
    </Box>
  );
};

export default App;
