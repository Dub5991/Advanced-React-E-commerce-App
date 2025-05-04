import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import ShoppingCart from './components/ShoppingCart';
import OrderManagement from './components/OrderManagement'; // Combined OrderHistory and OrderDetails
import AdminProducts from './components/AdminProducts'; // Admin interface for product management
import AdminProductDetails from './components/AdminProductDetails'; // Admin interface for product details
import NotFound from './components/NotFound'; // Import NotFound component
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        // Check if the user is an admin
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Show a loading spinner while determining authentication state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

      {/* Private Routes */}
      <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
      <Route path="/cart" element={user ? <ShoppingCart /> : <Navigate to="/login" />} />
      <Route path="/orders" element={user ? <OrderManagement /> : <Navigate to="/login" />} />
      <Route path="/orders/:orderId" element={user ? <OrderManagement /> : <Navigate to="/login" />} />

      {/* Admin Routes */}
      <Route
        path="/admin/products"
        element={user && isAdmin ? <AdminProducts /> : <Navigate to="/" />}
      />
      <Route 
        path="/admin/products/:productId"
        element={user && isAdmin ? <AdminProductDetails /> : <Navigate to="/" />}
      />

      {/* Catch-All Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;