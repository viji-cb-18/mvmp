import axios from './axiosInstance';

export const createPayment = (paymentData) => axios.post('/payment', paymentData);
export const getAllPayments = () => axios.get('/payment');
export const getPaymentById = (id) => axios.get(`/payment/${id}`);
export const refundPayment = (id) => axios.post(`/payment/${id}/refund`);
