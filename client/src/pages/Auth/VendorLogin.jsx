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
  
      if (user.role !== "vendor") {
        toast.error("Access denied: Not a vendor");
        return;
      }
  
      localStorage.setItem("vendorToken", token);
      localStorage.setItem("vendorInfo", JSON.stringify(user));
  
      dispatch(setCredentials({ token, user }));
  
      toast.success("Login successful");
      navigate("/vendor/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Login failed", {
        position: "top-center",
      });
    }
  };
  

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center">
      <div className="mb-6">
      <Link to="/" className="flex items-center space-x-1">
          <span className="text-4xl font-extrabold text-[#3ED6B5] tracking-tight">Nezi</span>
          <span className="text-4xl font-extrabold text-gray-800 tracking-tight">Cart</span>
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
            className="w-full bg-[#3ED6B5] text-white py-2 rounded-md hover:bg-[#31b9a1] transition"

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

