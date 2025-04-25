import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { ROLES } from '../utils/roles';
import ProtectedRoute from '../components/ProtectedRoute';


import AuthLayout from "../layouts/AuthLayout";
import UserLayout from '../layouts/Userlayout';
import AdminLayout from '../layouts/AdminLayout';
import VendorLayout from '../layouts/VendorLayout';
import CustomerLayout from '../layouts/CustomerLayout';

import NotFound from '../pages/Shared/NotFound';
import UpdatePassword from '../pages/Shared/UpdatePassword';

import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import AdminLogin from '../pages/Auth/AdminLogin';
import VendorRegister from '../pages/Auth/VendorRegister';
import VendorLogin from '../pages/Auth/VendorLogin';

import Home from '../pages/Customer/Home';
import ContactPage from "../pages/ContactPage";
import ProductDetailsPage from "../pages/Customer/ProductDetailsPage";
import CartPage from '../pages/Customer/CartPage';
import CheckoutPage from '../pages/Customer/CheckoutPage';
import Orders from '../pages/Customer/Orders';
import OrderDetails from '../pages/Customer/OrderDetails';
import Dashboard from '../pages/Customer/Dashboard';
import NewArrivalsPage from '../pages/Customer/NewArrivalsPage';
import BestSellingProducts from "../components/BestSellingProducts";
import CategoriesPage from "../pages/CategoriesPage";
import AboutUs from '../pages/Aboutus';


import VendorDashboard from '../pages/Vendor/Dashboard';
import Products from '../pages/Vendor/Products';
import AddProducts from '../pages/Vendor/AddProducts';
import EditProduct from '../pages/Vendor/EditProductpage';
import VendorOrders from '../pages/Vendor/Orders';
import StoreSettings from '../pages/Vendor/StoreSettings';
import VendorProfilePage from '../pages/Vendor/VendorProfilePage';
import VendorShipmentPage from "../pages/Vendor/VendorShipmentPage";
import VendorReturnsPage from '../pages/Vendor/VendorReturnsPage';


import AdminDashboard from '../pages/Admin/Dashboard';
import VendorsList from '../pages/Admin/VendorsList';
import ApproveVendor from '../pages/Admin/ApproveVendor';
import CustomerPage from '../pages/Admin/CustomerPage';
import PendingApprovals from '../pages/Admin/PendingApprovals';
import CategoryPage from '../pages/Admin/CategoryPage';
import BannerPage from '../pages/Admin/BannerPage';
import AdminProductsPage from '../pages/Admin/AdminProductsPage';
import AdminProfilePage from '../pages/Admin/AdminProfilePage';
import AdminOrders from '../pages/Admin/AdminOrders';
import AdminContactsPage from '../pages/Admin/AdminContactsPage';




const AppRouter = () => {
  const { token, user } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>

        {/* Auth Routes */}
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
        <Route path="/admin/login" element={<AuthLayout><AdminLogin /></AuthLayout>} />
        <Route path="/vendor/register" element={<AuthLayout><VendorRegister /></AuthLayout>} />
        <Route path="/vendor/login" element={<AuthLayout><VendorLogin /></AuthLayout>} />


        {/* Public & Customer Routes */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactPage />} />
          
          <Route path="product/:id" element={<ProductDetailsPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="new-arrivals" element={<NewArrivalsPage />} />
          <Route path="best-sellers" element={<BestSellingProducts />} />
          <Route path="/categories" element={<CategoriesPage />} /> 

          <Route path="orders" element={
            <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
              <Orders />
            </ProtectedRoute>
          } />

         <Route path="orders/:orderId" element={<OrderDetails />} />

          <Route path="change-password" element={
            <ProtectedRoute>
              <UpdatePassword />
            </ProtectedRoute>
          } />
        </Route>

        {/* Customer Dashboard */}
        <Route path="/customer" element={<CustomerLayout />}>
          <Route path="dashboard" element={
            <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="vendors" element={<VendorsList />} />
          <Route path="approve-vendors" element={<ApproveVendor />} />
          <Route path="users" element={<CustomerPage />} />
          <Route path="pending-approvals" element={<PendingApprovals />} />
          <Route path="categories" element={<CategoryPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="banners" element={<BannerPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
          <Route path="/admin/contacts" element={<AdminContactsPage />} />

        </Route>

        {/* Vendor Routes */}
        <Route path="/vendor" element={
          <ProtectedRoute allowedRoles={[ROLES.VENDOR]}>
            <VendorLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<VendorDashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="add-product" element={<AddProducts />} />
          <Route path="editproduct/:productId" element={<EditProduct />} />
          <Route path="orders" element={<VendorOrders />} />
          <Route path="settings" element={<StoreSettings />} />
          <Route path="profile" element={<VendorProfilePage />} />
          <Route path="shipments" element={<VendorShipmentPage />} />
          <Route path="/vendor/returns" element={<VendorReturnsPage />} />
        </Route>
        
       
        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
