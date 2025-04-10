import React from "react";
import { NavLink, Outlet } from 'react-router-dom';
import { FiLogOut, FiSettings, FiBox, FiUser, FiClipboard } from 'react-icons/fi';

const VendorLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-purple-600">VENDOR</h2>
        </div>
        <nav className="flex flex-col p-4 space-y-2 text-gray-700">
          <NavLink to="/vendor/dashboard" className="flex items-center space-x-2 hover:text-purple-600">
            <FiClipboard />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/vendor/products" className="flex items-center space-x-2 hover:text-purple-600">
            <FiBox />
            <span>My Products</span>
          </NavLink>
          
          <NavLink to="/vendor/orders" className="flex items-center space-x-2 hover:text-purple-600">
            <FiClipboard />
            <span>Orders</span>
          </NavLink>
          <NavLink to="/vendor/settings" className="flex items-center space-x-2 hover:text-purple-600">
            <FiSettings />
            <span>Settings</span>
          </NavLink>
          <NavLink to="/vendor/profile" className="flex items-center space-x-2 hover:text-purple-600">
            <FiUser />
            <span>Profile</span>
          </NavLink>
          <button className="flex items-center space-x-2 text-red-500 mt-4 hover:text-red-700">
            <FiLogOut />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white p-4 shadow-sm flex justify-between items-center">
          <div className="text-lg font-semibold text-gray-700">Good Morning, Vendor!</div>
          <div className="text-sm text-gray-600">Today: {new Date().toLocaleDateString()}</div>
        </header>

        {/* Dynamic Content */}
        <main className="p-6 bg-gray-100 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default VendorLayout;
