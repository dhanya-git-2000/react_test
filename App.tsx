import React ,{ useState }from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import FirstPage from './components/firstpage.tsx';
import sidebar from './components/sidebar.tsx'
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FirstPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
