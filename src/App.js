import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './components/theme/themePrimitives';
import Login from './pages/Login';
import Register from './pages/Register';
import UserList from './pages/Master/UserList';
import ProjectList from './pages/Project/ProjectList';
import TaskList from './pages/TaskList';
import ProjectTaskList from './pages/ProjectProgress/ProjectTaskList';
import Scurve from './pages/Scurve';
import ScurveCost from './pages/ScurveCost';
import ScurveValue from './pages/ScurveValue';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import { isLoggedIn } from './utils/auth';
import './App.css';
import AppNavbar from './components/AppNavbar';
import SideMenu from './components/SideMenu';
import { Box, Stack } from '@mui/material';
import ProjectCreate from './pages/Project/ProjectCreate';
import CompanyList from './pages/Master/CompanyList';


const App = () => {
  const loggedIn = isLoggedIn();
  const location = useLocation(); 

  const commonRoutes = [
    { path: "/login", element: loggedIn ? <Navigate to="/dashboard" /> : <Login /> },
    { path: "/register", element: loggedIn ? <Navigate to="/dashboard" /> : <Register /> },
    { path: "/users", element: loggedIn ? <UserList /> : <Navigate to="/login" /> },
    { path: "/companies", element: loggedIn ? <CompanyList /> : <Navigate to="/login" /> },
    { path: "/dashboard", element: loggedIn ? <Dashboard /> : <Navigate to="/login" /> },
    { path: "/home", element: loggedIn ? <Navigate to="/dashboard" /> : <Home /> },
    { path: "/projects", element: loggedIn ? <ProjectList /> : <Navigate to="/login" /> },
    { path: "/", element: loggedIn ? <Navigate to="/dashboard" /> : <Home /> },
    { path: "/tasks", element: loggedIn ? <TaskList /> : <Navigate to="/login" /> },
    { path: "/tasks/:cu_project_id", element: loggedIn ? <ProjectTaskList /> : <Navigate to="/login" /> },
    { path: "/projects/create", element: loggedIn ? <ProjectCreate /> : <Navigate to="/login" /> },
  ];

  const anonymousRoutes = [
    { path: "/project/s-curve/:projectId", element: <Scurve /> },
    { path: "/project/s-curve-cost/:projectId", element: <ScurveCost /> },
    { path: "/project/s-curve-value/:projectId", element: <ScurveValue /> },
  ];

  // Updated isAnonymousRoute logic to handle dynamic parameters
  const isAnonymousRoute = anonymousRoutes.some(route => {
    const pathWithoutParams = route.path.split('/:')[0];
    return location.pathname.startsWith(pathWithoutParams);
  });

  return (
    <ThemeProvider theme={theme}>
      <>
        {/* Render SideMenu and AppNavbar only for logged-in users and not on anonymous routes */}
        {loggedIn && !isAnonymousRoute && (
          <>
            <SideMenu />
            <AppNavbar />
          </>
        )}
        
        <Box
          component="main"
          sx={{
            flexGrow: 1, // Allow the Box to grow and fill the available space
            overflow: 'auto',
            ml: loggedIn && !isAnonymousRoute ? '240px' : '0',
            pl: 2,
            pr: 2,
            height: '100vh', // Full viewport height
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Stack
            spacing={1}
            sx={{
              alignItems: 'center',
              mx: 1,
              pb: 1,
              mt: { xs: 8, md: 0 },
            }}
          >
            {/* Render Header only for logged-in users and not on anonymous routes */}
            {loggedIn && !isAnonymousRoute && <Header sx={{ mt: 0, pt: 0 }} />}
            
            <Routes>
              {/* Include common routes */}
              {commonRoutes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
              {/* Include anonymous routes */}
              {anonymousRoutes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
            </Routes>
          </Stack>
        </Box>
      </>
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

// Root component wrapping the App in a Router
const Root = () => (
  <ErrorBoundary>
    <Router>
      <App />
    </Router>
  </ErrorBoundary>
);

export default Root;
