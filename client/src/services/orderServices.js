import axios from './axiosInstance';

export const createOrder = (orderData) => axios.post('/orders/create', orderData);
export const getAllOrders = () => axios.get('/orders');


export const getVendorOrders = () => axios.get("/orders/vendor/orders");


export const getOrderById = (orderId) => axios.get(`/orders/${orderId}`);
export const cancelOrder = (id) => axios.put(`/orders/cancel/${id}`);

export const returnOrder = (orderId) => axios.put(`/orders/return/${orderId}`);


export const getMyOrders = () => axios.get("/orders/my-orders");

export const updateOrderStatus = (orderId, status) =>
    axios.put(`/orders/${orderId}/status`, { status });

export const requestOrderReturn = (orderId, formData) =>
    axios.put(`/orders/return/${orderId}`, formData);
  
export const approveReturnRequest = (orderId, productId) =>
    axios.put(`/orders/${orderId}/return/approve`, { productId });
  
export const rejectReturnRequest = (orderId, productId) =>
    axios.put(`/orders/${orderId}/return/reject/${productId}`);