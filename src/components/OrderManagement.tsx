import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, ListGroup, Button, Container, Row, Col, Spinner } from 'react-bootstrap';

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();

  const updateOrder = async (orderId: string, updatedFields: Partial<Order>) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, updatedFields);
      console.log('Order updated successfully!');
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const placeOrder = async (cartItems: any[], totalPrice: number, shippingAddress: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User is not authenticated.');
      }

      const orderData = {
        userId: user.uid,
        email: user.email,
        products: cartItems,
        totalPrice,
        shippingAddress,
        createdAt: serverTimestamp(),
      };

      const ordersRef = collection(db, 'orders');
      await addDoc(ordersRef, orderData);

      console.log('Order placed successfully!');
      navigate('/orders'); // Redirect to the order history page
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);

      const fetchedOrders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(fetchedOrders);
      setLoading(false);
    };

    const fetchOrderDetails = async () => {
      try {
        const orderRef = doc(db, 'orders', orderId!);
        const orderSnap = await getDoc(orderRef);
        if (orderSnap.exists()) {
          setSelectedOrder(orderSnap.data());
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    } else {
      fetchOrders();
    }
  }, [orderId]);

  if (loading) {
    return (
      <Container className="text-center mt-4">
        <Spinner animation="border" />
        <p>Loading...</p>
      </Container>
    );
  }

  if (!orders.length && !orderId) {
    return <p>No orders found.</p>;
  }

  if (orderId && selectedOrder) {
    // Render Order Details
    return (
      <Container className="mt-4">
        <Card>
          <Card.Header as="h1" className="text-center">
            Order Receipt
          </Card.Header>
          <Card.Body>
            <Card.Text>
              <strong>Order ID:</strong> {orderId}
            </Card.Text>
            <Card.Text>
              <strong>Total:</strong> ${selectedOrder.totalPrice.toFixed(2)}
            </Card.Text>
            <Card.Text>
              <strong>Date:</strong>{' '}
              {new Date(selectedOrder.createdAt.seconds * 1000).toLocaleDateString()}
            </Card.Text>
            <Card.Text>
              <strong>Shipping Address:</strong>
              <input
                type="text"
                value={selectedOrder.shippingAddress || ''}
                onChange={(e) =>
                  updateOrder(orderId!, { shippingAddress: e.target.value })
                }
                className="form-control"
              />
            </Card.Text>
            <h5>Products</h5>
            <ListGroup variant="flush">
              {selectedOrder.products.map((product: any) => (
                <ListGroup.Item key={product.id}>
                  <Row>
                    <Col>
                      <strong>{product.title}</strong>
                    </Col>
                    <Col>
                      Quantity: {product.quantity}
                    </Col>
                    <Col>
                      Price: ${product.price.toFixed(2)}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
          <Card.Footer className="text-center">
            <Button variant="primary" onClick={() => navigate('/')}>
              Back to Shop
            </Button>{' '}
            <Button variant="secondary" onClick={() => navigate('/cart')}>
              Back to Cart
            </Button>
          </Card.Footer>
        </Card>
      </Container>
    );
  }

  // Render Order History
  return (
    <Container className="mt-4">
      <h1 className="text-center">Order History</h1>
      {orders.length === 0 ? (
        <p className="text-center">No orders found.</p>
      ) : (
        <ListGroup>
          {orders.map((order) => (
            <ListGroup.Item key={order.id}>
              <Row>
                <Col>
                  <strong>Order ID:</strong> {order.id}
                </Col>
                <Col>
                  <strong>Total:</strong> ${order.totalPrice.toFixed(2)}
                </Col>
                <Col>
                  <strong>Date:</strong>{' '}
                  {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}
                </Col>
                <Col className="text-end">
                  <Button
                    variant="info"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    View Details
                  </Button>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
      <Button variant="primary" onClick={() => navigate('/')} className="mt-3">
        Back to Shop
      </Button>{' '}
    </Container>
  );
};

export default OrderManagement;