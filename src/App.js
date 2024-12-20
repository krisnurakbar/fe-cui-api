import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './components/theme/themePrimitives';
import Login from './pages/Login';
import Register from './pages/Register';
import UserList from './pages/UserList';
import ProjectList from './pages/ProjectList';
import TaskList from './pages/TaskList';
import ProjectTaskList from './pages/ProjectTaskList';
import Scurve from './pages/Scurve';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import { isLoggedIn } from './utils/auth';
import './App.css';
import AppNavbar from './components/AppNavbar';
import SideMenu from './components/SideMenu';
import { Box, Stack } from '@mui/material';


const App = () => {
  const loggedIn = isLoggedIn();

  const commonRoutes = [
    { path: "/login", element: loggedIn ? <Navigate to="/dashboard" /> : <Login /> },
    { path: "/register", element: loggedIn ? <Navigate to="/dashboard" /> : <Register /> },
    { path: "/users", element: loggedIn ? <UserList /> : <Navigate to="/login" /> },
    { path: "/dashboard", element: loggedIn ? <Dashboard /> : <Navigate to="/login" /> },
    { path: "/home", element: loggedIn ? <Navigate to="/dashboard" /> : <Home /> },
    { path: "/projects", element: loggedIn ? <ProjectList /> : <Navigate to="/login" /> },
    { path: "/", element: loggedIn ? <Navigate to="/dashboard" /> : <Home /> },
    { path: "/tasks", element: loggedIn ? <TaskList /> : <Navigate to="/login" /> }, // Corrected Navigate path
    { path: "/tasks/project/:project_id", element: loggedIn ? <ProjectTaskList /> : <Navigate to="/login" /> }, // Corrected Navigate path
    //{ path: "/:projectId/progress",element: loggedIn ? <Scurve /> : <Navigate to="/login" /> }, // Corrected Navigate path
  ];

  const annonymousRoutes = [
    { path: "project/:projectId/s-curve", element: <Scurve /> }, // Removed loggedIn check
  ];

  return (
    <ThemeProvider theme={theme}>
      <Router>
        {loggedIn && (
          <>
            <SideMenu />
            <AppNavbar />
          </>
        )}
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            ml: loggedIn ? '240px' : '0', 
            p: 2 
          }}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 1,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            {loggedIn && <Header sx={{ mt: 0, pt: 0 }} />}
            <Routes>
              {commonRoutes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
            </Routes>
            {/* Render anonymous routes without theme */}
            <Routes>
              {annonymousRoutes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
            </Routes>
          </Stack>

        </Box>
      </Router>
      
    </ThemeProvider>
  );
};

// Error boundary component for error handling
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error occurred:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children; 
  }
}

export default () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
