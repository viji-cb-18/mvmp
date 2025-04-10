/*import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../services/authServices";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password });
      const { token, user } = res.data;

      if (user.role !== 'admin') {
        toast.error("Access Denied: Not an admin");
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      localStorage.setItem('user', JSON.stringify(user));

      toast.success("Welcome Admin!");
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-md">
        <div className="mb-6 text-center">
          <Link to="/" className="flex items-center justify-center space-x-1">
            <span className="text-4xl font-extrabold text-blue-700">Nezi</span>
            <span className="text-4xl font-extrabold text-yellow-500">Cart</span>
          </Link>
        </div>

        <h2 className="text-2xl font-semibold text-center mb-6">Admin Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Login as Admin
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Not an admin? <Link to="/login" className="text-blue-600 hover:underline">Login as user</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../services/authServices";  // Reuse the login service
import { toast } from "react-toastify";
import { FaUserShield } from 'react-icons/fa';

const AdminLogin = () => {
  const [values, setValues] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login(values);  
      const { token, user } = res.data;

      if (user.role !== 'admin') {
        return toast.error('Access denied. Not an admin account');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      toast.success('Admin login successful');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Admin login error:', err);
      toast.error(err?.response?.data?.msg || 'Admin login failed', {
        position: 'top-center',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-4">
          <FaUserShield className="text-4xl text-red-600" />
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
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition"
          >
            Log in as Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;*/
import { useNavigate } from 'react-router-dom';
//import { useDispatch } from 'react-redux';
//import { setCredentials } from '../../redux/slices/authSlice';
import { adminLogin } from '../../services/authServices';
import { toast } from 'react-toastify';
import { FaUserShield } from 'react-icons/fa';
import React, { useState } from 'react';


const AdminLogin = () => {
  const [values, setValues] = useState({ email: '', password: '' }); // ✅ this is important
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
        <div className="flex justify-center mb-4">
          <FaUserShield className="text-4xl text-red-600" />
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
    className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition"
  >
    Log in as Admin
  </button>
</form>

      </div>
    </div>
  );
};

export default AdminLogin;
