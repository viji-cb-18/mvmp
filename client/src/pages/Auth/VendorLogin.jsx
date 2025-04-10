/*import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../services/authServices";
import { toast } from "react-toastify";

const VendorLogin = () => {
  const [values, setValues] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login(values);
      const { token, user } = res.data;
  
      if (user.role !== "vendor") {
        return toast.error("Access denied. Not a vendor account");
      }
  
      if (!user.isApproved) {
        return toast.warning("Your account is pending approval by admin.");
      }
  
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Vendor login successful");
      navigate("/vendor/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-6">
          <Link to="/" className="text-4xl font-bold text-blue-600">
            Nezi<span className="text-yellow-500">Cart</span>
          </Link>
        </div>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Vendor Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              placeholder="vendor@nezicart.com"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Login as Vendor
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link to="/vendor/register" className="text-blue-600 hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VendorLogin;

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { vendorLogin } from "../../services/authServices";
import { toast } from "react-toastify";


const VendorLogin = () => {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await vendorLogin(values);
      const { token, vendor } = res.data;

      localStorage.setItem("vendorToken", token);
      localStorage.setItem("vendor", JSON.stringify(vendor));

      toast.success("Vendor login successful");
      navigate("/vendor/dashboard");

    } catch (err) {
      toast.error(err?.response?.data?.msg || "Login failed", {
        position: "top-center"
      });
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center">
      <div className="mb-6">
        <Link to="/" className="flex items-center space-x-1">
          <span className="text-4xl font-extrabold text-blue-700 tracking-tight">Nezi</span>
          <span className="text-4xl font-extrabold text-yellow-500 tracking-tight">Cart</span>
        </Link>
      </div>

      <div className="bg-white bg-opacity-90 shadow-md rounded-lg p-8 w-full max-w-md backdrop-blur-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Vendor Login
        </h2>

        <form className="space-y-5" onSubmit={onSubmit}>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              placeholder="vendor@example.com"
              autoComplete="email"
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              autoComplete="current-password"
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <a href="#" className="text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition"
          >
            Login as Vendor
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
       
          Don't have a vendor account? <Link to="/vendor/register">Apply now</Link>

           </p>

      </div>
    </div>
  );
};

export default VendorLogin;*/

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { vendorLogin } from "../../services/authServices";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlice";

const VendorLogin = () => {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await vendorLogin(values);
      const { token, user } = res.data;

      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Set Redux credentials
      dispatch(setCredentials({ token, user }));

      toast.success("Login successful");

      // Redirect based on role
      if (user.role === "vendor") {
        navigate("/vendor/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Login failed", {
        position: "top-center"
      });
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center">
      <div className="mb-6">
        <Link to="/" className="flex items-center space-x-1">
          <span className="text-4xl font-extrabold text-blue-700 tracking-tight">Nezi</span>
          <span className="text-4xl font-extrabold text-yellow-500 tracking-tight">Cart</span>
        </Link>
      </div>

      <div className="bg-white bg-opacity-90 shadow-md rounded-lg p-8 w-full max-w-md backdrop-blur-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Vendor Login
        </h2>

        <form className="space-y-5" onSubmit={onSubmit}>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              placeholder="vendor@example.com"
              autoComplete="email"
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              autoComplete="current-password"
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <a href="#" className="text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition"
          >
            Login as Vendor
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have a vendor account? <Link to="/vendor/register" className="text-blue-600">Apply now</Link>
        </p>
      </div>
    </div>
  );
};

export default VendorLogin;

