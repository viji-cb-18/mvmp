import React, { useEffect, useState } from "react";
import {
  getShipments,
  updateShipmentStatus,
} from "../../services/shipmentServices";
import { toast } from "react-toastify";

const VendorShipmentPage = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchShipments = async () => {
    try {
      const res = await getShipments();
      setShipments(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load shipments");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkInTransit = async (id) => {
    try {
      await updateShipmentStatus(id, { status: "In Transit" });
      toast.success("Shipment marked as In Transit");
      fetchShipments();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-[#2D70E4]">Vendor Shipments</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading shipments...</p>
      ) : shipments.length === 0 ? (
        <p className="text-center text-gray-500 italic">No shipments found.</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#3ED6B5]/10 text-[#065F46] uppercase tracking-wide font-semibold">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Tracking Number</th>
                <th className="p-3">Carrier</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {shipments.map((s) => (
                <tr key={s._id} className="hover:bg-green-50 transition">
                  <td className="p-3">#{s.orderId?._id?.slice(0, 6).toUpperCase()}</td>
                  <td className="p-3">{s.trackingNumber}</td>
                  <td className="p-3">{s.carrier}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        s.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : s.status === "In Transit"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {s.status === "Processing" && (
                      <button
                        onClick={() => handleMarkInTransit(s._id)}
                        className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
                      >
                        Mark In Transit
                      </button>
                    )}
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

export default VendorShipmentPage;
