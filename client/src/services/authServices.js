import axios from './axiosInstance';

// 🔐 Auth Endpoints
export const login = (data) => axios.post('/auth/login', data);
export const register = (data) => axios.post('/auth/register', data);

// 🧾 Profile & Account Management
export const getProfile = () => axios.get('/auth/user-profile');
export const updateProfile = (data) => axios.put('/auth/update-profile', data);
export const changePassword = (data) => axios.put('/auth/change-password', data);

// 🛡️ Admin login
export const adminLogin = (data) => axios.post('/auth/login', data);
export const vendorLogin = (data) => axios.post('/auth/login',data);