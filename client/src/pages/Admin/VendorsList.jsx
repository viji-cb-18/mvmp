/*import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getApprovedVendors } from '../../services/adminServices';

const VendorsList = () => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await getApprovedVendors(); // from adminServices
        console.log("Fetched Vendors:", res.data); // ✅ Check in browser console
        setVendors(res.data);
      } catch (err) {
        console.error("Error fetching vendors:", err);
      }
    };
  
    fetchVendors();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">All Vendors</h2>
      {vendors.length > 0 ? (
        <ul className="space-y-2">
          {vendors.map((vendor) => (
            <li key={vendor._id} className="border p-2 rounded shadow">
              <p><strong>Name:</strong> {vendor.name}</p>
              <p><strong>Email:</strong> {vendor.email}</p>
              <p><strong>Status:</strong> {vendor.approvalStatus}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No vendors found.</p>
      )}
    </div>
  );
  
};

export default VendorsList;
*/
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
      fetchVendors(); // Refresh list
    } catch (err) {
      toast.error("Failed to delete vendor");
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Approved Vendors</h2>
        <p className="text-sm text-gray-500">Manage your vendor accounts</p>
      </div>

      {vendors.length === 0 ? (
        <p className="text-gray-600">No vendors found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
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
              {vendors.map((vendor) => (
                <tr key={vendor._id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4">{vendor.name}</td>
                  <td className="py-2 px-4">{vendor.email}</td>
                  <td className="py-2 px-4">{vendor.storeName || "N/A"}</td>
                  <td className="py-2 px-4 text-green-600">{vendor.approvalStatus}</td>
                  <td className="py-2 px-4 text-center space-x-2">
                    {/* Update button (redirect or open modal) */}
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs"
                      onClick={() => toast.info("Edit feature coming soon!")}
                    >
                      <FaPen className="inline-block mr-1" />
                      Edit
                    </button>
                    {/* Delete button */}
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                      onClick={() => handleDelete(vendor._id)}
                    >
                      <FaTrash className="inline-block mr-1" />
                      Delete
                    </button>
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
