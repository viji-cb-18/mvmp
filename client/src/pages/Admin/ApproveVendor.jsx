/*import React, { useEffect, useState } from 'react';
import { getPendingVendors, approveVendor } from '../../services/adminServices';
import { toast } from 'react-toastify';

const ApproveVendor = () => {
    const [vendors, setVendors] = useState([]);

    useEffect(() => {
        fetchPendingVendors();
    }, []);

    const fetchPendingVendors = async () => {
        try {
            const response = await getPendingVendors();
            setVendors(response.data);
        } catch (error) {
            console.error('Error fetching pending vendors:', error);
            toast.error('Failed to fetch pending vendors.');
        }
    };

    const handleApproval = async (vendorId, approvalStatus) => {
        try {
            await approveVendor(vendorId, approvalStatus);
            toast.success(`Vendor ${approvalStatus === 'approved' ? 'approved' : 'rejected'} successfully.`);
            fetchPendingVendors(); // Refresh the list after approval/rejection
        } catch (error) {
            console.error(`Error ${approvalStatus === 'approved' ? 'approving' : 'rejecting'} vendor:`, error);
            toast.error(`Failed to ${approvalStatus === 'approved' ? 'approve' : 'reject'} vendor.`);
        }
    };

    return (
        <div>
            <h2>Pending Vendor Approvals</h2>
            {vendors.length === 0 ? (
                <p>No pending vendors.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Vendor Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendors.map((vendor) => (
                            <tr key={vendor._id}>
                                <td>{vendor.name}</td>
                                <td>{vendor.email}</td>
                                <td>
                                    <button onClick={() => handleApproval(vendor._id, 'approved')}>Approve</button>
                                    <button onClick={() => handleApproval(vendor._id, 'rejected')}>Reject</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ApproveVendor;
*//*
import React, { useEffect, useState } from 'react';
import { getPendingVendors, approveVendor } from '../../services/adminServices';
import { toast } from 'react-toastify';

const ApproveVendor = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingVendors = async () => {
    try {
      const response = await getPendingVendors();
      setVendors(response.data);
    } catch (error) {
      console.error('Error fetching pending vendors:', error);
      toast.error('Failed to fetch pending vendors.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (vendorId, approvalStatus) => {
    try {
      await approveVendor(vendorId, approvalStatus);
      toast.success(`Vendor ${approvalStatus} successfully.`);
      fetchPendingVendors(); // Refresh list
    } catch (error) {
      console.error(`Error approving/rejecting vendor:`, error);
      toast.error(`Failed to ${approvalStatus} vendor.`);
    }
  };

  useEffect(() => {
    fetchPendingVendors();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pending Vendor Approvals</h2>
      {loading ? (
        <p>Loading vendors...</p>
      ) : vendors.length === 0 ? (
        <p className="text-gray-500">No pending vendors</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor._id} className="text-center border-t">
                <td className="py-2 px-4 border">{vendor.name}</td>
                <td className="py-2 px-4 border">{vendor.email}</td>
                <td className="py-2 px-4 border">
                  <button
                    className="bg-green-500 text-white px-4 py-1 rounded mr-2"
                    onClick={() => handleApproval(vendor._id, 'approved')}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-1 rounded"
                    onClick={() => handleApproval(vendor._id, 'rejected')}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApproveVendor;
*/
import React, { useEffect, useState } from 'react';
import { getPendingVendors, approveVendor } from '../../services/adminServices';
import { toast } from 'react-toastify';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ApproveVendor = () => {
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');

  const VENDORS_PER_PAGE = 5;

  const fetchVendors = async () => {
    try {
      const res = await getPendingVendors();
      setVendors(res.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast.error('Failed to fetch pending vendors');
    }
  };

  const handleApproval = async (id, status) => {
    try {
      await approveVendor(id, status);
      toast.success(`Vendor ${status}`);
      fetchVendors();
    } catch (error) {
      toast.error(`Failed to ${status} vendor`);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const filteredVendors = vendors
    .filter((vendor) =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((vendor) => (statusFilter === 'all' ? true : vendor.approvalStatus === statusFilter))
    .sort((a, b) =>
      sortAsc
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

  const totalPages = Math.ceil(filteredVendors.length / VENDORS_PER_PAGE);
  const start = (currentPage - 1) * VENDORS_PER_PAGE;
  const paginatedVendors = filteredVendors.slice(start, start + VENDORS_PER_PAGE);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pending Vendor Approvals</h1>
          <p className="text-sm text-gray-500">Review vendor accounts awaiting approval.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search name/email"
            className="border px-3 py-1 rounded text-sm w-60"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border px-3 py-1 rounded text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            Sort by Name {sortAsc ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {paginatedVendors.length === 0 ? (
        <p className="text-gray-600">No vendors found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Store</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedVendors.map((vendor) => (
                <tr key={vendor._id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4">{vendor.name}</td>
                  <td className="py-2 px-4">{vendor.email}</td>
                  <td className="py-2 px-4">{vendor.storeName || 'N/A'}</td>
                  <td className="py-2 px-4 capitalize text-yellow-600">{vendor.approvalStatus}</td>
                  <td className="py-2 px-4 flex justify-center gap-2">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                      onClick={() => handleApproval(vendor._id, 'approved')}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                      onClick={() => handleApproval(vendor._id, 'rejected')}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="text-gray-600 hover:text-gray-800 disabled:opacity-30"
          >
            <FaChevronLeft />
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="text-gray-600 hover:text-gray-800 disabled:opacity-30"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default ApproveVendor;
