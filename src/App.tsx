import './css/App.css'
import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './pages/Home';
import CardForm from "./pages/CardForm";
import List from "./pages/List";
import Navigation from './components/Navigation';

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/list" element={<List />} />
        <Route path="/cardForm" element={<CardForm />} />
        <Route path="/cardForm/:id" element={<CardForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
