import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { clearCart, removeFromCart, incrementQuantity, decrementQuantity } from '../redux/cartSlice';
import { auth, db } from '../firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const ShoppingCart: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert('You must be logged in to place an order.');
      return;
    }

    try {
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        products: cartItems,
        totalPrice,
        createdAt: new Date(),
      });

      dispatch(clearCart());
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  if (cartItems.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div className="container mt-4">
      <h1>Shopping Cart</h1>
      <ul className="list-group mb-4">
        {cartItems.map((item) => (
          <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h5>{item.name}</h5>
              <p>Price: ${item.price.toFixed(2)}</p>
              <p>Quantity: {item.quantity}</p>
              <button
                className="btn btn-sm btn-secondary me-2"
                onClick={() => dispatch(incrementQuantity(item.id))}
              >
                +
              </button>
              <button
                className="btn btn-sm btn-secondary me-2"
                onClick={() => dispatch(decrementQuantity(item.id))}
              >
                -
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => dispatch(removeFromCart(item.id))}
              >
                Remove
              </button>
            </div>
            <p>Total: ${(item.price * item.quantity).toFixed(2)}</p>
          </li>
        ))}
      </ul>
      <h3>Total: ${totalPrice.toFixed(2)}</h3>
      <button className="btn btn-primary" onClick={handleCheckout}>
        Checkout
      </button>
    </div>
  );
};

export default ShoppingCart;