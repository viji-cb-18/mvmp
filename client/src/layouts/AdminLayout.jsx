import React, { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import AdminSidebar from "../components/AdminSidebar";

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F9FBFF]">
      
      <aside className="w-full md:w-64 bg-[#23272F] text-white shadow-lg">
        <AdminSidebar />
      </aside>

      
      <main className="flex-1 p-4 md:p-6">
        
        <div className="flex justify-between items-center bg-white shadow-sm px-6 py-4 rounded-lg mb-6 border border-[#E5EAF0]">
  <div className="flex items-center gap-2 text-gray-700 font-medium text-sm">
    <FaUserCircle className="text-[#2D70E4]" size={20} />
    <span className="text-sm font-semibold text-[#2D70E4]">
      {user?.name || "Admin"}
    </span>
  </div>

  <button
    onClick={handleLogout}
    className="bg-[#2D70E4] hover:bg-[#245bbd] text-white text-sm px-4 py-2 rounded-md transition"
  >
    Logout
  </button>
</div>

        
        <div className="bg-white p-6 rounded-xl shadow border border-[#E5EAF0] min-h-[300px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
