import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaCheckCircle,
  FaBoxOpen,
  FaUser,
  FaThList,
  FaClipboardList,
  FaImage,
  FaEnvelope
} from "react-icons/fa";

const navItems = [
  { name: "Dashboard", to: "/admin/dashboard", icon: <FaTachometerAlt /> },
  { name: "Vendors", to: "/admin/vendors", icon: <FaUsers /> },
  { name: "Approvals", to: "/admin/approve-vendors", icon: <FaCheckCircle /> },
  { name: "Products", to: "/admin/products", icon: <FaBoxOpen /> },
  { name: "Orders", to: "/admin/orders", icon: <FaClipboardList /> },
  { name: "Users", to: "/admin/users", icon: <FaUser /> },
  { name: "Categories", to: "/admin/categories", icon: <FaThList /> },
  { name: "Banners", to: "/admin/banners", icon: <FaImage /> },
  { name: "Profile", to: "/admin/profile", icon: <FaImage /> },
  { name: "Contacts", to: "/admin/contacts", icon: <FaEnvelope /> },
];

const AdminSidebar = () => {
  return (
    <div className="h-full px-4 py-6 overflow-y-auto bg-[#2B2F3A] text-white">
    <Link to="/" className="text-3xl font-bold block mb-8 text-center">
      <span className="text-[#3ED6B5]">Nezi</span>
      <span className="text-gray-800 bg-white px-1 rounded">Cart</span>
    </Link>

      <nav className="flex flex-col space-y-4">
        {navItems.map(({ name, to, icon }) => (
          <NavLink
            key={name}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md text-sm transition font-medium ${
              isActive
                ? "bg-white text-[#2B2F3A] font-semibold"
                : "hover:bg-white/10 text-white"
              }`
            }
          >
            <span className="text-lg">{icon}</span>
            {name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
