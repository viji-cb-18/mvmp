import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h2>404 - Page Not Found</h2>
    <p>Oops! The page you're looking for doesn't exist.</p>
    <Link to="/">Go Back Home</Link>
  </div>
);

export default NotFound;
