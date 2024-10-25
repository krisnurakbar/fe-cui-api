import * as React from 'react';
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

const MenuItem = styled(MuiMenuItem)({
  margin: '2px 0',
});

const OptionsMenuProject = ({ params }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

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
        <InsightsIcon />
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
        <MenuItem onClick={() => {
            const url = `/project/s-curve/${params.id}`;
            window.open(url, '_blank');
        }}>
          <ListItemIcon>
            <VisibilityIcon />
          </ListItemIcon>
          View S-Curve
        </MenuItem>
        <MenuItem
        onClick={() => {
            const url = `${process.env.DOMAIN}/project/s-curve/${params.id}`;
            navigator.clipboard.writeText(url);
            alert('Link copied to clipboard!');
        }}
        >
          <ListItemIcon>
            <ContentCopyIcon />
          </ListItemIcon>
          Copy Link
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default OptionsMenuProject;