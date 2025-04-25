import React from 'react';
import { Link } from 'react-router-dom';

const VendorSidebar = () => {
  return (
    <aside style={{ width: '200px', padding: '1rem', background: '#eee' }}>
      <h3>Vendor Panel</h3>
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        <li><Link to="/vendor/dashboard">Dashboard</Link></li>
        <li><Link to="/vendor/products">Products</Link></li>
        <li><Link to="/vendor/orders">Orders</Link></li>
        <li><Link to="/vendor/shipments">Shipments</Link></li>
        <li><Link to="/vendor/settings">Store Settings</Link></li>
        
      </ul>
    </aside>
  );
};

export default VendorSidebar;
