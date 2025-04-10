import axios from './axiosInstance';

export const getPendingVendors = () => axios.get('/vendors/admin/pending-vendors');
export const approveVendor = (id) => axios.put(`/vendors/approve/${id}`, { approvalStatus: 'approved' });
export const getApprovedVendors = () => axios.get('/vendors/approved-vendors');
export const getVendorProfile = () => axios.get('/vendors/profile');
export const updateVendorProfile = (data) => axios.put('/vendors/update', data);
export const getVendorReport = () => axios.get('/vendors/performance-report');
