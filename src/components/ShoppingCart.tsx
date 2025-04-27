import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { removeFromCart, clearCart, updateCartQuantity } from '../redux/cartSlice';

// ShoppingCart component definition
export const ShoppingCart: React.FC = () => {
  // Access the cart items from the Redux store
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  // Calculate the total number of items in the cart
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Calculate the total price of all items in the cart
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Handle the checkout process by clearing the cart and showing an alert
  const handleCheckout = () => {
    dispatch(clearCart()); // Dispatch action to clear the cart
    alert('Checkout successful! Your cart has been cleared.');
  };

  // Handle changes to the quantity of a specific item in the cart
  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateCartQuantity({ id, quantity })); // Dispatch action to update item quantity
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        // Display a message if the cart is empty
        <p className="text-center">
          Your cart is empty. <a href="/">Start shopping now!</a>
        </p>
      ) : (
        <>
          {/* Render the list of cart items */}
          <ul className="list-group mb-4">
            {cartItems.map((item) => (
              <li
                key={item.id} // Unique key for each item
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  {/* Display item image and title */}
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: '80px', marginRight: '10px' }}
                  />
                  {item.title}
                </div>
                <div>
                  {/* Display item price, quantity, and total price */}
                  ${item.price.toFixed(2)} x {item.quantity} = $
                    {(item.price * item.quantity).toFixed(2)}
                    <button
                    className="btn btn-outline-secondary btn-sm ms-2"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    >
                    -
                    </button>
                    <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                    <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                    +
                    </button>
                  {/* Button to remove the item from the cart */}
                  <button
                    className="btn btn-danger btn-sm ms-3"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {/* Display total items and total price */}
          <div className="d-flex justify-content-between">
            <h5>Total Items: {totalItems}</h5>
            <h5>Total Price: ${totalPrice.toFixed(2)}</h5>
          </div>
          {/* Buttons for navigation and checkout */}
          <div className="d-flex justify-content-between mt-3">
            <button
              className="btn btn-outline-primary"
              onClick={() => window.history.back()} // Navigate back to the previous page
            >
              Continue Shopping
            </button>
            <button className="btn btn-success" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};