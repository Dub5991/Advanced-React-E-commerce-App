import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import { ShoppingCart } from './components/ShoppingCart';
import 'bootstrap/dist/css/bootstrap.min.css';

// Main App component with routing setup
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Home page */}
        <Route path="/cart" element={<ShoppingCart />} /> {/* Shopping cart page */}
      </Routes>
    </Router>
  );
};

export default App;