import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      <div className="w-64 bg-white border-r">
        <AdminSidebar />
      </div>

      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
