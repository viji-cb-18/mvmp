import React, { useEffect, useState } from "react";
import { getAllContacts } from "../../services/contactServices";
import { toast } from "react-toastify";

const AdminContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      const res = await getAllContacts();
      console.log("Fetched Contacts Response:", res);
      if (Array.isArray(res.data.data)) {
        setContacts(res.data.data);
      } else {
        throw new Error("Invalid contact data format");
      }
    } catch (err) {
      console.error("Error fetching contacts:", err);
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#2D70E4] mb-6">
          📬 Contact Messages
        </h2>

        {loading ? (
          <div className="text-gray-600 text-center">Loading...</div>
        ) : contacts.length === 0 ? (
          <p className="text-gray-500 text-center">No contact messages found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {contacts.map((contact, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="mb-3">
                  <p className="text-base text-gray-800 font-medium">
                    👤 {contact.name}
                  </p>
                  <p className="text-sm text-gray-500">✉️ {contact.email}</p>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  📝 {contact.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContactsPage;
