import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Container, Spinner, Button } from 'react-bootstrap';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsData: Product[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({ ...product, title: product.name, quantity: 1 }));
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
      {products.map((product) => (
        <Col key={product.id} sm={12} md={6} lg={4} className="mb-4">
        <Card>
          <a href={product.imageUrl} target="_blank" rel="noopener noreferrer">
          <Card.Img variant="top" src={product.imageUrl} alt={product.name} />
          </a>
          <Card.Body>
          <Card.Title>{product.name}</Card.Title>
          <Card.Text>{product.description}</Card.Text>
          <Card.Text>
            <strong>${product.price ? product.price.toFixed(2) : '0.00'}</strong>
          </Card.Text>
          <Button onClick={() => handleAddToCart(product)}>Add to Cart</Button>
          </Card.Body>
        </Card>
        </Col>
      ))}
      </Row>
    </Container>
  );
};

export default Products;