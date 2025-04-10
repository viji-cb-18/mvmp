import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../services/authServices'; 
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const VendorRegister = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'vendor',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (values.password !== values.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    try {
      await register(values);
      toast.success('Registration successful! Awaiting admin approval.');
      navigate('/vendor/login');
    } catch (err) {
      toast.error(err?.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="mb-6">
        <Link to="/" className="flex items-center space-x-1">
          <span className="text-4xl font-extrabold text-blue-700 tracking-tight">Nezi</span>
          <span className="text-4xl font-extrabold text-yellow-500 tracking-tight">Cart</span>
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Vendor Registration</h2>

        <form className="space-y-5" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              placeholder="vendor@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={values.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <span
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-700">
            <input type="checkbox" id="terms" className="h-4 w-4 text-blue-600 border-gray-300 rounded" required />
            <label htmlFor="terms" className="ml-2">
              I accept the{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Terms and Conditions
              </a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
          >
            Register as Vendor
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/vendor/login" className="text-blue-600 hover:underline font-medium">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VendorRegister;
