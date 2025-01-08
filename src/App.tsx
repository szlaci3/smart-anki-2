import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from './routes';
import Home from './pages/Home';
import CardForm from './pages/CardForm';
import EditCard from './pages/EditCard';
import React from 'react';

// Map components to paths
const componentMap = {
  '/': Home,
  '/cardForm': CardForm,
  '/editCard': EditCard
};

function App() {
  return (
    <Router>
      <Routes>
        {routes.map((route) => (
          <Route 
          key={route.path} 
          path={route.path} 
          element={React.createElement(componentMap[route.path])}
        />
      ))}
      </Routes>
    </Router>
  );
}

export default App;
