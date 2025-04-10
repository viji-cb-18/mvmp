import axios from './axiosInstance';

export const getAllProducts = () => axios.get('/products');
export const getProductById = (id) => axios.get(`/products/${id}`);
export const getProductsByVendor = (vendorId) => axios.get(`/products/product/vendor/${vendorId}`);
export const addProduct = (formData) =>
  axios.post('/products/add', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
export const updateProduct = (id, data) => axios.put(`/products/${id}`, data);
export const deleteProduct = (id) => axios.delete(`/products/${id}`);
