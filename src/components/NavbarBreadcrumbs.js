import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { useLocation } from 'react-router-dom'; // Import useLocation to track the current route

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

export default function NavbarBreadcrumbs() {
  const location = useLocation(); // Get the current location
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  useEffect(() => {
    // Logic to determine breadcrumbs based on location.pathname
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const updatedBreadcrumbs = pathSegments.map((segment, index) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1), // Capitalize the first letter
      path: '/' + pathSegments.slice(0, index + 1).join('/'), // Create path for each breadcrumb
    }));
    setBreadcrumbs(updatedBreadcrumbs);
  }, [location]); // Update breadcrumbs when location changes

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      {breadcrumbs.map((breadcrumb, index) => (
        <Typography
          key={index}
          variant="body1"
          sx={ index === breadcrumbs.length - 1 ? { color: 'text.primary', fontWeight: 600 } : {} }
        >
          {breadcrumb.label}
        </Typography>
      ))}
    </StyledBreadcrumbs>
  );
}
