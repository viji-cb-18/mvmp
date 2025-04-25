import React, { useEffect, useState } from 'react';
import { getApprovedVendors, deleteUser } from '../../services/adminServices';
import { toast } from 'react-toastify';
import { FaTrash, FaPen } from 'react-icons/fa';

const VendorsList = () => {
  const [vendors, setVendors] = useState([]);

  const fetchVendors = async () => {
    try {
      const res = await getApprovedVendors();
      setVendors(res.data);
    } catch (err) {
      console.error("Error fetching vendors:", err);
      toast.error("Failed to load vendors");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this vendor?");
    if (!confirmDelete) return;

    try {
      await deleteUser(id);
      toast.success("Vendor deleted successfully");
      fetchVendors(); 
    } catch (err) {
      toast.error("Failed to delete vendor");
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white shadow-xl rounded-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
        <div>
          <h2 className="text-3xl font-bold text-[#2D70E4]">Approved Vendors</h2>
          <p className="text-sm text-gray-500">Manage and monitor your approved vendor accounts</p>
        </div>
      </div>

      {vendors.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">No vendors found.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
          <table className="min-w-full divide-y divide-gray-100 text-sm bg-white">
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
              {vendors.map((vendor) => (
                <tr key={vendor._id} className="hover:bg-[#F0FDF4] transition">
                  <td className="px-4 py-3 font-medium">{vendor.name}</td>
                  <td className="px-4 py-3">{vendor.email}</td>
                  <td className="px-4 py-3">{vendor.storeName || "N/A"}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">
                      {vendor.approvalStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => toast.info("Edit feature coming soon!")}
                        className="flex items-center gap-1 px-3 py-1 bg-[#3ED6B5] text-white rounded hover:bg-[#31b9a1] text-xs font-medium shadow-sm transition"
                      >
                        <FaPen size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(vendor._id)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs font-medium shadow-sm transition"
                      >
                        <FaTrash size={12} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VendorsList;
