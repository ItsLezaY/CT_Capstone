import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { FirebaseAppProvider } from 'reactfire';
import 'firebase/auth';


//internal imports
import { Home, Auth, Profile } from './components';
import './index.css'
import { theme } from './Theme/themes';
import { firebaseConfig } from './firebaseConfig';
import { Dashboard } from './components/Dashboard/Dashboard';



// my main page's center div -- will come back to change to div
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <ThemeProvider theme = {theme}>
      <Router>
        <Routes>
          <Route path='/' element = {<Home title = {"TrackerXI"}/>} />
          <Route path='/auth' element = {<Auth title={''}/>} />
          <Route path='/profile' element = {<Profile/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
        </Routes>
      </Router>
      </ThemeProvider>
    </FirebaseAppProvider>
  </React.StrictMode>,
)
