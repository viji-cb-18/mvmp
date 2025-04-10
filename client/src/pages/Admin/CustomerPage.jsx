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
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Customer List</h2>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 text-gray-600 font-semibold">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Profile Image</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((user, index) => (
                <tr key={user._id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.phone || "-"}</td>
                  <td className="px-4 py-2">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt="Profile"
                        className="w-10 h-10 object-cover rounded-full shadow-sm"
                      />
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                  <button
                     onClick={() => handleDelete(user._id)}
                     className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
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
