import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Button, Form, Table, Modal, Spinner, Alert } from 'react-bootstrap';

interface Product {
  id: string;
  name: string;
  category?: string;
  price: number;
  description: string;
  imageUrl: string;
}

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    id: '',
    name: '',
    category: '',
    price: 0.0,
    description: '',
    imageUrl: '',
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from Firestore
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData: Product[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(productsData);
    } catch (err) {
      setError('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add a new product
  const handleAddProduct = async () => {
    if (!newProduct.name || newProduct.price <= 0 || !newProduct.description || !newProduct.imageUrl) {
      setError('Please fill in all fields with valid values.');
      return;
    }
    try {
      setLoading(true);
      const docRef = await addDoc(collection(db, 'products'), {
        name: newProduct.name,
        category: newProduct.category,
        price: newProduct.price,
        description: newProduct.description,
        imageUrl: newProduct.imageUrl,
      });
      setProducts([...products, { ...newProduct, id: docRef.id }]);
      setNewProduct({ id: '', name: '', category: '', price: 0, description: '', imageUrl: '' });
    } catch (err) {
      setError('Failed to add product.');
    } finally {
      setLoading(false);
    }
  };

  // Update an existing product
  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    if (!editingProduct.name || editingProduct.price <= 0 || !editingProduct.description) {
      setError('Please fill in all fields with valid values.');
      return;
    }
    try {
      setLoading(true);
      const productRef = doc(db, 'products', editingProduct.id);

      // Prepare the updated fields
      const updatedFields: Partial<Product> = {
        name: editingProduct.name,
        category: editingProduct.category,
        price: editingProduct.price,
        description: editingProduct.description,
        imageUrl: editingProduct.imageUrl,
      };

      await updateDoc(productRef, updatedFields);
      setProducts(
        products.map((product) =>
          product.id === editingProduct.id ? { ...product, ...updatedFields } : product
        )
      );
      setEditingProduct(null);
      setShowModal(false);
    } catch (err) {
      setError('Failed to update product.');
    } finally {
      setLoading(false);
    }
  };

  // Delete a product
  const handleDeleteProduct = async (id: string) => {
    try {
      setLoading(true);
      const productRef = doc(db, 'products', id);
      await deleteDoc(productRef);
      setProducts(products.filter((product) => product.id !== id));
    } catch (err) {
      setError('Failed to delete product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Admin Panel - Manage Products</h1>
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Add Product Form */}
      <Form className="mb-4">
        <Form.Group>
          <Form.Label>Product Name</Form.Label>
          <Form.Control
            type="text"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            type="text"
            value={newProduct.imageUrl}
            onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
          />
        </Form.Group>
        <Button className="mt-3" onClick={handleAddProduct} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Add Product'}
        </Button>
      </Form>

      {/* Products Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
              </td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>${product.price ? product.price.toFixed(2) : '0.00'}</td>
              <td>{product.description}</td>
              <td>
                <Button
                  variant="warning"
                  className="me-2"
                  onClick={() => {
                    setEditingProduct(product);
                    setShowModal(true);
                  }}
                >
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDeleteProduct(product.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Product Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingProduct && (
            <Form>
              <Form.Group>
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  value={editingProduct.category}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, category: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      price: parseFloat(e.target.value),
                    })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="text"
                  value={editingProduct.imageUrl}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      imageUrl: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateProduct} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminProducts;