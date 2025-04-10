/*import { createBrowserRouter } from "react-router-dom";
import Userlayout from "../layout/Userlayout";
import AdminLayout from "../layout/AdminLayout";
import AdminLogin from "../pages/AdminLogin";
import AdminDashboard from "../pages/AdminDashboard";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import AdminRoute from "../components/AdminRoute";
import VendorLogin from "../pages/VendorLogin";
import VendorRegister from "../pages/VendorRegister";
import Vendors from "../pages/Vendors";
import ApprovedVendorList from "../components/ApprovedVendorList";
import VendorApproval from "../components/VendorApproval";
import Users from "../pages/Users";
import Products from "../pages/Products";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Userlayout />,
    children: [
      { path: "", element: <Home /> },
      { path: "profile", element: <Profile /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/admin/login", element: <AdminLogin /> },
  {
    path: "/admin/dashboard",
    element: <AdminRoute><AdminDashboard /></AdminRoute>,
  },
  {
    path: "/admin/vendors",
    element: <AdminRoute><Vendors /></AdminRoute>,
  },
  {
    path: "/admin/vendors/approved",
    element: <AdminRoute><ApprovedVendorList /></AdminRoute>,
  },
  {
    path: "/admin/vendors/approval",
    element: <AdminRoute><VendorApproval /></AdminRoute>,
  },
   
  {
    path: "/admin/users",
    element: <AdminRoute><Users /></AdminRoute>,
  },

  {
    path: "/admin/products",
    element: <AdminRoute><Products /></AdminRoute>,
  },
  

  { path: "/vendor/login", element: <VendorLogin /> },
  { path: "/vendor/register", element: <VendorRegister /> }, 
]);

export default router;*/

/*import { createBrowserRouter } from "react-router-dom";
import Userlayout from "../layout/Userlayout";
import AdminLayout from "../layout/AdminLayout";
import AdminLogin from "../pages/AdminLogin";
import AdminDashboard from "../pages/AdminDashboard";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import AdminRoute from "../components/AdminRoute";
import VendorLogin from "../pages/VendorLogin";
import VendorRegister from "../pages/VendorRegister";
import Vendors from "../pages/Vendors";
import ApprovedVendorList from "../components/ApprovedVendorList";
import VendorApproval from "../components/PendingApprovals";
import Users from "../pages/Users";
import Products from "../pages/Products";

const router = createBrowserRouter([
  // Public user routes
  {
    path: "/",
    element: <Userlayout />,
    children: [
      { path: "", element: <Home /> },
      { path: "profile", element: <Profile /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  // Vendor auth routes
  { path: "/vendor/login", element: <VendorLogin /> },
  { path: "/vendor/register", element: <VendorRegister /> },

  // Admin authentication
  { path: "/admin/login", element: <AdminLogin /> },

  // Admin dashboard and management routes
  {
    path: "/admin/dashboard",
    element: <AdminRoute><AdminDashboard /></AdminRoute>,
  },
  {
    path: "/admin/vendors",
    element: <AdminRoute><Vendors /></AdminRoute>, // Main vendor tab (approved/pending toggle)
  },
  {
    path: "/admin/vendors/approved",
    element: <AdminRoute><ApprovedVendorList /></AdminRoute>,
  },
  {
    path: "/admin/vendors/approval",
    element: <AdminRoute><VendorApproval /></AdminRoute>,
  },
  {
    path: "/admin/users",
    element: <AdminRoute><Users /></AdminRoute>,
  },
  {
    path: "/admin/products",
    element: <AdminRoute><Products /></AdminRoute>,
  },
]);

export default router;
*/
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { ROLES } from '../utils/roles';
import ProtectedRoute from '../components/ProtectedRoute';

// Layouts
import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';
import VendorLayout from '../layouts/VendorLayout';

// Public Pages
import Home from '../pages/Customer/Home';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/register';
import AdminLogin from '../pages/Auth/AdminLogin';
import ProductDetails from '../pages/Customer/Productdetails';
import NotFound from '../pages/Shared/NotFound';
import VendorRegister from '../pages/Auth/VendorRegister';
import VendorLogin from '../pages/Auth/VendorLogin';

// Shared Pages
import Profile from '../pages/Shared/Profile';
import UpdatePassword from '../pages/Shared/UpdatePassword';

// Admin Pages
import AdminDashboard from '../pages/Admin/Dashboard';
import VendorsList from '../pages/Admin/VendorsList';
import ApproveVendor from '../pages/Admin/ApproveVendor';
import CustomerPage from '../pages/Admin/CustomerPage';
import AdminProducts from '../pages/Admin/AdminProducts';
import PendingApprovals from '../pages/Admin/PendingApprovals';
import CategoryPage from '../pages/Admin/CategoryPage';

// Vendor Pages
import VendorDashboard from '../pages/Vendor/Dashboard';
import Products from '../pages/Vendor/Products';
import Orders from '../pages/Vendor/Orders';
import StoreSettings from '../pages/Vendor/StoreSettings';
import AddProducts from '../pages/Vendor/AddProducts';

// Customer Pages
import Cart from '../pages/Customer/Cart';
import Checkout from '../pages/Customer/Checkout';
import CustomerOrders from '../pages/Customer/Orders';

const AppRouter = () => {
  const { token, user } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>

        {/* User Layout */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="change-password" element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />
          <Route path="cart" element={<ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}><Cart /></ProtectedRoute>} />
          <Route path="checkout" element={<ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}><Checkout /></ProtectedRoute>} />
          <Route path="orders" element={<ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}><CustomerOrders /></ProtectedRoute>} />
        </Route>

        {/* Admin Auth */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin/" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="vendors" element={<VendorsList />} />
          <Route path="approve-vendors" element={<ApproveVendor />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="users" element={<CustomerPage />} />
          <Route path="pending-approvals" element={<PendingApprovals />} />
          <Route path="categories" element={<CategoryPage />} />
        </Route>

<Route path="/vendor/register" element={<VendorRegister />} />
<Route path="/vendor/login" element={<VendorLogin />} />

<Route path="/vendor" element={<ProtectedRoute allowedRoles={[ROLES.VENDOR]}><VendorLayout /></ProtectedRoute>}>
  <Route path="dashboard" element={<VendorDashboard />} />
  <Route path="products" element={<Products />} />
  <Route path="add-product" element={<AddProducts />} />
  <Route path="orders" element={<Orders />} />
  <Route path="settings" element={<StoreSettings />} />
  <Route path="profile" element={<Profile />} />
</Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
};

export default AppRouter;
