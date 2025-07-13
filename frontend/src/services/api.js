import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Replace with your production URL later
});

// Products
export const getProducts = () => API.get('/products');
export const addProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Dead Inventory
export const getDeadInventory = () => API.get('/dead-inventory');

// ✅ Add this function for sales history
export const getSalesHistory = () => API.get('/sales');
export const addSale = (data) => API.post('/sales', data);


export default API;
