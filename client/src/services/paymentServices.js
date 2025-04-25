import axios from './axiosInstance';

export const createPayment = (paymentData) => axios.post('/payment/create', paymentData);
export const getAllPayments = () => axios.get('/payment');
export const getPaymentById = (id) => axios.get(`/payment/${id}`);
export const createPaymentIntent = (amount) =>
    axios.post("/payment/create-intent", { amount });
export const refundPayment = (paymentId) => {
    return axios.post(`/api/payment/${paymentId}/refund`);
  };
  