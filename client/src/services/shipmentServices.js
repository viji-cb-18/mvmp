import axios from "../services/axiosInstance";

export const getShipments = () => axios.get("/shipment");

export const updateShipmentStatus = (shipmentId, data) =>
  axios.put(`/shipment/${shipmentId}`, data);

export const deleteShipment = (shipmentId) =>
  axios.delete(`/shipment/${shipmentId}`);
