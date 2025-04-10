import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <nav>
      <Link to="/">Home</Link>
      {user ? (
        <>
          <Link to="/profile">Profile</Link>
          {user.role === 'vendor' && <Link to="/vendor/dashboard">Vendor</Link>}
          {user.role === 'admin' && <Link to="/admin/dashboard">Admin</Link>}
          {user.role === 'customer' && <Link to="/cart">Cart</Link>}
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
};

export default Navbar;
