import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingVendors } from '../../redux/slices/vendorSlice';

const PendingApproval = () => {
  const dispatch = useDispatch();
  const { pendingVendors, status, error } = useSelector((state) => state.vendors);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPendingVendors());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Pending Vendor Approvals</h2>
      <ul>
        {pendingVendors.map((vendor) => (
          <li key={vendor.id}>{vendor.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default PendingApproval;
