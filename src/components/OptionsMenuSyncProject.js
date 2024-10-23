import * as React from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Divider, { dividerClasses } from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MuiMenuItem from '@mui/material/MenuItem';
import { paperClasses } from '@mui/material/Paper';
import { listClasses } from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon, { listItemIconClasses } from '@mui/material/ListItemIcon';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import MenuButton from './MenuButton';
import InsightsIcon from '@mui/icons-material/Insights';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import SyncIcon from '@mui/icons-material/Sync';
import projectService from '../services/projectService';

const MenuItem = styled(MuiMenuItem)({
  margin: '2px 0',
});


const OptionsMenuSyncProject = ({ params }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);
  

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
        <MenuItem
        onClick={() => {
          if (isSyncing) {
            alert('Background syncing is already in progress. Please wait until it finishes.');
          } else {
            setIsSyncing(true);
            projectService.syncProject(params.id).then(() => {
              setIsSyncing(false);
              alert('Background syncing is complete.');
            });
          }
        }}
      >
        <ListItemIcon>
          <SyncIcon />
        </ListItemIcon>
        Sync with ClickUp
      </MenuItem>
        <MenuItem
        onClick={() => {
            const url = `https://be-cui-api.vercel.app/api/task/webhook?project_id=${params.id}&cu_task_id=`;
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
    </React.Fragment>
  );
};

export default OptionsMenuSyncProject;