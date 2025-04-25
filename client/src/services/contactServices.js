import axios from "./axiosInstance";

export const submitContact = (data) => axios.post("/contacts", data);
export const getAllContacts = () => axios.get("/contacts");
