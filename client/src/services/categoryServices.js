import axios from './axiosInstance';

export const getCategory = () => axios.get('/categories');

export const getAllFlatCategories = async () => {
  return await axios.get("/api/categories/all");
};


export const addParentCategory = (data) =>
  axios.post('/categories/parent', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const addSubCategory = (data) =>
  axios.post('/categories/sub', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteCategory = (id) =>
  axios.delete(`/categories/${id}`); 

export const updateCategory = (id, data) =>
  axios.put(`/categories/${id}`, data); 


