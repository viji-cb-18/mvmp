import React from "react";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="h-full p-6 space-y-4">
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>

      <nav className="flex flex-col space-y-2">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : "text-gray-700"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/vendors"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : "text-gray-700"
          }
        >
          Vendors
        </NavLink>

        <NavLink
          to="/admin/approve-vendors"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : "text-gray-700"
          }
        >
          Approvals
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : "text-gray-700"
          }
        >
          Products
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : "text-gray-700"
          }
        >
          Users
        </NavLink>

        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : "text-gray-700"
          }
        >
          Categories
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminSidebar;
