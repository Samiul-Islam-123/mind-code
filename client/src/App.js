import logo from './logo.svg';
import './App.css';
import Dashboard from './Pages/Private/Dashboard/Dashboard';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './Pages/Public/LandingPage/LandingPage';
import PrivateRoute from './Pages/Private/PrivateRoute';
import { CssBaseline } from '@mui/material';

function App() {
  return (
    <>
    <CssBaseline />
    <Routes>
      <Route exact path='/' element={<LandingPage />} />
      <Route exact path='/dashboard/*' element={<>
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      </>} />
      
      
    </Routes>
    </>
  );
}

export default App;
