import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../services/authServices";
import { toast } from "react-toastify";
import { setCredentials } from "../../redux/slices/authSlice"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();


const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await login({ email, password });
    const { token, user } = res.data;

    if (user.role !== "customer") {
      toast.error("You are not authorized to log in from here");
      return;
    }

    localStorage.setItem("customerToken", token);
    localStorage.setItem("customerInfo", JSON.stringify(user));

    dispatch(setCredentials({ token, user }));
    toast.success("Login successful");

    navigate("/");
  } catch (err) {
    toast.error(err?.response?.data?.msg || "Login failed");
  }
};


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="mb-6">
        <Link to="/" className="flex items-center space-x-1">
          <span className="text-4xl font-extrabold text-[#3ED6B5] tracking-tight">Nezi</span>
          <span className="text-4xl font-extrabold text-gray-800 tracking-tight">Cart</span>
        </Link>
        

      </div>

      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign in to your account</h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-[#3ED6B5] text-white py-2 rounded-md hover:bg-[#31b9a1] transition"

          >
            Log in to your account
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
