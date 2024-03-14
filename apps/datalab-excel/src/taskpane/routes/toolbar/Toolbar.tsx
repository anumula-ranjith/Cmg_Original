import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  Popover,
  Toolbar,
  IconButton,
  AppBar,
  Typography,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../../auth/useAuth';
import { useHistory, Link } from 'react-router-dom';

type Props = Readonly<{
  title: string;
}>;

const ToolBar: React.FC<Props> = ({ title }) => {
  const history = useHistory();

  const { resetAuth } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = (event: React.MouseEvent<HTMLLIElement>) => {
    event.preventDefault();
    resetAuth();
    handleCloseMenu();
    history.push('/');
  };

  const isOpen = Boolean(anchorEl);
  const id = isOpen ? 'simple-popover' : undefined;

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleOpenMenu}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">{title}</Typography>
        </Toolbar>
      </AppBar>

      <Popover
        id={id}
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <List>
          <ListItem disablePadding role="menuitem" key="cmg_data">
            <ListItemButton component={Link} to="/TableScreenGlobal">
              <ListItemText primary="CMG Data" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding role="menuitem" key="support">
            <ListItemButton component={Link} to="/Support">
              <ListItemText primary="Support" />
            </ListItemButton>
          </ListItem>
          <ListItem
            disablePadding
            role="menuitem"
            key="logout"
            onClick={event => {
              handleLogout(event);
            }}
          >
            <ListItemButton>
              <ListItemText primary="Log Out" />
            </ListItemButton>
          </ListItem>
        </List>
      </Popover>
    </>
  );
};

export default ToolBar;
