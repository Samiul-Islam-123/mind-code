import React, { useState } from 'react';
import Sidebar from '../../../Components/Sidebar';
import { Container, Typography } from '@mui/material';
import Home from '../../../Components/DasboardComponents/Home';
import IDE from '../../../Components/DasboardComponents/IDE';
import Analytics from '../../../Components/DasboardComponents/Analytics';
import Logout from '../../../Components/DasboardComponents/Logout';
import { Route , Routes} from 'react-router-dom';
import ProjectDetails from '../../../Components/CustomUIComponents/ProjectDetails';
import { SocketContextProvider } from '../../../Context/SocketContext';

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState('home');

  const renderContent = () => {
    switch (selectedOption) {
      case 'home':
        return <Home />;
      
      case 'ide':
        return <IDE />;
      case 'analytics':
        return <Analytics />;
      case 'logout':
        return <Logout />;
      default:
        return <Typography variant="h4">Home Content</Typography>;
    }
  };

  return (
    <Container
        maxWidth="xxl"
        sx={{
          flexGrow: 1,
          
        }}
      >
      <Sidebar onOptionSelect={setSelectedOption} />
      <div>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route 
            path='/ide/:projectID' 
            element={
              <SocketContextProvider>
                <IDE />
              </SocketContextProvider>
            } 
          />
          <Route path='/analytics' element={<Analytics />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/project/:projectID' element={<ProjectDetails />} />
          
        </Routes>
      </div>
    </Container>
  );
};

export default Dashboard;
