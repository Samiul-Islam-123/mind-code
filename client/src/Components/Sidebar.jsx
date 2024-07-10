import React, { useContext, useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Box, Icon, Divider } from '@mui/material';
import { Home, Logout } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import CodeIcon from '@mui/icons-material/Code';
import { UserButton } from '@clerk/clerk-react';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { ThemeContext } from '../Context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ onOptionSelect }) => {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const {toggleTheme, mode} = useContext(ThemeContext);
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleOptionSelect = (value) => {
    toggleDrawer();
    setSelectedOption(value);
    onOptionSelect(value);

    // Navigate to respective URLs based on selected option
    switch (value) {
      case 'home':
        navigate('/dashboard/');
        break;
      case 'ide':
       navigate('/dashboard/ide');
        break;
      case 'analytics':
       navigate('/dashboard/analytics');
        break;
      case 'logout':
        // Perform logout logic here
        navigate('/dashboard/logout');
        break;
      default:
        break;
    }
  };

  const options = [
    { text: 'Home', icon: <Home />, value: 'home' },
    { text: 'IDE', icon: <CodeIcon />, value: 'ide' },
    { text: 'Analytics', icon: <AnalyticsIcon />, value: 'analytics' },
    { text: 'Logout', icon: <Logout />, value: 'logout' }
  ];

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <IconButton onClick={toggleDrawer}>
          <MenuIcon />
        </IconButton>
        <div style={{
          display : "flex",
          alignItems : "center"
        }}>
          <IconButton onClick={toggleTheme}>
            <Icon>
              {
                mode === "dark" ? (<>
                  <LightModeIcon />
                
                </>) : (<>
                  <DarkModeIcon />
                </>)
              }
            </Icon>
          </IconButton>
          
            <UserButton
              sx={{
                width: 48,
                height: 48
              }}
            />
         
        </div>
      </Box>
      <Divider />
      <Drawer
        open={open}
        onClose={toggleDrawer}
        sx={{
          '& .MuiDrawer-paper': { width: 300 } // Increase the width here
        }}
      >
        <List>
          {options.map((option) => (
            <ListItem
              button
              key={option.text}
              onClick={() => handleOptionSelect(option.value)}
              selected={selectedOption === option.value} // Highlight the selected option
            >
              <ListItemIcon>{option.icon}</ListItemIcon>
              <ListItemText primary={option.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
