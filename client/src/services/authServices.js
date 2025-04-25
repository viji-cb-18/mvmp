import axios from './axiosInstance';

export const login = (data) => axios.post('/auth/login', data);
export const register = (data) => axios.post('/auth/register', data);

export const getProfile = () => axios.get('/auth/profile');
export const updateProfile = (data) => {
  console.log("Sending update profile →", data); 
  return axios.put("/auth/update-profile", data);
};

export const changePassword = (data) => axios.put('/auth/change-password', data);
export const updateProfileImage = (data) =>
    axios.post('/auth/upload-profile-image', data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

export const adminLogin = (data) => axios.post('/auth/login', data);
export const vendorLogin = (data) => axios.post('/auth/login',data);

export const updateStoreLogo = (data) =>
    axios.post('/auth/vendor/store-logo', data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  