import axios from 'axios';

// Fetches product categories from the API
export const fetchCategories = async () => {
  const { data } = await axios.get('https://fakestoreapi.com/products/categories');
  return data;
};

// Fetches products, optionally filtered by category
export const fetchProducts = async (category?: string) => {
  const endpoint = category
    ? `https://fakestoreapi.com/products/category/${category}`
    : 'https://fakestoreapi.com/products';
  const { data } = await axios.get(endpoint);
  return data;
};