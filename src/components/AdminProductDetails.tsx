import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig.ts';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';

interface Product {
  id?: string;
  name: string;
  price: number;
}

const AdminProductDetails: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({ name: '', price: 0 });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const productsCollectionRef = collection(db, 'products');

  const handleError = (message: string, error?: unknown) => {
    setError(message);
    console.error(message, error);
  };

  const fetchProducts = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await getDocs(productsCollectionRef);
      setProducts(
        data.docs.map((doc) => {
          const productData = doc.data();
          return {
            id: doc.id,
            name: productData.name || '',
            price: productData.price || 0,
          } as Product;
        })
      );
    } catch (err) {
      handleError('Failed to fetch products.', err);
    } finally {
      setLoading(false);
    }
  }, [productsCollectionRef]);

  const addProduct = async () => {
    if (!newProduct.name || newProduct.price <= 0) {
      setError('Please provide valid product details.');
      return;
    }
    try {
      setActionLoading('add');
      await addDoc(productsCollectionRef, newProduct);
      setNewProduct({ name: '', price: 0 });
      fetchProducts();
    } catch (err) {
      handleError('Failed to add product.', err);
    } finally {
      setActionLoading(null);
    }
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    try {
      setActionLoading(`update-${id}`);
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, updatedFields);
      setProducts((prev) =>
        prev.map((product) =>
          product.id === id ? { ...product, ...updatedFields } : product
        )
      );
    } catch (err) {
      handleError('Failed to update product.', err);
    } finally {
      setActionLoading(null);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setActionLoading(`delete-${id}`);
      const productDoc = doc(db, 'products', id);
      await deleteDoc(productDoc);
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (err) {
      handleError('Failed to delete product.', err);
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div>
      <h1>Admin Product Details</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <h2>Add New Product</h2>
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Product Price"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              price: parseFloat(e.target.value) || 0,
            })
          }
        />
        <button onClick={addProduct} disabled={actionLoading === 'add'}>
          {actionLoading === 'add' ? 'Adding...' : 'Add Product'}
        </button>
      </div>
      <div>
        <h2>Product List</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              style={{
                border: '1px solid #ccc',
                padding: '10px',
                margin: '10px 0',
              }}
            >
              <h3>{product.name}</h3>
              <p>Price: ${product.price.toFixed(2)}</p>
              <button
                onClick={() =>
                  updateProduct(product.id!, { price: product.price + 1 })
                }
                disabled={actionLoading === `update-${product.id}`}
              >
                {actionLoading === `update-${product.id}`
                  ? 'Updating...'
                  : 'Increase Price'}
              </button>
              <button
                onClick={() => deleteProduct(product.id!)}
                disabled={actionLoading === `delete-${product.id}`}
              >
                {actionLoading === `delete-${product.id}`
                  ? 'Deleting...'
                  : 'Delete'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminProductDetails;