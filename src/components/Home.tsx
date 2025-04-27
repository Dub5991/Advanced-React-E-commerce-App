import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { useNavigate } from 'react-router-dom';
import { fetchCategories, fetchProducts } from '../services/api';
import { Product } from '../types';
import { RootState } from '../redux/store';

const Home: React.FC = () => {
  // Redux dispatch function to trigger actions
  const dispatch = useDispatch();
  // React Router's navigate function to programmatically navigate between routes
  const navigate = useNavigate();
  // State to track the selected category for filtering products
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  // State to track the product being added to the cart for the toast notification
  const [toastProduct, setToastProduct] = useState<Product | null>(null);
  // State to control the visibility of the toast notification
  const [showToast, setShowToast] = useState(false);

  // Selector to get cart items from the Redux store
  const cartItems = useSelector((state: RootState) => state.cart.items);
  // Calculate the total number of items in the cart
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Fetch categories using react-query
  const { data: categories = [], isLoading: categoriesLoading, isError: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Fetch products based on the selected category using react-query
  const { data: products = [], isLoading: productsLoading, isError: productsError } = useQuery({
    queryKey: ['products', selectedCategory || 'all'],
    queryFn: () => fetchProducts(selectedCategory),
  });

  // Function to handle adding a product to the cart
  const handleAddToCart = (product: Product) => {
    const cartItem = { ...product, quantity: 1 }; // Create a cart item with quantity 1
    dispatch(addToCart(cartItem)); // Dispatch the addToCart action
    setToastProduct(product); // Set the product for the toast notification
    setShowToast(true); // Show the toast notification

    // Automatically hide the toast after 3 seconds
    setTimeout(() => {
      setShowToast(false); // Hide the toast
      setTimeout(() => setToastProduct(null), 300); // Clear the product after fade-out
    }, 3000);
  };

  // Show a loading spinner while categories or products are being fetched
  if (categoriesLoading || productsLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Show an error message if there is an issue fetching data
  if (categoriesError || productsError) {
    return <div>Error loading data. Please try again later.</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4 text-primary">Welcome to Our Store</h1>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          {/* Dropdown to filter products by category */}
          <label htmlFor="category-select" className="form-label me-2 fw-bold">
            Filter by Category:
          </label>
          <select
            id="category-select"
            className="form-select d-inline-block w-auto"
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || undefined)}
          >
            <option value="">All Categories</option>
            {categories.map((category: string) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        {/* Button to navigate to the cart page */}
        <button className="btn btn-outline-primary position-relative" onClick={() => navigate('/cart')}>
          <i className="bi bi-cart"></i> View Cart
          {cartItemCount > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>
      <div className="row g-4">
        {/* Display products in a grid */}
        {products.map((product: Product) => (
          <div key={product.id} className="col-lg-3 col-md-4 col-sm-6">
            <div className="card h-100 shadow-sm border-0">
              {/* Product image */}
              <img
                src={product.image}
                className="card-img-top p-3"
                alt={product.title}
                style={{ objectFit: 'contain', height: '250px' }}
              />
              <div className="card-body d-flex flex-column">
                {/* Product details */}
                <h5 className="card-title text-truncate">{product.title}</h5>
                <p className="card-text text-muted small">{product.category}</p>
                <p className="card-text">{product.description}</p>
                <p className="card-text fw-bold text-success">Price: ${product.price.toFixed(2)}</p>
                <p className="card-text small text-muted">
                  Rating: {product.rating.rate} ({product.rating.count} reviews)
                </p>
                {/* Button to add the product to the cart */}
                <button
                  className="btn btn-primary mt-auto"
                  onClick={() => handleAddToCart(product)}
                >
                  <i className="bi bi-cart-plus"></i> Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Toast notification for product added to cart */}
      {toastProduct && (
        <div
          className={`toast position-fixed text-bg-primary bottom-0 end-0 m-3 ${showToast ? 'fade show' : 'fade'}`}
          role="alert"
          style={{ zIndex: 1055, transition: 'opacity 1s ease-in-out' }}
        >
          <div className="toast-header">
            <strong className="me-auto">Product Added</strong>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowToast(false)}
              aria-label="Close"
            ></button>
          </div>
          <div className="toast-body">
            <strong>{toastProduct.title}</strong> has been added to your cart.
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
