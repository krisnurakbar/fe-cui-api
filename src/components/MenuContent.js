import * as React from 'react';
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import { Divider } from '@mui/material';

const mainListItems = [
  { text: 'Home', icon: <HomeRoundedIcon />, link: '/' },
  { text: 'Projects', icon: <AnalyticsRoundedIcon />, link: '/projects' },
  // { text: 'Tasks', icon: <AssignmentRoundedIcon />, link: '/tasks' },
];

const secondaryListItems = [
  { text: 'Users', icon: <PeopleRoundedIcon />, link: '/users' },
];

export default function MenuContent() {
  // Retrieve userRole from local storage
  const userRole = localStorage.getItem('userRole'); // Adjust the key based on your setup

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton component={Link} to={item.link} selected={index === 0}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      {/* Conditionally render secondary list items based on userRole */}
      {userRole === 'Admin' && (
        <List dense>
          <ListItem>
            <ListItemText primary="Master" /> {/* Add "Master" text here */}
          </ListItem>
          {secondaryListItems.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: 'block' }}>
              <ListItemButton component={Link} to={item.link}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Stack>
  );
}
