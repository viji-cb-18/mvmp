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

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white shadow-xl rounded-2xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#2D70E4] mb-1">⏳ Pending Vendor Approvals</h2>
        <p className="text-sm text-gray-500">Review and take action on vendors awaiting approval.</p>
      </div>

     
      {status === 'loading' && (
        <div className="text-center py-10 text-gray-500 animate-pulse">Loading vendors...</div>
      )}
      {status === 'failed' && (
        <div className="text-center text-red-600 font-semibold py-6">Error: {error}</div>
      )}
      {status === 'succeeded' && pendingVendors.length === 0 && (
        <div className="text-center text-gray-500 py-10">No pending vendors at the moment.</div>
      )}

      
      {status === 'succeeded' && pendingVendors.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingVendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-gradient-to-br from-white to-[#F8FAFC] border border-gray-200 rounded-xl shadow-md p-5 hover:shadow-xl transition-all duration-300"
            >
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-800">{vendor.name}</h3>
                <p className="text-sm text-gray-600">{vendor.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Store: <span className="font-medium">{vendor.storeName || 'N/A'}</span>
                </p>
              </div>
              <div className="mt-4">
                <span className="inline-block bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                  ⏱ Pending Approval
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingApproval;
