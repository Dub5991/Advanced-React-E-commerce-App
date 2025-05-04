import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import AdminProducts from './AdminProducts';
import OrderManagement from './OrderManagement';
import Products from './Products';
import ShoppingCart from './ShoppingCart';
import { Navbar, Nav, Button, Badge } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const Home: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false); // Admin access control
  const [view, setView] = useState<'products' | 'orders' | 'admin' | 'cart'>('products'); // View state
  const navigate = useNavigate();
  const cartItemCount = useSelector((state: RootState) => state.cart.items.length); // Cart item count

  // Fetch user profile and check admin role
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists() && userDoc.data().role === 'admin') {
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="container mt-4">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary">
          Welcome to Our Store{auth.currentUser && `, ${auth.currentUser.email}`}
        </h1>
        <div className="d-flex align-items-center">
            <Button
            variant="warning"
            className="me-2"
            onClick={() => setIsAdmin((prev) => !prev)}
            style={{ padding: '2px 8px', fontSize: '0.8rem' }}
            >
            Toggle Admin Access
            </Button>
            <Button
            variant="light"
            className="me-3 position-relative"
            onClick={() => setView('cart')}
            style={{ height: '50px', width: 'auto' }}
            >
            🛒
            {cartItemCount > 0 && (
              <Badge
              bg="danger"
              pill
              className="position-absolute top-0 start-100 translate-middle"
              >
              {cartItemCount}
              </Badge>
            )}
            </Button>
            <Button
            variant="danger"
            onClick={handleLogout}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              zIndex: 1000,
            }}
            >
            Logout
            </Button>
        </div>
      </div>

      {/* Navigation Bar */}
      <Navbar bg="light" expand="lg" className="mb-4">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              className={view === 'products' ? 'active' : ''}
              onClick={() => setView('products')}
            >
              Products
            </Nav.Link>
            <Nav.Link
              className={view === 'orders' ? 'active' : ''}
              onClick={() => setView('orders')}
            >
              Order History
            </Nav.Link>
            {isAdmin && (
              <Nav.Link
                className={view === 'admin' ? 'active' : ''}
                onClick={() => setView('admin')}
              >
                Admin Panel
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Conditional Rendering Based on View */}
      {view === 'products' && <Products />}
      {view === 'orders' && <OrderManagement />}
      {view === 'admin' && isAdmin && <AdminProducts />}
      {view === 'cart' && <ShoppingCart />}
    </div>
  );
};

export default Home;