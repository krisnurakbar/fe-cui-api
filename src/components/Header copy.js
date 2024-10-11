import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { isLoggedIn } from '../utils/auth'; // Import the auth check function
import { useNavigate } from 'react-router-dom'; // For navigation

export default function ButtonAppBar() {
  const loggedIn = isLoggedIn(); // Check login status and log it
  const navigate = useNavigate(); // Use the navigate function from react-router-dom
  const handleLogout = () => {
    console.log("Logging out..."); // Log for debugging
    localStorage.removeItem("userToken"); // Clear the user token from local storage
    navigate('/login'); // Redirect to the login page after logout
    window.location.reload(); // Force a refresh if necessary
  };


  return (
  <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Home
        </Typography>
        
        {/* Render the Button only if not logged in */}
        {!loggedIn && (
          <Button 
            variant='h6'
            component={Link} 
            color="inherit"
            onClick={handleLogout}
          >
            Login 
          </Button>
        )}
        {loggedIn && (
          <Button 
            variant='h6'
            component={Link} 
            color="inherit"
            to="/"
          >
            Dashboard
          </Button>
        )}
        {loggedIn && (
          <Button 
            variant='h6'
            component={Link} 
            color="inherit"
            to="/users"
          >
            Users
          </Button>
        )}
        
      </Toolbar>
    </AppBar>
  </Box>
);

}
