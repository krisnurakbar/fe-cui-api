import * as React from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { dividerClasses } from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MuiMenuItem from '@mui/material/MenuItem';
import { paperClasses } from '@mui/material/Paper';
import { listClasses } from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuButton from './MenuButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import SyncIcon from '@mui/icons-material/Sync';
import projectService from '../services/projectService';
import SyncAltIcon from '@mui/icons-material/SyncAlt';

const MenuItem = styled(MuiMenuItem)({
  margin: '2px 0',
});


const OptionsMenuSyncProject = ({ params }) => {
  // const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false); // Add this line
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // const handleCloseSnackbar = () => {
  //   setOpenSnackbar(false);
  //   setSnackbarMessage('');
  // };

  const handleSync = async () => {
    alert('Background syncing is already in progress. Please wait until it finishes.');
    if (isSyncing) {
      alert('Background syncing is already in progress. Please wait until it finishes.'); 
      return;
    }

    setIsSyncing(true);
    try {
      await projectService.syncProject(params.id);
      alert('Background syncing is complete.'); 
    } catch (error) {
      alert('An error occurred while syncing the project.'); 
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncPlanProgress = async () => {
    alert('Background syncing is already in progress. Please wait until it finishes.');
    if (isSyncing) {
      alert('Background syncing is already in progress. Please wait until it finishes.'); 
      return;
    }

    setIsSyncing(true);
    try {
      await projectService.syncPlanProgressManual(params.id);
      alert('Background syncing Plan Progress is complete.'); 
    } catch (error) {
      alert('An error occurred while syncing the project.'); 
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <React.Fragment>
      <MenuButton
        id="menu-button"
        aria-controls="menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ borderColor: 'transparent' }}
      >
        <CloudSyncIcon />
      </MenuButton>
      <Menu
        anchorEl={anchorEl}
        id="menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          [`& .${listClasses.root}`]: {
            padding: '4px',
          },
          [`& .${paperClasses.root}`]: {
            padding: 0,
          },
          [`& .${dividerClasses.root}`]: {
            margin: '4px -4px',
          },
        }}
      >
        <MenuItem onClick={handleSync}>
          <ListItemIcon>
            <SyncIcon />
          </ListItemIcon>
          Sync with ClickUp
        </MenuItem>
        <MenuItem onClick={handleSyncPlanProgress}>
          <ListItemIcon>
            <SyncAltIcon />
          </ListItemIcon>
          Sync Plan Progress
        </MenuItem>
        <MenuItem
          onClick={() => {
            const url = `${process.env.REACT_APP_API_BASE_URL}/api/task/webhook?project_id=${params.id}&cu_task_id=`;
            navigator.clipboard.writeText(url);
            alert('Link copied to clipboard!');
          }}
        >
          <ListItemIcon>
            <ContentCopyIcon />
          </ListItemIcon>
          Copy Automation Link
        </MenuItem>
      </Menu>
      {/* <Snackbar
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        message={snackbarMessage || "User successfully logged in!"} // Show error message if set, otherwise show success
        autoHideDuration={6000} // Duration before the Snackbar disappears 
      /> */}
    </React.Fragment>
  );
};

export default OptionsMenuSyncProject;