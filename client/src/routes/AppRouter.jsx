import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { ROLES } from '../utils/roles';
import ProtectedRoute from '../components/ProtectedRoute';

import UserLayout from '../layouts/Userlayout';
import AdminLayout from '../layouts/AdminLayout';
import VendorLayout from '../layouts/VendorLayout';

import Home from '../pages/Customer/Home';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/register';
import AdminLogin from '../pages/Auth/AdminLogin';
import ProductDetails from '../pages/Customer/Productdetails';
import NotFound from '../pages/Shared/NotFound';
import VendorRegister from '../pages/Auth/VendorRegister';
import VendorLogin from '../pages/Auth/VendorLogin';

import Profile from '../pages/Shared/Profile';
import UpdatePassword from '../pages/Shared/UpdatePassword';

import AdminDashboard from '../pages/Admin/Dashboard';
import VendorsList from '../pages/Admin/VendorsList';
import ApproveVendor from '../pages/Admin/ApproveVendor';
import CustomerPage from '../pages/Admin/CustomerPage';
import AdminProducts from '../pages/Admin/AdminProducts';
import PendingApprovals from '../pages/Admin/PendingApprovals';
import CategoryPage from '../pages/Admin/CategoryPage';

import VendorDashboard from '../pages/Vendor/Dashboard';
import Products from '../pages/Vendor/Products';
import Orders from '../pages/Vendor/Orders';
import StoreSettings from '../pages/Vendor/StoreSettings';
import AddProducts from '../pages/Vendor/AddProducts';

import Cart from '../pages/Customer/Cart';
import Checkout from '../pages/Customer/Checkout';
import CustomerOrders from '../pages/Customer/Orders';

const AppRouter = () => {
  const { token, user } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>

    
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
        
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
};

export default AppRouter;
