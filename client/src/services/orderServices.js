import axios from './axiosInstance';

export const createOrder = (orderData) => axios.post('/orders/create', orderData);
export const getAllOrders = () => axios.get('/orders');
export const getOrderById = (orderId) => axios.get(`/orders/${orderId}`);
export const cancelOrder = (orderId) => axios.put(`/orders/${orderId}/cancel`);
export const requestReturn = (orderId) => axios.put(`/orders/${orderId}/return`);
