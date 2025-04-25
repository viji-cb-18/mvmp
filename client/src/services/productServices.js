import axios from './axiosInstance';


export const getAllProducts = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.category) params.append("category", filters.category);
  if (filters.subcategory) params.append("subcategory", filters.subcategory);
  if (filters.search) params.append("search", filters.search);
  if (filters.vendorId) params.append("vendorId", filters.vendorId);

  const res = await axios.get(`/products/all?${params.toString()}`);
  return res.data.data;
};

export const getBestSellingProducts = async () => {
  return await axios.get('/products/best-sellers');
};

export const getProductById = async (id) => {
  return await axios.get(`/products/${id}`);
};

export const getProductsByVendor = (vendorId) =>
  axios.get(`/products/vendor/${vendorId}`);

export const addProduct = (formData) =>
  axios.post('/products/add', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  export const updateProduct = (id, data) =>
    axios.put(`/products/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  
export const deleteProduct = (id) => axios.delete(`/products/${id}`);


