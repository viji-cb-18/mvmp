/*import React, { useEffect, useState } from 'react';
import { getPendingVendors, approveVendor } from '../../services/vendorServices';
import { toast } from 'react-toastify';

const PendingApprovals = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/vendors/pending-vendors");
      setVendors(res.data);
    } catch (err) {
      toast.error('Failed to fetch vendors');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (id, status) => {
    try {
    await axios.put(`/api/vendors/approve-vendor/${id}`, {
            approvalStatus: status,
          });
      toast.success(`Vendor ${status}`);
      fetchVendors(); // Refresh list
    } catch (err) {
      toast.error('Failed to update approval');
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pending Vendor Approvals</h2>
      {loading ? (
        <p>Loading vendors...</p>
      ) : vendors.length === 0 ? (
        <p className="text-gray-500">No pending vendors</p>
      ) : (
        <div className="space-y-4">
          {vendors.map((vendor) => (
            <div key={vendor._id} className="p-4 border rounded shadow flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{vendor.name}</h3>
                <p className="text-sm text-gray-600">{vendor.email}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  className="px-4 py-1 bg-green-500 text-white rounded"
                  onClick={() => handleApproval(vendor._id, 'approved')}
                >
                  Approve
                </button>
                <button
                  className="px-4 py-1 bg-red-500 text-white rounded"
                  onClick={() => handleApproval(vendor._id, 'rejected')}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingApprovals;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PendingApprovals = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await axios.get("/api/vendors/pending-vendors");
        setVendors(res.data);
      } catch (err) {
        toast.error("Failed to fetch vendors");
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  const handleApproval = async (id, status) => {
    try {
      await axios.put(`/api/vendors/approve/${id}`, { approvalStatus: status });
      toast.success(`Vendor ${status}`);
      setVendors((prevVendors) => prevVendors.filter((vendor) => vendor._id !== id));
    } catch (err) {
      toast.error("Failed to update approval");
    }
  };

  if (loading) {
    return <p>Loading vendors...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pending Vendor Approvals</h2>
      {vendors.length === 0 ? (
        <p className="text-gray-500">No pending vendors</p>
      ) : (
        <div className="space-y-4">
          {vendors.map((vendor) => (
            <div
              key={vendor._id}
              className="p-4 border rounded shadow flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">{vendor.name}</h3>
                <p className="text-sm text-gray-600">{vendor.email}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  className="px-4 py-1 bg-green-500 text-white rounded"
                  onClick={() => handleApproval(vendor._id, "approved")}
                >
                  Approve
                </button>
                <button
                  className="px-4 py-1 bg-red-500 text-white rounded"
                  onClick={() => handleApproval(vendor._id, "rejected")}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingApprovals;*/
// src/components/PendingApproval.js
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
