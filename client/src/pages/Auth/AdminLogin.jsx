import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../services/authServices';
import { toast } from 'react-toastify';
import { FaUserShield } from 'react-icons/fa';
import React, { useState } from 'react';
import { Link } from "react-router-dom";


const AdminLogin = () => {
  const [values, setValues] = useState({ email: '', password: '' }); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await adminLogin(values);
      const { token, user } = res.data;

      if (user.role !== 'admin') {
        return toast.error('Access denied. Not an admin account');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      toast.success('Admin login successful');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.msg || 'Admin login failed');
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">

      <div className="mb-6 text-center">
          <Link to="/" className="flex justify-center items-center space-x-1">
            <span className="text-4xl font-extrabold text-[#3ED6B5] tracking-tight">Nezi</span>
            <span className="text-4xl font-extrabold text-gray-800 tracking-tight">Cart</span>
          </Link>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Admin Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-5">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
    <input
      type="email"
      name="email"
      value={values.email}
      onChange={handleChange}
      placeholder="admin@company.com"
      autoComplete="email"
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
    />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
    <input
      type="password"
      name="password"
      value={values.password}
      onChange={handleChange}
      placeholder="••••••••"
      autoComplete="current-password"
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
    />
  </div>
  <button
            type="submit"
            className="w-full bg-[#3ED6B5] text-white py-2 rounded-md hover:bg-[#31b9a1] transition"

          >
    Log in as Admin
  </button>
</form>

      </div>
    </div>
  );
};

export default AdminLogin;
