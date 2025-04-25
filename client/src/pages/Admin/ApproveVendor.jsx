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
    <div className="p-6 max-w-7xl mx-auto bg-white shadow-xl rounded-2xl">
     
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2D70E4]">Vendor Approval Panel</h1>
          <p className="text-sm text-gray-500">Review and approve vendor accounts.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search by name or email"
            className="border border-gray-300 px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-[#7AC3F1] outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border border-gray-300 px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-[#7AC3F1] outline-none"
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
            className="bg-gradient-to-r from-[#2D70E4] to-[#7AC3F1] text-white px-4 py-2 rounded-md text-sm hover:opacity-90"
          >
            Sort {sortAsc ? 'A → Z' : 'Z → A'}
          </button>
        </div>
      </div>

     
      {paginatedVendors.length === 0 ? (
        <div className="text-gray-500 py-10 text-center">No vendors found.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full text-sm bg-white">
            <thead className="bg-[#2D70E4]/10 text-[#2D70E4] font-semibold uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Store</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {paginatedVendors.map((vendor) => (
                <tr key={vendor._id} className="hover:bg-[#F0FDF4] transition">
                  <td className="px-4 py-3 font-medium">{vendor.name}</td>
                  <td className="px-4 py-3">{vendor.email}</td>
                  <td className="px-4 py-3">{vendor.storeName || 'N/A'}</td>
                  <td className="px-4 py-3 capitalize">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full
                      ${vendor.approvalStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        vendor.approvalStatus === 'approved' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-600'}
                    `}>
                      {vendor.approvalStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition"
                        onClick={() => handleApproval(vendor._id, 'approved')}
                      >
                        Approve
                      </button>
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition"
                        onClick={() => handleApproval(vendor._id, 'rejected')}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

     
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="text-gray-500 hover:text-[#2D70E4] disabled:opacity-40"
          >
            <FaChevronLeft />
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="text-gray-500 hover:text-[#2D70E4] disabled:opacity-40"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default ApproveVendor;
