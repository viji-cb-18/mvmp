import axios from './axiosInstance';

export const getAllUsers = () => axios.get('/auth/users');

export const getAllProducts = () => axios.get('/products');

export const getAllVendors = () => axios.get("/auth/vendors");

export const approveVendor = (id, approvalStatus) =>
    axios.put(`/auth/approve/${id}`, { approvalStatus });

export const getPendingVendors = () =>
    axios.get('/auth/pending-vendors');

export const getApprovedVendors = () => axios.get('/auth/vendors');

export const deleteUser = (userId) => axios.delete(`/auth/users/${userId}`);


export const getUserById = (userId) => axios.get(`/auth/${userId}`);
