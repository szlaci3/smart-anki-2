import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CardForm from './pages/CardForm';
import EditCard from './pages/EditCard';
import Navigation from './components/Navigation';

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cardForm" element={<CardForm />} />
        <Route path="/editCard/:id" element={<EditCard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
