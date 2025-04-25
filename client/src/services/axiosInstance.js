import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5001/api',
});

const PUBLIC_ENDPOINTS = ["/products/all", "/products/best-sellers"];

instance.interceptors.request.use((config) => {
  //const token = localStorage.getItem('token');
  const token =
  localStorage.getItem('token') ||         // vendor or generic
  localStorage.getItem('adminToken') ||    // admin
  localStorage.getItem('customerToken');   // customer


  const isPublic = PUBLIC_ENDPOINTS.some((url) => config.url?.startsWith(url));

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;
