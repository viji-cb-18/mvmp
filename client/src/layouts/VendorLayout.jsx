import React, { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FiLogOut, FiBox, FiUser, FiClipboard, FiChevronDown, FiMenu } from "react-icons/fi";
import { FaTruck, FaExchangeAlt } from "react-icons/fa"; 
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";

const VendorLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/vendor/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2B2F3A] text-white flex flex-col shadow-lg h-screen">
    <div className="bg-[#00B894] px-4 py-3 text-center">
    <Link to="/" className="text-3xl font-bold">
    <span className="text-white">Nezi</span>
    <span className="text-gray-800  px-1 rounded">Cart</span>
  </Link>
    </div>

    <nav className="flex-1 p-5 space-y-3">
      <SidebarLink to="/vendor/dashboard" label="Dashboard" icon={<FiClipboard />} />
      <SidebarLink to="/vendor/products" label="My Products" icon={<FiBox />} />
      <SidebarLink to="/vendor/orders" label="Orders" icon={<FiClipboard />} />
      <SidebarLink to="/vendor/shipments" label="Shipments" icon={<FaTruck />} />
      <SidebarLink to="/vendor/profile" label="Profile" icon={<FiUser />} />
      <SidebarLink to= "/vendor/returns" label="Return Request" icon={<FaExchangeAlt /> } />
    </nav>
  </aside>

  
  <div className="flex-1 flex flex-col bg-gray-100">
   
    <header className="bg-[#00B894] text-white px-4 py-3 shadow flex justify-between items-center">
      <div className="text-lg font-semibold"></div>

      <div className="flex items-center gap-4">
        <p className="text-sm flex items-center gap-2">
          <span className="text-white"></span>
          {user?.name || "Vendor"}
        </p>
        <button
          onClick={() => {
            dispatch(logout());
            localStorage.removeItem("token");
            navigate("/vendor/login");
          }}
          className="bg-white text-[#00B894] font-semibold px-4 py-1.5 rounded hover:bg-gray-100 text-sm"
        >
          Logout
        </button>
      </div>
    </header>

    <main className="p-4 sm:p-6 flex-1 overflow-y-auto">
      <Outlet />
    </main>
  </div>
</div>
    
  );
};

const SidebarLink = ({ to, label, icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition ${
        isActive
          ? "bg-[#00B894] text-white shadow"
          : "text-gray-300 hover:bg-[#00B894]/20 hover:text-white"
      }`
    }
  >
    <span className="text-lg">{icon}</span>
    {label}
  </NavLink>
);

export default VendorLayout;
