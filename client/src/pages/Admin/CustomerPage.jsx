import React, { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../../services/adminServices";
import { toast } from "react-toastify";

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);

  const loadCustomers = async () => {
    try {
      const res = await getAllUsers();
      const onlyCustomers = res.data.data.filter((u) => u.role === "customer");
      setCustomers(onlyCustomers);
    } catch (err) {
      console.error("Load Error:", err);
      toast.error("Failed to load customers");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      toast.success("User deleted");
      loadCustomers();
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete user");
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white shadow-xl rounded-2xl">
      <h2 className="text-3xl font-bold text-[#2D70E4] mb-6">Customer List</h2>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-100 text-sm bg-white">
          <thead className="bg-[#2D70E4]/10 text-[#2D70E4] font-semibold uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Profile Image</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {customers.length > 0 ? (
              customers.map((user, index) => (
                <tr key={user._id} className="hover:bg-[#F0FDF4] transition">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.phone || "-"}</td>
                  <td className="px-4 py-3">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover border shadow-sm"
                      />
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white px-3 py-1 text-xs rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerPage;
