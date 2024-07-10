import logo from './logo.svg';
import './App.css';
import Dashboard from './Pages/Private/Dashboard/Dashboard';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './Pages/Public/LandingPage/LandingPage';
import PrivateRoute from './Pages/Private/PrivateRoute';
import { CssBaseline } from '@mui/material';
import { UserDataProvider } from './Context/UserDataContext';

function App() {
  return (
    <>
    <CssBaseline />
    <Routes>
      <Route exact path='/' element={<LandingPage />} />
      <Route exact path='/dashboard/*' element={<>
          <UserDataProvider>
        <PrivateRoute>
            <Dashboard />
        </PrivateRoute>
          </UserDataProvider>
      </>} />
      
      
    </Routes>
    </>
  );
}

export default App;
